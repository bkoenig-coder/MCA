import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jfmpjkptjfjolnbuahiq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_vIKfeLyEYMX7Svm5eto-cg_9P3jlUaK';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Normalizes Supabase snake_case rows into camelCase objects for 100% frontend compatibility
export function normalizePost(row: any) {
  if (!row) return null;
  return {
    ...row,
    id: row.id,
    title: row.title || row.title_en || row.title_mn || '',
    titleEn: row.title_en ?? row.titleEn ?? row.title ?? '',
    titleMn: row.title_mn ?? row.titleMn ?? '',
    titleDe: row.title_de ?? row.titleDe ?? '',
    slug: row.slug ?? '',
    content: row.content || row.content_en || row.content_mn || '',
    contentEn: row.content_en ?? row.contentEn ?? row.content ?? '',
    contentMn: row.content_mn ?? row.contentMn ?? '',
    contentDe: row.content_de ?? row.contentDe ?? '',
    imageUrl: row.image_url ?? row.imageUrl ?? '',
    galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : (row.galleryImages || []),
    category: row.category ?? '',
    categoryEn: row.category_en ?? row.categoryEn ?? '',
    categoryMn: row.category_mn ?? row.categoryMn ?? '',
    categoryDe: row.category_de ?? row.categoryDe ?? '',
    tags: Array.isArray(row.tags) ? row.tags : [],
    featured: Boolean(row.featured),
    status: row.status ?? 'published',
    authorId: row.author_id ?? row.authorId ?? '',
    createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? row.updatedAt ?? new Date().toISOString(),
  };
}

export function normalizeEvent(row: any) {
  if (!row) return null;
  return {
    ...row,
    id: row.id,
    title: row.title || row.title_en || row.title_mn || '',
    titleEn: row.title_en ?? row.titleEn ?? row.title ?? '',
    titleMn: row.title_mn ?? row.titleMn ?? '',
    titleDe: row.title_de ?? row.titleDe ?? '',
    description: row.description || row.description_en || row.description_mn || '',
    descriptionEn: row.description_en ?? row.descriptionEn ?? row.description ?? '',
    descriptionMn: row.description_mn ?? row.descriptionMn ?? '',
    descriptionDe: row.description_de ?? row.descriptionDe ?? '',
    price: Number(row.price) || 0,
    capacity: Number(row.capacity) || 0,
    registeredCount: Number(row.registered_count ?? row.registeredCount) || 0,
    date: row.date || '',
    time: row.time || '',
    location: row.location || row.location_en || '',
    locationEn: row.location_en ?? row.locationEn ?? row.location ?? '',
    locationMn: row.location_mn ?? row.locationMn ?? '',
    locationDe: row.location_de ?? row.locationDe ?? '',
    imageUrl: row.image_url ?? row.imageUrl ?? '',
    galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : (row.galleryImages || []),
    category: row.category ?? '',
    categoryEn: row.category_en ?? row.categoryEn ?? '',
    categoryMn: row.category_mn ?? row.categoryMn ?? '',
    categoryDe: row.category_de ?? row.categoryDe ?? '',
    whatsIncluded: Array.isArray(row.whats_included) ? row.whats_included : (row.whatsIncluded || []),
    createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? row.updatedAt ?? new Date().toISOString(),
  };
}

export function normalizeGalleryItem(row: any) {
  if (!row) return null;
  return {
    ...row,
    id: row.id,
    title: row.title || row.title_en || row.title_mn || '',
    titleEn: row.title_en ?? row.titleEn ?? row.title ?? '',
    titleMn: row.title_mn ?? row.titleMn ?? '',
    titleDe: row.title_de ?? row.titleDe ?? '',
    artist: row.artist ?? row.artist_en ?? '',
    artistEn: row.artist_en ?? row.artistEn ?? row.artist ?? '',
    artistMn: row.artist_mn ?? row.artistMn ?? '',
    artistDe: row.artist_de ?? row.artistDe ?? '',
    year: row.year ?? '',
    description: row.description || row.description_en || row.description_mn || '',
    descriptionEn: row.description_en ?? row.descriptionEn ?? row.description ?? '',
    descriptionMn: row.description_mn ?? row.descriptionMn ?? '',
    descriptionDe: row.description_de ?? row.descriptionDe ?? '',
    imageUrl: row.image_url ?? row.imageUrl ?? '',
    galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : (row.galleryImages || []),
    category: row.category ?? '',
    categoryEn: row.category_en ?? row.categoryEn ?? '',
    categoryMn: row.category_mn ?? row.categoryMn ?? '',
    categoryDe: row.category_de ?? row.categoryDe ?? '',
    createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? row.updatedAt ?? new Date().toISOString(),
  };
}

// ----------------------------------------------------------------------------
// Authentication API
// ----------------------------------------------------------------------------
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });
  if (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
  return data;
}

export async function logOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error logging out:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------------
// Posts API
// ----------------------------------------------------------------------------
export async function fetchPosts(): Promise<any[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  return (data || []).map(normalizePost);
}

export async function fetchPostByIdOrSlug(idOrSlug: string): Promise<any | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }
  return data ? normalizePost(data) : null;
}

export async function upsertPost(postData: any): Promise<any> {
  const id = postData.id || `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const record = {
    id,
    title: postData.title || postData.titleEn || 'Untitled',
    title_en: postData.titleEn || null,
    title_mn: postData.titleMn || null,
    title_de: postData.titleDe || null,
    slug: postData.slug || null,
    content: postData.content || postData.contentEn || '',
    content_en: postData.contentEn || null,
    content_mn: postData.contentMn || null,
    content_de: postData.contentDe || null,
    image_url: postData.imageUrl || null,
    gallery_images: postData.galleryImages || [],
    category: postData.category || null,
    category_en: postData.categoryEn || null,
    category_mn: postData.categoryMn || null,
    category_de: postData.categoryDe || null,
    tags: postData.tags || [],
    featured: Boolean(postData.featured),
    status: postData.status || 'published',
    author_id: postData.authorId || null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('posts')
    .upsert(record)
    .select()
    .single();

  if (error) {
    console.error('Error saving post:', error);
    throw error;
  }
  return normalizePost(data);
}

export async function deletePostById(id: string): Promise<boolean> {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) {
    console.error('Error deleting post:', error);
    return false;
  }
  return true;
}

// ----------------------------------------------------------------------------
// Events API
// ----------------------------------------------------------------------------
export async function fetchEvents(): Promise<any[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });
  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }
  return (data || []).map(normalizeEvent);
}

export async function fetchEventById(id: string): Promise<any | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('Error fetching event:', error);
    return null;
  }
  return data ? normalizeEvent(data) : null;
}

export async function upsertEvent(eventData: any): Promise<any> {
  const id = eventData.id || `event_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const record = {
    id,
    title: eventData.title || eventData.titleEn || 'Untitled Event',
    title_en: eventData.titleEn || null,
    title_mn: eventData.titleMn || null,
    title_de: eventData.titleDe || null,
    description: eventData.description || eventData.descriptionEn || '',
    description_en: eventData.descriptionEn || null,
    description_mn: eventData.descriptionMn || null,
    description_de: eventData.descriptionDe || null,
    price: Number(eventData.price) || 0,
    capacity: Number(eventData.capacity) || 0,
    registered_count: Number(eventData.registeredCount) || 0,
    date: eventData.date || new Date().toISOString().split('T')[0],
    time: eventData.time || null,
    location: eventData.location || null,
    location_en: eventData.locationEn || null,
    location_mn: eventData.locationMn || null,
    location_de: eventData.locationDe || null,
    image_url: eventData.imageUrl || null,
    gallery_images: eventData.galleryImages || [],
    category: eventData.category || null,
    category_en: eventData.categoryEn || null,
    category_mn: eventData.categoryMn || null,
    category_de: eventData.categoryDe || null,
    whats_included: eventData.whatsIncluded || [],
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('events')
    .upsert(record)
    .select()
    .single();

  if (error) {
    console.error('Error saving event:', error);
    throw error;
  }
  return normalizeEvent(data);
}

export async function deleteEventById(id: string): Promise<boolean> {
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) {
    console.error('Error deleting event:', error);
    return false;
  }
  return true;
}

// ----------------------------------------------------------------------------
// Gallery API
// ----------------------------------------------------------------------------
export async function fetchGallery(): Promise<any[]> {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching gallery:', error);
    return [];
  }
  return (data || []).map(normalizeGalleryItem);
}

export async function fetchGalleryById(id: string): Promise<any | null> {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('Error fetching gallery item:', error);
    return null;
  }
  return data ? normalizeGalleryItem(data) : null;
}

export async function upsertGalleryItem(itemData: any): Promise<any> {
  const id = itemData.id || `gallery_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const record = {
    id,
    title: itemData.title || itemData.titleEn || 'Untitled Artwork',
    title_en: itemData.titleEn || null,
    title_mn: itemData.titleMn || null,
    title_de: itemData.titleDe || null,
    artist: itemData.artist || null,
    artist_en: itemData.artistEn || null,
    artist_mn: itemData.artistMn || null,
    artist_de: itemData.artistDe || null,
    year: itemData.year ? String(itemData.year) : null,
    description: itemData.description || itemData.descriptionEn || null,
    description_en: itemData.descriptionEn || null,
    description_mn: itemData.descriptionMn || null,
    description_de: itemData.descriptionDe || null,
    image_url: itemData.imageUrl || '',
    gallery_images: itemData.galleryImages || [],
    category: itemData.category || null,
    category_en: itemData.categoryEn || null,
    category_mn: itemData.categoryMn || null,
    category_de: itemData.categoryDe || null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('gallery')
    .upsert(record)
    .select()
    .single();

  if (error) {
    console.error('Error saving gallery item:', error);
    throw error;
  }
  return normalizeGalleryItem(data);
}

export async function deleteGalleryById(id: string): Promise<boolean> {
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  if (error) {
    console.error('Error deleting gallery item:', error);
    return false;
  }
  return true;
}

// ----------------------------------------------------------------------------
// Memberships & Applications
// ----------------------------------------------------------------------------
export async function submitMembershipApplication(appData: any) {
  const id = `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const record = {
    id,
    user_id: appData.userId || null,
    user_email: appData.userEmail || '',
    first_name: appData.firstName || '',
    last_name: appData.lastName || '',
    gender: appData.gender || null,
    dob: appData.dob || null,
    phone: appData.phone || null,
    nationality: appData.nationality || null,
    tier: appData.tier || 'student',
    age: appData.age ? Number(appData.age) : null,
    school_or_university: appData.schoolOrUniversity || null,
    student_id_number: appData.studentIdNumber || null,
    organization_name: appData.organizationName || null,
    position: appData.position || null,
    website_or_linkedin: appData.websiteOrLinkedin || null,
    statement_of_purpose: appData.statementOfPurpose || null,
    status: appData.status || 'pending',
  };

  const { data, error } = await supabase
    .from('membership_applications')
    .insert(record)
    .select()
    .single();

  if (error) {
    console.error('Error submitting membership application:', error);
    throw error;
  }
  return data;
}

export async function fetchMembershipApplications(): Promise<any[]> {
  const { data, error } = await supabase
    .from('membership_applications')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching membership applications:', error);
    return [];
  }
  return data || [];
}

// ----------------------------------------------------------------------------
// Registrations
// ----------------------------------------------------------------------------
export async function createRegistration(regData: any) {
  const id = `reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const record = {
    id,
    event_id: regData.eventId || '',
    event_title: regData.eventTitle || '',
    user_id: regData.userId || null,
    user_email: regData.userEmail || regData.email || '',
    name: regData.name || '',
    email: regData.email || '',
    phone: regData.phone || null,
    notes: regData.notes || null,
    status: regData.status || 'pending',
    amount: Number(regData.amount) || 0,
    stripe_session_id: regData.stripeSessionId || null,
  };

  const { data, error } = await supabase
    .from('registrations')
    .insert(record)
    .select()
    .single();

  if (error) {
    console.error('Error creating registration:', error);
    throw error;
  }
  return data;
}

export async function fetchRegistrations(): Promise<any[]> {
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching registrations:', error);
    return [];
  }
  return data || [];
}
