import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { db, collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp, OperationType, handleFirestoreError } from '../firebase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Plus, Calendar, FileText, Users, User as UserIcon, TrendingUp, Image as ImageIcon, 
  Trash2, Edit3, Check, X, AlertCircle, ExternalLink, Download, Shield, Sparkles, 
  Wand2, Copy, Search, Eye, MapPin, Clock, Tag, Compass
} from 'lucide-react';
import { deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import Modal from '../components/Modal';
import { autoTranslateRecord } from '../services/translationService';

// Curated High-Resolution Media Library Presets for Instant 1-Click Selection
const CURATED_MEDIA_PRESETS = [
  {
    category: 'Festivals & Galas',
    images: [
      { label: 'Naadam Festival', url: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=1600&auto=format&fit=crop' },
      { label: 'Tsagaan Sar Celebration', url: 'https://images.unsplash.com/photo-1543083477-4f785aeafaa9?q=80&w=1600&auto=format&fit=crop' },
      { label: 'Vienna Cultural Gala', url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1600&auto=format&fit=crop' },
      { label: 'Community Assembly', url: 'https://plus.unsplash.com/premium_photo-1716932567535-6bb42a3f38ff?q=80&w=1332&auto=format&fit=crop' }
    ]
  },
  {
    category: 'Music & Living Heritage',
    images: [
      { label: 'Morin Khuur Masterclass', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop' },
      { label: 'Traditional Throat Singing', url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1600&auto=format&fit=crop' },
      { label: 'Classical Mongolian Script', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1600&auto=format&fit=crop' },
      { label: 'Youth Cultural Workshop', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1600&auto=format&fit=crop' }
    ]
  },
  {
    category: 'Nomadic Steppes & Landscapes',
    images: [
      { label: 'Mongolian Endless Steppes', url: 'https://images.unsplash.com/photo-1695555875394-4e8aa542ccdc?q=80&w=1600&auto=format&fit=crop' },
      { label: 'Traditional Steppe Settlement', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop' },
      { label: 'Altai Mountains & Riders', url: 'https://images.unsplash.com/photo-1625862849881-64c93500d0a5?q=80&w=1600&auto=format&fit=crop' },
      { label: 'Nomadic Horizons', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1600&auto=format&fit=crop' }
    ]
  },
  {
    category: 'Art, Architecture & Artifacts',
    images: [
      { label: 'Historical Museum Regalia', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1600&auto=format&fit=crop' },
      { label: 'Palais Eschenbach Vienna', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop' },
      { label: 'Traditional Silk Deel', url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1600&auto=format&fit=crop' },
      { label: 'Contemporary Fine Art', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1600&auto=format&fit=crop' }
    ]
  }
];

export default function AdminDashboard() {
  const { user, profile } = useAuth();
  const userEmail = user?.email?.toLowerCase() || '';
  const isSuperAdmin = userEmail === 'emeraldtorstein@gmail.com';
  const isDomainAdmin = userEmail.endsWith('@mongoliancenter.org') || userEmail === 'info@mongoliancenter.org';
  const isAdminUser = isSuperAdmin || isDomainAdmin || userEmail === 'batmunkh.unen@gmail.com' || profile?.role === 'admin';
  const isEditor = isAdminUser || profile?.role === 'moderator';

  const [activeTab, setActiveTab] = useState<'analytics' | 'events' | 'posts' | 'registrations' | 'gallery' | 'users' | 'applications'>('analytics');

  // Analytics State
  const [pageViews, setPageViews] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);

  // Content State
  const [events, setEvents] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  // Search & Filter States
  const [eventSearch, setEventSearch] = useState('');
  const [postSearch, setPostSearch] = useState('');
  const [gallerySearch, setGallerySearch] = useState('');
  const [regSearch, setRegSearch] = useState('');

  // Media Preset Drawer State
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [activeMediaTarget, setActiveMediaTarget] = useState<'event' | 'post' | 'gallery' | null>(null);

  // Form States
  const [eventForm, setEventForm] = useState({
    id: '',
    titleEn: '', titleMn: '', titleDe: '',
    descriptionEn: '', descriptionMn: '', descriptionDe: '',
    date: '',
    time: '18:00',
    location: 'Palais Eschenbach, Eschenbachgasse 11, 1010 Wien',
    category: 'Cultural Celebration',
    price: 0,
    capacity: 100,
    imageUrl: '',
    whatsIncluded: 'Authentic Catering, Cultural Performance, Translation Support',
    galleryImages: ''
  });

  const [postForm, setPostForm] = useState({ 
    id: '', 
    slug: '', 
    titleEn: '', titleMn: '', titleDe: '', 
    contentEn: '', contentMn: '', contentDe: '', 
    imageUrl: '', 
    galleryImages: '' 
  });

  const [galleryForm, setGalleryForm] = useState({ 
    id: '', 
    titleEn: '', titleMn: '', titleDe: '', 
    artistEn: '', artistMn: '', artistDe: '', 
    year: '2026', 
    descriptionEn: '', descriptionMn: '', descriptionDe: '', 
    imageUrl: '', 
    category: 'Traditional' 
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Dedicated Studio Modals
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventLangTab, setEventLangTab] = useState<'en' | 'mn' | 'de'>('en');
  const [eventEditorMode, setEventEditorMode] = useState<'edit' | 'preview'>('edit');

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postLangTab, setPostLangTab] = useState<'mn' | 'en' | 'de'>('mn');
  const [postEditorMode, setPostEditorMode] = useState<'edit' | 'preview'>('edit');

  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryLangTab, setGalleryLangTab] = useState<'en' | 'mn' | 'de'>('en');
  const [galleryEditorMode, setGalleryEditorMode] = useState<'edit' | 'preview'>('edit');

  // Deletion Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ collection: string, id: string } | null>(null);

  useEffect(() => {
    if (!isEditor) return;

    // Fetch Analytics
    const qAnalytics = query(collection(db, 'analytics'), orderBy('timestamp', 'desc'), limit(1000));
    const unsubscribeAnalytics = onSnapshot(qAnalytics, (snapshot) => {
      const views = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPageViews(views);

      const counts: { [key: string]: number } = {};
      views.forEach((v: any) => {
        if (v.timestamp && typeof v.timestamp.toDate === 'function') {
          const date = new Date(v.timestamp.toDate()).toLocaleDateString();
          counts[date] = (counts[date] || 0) + 1;
        }
      });
      const chartData = Object.entries(counts).map(([date, count]) => ({ date, count })).reverse();
      setAnalyticsData(chartData);
    }, (error) => handleFirestoreError(error, OperationType.GET, 'analytics'));

    // Fetch Events
    const qEvents = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
    const unsubscribeEvents = onSnapshot(qEvents, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'events'));

    // Fetch Posts
    const qPosts = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribePosts = onSnapshot(qPosts, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'posts'));

    // Fetch Registrations
    const qRegs = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'));
    const unsubscribeRegs = onSnapshot(qRegs, (snapshot) => {
      setRegistrations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'registrations'));

    // Fetch Users
    const qUsers = query(collection(db, 'users'));
    const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'users'));

    // Fetch Gallery
    const qGallery = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribeGallery = onSnapshot(qGallery, (snapshot) => {
      setGallery(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'gallery'));

    // Fetch Applications
    const qApplications = query(collection(db, 'membership_applications'), orderBy('createdAt', 'desc'));
    const unsubscribeApplications = onSnapshot(qApplications, (snapshot) => {
      setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'membership_applications'));

    return () => {
      unsubscribeAnalytics();
      unsubscribeEvents();
      unsubscribePosts();
      unsubscribeRegs();
      unsubscribeUsers();
      unsubscribeGallery();
      unsubscribeApplications();
    };
  }, [isEditor]);

  // Transliteration helper for clean English slugs
  const transliterateCyrillic = (text: string): string => {
    const map: { [key: string]: string } = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y',
      'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'ө': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ү': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '',
      'э': 'e', 'ю': 'yu', 'я': 'ya',
      'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y',
      'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'Ө': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
      'Ү': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch', 'Ъ': '', 'Ы': 'Y', 'Ь': '',
      'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
    };
    return text.split('').map(char => map[char] || char).join('');
  };

  // 1-Click AI Auto-Translation for Events
  const handleAutoTranslateEvent = async () => {
    const srcTitle = eventForm.titleEn || eventForm.titleMn || eventForm.titleDe;
    const srcDesc = eventForm.descriptionEn || eventForm.descriptionMn || eventForm.descriptionDe;

    if (!srcTitle && !srcDesc) {
      toast.error('Please enter at least a title or description in any language first');
      return;
    }

    setIsTranslating(true);
    try {
      const translated = await autoTranslateRecord({
        title: srcTitle,
        description: srcDesc
      }, ['title', 'description']);

      setEventForm(prev => ({
        ...prev,
        titleEn: prev.titleEn || translated.titleEn || srcTitle,
        titleMn: prev.titleMn || translated.titleMn || srcTitle,
        titleDe: prev.titleDe || translated.titleDe || srcTitle,
        descriptionEn: prev.descriptionEn || translated.descriptionEn || srcDesc,
        descriptionMn: prev.descriptionMn || translated.descriptionMn || srcDesc,
        descriptionDe: prev.descriptionDe || translated.descriptionDe || srcDesc
      }));
      toast.success('✨ All event translations generated!');
    } catch (err) {
      toast.error('Auto-translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  // 1-Click AI Auto-Translation for Posts / News
  const handleAutoTranslatePost = async () => {
    const srcTitle = postForm.titleMn || postForm.titleEn || postForm.titleDe;
    const srcContent = postForm.contentMn || postForm.contentEn || postForm.contentDe;

    if (!srcTitle && !srcContent) {
      toast.error('Please enter at least a headline or article content in any language first');
      return;
    }

    setIsTranslating(true);
    try {
      const translated = await autoTranslateRecord({
        title: srcTitle,
        content: srcContent
      }, ['title', 'content']);

      setPostForm(prev => ({
        ...prev,
        titleEn: prev.titleEn || translated.titleEn || srcTitle,
        titleMn: prev.titleMn || translated.titleMn || srcTitle,
        titleDe: prev.titleDe || translated.titleDe || srcTitle,
        contentEn: prev.contentEn || translated.contentEn || srcContent,
        contentMn: prev.contentMn || translated.contentMn || srcContent,
        contentDe: prev.contentDe || translated.contentDe || srcContent
      }));
      toast.success('✨ All article translations generated!');
    } catch (err) {
      toast.error('Auto-translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  // 1-Click AI Auto-Translation for Gallery
  const handleAutoTranslateGallery = async () => {
    const srcTitle = galleryForm.titleEn || galleryForm.titleMn || galleryForm.titleDe;
    const srcDesc = galleryForm.descriptionEn || galleryForm.descriptionMn || galleryForm.descriptionDe;
    const srcArtist = galleryForm.artistEn || galleryForm.artistMn || galleryForm.artistDe;

    if (!srcTitle && !srcDesc) {
      toast.error('Please enter at least an artwork title or description first');
      return;
    }

    setIsTranslating(true);
    try {
      const translated = await autoTranslateRecord({
        title: srcTitle,
        description: srcDesc,
        artist: srcArtist
      }, ['title', 'description', 'artist']);

      setGalleryForm(prev => ({
        ...prev,
        titleEn: prev.titleEn || translated.titleEn || srcTitle,
        titleMn: prev.titleMn || translated.titleMn || srcTitle,
        titleDe: prev.titleDe || translated.titleDe || srcTitle,
        descriptionEn: prev.descriptionEn || translated.descriptionEn || srcDesc,
        descriptionMn: prev.descriptionMn || translated.descriptionMn || srcDesc,
        descriptionDe: prev.descriptionDe || translated.descriptionDe || srcDesc,
        artistEn: prev.artistEn || translated.artistEn || srcArtist,
        artistMn: prev.artistMn || translated.artistMn || srcArtist,
        artistDe: prev.artistDe || translated.artistDe || srcArtist
      }));
      toast.success('✨ All artwork translations generated!');
    } catch (err) {
      toast.error('Auto-translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  // Quick Apply Media Preset
  const handleSelectMediaPreset = (url: string) => {
    if (activeMediaTarget === 'event') {
      setEventForm(prev => ({ ...prev, imageUrl: url }));
    } else if (activeMediaTarget === 'post') {
      setPostForm(prev => ({ ...prev, imageUrl: url }));
    } else if (activeMediaTarget === 'gallery') {
      setGalleryForm(prev => ({ ...prev, imageUrl: url }));
    }
    setIsMediaPickerOpen(false);
    toast.success('Photo applied from media library');
  };

  // Open Event Modal for Create or Edit
  const openEventStudio = (existingEvent?: any) => {
    if (existingEvent) {
      setIsEditing(true);
      setEventForm({
        id: existingEvent.id,
        titleEn: existingEvent.titleEn || existingEvent.title || '',
        titleMn: existingEvent.titleMn || '',
        titleDe: existingEvent.titleDe || '',
        descriptionEn: existingEvent.descriptionEn || existingEvent.description || '',
        descriptionMn: existingEvent.descriptionMn || '',
        descriptionDe: existingEvent.descriptionDe || '',
        date: existingEvent.date || '',
        time: existingEvent.time || '18:00',
        location: existingEvent.location || 'Vienna, Austria',
        category: existingEvent.category || 'Cultural Celebration',
        price: (existingEvent.price || 0) / 100,
        capacity: existingEvent.capacity || 0,
        imageUrl: existingEvent.imageUrl || '',
        whatsIncluded: Array.isArray(existingEvent.whatsIncluded) ? existingEvent.whatsIncluded.join(', ') : '',
        galleryImages: Array.isArray(existingEvent.galleryImages) ? existingEvent.galleryImages.join(', ') : ''
      });
    } else {
      setIsEditing(false);
      setEventForm({
        id: '',
        titleEn: '', titleMn: '', titleDe: '',
        descriptionEn: '', descriptionMn: '', descriptionDe: '',
        date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        time: '18:00',
        location: 'Palais Eschenbach, Eschenbachgasse 11, 1010 Wien',
        category: 'Cultural Celebration',
        price: 0,
        capacity: 100,
        imageUrl: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=1600&auto=format&fit=crop',
        whatsIncluded: 'Authentic Catering, Cultural Performance, Translation Support',
        galleryImages: ''
      });
    }
    setEventEditorMode('edit');
    setIsEventModalOpen(true);
  };

  // Open Post Modal for Create or Edit
  const openPostStudio = (existingPost?: any) => {
    if (existingPost) {
      setIsEditing(true);
      setPostForm({
        id: existingPost.id,
        slug: existingPost.slug || '',
        titleEn: existingPost.titleEn || '',
        titleMn: existingPost.titleMn || existingPost.title || '',
        titleDe: existingPost.titleDe || '',
        contentEn: existingPost.contentEn || '',
        contentMn: existingPost.contentMn || existingPost.content || '',
        contentDe: existingPost.contentDe || '',
        imageUrl: existingPost.imageUrl || '',
        galleryImages: Array.isArray(existingPost.galleryImages) ? existingPost.galleryImages.join(', ') : ''
      });
    } else {
      setIsEditing(false);
      setPostForm({
        id: '',
        slug: '',
        titleEn: '', titleMn: '', titleDe: '',
        contentEn: '', contentMn: '', contentDe: '',
        imageUrl: 'https://images.unsplash.com/photo-1695555875394-4e8aa542ccdc?q=80&w=1600&auto=format&fit=crop',
        galleryImages: ''
      });
    }
    setPostEditorMode('edit');
    setIsPostModalOpen(true);
  };

  // Open Gallery Modal for Create or Edit
  const openGalleryStudio = (existingArtwork?: any) => {
    if (existingArtwork) {
      setIsEditing(true);
      setGalleryForm({
        id: existingArtwork.id,
        titleEn: existingArtwork.titleEn || existingArtwork.title || '',
        titleMn: existingArtwork.titleMn || '',
        titleDe: existingArtwork.titleDe || '',
        artistEn: existingArtwork.artistEn || existingArtwork.artist || '',
        artistMn: existingArtwork.artistMn || '',
        artistDe: existingArtwork.artistDe || '',
        year: existingArtwork.year || '2026',
        descriptionEn: existingArtwork.descriptionEn || existingArtwork.description || '',
        descriptionMn: existingArtwork.descriptionMn || '',
        descriptionDe: existingArtwork.descriptionDe || '',
        imageUrl: existingArtwork.imageUrl || '',
        category: existingArtwork.category || 'Traditional'
      });
    } else {
      setIsEditing(false);
      setGalleryForm({
        id: '',
        titleEn: '', titleMn: '', titleDe: '',
        artistEn: '', artistMn: '', artistDe: '',
        year: '2026',
        descriptionEn: '', descriptionMn: '', descriptionDe: '',
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1600&auto=format&fit=crop',
        category: 'Traditional'
      });
    }
    setGalleryEditorMode('edit');
    setIsGalleryModalOpen(true);
  };

  // Submit Event
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const fallbackTitle = (eventForm.titleEn || eventForm.titleMn || eventForm.titleDe || '').trim();
    if (!fallbackTitle) {
      toast.error('Please enter an event title in at least one language.');
      return;
    }

    setIsSubmitting(true);
    try {
      const fallbackDesc = (eventForm.descriptionEn || eventForm.descriptionMn || eventForm.descriptionDe || '').trim() || 'Event details and program information.';
      const fallbackImage = (eventForm.imageUrl || '').trim() || 'https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=1600&auto=format&fit=crop';

      const baseData: any = {
        title: fallbackTitle,
        titleEn: eventForm.titleEn?.trim() || fallbackTitle,
        titleMn: eventForm.titleMn?.trim() || fallbackTitle,
        titleDe: eventForm.titleDe?.trim() || fallbackTitle,
        description: fallbackDesc,
        descriptionEn: eventForm.descriptionEn?.trim() || fallbackDesc,
        descriptionMn: eventForm.descriptionMn?.trim() || fallbackDesc,
        descriptionDe: eventForm.descriptionDe?.trim() || fallbackDesc,
        date: eventForm.date || new Date().toISOString().split('T')[0],
        time: eventForm.time || '18:00',
        location: eventForm.location?.trim() || 'Palais Eschenbach, Eschenbachgasse 11, 1010 Wien',
        category: eventForm.category || 'Cultural Celebration',
        price: Number(eventForm.price) * 100 || 0,
        capacity: Number(eventForm.capacity) || 0,
        imageUrl: fallbackImage,
        updatedAt: serverTimestamp(),
      };

      const whatsIncludedList = eventForm.whatsIncluded
        ? eventForm.whatsIncluded.split(',').map(s => s.trim()).filter(Boolean)
        : [];
      if (whatsIncludedList.length > 0) {
        baseData.whatsIncluded = whatsIncludedList;
      }

      const galleryList = eventForm.galleryImages
        ? eventForm.galleryImages.split(',').map(s => s.trim()).filter(Boolean)
        : [];
      if (galleryList.length > 0) {
        baseData.galleryImages = galleryList;
      }

      if (isEditing && eventForm.id) {
        await updateDoc(doc(db, 'events', eventForm.id), baseData);
        toast.success('Event updated successfully');
      } else {
        await addDoc(collection(db, 'events'), { ...baseData, registeredCount: 0, createdAt: serverTimestamp() });
        toast.success('Event published successfully');
      }

      setIsEventModalOpen(false);
      setIsEditing(false);
    } catch (error: any) {
      console.error('Save Event Error:', error);
      toast.error(`Failed to save event: ${error?.message || 'Check connection'}`);
      handleFirestoreError(error, OperationType.WRITE, 'events');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Post
  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const fallbackTitle = (postForm.titleMn || postForm.titleEn || postForm.titleDe || '').trim();
    if (!fallbackTitle) {
      toast.error('Please enter an article headline in at least one language.');
      return;
    }

    setIsSubmitting(true);
    try {
      const rawSlugSource = postForm.titleEn || postForm.titleMn || 'post';
      const transliteratedSource = transliterateCyrillic(rawSlugSource);
      const generatedSlug = transliteratedSource
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || `post-${Date.now()}`;

      const fallbackContent = (postForm.contentMn || postForm.contentEn || postForm.contentDe || '').trim() || 'Article content details.';
      const fallbackAuthorId = user?.uid || 'admin-author';
      const fallbackImageUrl = (postForm.imageUrl || '').trim() || 'https://images.unsplash.com/photo-1695555875394-4e8aa542ccdc?q=80&w=1600&auto=format&fit=crop';

      const postData: any = {
        title: fallbackTitle,
        titleEn: postForm.titleEn?.trim() || fallbackTitle,
        titleMn: postForm.titleMn?.trim() || fallbackTitle,
        titleDe: postForm.titleDe?.trim() || fallbackTitle,
        slug: postForm.slug?.trim() || generatedSlug,
        content: fallbackContent,
        contentEn: postForm.contentEn?.trim() || fallbackContent,
        contentMn: postForm.contentMn?.trim() || fallbackContent,
        contentDe: postForm.contentDe?.trim() || fallbackContent,
        imageUrl: fallbackImageUrl,
        updatedAt: serverTimestamp(),
      };

      const galleryList = postForm.galleryImages
        ? postForm.galleryImages.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];
      if (galleryList.length > 0) {
        postData.galleryImages = galleryList;
      }

      if (isEditing && postForm.id) {
        await updateDoc(doc(db, 'posts', postForm.id), postData);
        toast.success('Post updated successfully');
      } else {
        await addDoc(collection(db, 'posts'), {
          ...postData,
          authorId: fallbackAuthorId,
          createdAt: serverTimestamp()
        });
        toast.success('Gazette Article published successfully');
      }

      setIsPostModalOpen(false);
      setIsEditing(false);
    } catch (error: any) {
      console.error('Save Post Error:', error);
      toast.error(`Failed to save post: ${error?.message || 'Check permissions'}`);
      handleFirestoreError(error, OperationType.WRITE, 'posts');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Gallery Item
  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const fallbackTitle = (galleryForm.titleEn || galleryForm.titleMn || galleryForm.titleDe || '').trim();
    if (!fallbackTitle) {
      toast.error('Please enter an artwork title in at least one language.');
      return;
    }

    setIsSubmitting(true);
    try {
      const fallbackDesc = (galleryForm.descriptionEn || galleryForm.descriptionMn || galleryForm.descriptionDe || '').trim() || 'Traditional craftsmanship piece.';
      const fallbackArtist = (galleryForm.artistEn || galleryForm.artistMn || galleryForm.artistDe || '').trim() || 'Master Artist';
      const fallbackImage = (galleryForm.imageUrl || '').trim() || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1600&auto=format&fit=crop';

      const baseData: any = {
        title: fallbackTitle,
        titleEn: galleryForm.titleEn?.trim() || fallbackTitle,
        titleMn: galleryForm.titleMn?.trim() || fallbackTitle,
        titleDe: galleryForm.titleDe?.trim() || fallbackTitle,
        artist: fallbackArtist,
        artistEn: galleryForm.artistEn?.trim() || fallbackArtist,
        artistMn: galleryForm.artistMn?.trim() || fallbackArtist,
        artistDe: galleryForm.artistDe?.trim() || fallbackArtist,
        year: galleryForm.year || '2026',
        description: fallbackDesc,
        descriptionEn: galleryForm.descriptionEn?.trim() || fallbackDesc,
        descriptionMn: galleryForm.descriptionMn?.trim() || fallbackDesc,
        descriptionDe: galleryForm.descriptionDe?.trim() || fallbackDesc,
        imageUrl: fallbackImage,
        category: galleryForm.category || 'Traditional',
        updatedAt: serverTimestamp(),
      };

      if (isEditing && galleryForm.id) {
        await updateDoc(doc(db, 'gallery', galleryForm.id), baseData);
        toast.success('Gallery item updated successfully');
      } else {
        await addDoc(collection(db, 'gallery'), { ...baseData, createdAt: serverTimestamp() });
        toast.success('Artwork added to gallery successfully');
      }

      setIsGalleryModalOpen(false);
      setIsEditing(false);
    } catch (error: any) {
      console.error('Save Gallery Error:', error);
      toast.error(`Failed to save gallery item: ${error?.message || 'Check connection'}`);
      handleFirestoreError(error, OperationType.WRITE, 'gallery');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (colName: string, id: string) => {
    setItemToDelete({ collection: colName, id });
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteDoc(doc(db, itemToDelete.collection, itemToDelete.id));
      toast.success('Item deleted successfully');
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error('Failed to delete item');
      handleFirestoreError(error, OperationType.DELETE, itemToDelete.collection);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      toast.success('User role updated');
    } catch (error) {
      toast.error('Failed to update user role');
      handleFirestoreError(error, OperationType.WRITE, 'users');
    }
  };

  const handleMembershipTierChange = async (userId: string, newTier: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        membershipTier: newTier,
        membershipStatus: newTier === 'user' ? 'inactive' : 'active',
        membershipUpdatedAt: serverTimestamp()
      });
      toast.success('User membership tier updated');
    } catch (error) {
      toast.error('Failed to update membership tier');
      handleFirestoreError(error, OperationType.WRITE, 'users');
    }
  };

  const handleReviewApplication = async (appId: string, userId: string, tier: string, newStatus: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'membership_applications', appId), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });

      if (newStatus === 'approved') {
        await updateDoc(doc(db, 'users', userId), {
          membershipTier: tier,
          membershipStatus: 'active',
          membershipUpdatedAt: serverTimestamp()
        });
        toast.success(`Application approved! User tier set to ${tier}.`);
      } else {
        toast.success('Application rejected.');
      }
    } catch (error) {
      toast.error('Failed to update application');
      handleFirestoreError(error, OperationType.WRITE, 'membership_applications');
    }
  };

  const exportToCSV = () => {
    const headers = ['Attendee Name', 'User Email', 'Event Title', 'Status', 'Date Registered'];
    const rows = registrations.map(reg => [
      `"${reg.name || 'N/A'}"`,
      `"${reg.email || getUserEmail(reg.userId)}"`,
      `"${getEventTitle(reg.eventId)}"`,
      `"${reg.status || 'pending'}"`,
      `"${reg.createdAt?.toDate ? reg.createdAt.toDate().toLocaleDateString() : 'N/A'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MCA_Registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getUserEmail = (userId: string) => {
    const u = users.find(user => user.id === userId);
    return u ? u.email : 'Unknown User';
  };

  const getEventTitle = (eventId: string) => {
    const e = events.find(event => event.id === eventId);
    return e ? (e.titleEn || e.title || 'Untitled Event') : 'Unknown Event';
  };

  // Filtered lists
  const filteredEvents = events.filter(e => {
    const search = eventSearch.toLowerCase();
    return (e.titleEn || e.title || '').toLowerCase().includes(search) ||
           (e.location || '').toLowerCase().includes(search) ||
           (e.category || '').toLowerCase().includes(search);
  });

  const filteredPosts = posts.filter(p => {
    const search = postSearch.toLowerCase();
    return (p.titleMn || p.titleEn || p.title || '').toLowerCase().includes(search) ||
           (p.slug || '').toLowerCase().includes(search);
  });

  const filteredGallery = gallery.filter(g => {
    const search = gallerySearch.toLowerCase();
    return (g.titleEn || g.title || '').toLowerCase().includes(search) ||
           (g.artist || g.artistEn || '').toLowerCase().includes(search) ||
           (g.category || '').toLowerCase().includes(search);
  });

  const filteredRegistrations = registrations.filter(r => {
    const search = regSearch.toLowerCase();
    return (r.name || '').toLowerCase().includes(search) ||
           (r.email || '').toLowerCase().includes(search) ||
           getEventTitle(r.eventId).toLowerCase().includes(search);
  });

  if (!isEditor) {
    return (
      <div className="pt-[140px] md:pt-[152px] min-h-screen bg-brand-paper flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-10 rounded-[32px] border border-brand-ink/10 shadow-lg">
          <Shield size={48} className="text-brand-gold mx-auto mb-4" />
          <h2 className="text-2xl font-serif mb-2">Restricted Access</h2>
          <p className="text-sm text-brand-ink/60 mb-6 font-light">
            You must be an administrator or editor to access the MCA management studio.
          </p>
          <Link to="/" className="inline-block px-6 py-3 bg-brand-ink text-white rounded-xl text-xs uppercase tracking-wider font-bold">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[140px] md:pt-[152px] min-h-screen bg-[#FAF8F5] text-slate-900 selection:bg-brand-gold/30 selection:text-slate-900 font-sans pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Executive Studio Header with 1-Click Launchpad */}
        <div className="mb-10 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-[#0A1128] text-brand-gold rounded text-[10px] uppercase font-mono tracking-widest font-bold">
                Executive Studio
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-600 font-medium">Austrian-Mongolian Center Publishing Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900">
              Admin <span className="italic text-[#C5A059] font-light">Publishing Center</span>
            </h1>
          </div>

          {/* Quick Post Launchpad Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openPostStudio()}
              className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl hover:bg-brand-gold hover:text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-sm group cursor-pointer"
            >
              <FileText className="w-4 h-4 text-brand-gold group-hover:text-slate-950 transition-colors" />
              <span>+ Post News</span>
            </button>

            <button
              onClick={() => openEventStudio()}
              className="flex items-center gap-2 px-5 py-3 bg-[#0A1128] text-white rounded-xl hover:bg-brand-gold hover:text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-sm group cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-brand-gold group-hover:text-slate-950 transition-colors" />
              <span>+ Create Event</span>
            </button>

            <button
              onClick={() => openGalleryStudio()}
              className="flex items-center gap-2 px-5 py-3 bg-white text-slate-800 border border-slate-300 rounded-xl hover:border-brand-gold hover:text-brand-gold font-bold text-xs uppercase tracking-wider transition-all shadow-sm group cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
              <span>+ Add Artwork</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="mb-10 overflow-x-auto no-scrollbar">
          <div className="inline-flex bg-slate-200/80 p-1.5 rounded-2xl border border-slate-200 gap-1 min-w-max">
            {[
              { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={16} />, badge: null },
              { id: 'events', label: 'Events & Galas', icon: <Calendar size={16} />, badge: events.length },
              { id: 'posts', label: 'News & Gazette', icon: <FileText size={16} />, badge: posts.length },
              { id: 'gallery', label: 'Gallery Archive', icon: <ImageIcon size={16} />, badge: gallery.length },
              { id: 'registrations', label: 'Registrations', icon: <Users size={16} />, badge: registrations.length },
              { id: 'users', label: 'Members', icon: <Shield size={16} />, badge: users.length },
              { id: 'applications', label: 'Applications', icon: <FileText size={16} />, badge: applications.filter(a => a.status === 'pending').length || null },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== null && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    activeTab === tab.id ? 'bg-[#0A1128] text-white' : 'bg-slate-300 text-slate-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Contents */}
        <AnimatePresence mode="wait">
          
          {/* 1. ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Page Views', value: pageViews.length, icon: <TrendingUp className="text-blue-600" />, color: 'bg-blue-50' },
                  { label: 'Active Events', value: events.length, icon: <Calendar className="text-amber-600" />, color: 'bg-amber-50' },
                  { label: 'Event Registrations', value: registrations.length, icon: <Users className="text-purple-600" />, color: 'bg-purple-50' },
                  { label: 'Community Members', value: users.length, icon: <Shield className="text-emerald-600" />, color: 'bg-emerald-50' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm">
                    <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                      {stat.icon}
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-serif font-bold text-slate-900">{stat.value}</h3>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-serif text-slate-900">Traffic Activity</h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                      Daily Views
                    </div>
                  </div>
                  <div className="h-[340px] w-full flex items-center justify-center">
                    {analyticsData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                          <Tooltip
                            contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', fontSize: '12px', padding: '12px' }}
                          />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#0f172a"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#0f172a', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center">
                        <TrendingUp size={40} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-slate-400 text-sm italic">No traffic recorded yet.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="text-2xl font-serif mb-6 text-slate-900">Recent Visits</h3>
                  <div className="space-y-4">
                    {pageViews.length > 0 ? pageViews.slice(0, 6).map((view, i) => (
                      <div key={i} className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                          <ExternalLink size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{view.page || 'Home'}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
                            {view.timestamp?.toDate ? view.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                          </p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-slate-400 text-sm italic text-center py-10">No recent activity.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. EVENTS TAB */}
          {activeTab === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Actions & Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search events by title, location..."
                    value={eventSearch}
                    onChange={e => setEventSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-gold/20 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => openEventStudio()}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#0A1128] text-white rounded-xl hover:bg-brand-gold hover:text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    <Plus size={16} />
                    <span>Create New Event</span>
                  </button>
                </div>
              </div>

              {/* Events Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.length > 0 ? filteredEvents.map((item) => (
                  <div key={item.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all">
                    <div className="aspect-[16/9] relative overflow-hidden bg-slate-100">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Calendar size={32} />
                        </div>
                      )}
                      
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-white/95 backdrop-blur-sm text-slate-900 text-[10px] uppercase tracking-widest font-extrabold rounded-md shadow-sm border border-slate-200">
                          {item.category || 'Event'}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <button
                          onClick={() => openEventStudio(item)}
                          className="p-2 bg-white/90 hover:bg-brand-gold hover:text-slate-950 text-slate-700 rounded-lg shadow-sm backdrop-blur-sm transition-colors cursor-pointer"
                          title="Edit Event"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => confirmDelete('events', item.id)}
                          className="p-2 bg-white/90 hover:bg-red-500 hover:text-white text-red-600 rounded-lg shadow-sm backdrop-blur-sm transition-colors cursor-pointer"
                          title="Delete Event"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-bold text-white bg-slate-950/75 backdrop-blur-md px-3 py-1.5 rounded-lg">
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} className="text-brand-gold" />
                          {item.date} • {item.time}
                        </span>
                        <span className="text-brand-gold">
                          {item.price > 0 ? `€${(item.price / 100).toFixed(2)}` : 'FREE'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="text-xl font-serif text-slate-900 font-semibold line-clamp-1 mb-1">
                          {item.titleEn || item.title || 'Untitled Event'}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {item.descriptionEn || item.description || 'No description provided.'}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1 truncate max-w-[200px]" title={item.location}>
                          <MapPin size={13} className="text-brand-gold shrink-0" />
                          <span className="truncate">{item.location || 'Vienna'}</span>
                        </span>
                        <span className="font-mono text-[11px] font-bold text-slate-700">
                          {item.registeredCount || 0} RSVPs
                        </span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-16 bg-white rounded-3xl border border-slate-200 text-center">
                    <Calendar size={40} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500 text-sm font-medium">No events found matching your search.</p>
                    <button
                      onClick={() => openEventStudio()}
                      className="mt-4 px-5 py-2.5 bg-[#0A1128] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                    >
                      + Create First Event
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* 3. POSTS / GAZETTE NEWS TAB */}
          {activeTab === 'posts' && (
            <motion.div
              key="posts"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Actions & Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search news by headline..."
                    value={postSearch}
                    onChange={e => setPostSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-gold/20 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => openPostStudio()}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#0A1128] text-white rounded-xl hover:bg-brand-gold hover:text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    <Plus size={16} />
                    <span>Write Gazette Article</span>
                  </button>
                </div>
              </div>

              {/* News Articles List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.length > 0 ? filteredPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all">
                    <div className="aspect-[16/10] relative overflow-hidden bg-slate-100">
                      {post.imageUrl ? (
                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <FileText size={32} />
                        </div>
                      )}

                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <button
                          onClick={() => openPostStudio(post)}
                          className="p-2 bg-white/90 hover:bg-brand-gold hover:text-slate-950 text-slate-700 rounded-lg shadow-sm backdrop-blur-sm transition-colors cursor-pointer"
                          title="Edit Article"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => confirmDelete('posts', post.id)}
                          className="p-2 bg-white/90 hover:bg-red-500 hover:text-white text-red-600 rounded-lg shadow-sm backdrop-blur-sm transition-colors cursor-pointer"
                          title="Delete Article"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="absolute bottom-3 left-3">
                        <span className="px-2.5 py-1 bg-slate-900/80 text-brand-gold text-[9px] uppercase font-mono tracking-widest font-bold rounded">
                          Gazette Publication
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="text-xl font-serif text-slate-900 font-bold line-clamp-2 mb-2">
                          {post.titleMn || post.titleEn || post.title || 'Untitled Article'}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                          {post.contentMn || post.contentEn || post.content || 'No text content.'}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
                        <span className="truncate max-w-[150px]">/{post.slug || 'news'}</span>
                        <Link to={`/news/${post.slug || post.id}`} className="text-brand-gold hover:underline font-bold text-[11px] flex items-center gap-1">
                          View Article <ExternalLink size={11} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-16 bg-white rounded-3xl border border-slate-200 text-center">
                    <FileText size={40} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500 text-sm font-medium">No gazette articles found.</p>
                    <button
                      onClick={() => openPostStudio()}
                      className="mt-4 px-5 py-2.5 bg-[#0A1128] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                    >
                      + Write First Article
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* 4. GALLERY ARCHIVE TAB */}
          {activeTab === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Actions & Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search gallery by title, artist..."
                    value={gallerySearch}
                    onChange={e => setGallerySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-gold/20 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => openGalleryStudio()}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#0A1128] text-white rounded-xl hover:bg-brand-gold hover:text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    <Plus size={16} />
                    <span>Add Artwork</span>
                  </button>
                </div>
              </div>

              {/* Gallery Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGallery.length > 0 ? filteredGallery.map((item) => (
                  <div key={item.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all">
                    <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-white/95 backdrop-blur-sm text-slate-900 text-[10px] uppercase tracking-widest font-extrabold rounded-md shadow-sm border border-slate-200">
                          {item.category || 'Traditional'}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <button
                          onClick={() => openGalleryStudio(item)}
                          className="p-2 bg-white/90 hover:bg-brand-gold hover:text-slate-950 text-slate-700 rounded-lg shadow-sm backdrop-blur-sm transition-colors cursor-pointer"
                          title="Edit Artwork"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => confirmDelete('gallery', item.id)}
                          className="p-2 bg-white/90 hover:bg-red-500 hover:text-white text-red-600 rounded-lg shadow-sm backdrop-blur-sm transition-colors cursor-pointer"
                          title="Delete Artwork"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <h4 className="text-xl font-serif text-slate-900 font-semibold truncate mb-1">
                        {item.titleEn || item.title || 'Untitled'}
                      </h4>
                      <p className="text-xs text-slate-500 italic">
                        {item.artist || item.artistEn || 'Master Artist'} • {item.year || '2026'}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-16 bg-white rounded-3xl border border-slate-200 text-center">
                    <ImageIcon size={40} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500 text-sm font-medium">No gallery items found.</p>
                    <button
                      onClick={() => openGalleryStudio()}
                      className="mt-4 px-5 py-2.5 bg-[#0A1128] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                    >
                      + Add First Artwork
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* 5. REGISTRATIONS TAB */}
          {activeTab === 'registrations' && (
            <motion.div
              key="registrations"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-8 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="text-2xl font-serif text-slate-900">Event Registrations</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Attendee roster and ticket tracking</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search registrations..."
                      value={regSearch}
                      onChange={e => setRegSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                  <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer"
                  >
                    <Download size={14} />
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Attendee</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Event Title</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Contact</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Date</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900">{reg.name || 'Anonymous'}</p>
                          <p className="text-[10px] text-slate-400 font-mono">UID: {reg.userId?.slice(0, 8)}...</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-serif text-slate-900">{getEventTitle(reg.eventId)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-slate-700">{reg.email || getUserEmail(reg.userId)}</p>
                          {reg.phone && <p className="text-[10px] text-slate-500">{reg.phone}</p>}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            reg.status === 'paid' || reg.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                            reg.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {reg.status || 'confirmed'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs font-mono">
                          {reg.createdAt?.toDate ? reg.createdAt.toDate().toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => { setItemToDelete({ id: reg.id, collection: 'registrations' }); setIsDeleteModalOpen(true); }}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* 6. USERS TAB */}
          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-8 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-serif text-slate-900">Community Members</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Manage user roles and membership status</p>
                </div>
                <div className="bg-slate-100 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-800">
                  Total Users: <span className="text-brand-gold font-mono">{users.length}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Member</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Email</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">System Role</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Membership Tier</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold font-bold text-xs">
                              {u.photoURL ? (
                                <img src={u.photoURL} alt="" className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                u.displayName ? u.displayName.charAt(0) : <UserIcon size={14} />
                              )}
                            </div>
                            <span className="text-sm font-medium text-slate-900">{u.displayName || 'Anonymous'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-600 font-mono">{u.email}</td>
                        <td className="px-6 py-4">
                          <select
                            value={u.role || 'user'}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            disabled={!isSuperAdmin || u.email?.toLowerCase() === 'emeraldtorstein@gmail.com'}
                            className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-800"
                          >
                            <option value="user">User</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={u.membershipTier || 'user'}
                            onChange={(e) => handleMembershipTierChange(u.id, e.target.value)}
                            className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-800"
                          >
                            <option value="user">Non-Member</option>
                            <option value="student">Student / Youth</option>
                            <option value="professional">Professional</option>
                            <option value="partner">Partner</option>
                            <option value="institutional">Institutional</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                          {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* 7. APPLICATIONS TAB */}
          {activeTab === 'applications' && (
            <motion.div
              key="applications"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-8 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-serif text-slate-900">Membership Applications</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Review applicant statements and approve tiers</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-xs font-bold text-amber-900">
                  Pending: {applications.filter(a => a.status === 'pending').length}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Applicant</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Tier</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Details</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Statement</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900">{app.firstName} {app.lastName}</p>
                          <p className="text-xs text-slate-500 font-mono">{app.userEmail}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded text-[10px] font-bold uppercase tracking-widest">
                            {app.tier}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-700">
                          {app.organizationName && <p><strong>Org:</strong> {app.organizationName}</p>}
                          {app.position && <p><strong>Role:</strong> {app.position}</p>}
                          {app.schoolOrUniversity && <p><strong>School:</strong> {app.schoolOrUniversity}</p>}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-slate-600 line-clamp-2 max-w-xs" title={app.statementOfPurpose}>
                            {app.statementOfPurpose || 'N/A'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                            app.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                            app.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {app.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleReviewApplication(app.id, app.userId, app.tier, 'approved')}
                                className="p-2 bg-emerald-100 hover:bg-emerald-600 hover:text-white text-emerald-700 rounded-lg transition-colors cursor-pointer"
                                title="Approve"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => handleReviewApplication(app.id, app.userId, app.tier, 'rejected')}
                                className="p-2 bg-rose-100 hover:bg-rose-600 hover:text-white text-rose-700 rounded-lg transition-colors cursor-pointer"
                                title="Reject"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Reviewed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* ========================================================================= */}
      {/* 1. EVENT CREATOR STUDIO MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        title={isEditing ? "Edit Event" : "Create New Event"}
        className="max-w-4xl"
      >
        <div className="space-y-6">
          {/* Top Control Bar: Mode Toggle & 1-Click Auto Translate */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setEventEditorMode('edit')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  eventEditorMode === 'edit' ? 'bg-[#0A1128] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Edit3 size={13} className="inline mr-1.5" /> Edit Form
              </button>
              <button
                type="button"
                onClick={() => setEventEditorMode('preview')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  eventEditorMode === 'preview' ? 'bg-[#0A1128] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Eye size={13} className="inline mr-1.5" /> Live Preview
              </button>
            </div>

            <button
              type="button"
              onClick={handleAutoTranslateEvent}
              disabled={isTranslating}
              className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-brand-gold hover:text-slate-950 text-amber-900 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-amber-300 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <Wand2 size={14} className={isTranslating ? "animate-spin" : ""} />
              <span>{isTranslating ? 'Translating...' : '✨ Auto-Translate All Languages'}</span>
            </button>
          </div>

          {eventEditorMode === 'edit' ? (
            <form onSubmit={handleAddEvent} className="space-y-6">
              
              {/* Media & Key Event Details Strip */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-200">
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Cover Image URL</label>
                      <button
                        type="button"
                        onClick={() => { setActiveMediaTarget('event'); setIsMediaPickerOpen(true); }}
                        className="text-[10px] text-amber-800 hover:text-brand-gold font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        <ImageIcon size={12} /> 📸 Browse Media Presets
                      </button>
                    </div>
                    <input
                      required
                      value={eventForm.imageUrl}
                      onChange={e => setEventForm({ ...eventForm, imageUrl: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-brand-gold/20"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Event Date</label>
                      <input
                        required
                        type="date"
                        value={eventForm.date}
                        onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-brand-gold/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Start Time</label>
                      <input
                        required
                        type="time"
                        value={eventForm.time}
                        onChange={e => setEventForm({ ...eventForm, time: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-brand-gold/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Category</label>
                      <select
                        value={eventForm.category}
                        onChange={e => setEventForm({ ...eventForm, category: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium"
                      >
                        <option value="Cultural Celebration">Cultural Celebration</option>
                        <option value="Masterclass & Workshop">Masterclass & Workshop</option>
                        <option value="Academic Lecture">Academic Lecture</option>
                        <option value="Concert & Performance">Concert & Performance</option>
                        <option value="Diplomatic Forum">Diplomatic Forum</option>
                      </select>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Ticket Price (€)</label>
                        <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={eventForm.price === 0}
                            onChange={(e) => setEventForm({ ...eventForm, price: e.target.checked ? 0 : 15 })}
                            className="rounded text-brand-gold"
                          />
                          Free
                        </label>
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        disabled={eventForm.price === 0}
                        value={eventForm.price === 0 ? '' : eventForm.price}
                        onChange={e => setEventForm({ ...eventForm, price: Number(e.target.value) })}
                        placeholder={eventForm.price === 0 ? "Free of Charge" : "15.00"}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 disabled:bg-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Location</label>
                    <input
                      required
                      value={eventForm.location}
                      onChange={e => setEventForm({ ...eventForm, location: e.target.value })}
                      placeholder="e.g. Palais Eschenbach, Eschenbachgasse 11, 1010 Wien"
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900"
                    />
                  </div>
                </div>

                {/* Live Image Preview */}
                <div className="md:col-span-4 flex flex-col justify-center">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 relative shadow-sm">
                    {eventForm.imageUrl ? (
                      <img src={eventForm.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <ImageIcon size={28} />
                        <span className="text-[9px] uppercase tracking-wider font-bold mt-2">No Photo Set</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-center text-slate-500 font-mono mt-2">Cover Preview</span>
                </div>
              </div>

              {/* Multilingual Text Tabs */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mr-2">Language:</span>
                    <button
                      type="button"
                      onClick={() => setEventLangTab('en')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs uppercase font-extrabold border transition-all ${
                        eventLangTab === 'en' ? 'bg-[#0A1128] text-white border-[#0A1128]' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      🇬🇧 English {eventForm.titleEn && '✓'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEventLangTab('mn')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs uppercase font-extrabold border transition-all ${
                        eventLangTab === 'mn' ? 'bg-[#0A1128] text-white border-[#0A1128]' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      🇲🇳 Монгол {eventForm.titleMn && '✓'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEventLangTab('de')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs uppercase font-extrabold border transition-all ${
                        eventLangTab === 'de' ? 'bg-[#0A1128] text-white border-[#0A1128]' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      🇩🇪 Deutsch {eventForm.titleDe && '✓'}
                    </button>
                  </div>
                </div>

                {eventLangTab === 'en' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Title (English)</label>
                      <input
                        value={eventForm.titleEn}
                        onChange={e => setEventForm({ ...eventForm, titleEn: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900"
                        placeholder="e.g. Tsagaan Sar Traditional Spring Gala 2026"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Description (English)</label>
                      <textarea
                        value={eventForm.descriptionEn}
                        onChange={e => setEventForm({ ...eventForm, descriptionEn: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl p-4 text-xs text-slate-900 h-32 leading-relaxed"
                        placeholder="Describe the schedule, guest performers, and program..."
                      />
                    </div>
                  </div>
                )}

                {eventLangTab === 'mn' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Title (Mongolian)</label>
                      <input
                        value={eventForm.titleMn}
                        onChange={e => setEventForm({ ...eventForm, titleMn: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900"
                        placeholder="Арга хэмжээний гарчиг..."
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Description (Mongolian)</label>
                      <textarea
                        value={eventForm.descriptionMn}
                        onChange={e => setEventForm({ ...eventForm, descriptionMn: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl p-4 text-xs text-slate-900 h-32 leading-relaxed"
                        placeholder="Арга хэмжээний дэлгэрэнгүй тайлбар..."
                      />
                    </div>
                  </div>
                )}

                {eventLangTab === 'de' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Title (German)</label>
                      <input
                        value={eventForm.titleDe}
                        onChange={e => setEventForm({ ...eventForm, titleDe: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900"
                        placeholder="Veranstaltungstitel auf Deutsch..."
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Description (German)</label>
                      <textarea
                        value={eventForm.descriptionDe}
                        onChange={e => setEventForm({ ...eventForm, descriptionDe: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl p-4 text-xs text-slate-900 h-32 leading-relaxed"
                        placeholder="Beschreibung auf Deutsch..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold uppercase tracking-wider text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl bg-[#0A1128] text-white hover:bg-brand-gold hover:text-slate-950 font-bold uppercase tracking-wider text-xs transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving Event...' : isEditing ? 'Update Event' : 'Publish Event'}
                </button>
              </div>
            </form>
          ) : (
            /* Event Live Card Preview */
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-6">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-amber-800 block">
                Live Visitor Card Preview:
              </span>
              <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
                <div className="aspect-[16/9] relative overflow-hidden bg-slate-100">
                  {eventForm.imageUrl && (
                    <img src={eventForm.imageUrl} alt="" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-white/95 text-slate-900 text-[10px] uppercase tracking-widest font-extrabold rounded-md shadow-sm border border-slate-200">
                      {eventForm.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-bold text-white bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg">
                    <span>{eventForm.date} • {eventForm.time}</span>
                    <span className="text-brand-gold">{eventForm.price > 0 ? `€${eventForm.price}` : 'FREE'}</span>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-serif text-slate-900 font-bold">
                    {eventForm.titleEn || eventForm.titleMn || eventForm.titleDe || 'Untitled Event'}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {eventForm.descriptionEn || eventForm.descriptionMn || eventForm.descriptionDe || 'Event description will appear here...'}
                  </p>
                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
                    <MapPin size={13} className="text-brand-gold shrink-0" />
                    <span>{eventForm.location}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* 2. NEWS GAZETTE ARTICLE CREATOR STUDIO MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        title={isEditing ? "Edit Gazette Article" : "Write Gazette Article"}
        className="max-w-5xl"
      >
        <div className="space-y-6">
          {/* Mode Selector & 1-Click Translate */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPostEditorMode('edit')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  postEditorMode === 'edit' ? 'bg-[#0A1128] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Edit3 size={13} className="inline mr-1.5" /> Edit Article
              </button>
              <button
                type="button"
                onClick={() => setPostEditorMode('preview')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  postEditorMode === 'preview' ? 'bg-[#0A1128] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Eye size={13} className="inline mr-1.5" /> Broadsheet Preview
              </button>
            </div>

            <button
              type="button"
              onClick={handleAutoTranslatePost}
              disabled={isTranslating}
              className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-brand-gold hover:text-slate-950 text-amber-900 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-amber-300 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <Wand2 size={14} className={isTranslating ? "animate-spin" : ""} />
              <span>{isTranslating ? 'Translating...' : '✨ Auto-Translate All Languages'}</span>
            </button>
          </div>

          {postEditorMode === 'edit' ? (
            <form onSubmit={handleAddPost} className="space-y-6">
              
              {/* Media & Slug Strip */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-200">
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Article Hero Photo URL</label>
                      <button
                        type="button"
                        onClick={() => { setActiveMediaTarget('post'); setIsMediaPickerOpen(true); }}
                        className="text-[10px] text-amber-800 hover:text-brand-gold font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        <ImageIcon size={12} /> 📸 Browse Media Presets
                      </button>
                    </div>
                    <input
                      required
                      value={postForm.imageUrl}
                      onChange={e => setPostForm({ ...postForm, imageUrl: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-brand-gold/20"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">
                      Custom URL Slug (Leave empty for auto-generation)
                    </label>
                    <input
                      value={postForm.slug}
                      onChange={e => setPostForm({ ...postForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') })}
                      placeholder="e.g. bilateral-austrian-mongolian-heritage-symposium-2026"
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">
                      Extra Gallery Images (Comma separated URLs)
                    </label>
                    <input
                      value={postForm.galleryImages}
                      onChange={e => setPostForm({ ...postForm, galleryImages: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-1, https://images.unsplash.com/photo-2"
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900"
                    />
                  </div>
                </div>

                {/* Cover Image Preview */}
                <div className="md:col-span-4 flex flex-col justify-center">
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 relative shadow-sm">
                    {postForm.imageUrl ? (
                      <img src={postForm.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <ImageIcon size={28} />
                        <span className="text-[9px] uppercase tracking-wider font-bold mt-2">No Photo Set</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-center text-slate-500 font-mono mt-2">Article Photo Preview</span>
                </div>
              </div>

              {/* Language Switcher */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mr-2">Language:</span>
                    <button
                      type="button"
                      onClick={() => setPostLangTab('mn')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs uppercase font-extrabold border transition-all ${
                        postLangTab === 'mn' ? 'bg-[#0A1128] text-white border-[#0A1128]' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      🇲🇳 Монгол {postForm.titleMn && '✓'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostLangTab('en')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs uppercase font-extrabold border transition-all ${
                        postLangTab === 'en' ? 'bg-[#0A1128] text-white border-[#0A1128]' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      🇬🇧 English {postForm.titleEn && '✓'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostLangTab('de')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs uppercase font-extrabold border transition-all ${
                        postLangTab === 'de' ? 'bg-[#0A1128] text-white border-[#0A1128]' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      🇩🇪 Deutsch {postForm.titleDe && '✓'}
                    </button>
                  </div>
                </div>

                {/* Text Formatting Toolbar */}
                <div className="flex flex-wrap items-center gap-2 p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mr-1">QUICK FORMAT:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const field = postLangTab === 'mn' ? 'contentMn' : postLangTab === 'en' ? 'contentEn' : 'contentDe';
                      setPostForm(prev => ({ ...prev, [field]: prev[field] + '\n\n' }));
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-200 font-bold"
                  >
                    + Paragraph
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const field = postLangTab === 'mn' ? 'contentMn' : postLangTab === 'en' ? 'contentEn' : 'contentDe';
                      setPostForm(prev => ({ ...prev, [field]: prev[field] + '\n### Section Subtitle\n' }));
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-200 font-bold"
                  >
                    📌 Subheading
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const field = postLangTab === 'mn' ? 'contentMn' : postLangTab === 'en' ? 'contentEn' : 'contentDe';
                      setPostForm(prev => ({ ...prev, [field]: prev[field] + '\n"Featured quote goes here"\n' }));
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-200 font-bold"
                  >
                    ❝ Pull Quote ❞
                  </button>
                </div>

                {postLangTab === 'mn' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Headline (Mongolian)</label>
                      <input
                        value={postForm.titleMn}
                        onChange={e => setPostForm({ ...postForm, titleMn: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-lg font-serif font-bold text-slate-900"
                        placeholder="Нийтлэлийн гарчиг..."
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Article Content (Mongolian)</label>
                      <textarea
                        value={postForm.contentMn}
                        onChange={e => setPostForm({ ...postForm, contentMn: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl p-4 text-sm font-serif text-slate-900 h-64 leading-relaxed"
                        placeholder="Нийтлэлийн агуулгыг энд бичнэ үү..."
                      />
                    </div>
                  </div>
                )}

                {postLangTab === 'en' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Headline (English)</label>
                      <input
                        value={postForm.titleEn}
                        onChange={e => setPostForm({ ...postForm, titleEn: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-lg font-serif font-bold text-slate-900"
                        placeholder="English Headline..."
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Article Content (English)</label>
                      <textarea
                        value={postForm.contentEn}
                        onChange={e => setPostForm({ ...postForm, contentEn: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl p-4 text-sm font-serif text-slate-900 h-64 leading-relaxed"
                        placeholder="Write article body in English..."
                      />
                    </div>
                  </div>
                )}

                {postLangTab === 'de' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Headline (German)</label>
                      <input
                        value={postForm.titleDe}
                        onChange={e => setPostForm({ ...postForm, titleDe: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-lg font-serif font-bold text-slate-900"
                        placeholder="Deutsche Überschrift..."
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Article Content (German)</label>
                      <textarea
                        value={postForm.contentDe}
                        onChange={e => setPostForm({ ...postForm, contentDe: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl p-4 text-sm font-serif text-slate-900 h-64 leading-relaxed"
                        placeholder="Artikelinhalt auf Deutsch..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold uppercase tracking-wider text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl bg-[#0A1128] text-white hover:bg-brand-gold hover:text-slate-950 font-bold uppercase tracking-wider text-xs transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Publishing...' : isEditing ? 'Update Gazette Article' : 'Publish Gazette Article'}
                </button>
              </div>
            </form>
          ) : (
            /* Broadsheet Live Preview */
            <div className="p-8 bg-[#FAF8F5] rounded-3xl border border-slate-300 space-y-6">
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <span className="text-[9px] uppercase tracking-[0.3em] font-extrabold text-slate-500 block mb-1">
                  THE AUSTRIAN-MONGOLIAN GAZETTE • LIVE PREVIEW
                </span>
                <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-900 leading-tight my-3">
                  {postForm.titleMn || postForm.titleEn || postForm.titleDe || 'Untitled Article'}
                </h1>
                <div className="border-t border-b border-slate-900 py-1.5 flex justify-between text-[9px] font-mono font-bold text-slate-700">
                  <span>VIENNA, AUSTRIA</span>
                  <span>{new Date().toLocaleDateString()}</span>
                  <span>PREVIEW MODE</span>
                </div>
              </div>

              {postForm.imageUrl && (
                <div className="aspect-[16/10] overflow-hidden rounded-xl bg-slate-200">
                  <img src={postForm.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="font-serif text-slate-900 text-base leading-relaxed space-y-4">
                {(postForm.contentMn || postForm.contentEn || postForm.contentDe || 'Article content will be formatted here...').split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* 3. GALLERY ARTWORK CREATOR STUDIO MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        title={isEditing ? "Edit Gallery Artwork" : "Add Artwork to Gallery"}
        className="max-w-4xl"
      >
        <div className="space-y-6">
          {/* Mode & Auto-Translate */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setGalleryEditorMode('edit')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  galleryEditorMode === 'edit' ? 'bg-[#0A1128] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Edit3 size={13} className="inline mr-1.5" /> Edit Artwork
              </button>
              <button
                type="button"
                onClick={() => setGalleryEditorMode('preview')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  galleryEditorMode === 'preview' ? 'bg-[#0A1128] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Eye size={13} className="inline mr-1.5" /> Live Card Preview
              </button>
            </div>

            <button
              type="button"
              onClick={handleAutoTranslateGallery}
              disabled={isTranslating}
              className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-brand-gold hover:text-slate-950 text-amber-900 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-amber-300 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <Wand2 size={14} className={isTranslating ? "animate-spin" : ""} />
              <span>{isTranslating ? 'Translating...' : '✨ Auto-Translate All Languages'}</span>
            </button>
          </div>

          {galleryEditorMode === 'edit' ? (
            <form onSubmit={handleAddGalleryItem} className="space-y-6">
              
              {/* Media & Meta Strip */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-200">
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Artwork Image URL</label>
                      <button
                        type="button"
                        onClick={() => { setActiveMediaTarget('gallery'); setIsMediaPickerOpen(true); }}
                        className="text-[10px] text-amber-800 hover:text-brand-gold font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        <ImageIcon size={12} /> 📸 Browse Media Presets
                      </button>
                    </div>
                    <input
                      required
                      value={galleryForm.imageUrl}
                      onChange={e => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-brand-gold/20"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Category</label>
                      <select
                        value={galleryForm.category}
                        onChange={e => setGalleryForm({ ...galleryForm, category: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium"
                      >
                        <option value="Traditional">Traditional Art</option>
                        <option value="Contemporary">Contemporary</option>
                        <option value="Cross-Cultural">Cross-Cultural</option>
                        <option value="Artifact Heritage">Artifact Heritage</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Year / Period</label>
                      <input
                        value={galleryForm.year}
                        onChange={e => setGalleryForm({ ...galleryForm, year: e.target.value })}
                        placeholder="e.g. 2026 or 19th Century"
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Preview Box */}
                <div className="md:col-span-4 flex flex-col justify-center">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 relative shadow-sm">
                    {galleryForm.imageUrl ? (
                      <img src={galleryForm.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <ImageIcon size={28} />
                        <span className="text-[9px] uppercase tracking-wider font-bold mt-2">No Image Set</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-center text-slate-500 font-mono mt-2">Artwork Preview</span>
                </div>
              </div>

              {/* Language Navigation */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mr-2">Language:</span>
                    <button
                      type="button"
                      onClick={() => setGalleryLangTab('en')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs uppercase font-extrabold border transition-all ${
                        galleryLangTab === 'en' ? 'bg-[#0A1128] text-white border-[#0A1128]' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      🇬🇧 English {galleryForm.titleEn && '✓'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setGalleryLangTab('mn')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs uppercase font-extrabold border transition-all ${
                        galleryLangTab === 'mn' ? 'bg-[#0A1128] text-white border-[#0A1128]' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      🇲🇳 Монгол {galleryForm.titleMn && '✓'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setGalleryLangTab('de')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs uppercase font-extrabold border transition-all ${
                        galleryLangTab === 'de' ? 'bg-[#0A1128] text-white border-[#0A1128]' : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      🇩🇪 Deutsch {galleryForm.titleDe && '✓'}
                    </button>
                  </div>
                </div>

                {galleryLangTab === 'en' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Artwork Title (English)</label>
                        <input
                          value={galleryForm.titleEn}
                          onChange={e => setGalleryForm({ ...galleryForm, titleEn: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900"
                          placeholder="e.g. Masterpiece Morin Khuur Carving"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Artist Name (English)</label>
                        <input
                          value={galleryForm.artistEn}
                          onChange={e => setGalleryForm({ ...galleryForm, artistEn: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900"
                          placeholder="e.g. Master Craftsman Baatar"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Description / Historical Story (English)</label>
                      <textarea
                        value={galleryForm.descriptionEn}
                        onChange={e => setGalleryForm({ ...galleryForm, descriptionEn: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl p-4 text-xs text-slate-900 h-28 leading-relaxed"
                        placeholder="Tell the cultural story and craftsmanship technique..."
                      />
                    </div>
                  </div>
                )}

                {galleryLangTab === 'mn' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Гарчиг (Монгол)</label>
                        <input
                          value={galleryForm.titleMn}
                          onChange={e => setGalleryForm({ ...galleryForm, titleMn: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900"
                          placeholder="Бүтээлийн нэр..."
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Уран бүтээлч (Монгол)</label>
                        <input
                          value={galleryForm.artistMn}
                          onChange={e => setGalleryForm({ ...galleryForm, artistMn: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900"
                          placeholder="Урлаачийн нэр..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Тайлбар (Монгол)</label>
                      <textarea
                        value={galleryForm.descriptionMn}
                        onChange={e => setGalleryForm({ ...galleryForm, descriptionMn: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl p-4 text-xs text-slate-900 h-28 leading-relaxed"
                        placeholder="Бүтээлийн түүх, хийц урлалын тайлбар..."
                      />
                    </div>
                  </div>
                )}

                {galleryLangTab === 'de' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Titel (Deutsch)</label>
                        <input
                          value={galleryForm.titleDe}
                          onChange={e => setGalleryForm({ ...galleryForm, titleDe: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900"
                          placeholder="Kunstwerktitel..."
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Künstler (Deutsch)</label>
                        <input
                          value={galleryForm.artistDe}
                          onChange={e => setGalleryForm({ ...galleryForm, artistDe: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900"
                          placeholder="Name des Künstlers..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5 block">Beschreibung (Deutsch)</label>
                      <textarea
                        value={galleryForm.descriptionDe}
                        onChange={e => setGalleryForm({ ...galleryForm, descriptionDe: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl p-4 text-xs text-slate-900 h-28 leading-relaxed"
                        placeholder="Beschreibung der Handwerkskunst auf Deutsch..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold uppercase tracking-wider text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl bg-[#0A1128] text-white hover:bg-brand-gold hover:text-slate-950 font-bold uppercase tracking-wider text-xs transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : isEditing ? 'Update Artwork' : 'Add to Gallery Archive'}
                </button>
              </div>
            </form>
          ) : (
            /* Gallery Live Card Preview */
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-6">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-amber-800 block">
                Live Visitor Showcase Preview:
              </span>
              <div className="max-w-sm mx-auto bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
                <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                  {galleryForm.imageUrl && (
                    <img src={galleryForm.imageUrl} alt="" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-white/95 text-slate-900 text-[10px] uppercase tracking-widest font-extrabold rounded-md shadow-sm border border-slate-200">
                      {galleryForm.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-xl font-serif text-slate-900 font-bold">
                    {galleryForm.titleEn || galleryForm.titleMn || galleryForm.titleDe || 'Untitled Artwork'}
                  </h3>
                  <p className="text-xs text-slate-500 italic">
                    {galleryForm.artistEn || galleryForm.artistMn || 'Master Artist'} • {galleryForm.year}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed pt-2 border-t border-slate-100">
                    {galleryForm.descriptionEn || galleryForm.descriptionMn || galleryForm.descriptionDe || 'Artwork description will appear here...'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* 4. CURATED MEDIA PRESET PICKER DRAWER / MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        title="📸 Curated Mongolian Cultural Media Library"
        className="max-w-4xl"
      >
        <div className="space-y-6">
          <p className="text-xs text-slate-600 leading-relaxed font-light">
            Click any high-resolution photo preset below to automatically apply it to your current form.
          </p>

          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
            {CURATED_MEDIA_PRESETS.map((grp, gIdx) => (
              <div key={gIdx} className="space-y-3">
                <h4 className="text-xs uppercase tracking-widest font-extrabold text-amber-900 flex items-center gap-2">
                  <Tag size={12} className="text-brand-gold" />
                  {grp.category}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {grp.images.map((img, imgIdx) => (
                    <div
                      key={imgIdx}
                      onClick={() => handleSelectMediaPreset(img.url)}
                      className="group cursor-pointer rounded-2xl overflow-hidden border-2 border-slate-200 hover:border-brand-gold transition-all shadow-sm relative bg-slate-100"
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="p-2 bg-white text-center">
                        <p className="text-[10px] font-bold text-slate-800 truncate group-hover:text-amber-800 transition-colors">
                          {img.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              onClick={() => setIsMediaPickerOpen(false)}
              className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold uppercase tracking-wider text-xs"
            >
              Close Media Library
            </button>
          </div>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* 5. DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Permanent Deletion"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 mx-auto mb-6">
            <AlertCircle size={32} />
          </div>
          <p className="text-slate-600 text-sm mb-8 leading-relaxed">
            Are you sure you want to delete this record? This action will permanently remove it from the live database.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 px-6 py-3 rounded-xl bg-slate-100 text-slate-800 font-bold uppercase tracking-wider text-xs hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-6 py-3 rounded-xl bg-rose-600 text-white font-bold uppercase tracking-wider text-xs hover:bg-rose-700 transition-colors shadow-md"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
