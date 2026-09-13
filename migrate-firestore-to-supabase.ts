import { initializeApp } from 'firebase/app';
import { initializeFirestore, collection, getDocs } from 'firebase/firestore';
import { createClient } from '@supabase/supabase-js';
import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId);

const supabaseUrl = process.env.SUPABASE_URL || 'https://jfmpjkptjfjolnbuahiq.supabase.co';
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || '';
const supabase = createClient(supabaseUrl, supabaseSecretKey);

function parseDate(val: any): string | null {
  if (!val) return null;
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    if (val.seconds) {
      return new Date(val.seconds * 1000).toISOString();
    }
    if (val._seconds) {
      return new Date(val._seconds * 1000).toISOString();
    }
  }
  return null;
}

async function migratePosts() {
  console.log('--- Migrating Posts ---');
  const snap = await getDocs(collection(db, 'posts'));
  console.log(`Found ${snap.size} posts in Firestore.`);
  
  const records = snap.docs.map(doc => {
    const d = doc.data();
    return {
      id: doc.id,
      title: d.title || d.titleEn || d.titleMn || 'Untitled',
      title_en: d.titleEn || null,
      title_mn: d.titleMn || null,
      title_de: d.titleDe || null,
      slug: d.slug || null,
      content: d.content || d.contentEn || d.contentMn || '',
      content_en: d.contentEn || null,
      content_mn: d.contentMn || null,
      content_de: d.contentDe || null,
      image_url: d.imageUrl || null,
      gallery_images: d.galleryImages || [],
      category: d.category || null,
      category_en: d.categoryEn || null,
      category_mn: d.categoryMn || null,
      category_de: d.categoryDe || null,
      tags: d.tags || [],
      featured: d.featured ?? false,
      status: d.status || 'published',
      author_id: d.authorId || null,
      created_at: parseDate(d.createdAt) || new Date().toISOString(),
      updated_at: parseDate(d.updatedAt) || new Date().toISOString(),
    };
  });

  const { data, error } = await supabase.from('posts').upsert(records);
  if (error) {
    console.error('Error migrating posts:', error);
  } else {
    console.log(`Successfully migrated ${records.length} posts to Supabase!`);
  }
}

async function migrateEvents() {
  console.log('--- Migrating Events ---');
  const snap = await getDocs(collection(db, 'events'));
  console.log(`Found ${snap.size} events in Firestore.`);
  
  const records = snap.docs.map(doc => {
    const d = doc.data();
    return {
      id: doc.id,
      title: d.title || d.titleEn || d.titleMn || 'Untitled',
      title_en: d.titleEn || null,
      title_mn: d.titleMn || null,
      title_de: d.titleDe || null,
      description: d.description || d.descriptionEn || d.descriptionMn || '',
      description_en: d.descriptionEn || null,
      description_mn: d.descriptionMn || null,
      description_de: d.descriptionDe || null,
      price: Number(d.price) || 0,
      capacity: Number(d.capacity) || 0,
      registered_count: Number(d.registeredCount) || 0,
      date: d.date || new Date().toISOString().split('T')[0],
      time: d.time || null,
      location: d.location || null,
      location_en: d.locationEn || null,
      location_mn: d.locationMn || null,
      location_de: d.locationDe || null,
      image_url: d.imageUrl || null,
      gallery_images: d.galleryImages || [],
      category: d.category || null,
      category_en: d.categoryEn || null,
      category_mn: d.categoryMn || null,
      category_de: d.categoryDe || null,
      whats_included: d.whatsIncluded || [],
      created_at: parseDate(d.createdAt) || new Date().toISOString(),
      updated_at: parseDate(d.updatedAt) || new Date().toISOString(),
    };
  });

  const { data, error } = await supabase.from('events').upsert(records);
  if (error) {
    console.error('Error migrating events:', error);
  } else {
    console.log(`Successfully migrated ${records.length} events to Supabase!`);
  }
}

async function migrateGallery() {
  console.log('--- Migrating Gallery ---');
  const snap = await getDocs(collection(db, 'gallery'));
  console.log(`Found ${snap.size} gallery items in Firestore.`);
  
  const records = snap.docs.map(doc => {
    const d = doc.data();
    return {
      id: doc.id,
      title: d.title || d.titleEn || d.titleMn || 'Untitled',
      title_en: d.titleEn || null,
      title_mn: d.titleMn || null,
      title_de: d.titleDe || null,
      artist: d.artist || null,
      artist_en: d.artistEn || null,
      artist_mn: d.artistMn || null,
      artist_de: d.artistDe || null,
      year: d.year ? String(d.year) : null,
      description: d.description || d.descriptionEn || d.descriptionMn || null,
      description_en: d.descriptionEn || null,
      description_mn: d.descriptionMn || null,
      description_de: d.descriptionDe || null,
      image_url: d.imageUrl || '',
      gallery_images: d.galleryImages || [],
      category: d.category || null,
      category_en: d.categoryEn || null,
      category_mn: d.categoryMn || null,
      category_de: d.categoryDe || null,
      created_at: parseDate(d.createdAt) || new Date().toISOString(),
      updated_at: parseDate(d.updatedAt) || new Date().toISOString(),
    };
  });

  const { data, error } = await supabase.from('gallery').upsert(records);
  if (error) {
    console.error('Error migrating gallery:', error);
  } else {
    console.log(`Successfully migrated ${records.length} gallery items to Supabase!`);
  }
}

async function runMigration() {
  try {
    await migratePosts();
    await migrateEvents();
    await migrateGallery();
    console.log('\nMigration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

runMigration();
