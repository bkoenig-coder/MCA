import { supabase, normalizePost, normalizeEvent, normalizeGalleryItem, toTimestamp } from './supabase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  console.warn('Database Log/Warning: ', operationType, path, error);
}

// Convert Firestore-style collection names to Supabase tables if different
function mapTableName(colName: string): string {
  switch (colName) {
    case 'posts': return 'posts';
    case 'events': return 'events';
    case 'gallery': return 'gallery';
    case 'users': return 'users';
    case 'membership_applications': return 'membership_applications';
    case 'registrations': return 'registrations';
    case 'game_scores': return 'game_scores';
    case 'analytics':
    case 'analytics_events': return 'analytics';
    default: return colName;
  }
}

// Normalize record from Supabase table format into front-end compatible structure
function normalizeDocumentData(tableName: string, data: any): any {
  if (!data) return null;
  let normalized: any;
  if (tableName === 'posts') normalized = normalizePost(data);
  else if (tableName === 'events') normalized = normalizeEvent(data);
  else if (tableName === 'gallery') normalized = normalizeGalleryItem(data);
  else normalized = { ...data };

  // Ensure createdAt, updatedAt, timestamp always have .toDate() for backward compatibility
  if (normalized.created_at && !normalized.createdAt) normalized.createdAt = normalized.created_at;
  if (normalized.updated_at && !normalized.updatedAt) normalized.updatedAt = normalized.updated_at;

  if (normalized.createdAt !== undefined) {
    normalized.createdAt = toTimestamp(normalized.createdAt);
  }
  if (normalized.updatedAt !== undefined) {
    normalized.updatedAt = toTimestamp(normalized.updatedAt);
  }
  if (normalized.timestamp !== undefined) {
    normalized.timestamp = toTimestamp(normalized.timestamp);
  }
  return normalized;
}

// Columns the content tables really have. Anything else is dropped before saving, because
// the database rejects a whole save when it sees an unknown field.
const LANGS = ['en', 'mn', 'de', 'tr'];
const withLangs = (base: string) => [base, ...LANGS.map(l => `${base}_${l}`)];
const TABLE_COLUMNS: Record<string, Set<string>> = {
  posts: new Set([
    'id', ...withLangs('title'), ...withLangs('content'), ...withLangs('category').filter(c => c !== 'category_tr'),
    'slug', 'image_url', 'gallery_images', 'tags', 'featured', 'status', 'author_id', 'created_at', 'updated_at',
  ]),
  events: new Set([
    'id', ...withLangs('title'), ...withLangs('description'), ...withLangs('location').filter(c => c !== 'location_tr'),
    ...withLangs('category').filter(c => c !== 'category_tr'),
    'price', 'capacity', 'registered_count', 'date', 'time', 'image_url', 'gallery_images', 'whats_included', 'created_at', 'updated_at',
  ]),
  gallery: new Set([
    'id', ...withLangs('title'), ...withLangs('artist'), ...withLangs('description'), ...withLangs('category').filter(c => c !== 'category_tr'),
    'year', 'image_url', 'gallery_images', 'created_at', 'updated_at',
  ]),
};

const toSnake = (key: string) => key.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`);

// Transform incoming payload to Supabase DB columns
function transformToSupabasePayload(tableName: string, data: any): any {
  if (!data || typeof data !== 'object') return data;
  const payload: any = {};

  // camelCase fields from the app become snake_case columns (titleEn -> title_en, imageUrl -> image_url ...)
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    payload[toSnake(key)] = value;
  }

  const allowed = TABLE_COLUMNS[tableName];
  if (allowed) {
    for (const key of Object.keys(payload)) {
      if (!allowed.has(key)) delete payload[key];
    }
  }
  return payload;
}

/** True after a save had to leave out the Turkish columns because the database does not have them yet. */
export let turkishColumnsMissing = false;

/** Runs a write; if only the optional Turkish columns are missing in the database, saves again without them. */
async function writeWithTurkishFallback(run: (payload: any) => PromiseLike<{ error: any }>, payload: any) {
  let result = await run(payload);
  const err = result.error;
  if (err && (err.code === 'PGRST204' || /column/i.test(err.message || '')) && /_tr/.test(err.message || '')) {
    const trimmed = Object.fromEntries(Object.entries(payload).filter(([k]) => !k.endsWith('_tr')));
    console.warn('Turkish columns are missing in the database: saved without them. Run supabase-turkish.sql.');
    turkishColumnsMissing = true;
    result = await run(trimmed);
  }
  return result;
}

// ----------------------------------------------------------------------------
// Firestore-compatible query / reference builders
// ----------------------------------------------------------------------------
export interface DocRef {
  type: 'doc';
  collectionName: string;
  id: string;
  path: string;
}

export interface CollectionRef {
  type: 'collection';
  collectionName: string;
  path: string;
}

export interface QueryConstraint {
  type: 'where' | 'orderBy' | 'limit';
  field?: string;
  op?: string;
  val?: any;
  direction?: 'asc' | 'desc';
  limitCount?: number;
}

export interface QueryRef {
  type: 'query';
  collectionName: string;
  constraints: QueryConstraint[];
}

export const db = { type: 'supabase_adapter' };

export function doc(dbOrCol: any, collectionNameOrId?: string, id?: string): DocRef {
  if (typeof dbOrCol === 'object' && dbOrCol.type === 'collection') {
    const col = dbOrCol.collectionName;
    const docId = collectionNameOrId || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return { type: 'doc', collectionName: col, id: docId, path: `${col}/${docId}` };
  }
  const col = collectionNameOrId || 'unknown';
  const docId = id || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return { type: 'doc', collectionName: col, id: docId, path: `${col}/${docId}` };
}

export function collection(dbInstance: any, collectionName: string): CollectionRef {
  return { type: 'collection', collectionName, path: collectionName };
}

export function query(colRef: CollectionRef | QueryRef, ...constraints: QueryConstraint[]): QueryRef {
  const prevConstraints = (colRef as QueryRef).constraints || [];
  return {
    type: 'query',
    collectionName: colRef.collectionName,
    constraints: [...prevConstraints, ...constraints],
  };
}

export function where(field: string, op: string, val: any): QueryConstraint {
  return { type: 'where', field, op, val };
}

export function orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): QueryConstraint {
  return { type: 'orderBy', field, direction };
}

export function limit(limitCount: number): QueryConstraint {
  return { type: 'limit', limitCount };
}

export function serverTimestamp(): string {
  return new Date().toISOString();
}

export function increment(n: number) {
  return n;
}

// ----------------------------------------------------------------------------
// CRUD Operations
// ----------------------------------------------------------------------------
export async function getDoc(docRef: DocRef) {
  const table = mapTableName(docRef.collectionName);
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', docRef.id)
    .maybeSingle();

  return {
    id: docRef.id,
    exists: () => Boolean(data),
    data: () => (data ? normalizeDocumentData(table, data) : undefined),
  };
}

export async function getDocFromServer(docRef: DocRef) {
  return getDoc(docRef);
}

export async function getDocs(queryRef: CollectionRef | QueryRef) {
  const table = mapTableName(queryRef.collectionName);
  let q = supabase.from(table).select('*');

  if ((queryRef as QueryRef).constraints) {
    for (const c of (queryRef as QueryRef).constraints) {
      if (c.type === 'where' && c.field) {
        // Map where field if needed
        let fieldName = c.field;
        if (fieldName === 'slug') fieldName = 'slug';
        if (fieldName === 'userId') fieldName = 'user_id';
        if (fieldName === 'eventId') fieldName = 'event_id';
        if (fieldName === 'category') fieldName = 'category';

        if (c.op === '==' || c.op === '=') {
          q = q.eq(fieldName, c.val);
        } else if (c.op === '>') {
          q = q.gt(fieldName, c.val);
        } else if (c.op === '>=') {
          q = q.gte(fieldName, c.val);
        } else if (c.op === '<') {
          q = q.lt(fieldName, c.val);
        } else if (c.op === '<=') {
          q = q.lte(fieldName, c.val);
        } else if (c.op === 'in') {
          q = q.in(fieldName, c.val);
        }
      } else if (c.type === 'orderBy' && c.field) {
        let fieldName = c.field;
        if (fieldName === 'createdAt') fieldName = 'created_at';
        if (fieldName === 'updatedAt') fieldName = 'updated_at';
        q = q.order(fieldName, { ascending: c.direction === 'asc' });
      } else if (c.type === 'limit' && c.limitCount) {
        q = q.limit(c.limitCount);
      }
    }
  }

  const { data, error } = await q;
  if (error) {
    console.error(`Error querying table ${table}:`, error);
    return {
      empty: true,
      size: 0,
      docs: [],
    };
  }

  const docs = (data || []).map((row: any) => ({
    id: row.id,
    data: () => normalizeDocumentData(table, row),
    exists: () => true,
  }));

  return {
    empty: docs.length === 0,
    size: docs.length,
    docs,
  };
}

export async function setDoc(docRef: DocRef, data: any, options?: { merge?: boolean }) {
  const table = mapTableName(docRef.collectionName);
  const payload = transformToSupabasePayload(table, { id: docRef.id, ...data });

  const { error } = await writeWithTurkishFallback(p => supabase.from(table).upsert(p), payload);
  if (error) {
    console.error(`Error in setDoc (${table}):`, error);
    throw error;
  }
}

export async function addDoc(colRef: CollectionRef, data: any) {
  const table = mapTableName(colRef.collectionName);
  const id = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const payload = transformToSupabasePayload(table, { id, ...data });

  const { error } = await writeWithTurkishFallback(p => supabase.from(table).insert(p), payload);
  if (error) {
    console.error(`Error in addDoc (${table}):`, error);
    throw error;
  }
  return { id, path: `${colRef.collectionName}/${id}` };
}

export async function updateDoc(docRef: DocRef, data: any) {
  const table = mapTableName(docRef.collectionName);
  const payload = transformToSupabasePayload(table, data);

  const { error } = await writeWithTurkishFallback(p => supabase.from(table).update(p).eq('id', docRef.id), payload);
  if (error) {
    console.error(`Error in updateDoc (${table}):`, error);
    throw error;
  }
}

export async function deleteDoc(docRef: DocRef) {
  const table = mapTableName(docRef.collectionName);
  const { error } = await supabase.from(table).delete().eq('id', docRef.id);
  if (error) {
    console.error(`Error in deleteDoc (${table}):`, error);
    throw error;
  }
}

// Real-time snapshot listener / initial load
export function onSnapshot(
  target: DocRef | CollectionRef | QueryRef,
  onNext: (snap: any) => void,
  onError?: (err: any) => void
) {
  let isSubscribed = true;

  const fetchData = async () => {
    try {
      if ((target as DocRef).type === 'doc') {
        const snap = await getDoc(target as DocRef);
        if (isSubscribed) onNext(snap);
      } else {
        const snap = await getDocs(target as CollectionRef | QueryRef);
        if (isSubscribed) onNext(snap);
      }
    } catch (err) {
      if (isSubscribed && onError) onError(err);
    }
  };

  fetchData();

  // Supabase real-time channel subscription
  const tableName = mapTableName(target.collectionName);
  const channel = supabase
    .channel(`realtime_${tableName}_${Date.now()}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, () => {
      if (isSubscribed) fetchData();
    })
    .subscribe();

  return () => {
    isSubscribed = false;
    supabase.removeChannel(channel);
  };
}

// Batch write helper
export function writeBatch(dbInstance?: any) {
  const operations: Array<() => Promise<any>> = [];
  return {
    set(docRef: DocRef, data: any) {
      operations.push(() => setDoc(docRef, data));
    },
    update(docRef: DocRef, data: any) {
      operations.push(() => updateDoc(docRef, data));
    },
    delete(docRef: DocRef) {
      operations.push(() => deleteDoc(docRef));
    },
    async commit() {
      for (const op of operations) {
        await op();
      }
    },
  };
}

// ----------------------------------------------------------------------------
// Authentication Wrapper
// ----------------------------------------------------------------------------
class AuthWrapper {
  private _currentUser: any = null;

  constructor() {
    supabase.auth.getSession().then(({ data: { session } }) => {
      this._currentUser = session?.user
        ? {
            uid: session.user.id,
            email: session.user.email,
            displayName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0],
            photoURL: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
          }
        : null;
    });

    supabase.auth.onAuthStateChange((event, session) => {
      this._currentUser = session?.user
        ? {
            uid: session.user.id,
            email: session.user.email,
            displayName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0],
            photoURL: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
          }
        : null;
    });
  }

  get currentUser() {
    return this._currentUser;
  }
}

export const auth = new AuthWrapper();

export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error in Google Sign In:', error);
    throw error;
  }
}

export async function logOut() {
  await supabase.auth.signOut();
}

export const GoogleAuthProvider = class {};
