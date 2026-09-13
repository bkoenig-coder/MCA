import { supabase, normalizePost, normalizeEvent, normalizeGalleryItem } from './supabase';

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
  if (tableName === 'posts') return normalizePost(data);
  if (tableName === 'events') return normalizeEvent(data);
  if (tableName === 'gallery') return normalizeGalleryItem(data);
  return data;
}

// Transform incoming payload to Supabase DB columns
function transformToSupabasePayload(tableName: string, data: any): any {
  if (!data || typeof data !== 'object') return data;
  const payload: any = { ...data };

  // Handle special fields
  if (payload.titleEn !== undefined) payload.title_en = payload.titleEn;
  if (payload.titleMn !== undefined) payload.title_mn = payload.titleMn;
  if (payload.titleDe !== undefined) payload.title_de = payload.titleDe;

  if (payload.contentEn !== undefined) payload.content_en = payload.contentEn;
  if (payload.contentMn !== undefined) payload.content_mn = payload.contentMn;
  if (payload.contentDe !== undefined) payload.content_de = payload.contentDe;

  if (payload.descriptionEn !== undefined) payload.description_en = payload.descriptionEn;
  if (payload.descriptionMn !== undefined) payload.description_mn = payload.descriptionMn;
  if (payload.descriptionDe !== undefined) payload.description_de = payload.descriptionDe;

  if (payload.imageUrl !== undefined) payload.image_url = payload.imageUrl;
  if (payload.galleryImages !== undefined) payload.gallery_images = payload.galleryImages;

  if (payload.locationEn !== undefined) payload.location_en = payload.locationEn;
  if (payload.locationMn !== undefined) payload.location_mn = payload.locationMn;
  if (payload.locationDe !== undefined) payload.location_de = payload.locationDe;

  if (payload.categoryEn !== undefined) payload.category_en = payload.categoryEn;
  if (payload.categoryMn !== undefined) payload.category_mn = payload.categoryMn;
  if (payload.categoryDe !== undefined) payload.category_de = payload.categoryDe;

  if (payload.artistEn !== undefined) payload.artist_en = payload.artistEn;
  if (payload.artistMn !== undefined) payload.artist_mn = payload.artistMn;
  if (payload.artistDe !== undefined) payload.artist_de = payload.artistDe;

  if (payload.whatsIncluded !== undefined) payload.whats_included = payload.whatsIncluded;
  if (payload.registeredCount !== undefined) payload.registered_count = payload.registeredCount;
  if (payload.authorId !== undefined) payload.author_id = payload.authorId;
  if (payload.userId !== undefined) payload.user_id = payload.userId;
  if (payload.userEmail !== undefined) payload.user_email = payload.userEmail;
  if (payload.firstName !== undefined) payload.first_name = payload.firstName;
  if (payload.lastName !== undefined) payload.last_name = payload.lastName;

  return payload;
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

  const { error } = await supabase.from(table).upsert(payload);
  if (error) {
    console.error(`Error in setDoc (${table}):`, error);
    throw error;
  }
}

export async function addDoc(colRef: CollectionRef, data: any) {
  const table = mapTableName(colRef.collectionName);
  const id = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const payload = transformToSupabasePayload(table, { id, ...data });

  const { error } = await supabase.from(table).insert(payload);
  if (error) {
    console.error(`Error in addDoc (${table}):`, error);
    throw error;
  }
  return { id, path: `${colRef.collectionName}/${id}` };
}

export async function updateDoc(docRef: DocRef, data: any) {
  const table = mapTableName(docRef.collectionName);
  const payload = transformToSupabasePayload(table, data);

  const { error } = await supabase.from(table).update(payload).eq('id', docRef.id);
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
