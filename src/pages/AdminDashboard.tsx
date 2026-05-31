import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { db, auth, collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp, OperationType, handleFirestoreError } from '../firebase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Plus, Calendar, FileText, Users, User as UserIcon, TrendingUp, Image as ImageIcon, Trash2, Edit3, Check, X, AlertCircle, ExternalLink, Download, Shield } from 'lucide-react';
import { deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import Modal from '../components/Modal';
import { autoTranslateRecord } from '../services/translationService';

export default function AdminDashboard() {
  const { user, profile } = useAuth();
  const isSuperAdmin = user?.email?.toLowerCase() === 'emeraldtorstein@gmail.com';
  const isAdminUser = isSuperAdmin || user?.email?.toLowerCase() === 'batmunkh.unen@gmail.com' || profile?.role === 'admin';
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

  // Form States
  const [eventForm, setEventForm] = useState({ 
    id: '',
    titleEn: '', titleMn: '', titleDe: '',
    descriptionEn: '', descriptionMn: '', descriptionDe: '',
    date: '', 
    time: '',
    location: '',
    category: '',
    price: 0, 
    capacity: 0,
    imageUrl: '',
    whatsIncluded: '',
    galleryImages: ''
  });
  const [postForm, setPostForm] = useState({ id: '', slug: '', titleEn: '', titleMn: '', titleDe: '', contentEn: '', contentMn: '', contentDe: '', imageUrl: '' });
  const [galleryForm, setGalleryForm] = useState({ id: '', titleEn: '', titleMn: '', titleDe: '', artistEn: '', artistMn: '', artistDe: '', year: '', descriptionEn: '', descriptionMn: '', descriptionDe: '', imageUrl: '', category: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ collection: string, id: string } | null>(null);
  const [regSearch, setRegSearch] = useState('');

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

    // Fetch Users (for registration mapping)
    const qUsers = query(collection(db, 'users'));
    const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'users'));

    // Fetch Gallery
    const qGallery = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribeGallery = onSnapshot(qGallery, (snapshot) => {
      setGallery(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'gallery'));

    // Fetch Membership Applications
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

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const baseData = {
        titleEn: eventForm.titleEn,
        titleMn: eventForm.titleMn,
        titleDe: eventForm.titleDe,
        title: eventForm.titleEn,
        descriptionEn: eventForm.descriptionEn,
        descriptionMn: eventForm.descriptionMn,
        descriptionDe: eventForm.descriptionDe,
        description: eventForm.descriptionEn,
        date: eventForm.date,
        time: eventForm.time,
        location: eventForm.location,
        category: eventForm.category,
        price: Number(eventForm.price) * 100,
        capacity: Number(eventForm.capacity) || 0,
        imageUrl: eventForm.imageUrl,
        galleryImages: eventForm.galleryImages ? eventForm.galleryImages.split(',').map(s => s.trim()).filter(s => s !== '') : [],
        whatsIncluded: eventForm.whatsIncluded.split(',').map(s => s.trim()).filter(s => s !== ''),
        updatedAt: serverTimestamp(),
      };
      
      const data = await autoTranslateRecord(baseData, ['location', 'category']);

      if (isEditing && eventForm.id) {
        await setDoc(doc(db, 'events', eventForm.id), data, { merge: true });
        toast.success('Event updated successfully');
      } else {
        await addDoc(collection(db, 'events'), { ...data, registeredCount: 0, createdAt: serverTimestamp() });
        toast.success('Event created successfully');
      }

      setEventForm({ id: '', titleEn: '', titleMn: '', titleDe: '', descriptionEn: '', descriptionMn: '', descriptionDe: '', date: '', time: '', location: '', category: '', price: 0, capacity: 0, imageUrl: '', galleryImages: '', whatsIncluded: '' });
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to save event');
      handleFirestoreError(error, OperationType.WRITE, 'events');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = {
        titleEn: postForm.titleEn,
        titleMn: postForm.titleMn,
        titleDe: postForm.titleDe,
        title: postForm.titleEn,
        slug: postForm.slug || postForm.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        contentEn: postForm.contentEn,
        contentMn: postForm.contentMn,
        contentDe: postForm.contentDe,
        content: postForm.contentEn,
        imageUrl: postForm.imageUrl,
        updatedAt: serverTimestamp(),
      };
      
      if (isEditing && postForm.id) {
        await setDoc(doc(db, 'posts', postForm.id), data, { merge: true });
        toast.success('Post updated successfully');
      } else {
        await addDoc(collection(db, 'posts'), { ...data, authorId: user?.uid, createdAt: serverTimestamp() });
        toast.success('Post published successfully');
      }

      setPostForm({ id: '', slug: '', titleEn: '', titleMn: '', titleDe: '', contentEn: '', contentMn: '', contentDe: '', imageUrl: '' });
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to save post');
      handleFirestoreError(error, OperationType.WRITE, 'posts');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const baseData = {
        titleEn: galleryForm.titleEn,
        titleMn: galleryForm.titleMn,
        titleDe: galleryForm.titleDe,
        title: galleryForm.titleEn,
        artistEn: galleryForm.artistEn,
        artistMn: galleryForm.artistMn,
        artistDe: galleryForm.artistDe,
        artist: galleryForm.artistEn,
        year: galleryForm.year,
        descriptionEn: galleryForm.descriptionEn,
        descriptionMn: galleryForm.descriptionMn,
        descriptionDe: galleryForm.descriptionDe,
        description: galleryForm.descriptionEn,
        imageUrl: galleryForm.imageUrl,
        category: galleryForm.category,
        updatedAt: serverTimestamp(),
      };
      
      const data = await autoTranslateRecord(baseData, ['category']);

      if (isEditing && galleryForm.id) {
        await setDoc(doc(db, 'gallery', galleryForm.id), data, { merge: true });
        toast.success('Gallery item updated successfully');
      } else {
        await addDoc(collection(db, 'gallery'), { ...data, createdAt: serverTimestamp() });
        toast.success('Gallery item added successfully');
      }

      setGalleryForm({ id: '', titleEn: '', titleMn: '', titleDe: '', artistEn: '', artistMn: '', artistDe: '', year: '', descriptionEn: '', descriptionMn: '', descriptionDe: '', imageUrl: '', category: '' });
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to save gallery item');
      handleFirestoreError(error, OperationType.WRITE, 'gallery');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (collection: string, id: string) => {
    setItemToDelete({ collection, id });
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteDoc(doc(db, itemToDelete.collection, itemToDelete.id));
      toast.success('Item deleted successfully');
    } catch (error) {
      toast.error('Failed to delete item');
      handleFirestoreError(error, OperationType.DELETE, itemToDelete.collection);
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const editEvent = (event: any) => {
    setEventForm({
      id: event.id,
      titleEn: event.titleEn || event.title || '',
      titleMn: event.titleMn || event.title || '',
      titleDe: event.titleDe || event.title || '',
      descriptionEn: event.descriptionEn || event.description || '',
      descriptionMn: event.descriptionMn || event.description || '',
      descriptionDe: event.descriptionDe || event.description || '',
      date: event.date,
      time: event.time || '',
      location: event.location || '',
      category: event.category || '',
      price: event.price / 100,
      capacity: event.capacity || 0,
      imageUrl: event.imageUrl,
      galleryImages: Array.isArray(event.galleryImages) ? event.galleryImages.join(', ') : '',
      whatsIncluded: Array.isArray(event.whatsIncluded) ? event.whatsIncluded.join(', ') : ''
    });
    setIsEditing(true);
    setActiveTab('events');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const editPost = (post: any) => {
    setPostForm({
      id: post.id,
      slug: post.slug || '',
      titleEn: post.titleEn || post.title || '',
      titleMn: post.titleMn || post.title || '',
      titleDe: post.titleDe || post.title || '',
      contentEn: post.contentEn || post.content || '',
      contentMn: post.contentMn || post.content || '',
      contentDe: post.contentDe || post.content || '',
      imageUrl: post.imageUrl || ''
    });
    setIsEditing(true);
    setActiveTab('posts');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const editGalleryItem = (item: any) => {
    setGalleryForm({
      id: item.id,
      titleEn: item.titleEn || item.title || '',
      titleMn: item.titleMn || item.title || '',
      titleDe: item.titleDe || item.title || '',
      artistEn: item.artistEn || item.artist || '',
      artistMn: item.artistMn || item.artist || '',
      artistDe: item.artistDe || item.artist || '',
      year: item.year || '',
      descriptionEn: item.descriptionEn || item.description || '',
      descriptionMn: item.descriptionMn || item.description || '',
      descriptionDe: item.descriptionDe || item.description || '',
      imageUrl: item.imageUrl,
      category: item.category || ''
    });
    setIsEditing(true);
    setActiveTab('gallery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getUserEmail = (userId: string) => {
    const u = users.find(u => u.uid === userId);
    return u ? u.email : userId;
  };

  const getEventTitle = (eventId: string) => {
    const e = events.find(e => e.id === eventId);
    return e ? e.title : eventId;
  };

  const exportToCSV = () => {
    if (registrations.length === 0) {
      toast.error('No registrations to export');
      return;
    }

    const headers = ['Registration ID', 'User Email', 'User UID', 'Event Title', 'Event ID', 'Status', 'Date'];
    const rows = registrations.map(reg => [
      reg.id,
      getUserEmail(reg.userId),
      reg.userId,
      getEventTitle(reg.eventId),
      reg.eventId,
      reg.status,
      reg.createdAt?.toDate().toISOString() || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `registrations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported successfully');
  };

  const filteredRegistrations = registrations.filter(reg => {
    const email = getUserEmail(reg.userId).toLowerCase();
    const title = getEventTitle(reg.eventId).toLowerCase();
    const search = regSearch.toLowerCase();
    return email.includes(search) || title.includes(search) || reg.status.toLowerCase().includes(search);
  });

  if (!isEditor) {
    return (
      <div className="pt-32 px-6 text-center">
        <h1 className="text-2xl font-serif">Access Denied</h1>
        <p className="mt-4">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-32 px-4 md:px-6 pb-20 bg-brand-paper/30 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-brand-ink flex items-center justify-center text-brand-gold">
                <Shield size={20} />
              </div>
              <h1 className="text-3xl md:text-5xl font-serif tracking-tight">Admin <span className="italic text-brand-gold">Control</span></h1>
            </div>
            <p className="text-sm text-brand-ink/50 font-light">Managing the Mongolian Center in Austria ecosystem.</p>
          </div>
          
          <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-[24px] border border-brand-ink/5 w-full lg:w-auto overflow-x-auto no-scrollbar shadow-sm">
            {[
              { id: 'analytics', icon: <TrendingUp size={16} />, label: 'Analytics' },
              { id: 'events', icon: <Calendar size={16} />, label: 'Events' },
              { id: 'posts', icon: <FileText size={16} />, label: 'Posts' },
              { id: 'gallery', icon: <ImageIcon size={16} />, label: 'Gallery' },
              { id: 'registrations', icon: <Users size={16} />, label: 'Registrations' },
              ...(isAdminUser ? [
                { id: 'users', icon: <Shield size={16} />, label: 'Users' },
                { id: 'applications', icon: <FileText size={16} />, label: 'Applications' }
              ] : []),
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setIsEditing(false); }}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap flex-1 lg:flex-none justify-center ${
                  activeTab === tab.id ? 'bg-brand-ink text-white shadow-lg shadow-brand-ink/20' : 'text-brand-ink/40 hover:text-brand-ink hover:bg-white/50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'analytics' && (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Views', value: pageViews.length, icon: <TrendingUp className="text-blue-500" />, color: 'bg-blue-50' },
                  { label: 'Active Events', value: events.length, icon: <Calendar className="text-brand-gold" />, color: 'bg-brand-gold/10' },
                  { label: 'Total Registrations', value: registrations.length, icon: <Users className="text-purple-500" />, color: 'bg-purple-50' },
                  { label: 'Community Members', value: users.length, icon: <Shield className="text-green-500" />, color: 'bg-green-50' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-[32px] border border-brand-ink/5 shadow-sm hover:shadow-md transition-all">
                    <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                      {stat.icon}
                    </div>
                    <p className="text-[10px] font-bold text-brand-ink/40 uppercase tracking-widest mb-1">{stat.label}</p>
                    <h3 className="text-4xl font-serif">{stat.value}</h3>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[40px] border border-brand-ink/5 shadow-sm">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-serif">Traffic Analysis</h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-ink/40">
                      <div className="w-2 h-2 rounded-full bg-brand-ink" />
                      Daily Page Views
                    </div>
                  </div>
                  <div className="h-[400px] w-full flex items-center justify-center">
                    {analyticsData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontSize: '12px', padding: '16px' }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="count" 
                            stroke="#141414" 
                            strokeWidth={3} 
                            dot={{ r: 4, fill: '#141414', strokeWidth: 2, stroke: '#fff' }} 
                            activeDot={{ r: 6, strokeWidth: 0 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center">
                        <TrendingUp size={48} className="mx-auto text-brand-ink/10 mb-4" />
                        <p className="text-brand-ink/40 italic">No traffic data available yet.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white p-8 md:p-10 rounded-[40px] border border-brand-ink/5 shadow-sm">
                  <h3 className="text-2xl font-serif mb-8">Recent Activity</h3>
                  <div className="space-y-6">
                    {pageViews.length > 0 ? pageViews.slice(0, 6).map((view, i) => (
                      <div key={i} className="flex items-start gap-4 pb-6 border-b border-brand-ink/5 last:border-0 last:pb-0">
                        <div className="w-8 h-8 rounded-full bg-brand-paper flex items-center justify-center text-brand-ink/40 shrink-0">
                          <ExternalLink size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-brand-ink truncate">{view.page || 'Home'}</p>
                          <p className="text-[10px] text-brand-ink/40 uppercase tracking-widest mt-1">
                            {view.timestamp?.toDate ? view.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                          </p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-brand-ink/40 italic text-center py-10">No recent activity.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'events' && (
            <motion.div 
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
              <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-[40px] border border-brand-ink/5 shadow-sm lg:sticky lg:top-32">
                  <h3 className="text-2xl font-serif mb-8 flex items-center gap-3">
                    {isEditing ? <Edit3 size={24} className="text-brand-gold" /> : <Plus size={24} className="text-brand-gold" />}
                    {isEditing ? 'Edit Event' : 'Create Event'}
                  </h3>
                  <form onSubmit={handleAddEvent} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Event Title (English)</label>
                      <input 
                        required
                        value={eventForm.titleEn}
                        onChange={e => setEventForm({...eventForm, titleEn: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all"
                        placeholder="e.g. Naadam Festival 2026"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Description (English)</label>
                      <textarea 
                        required
                        value={eventForm.descriptionEn}
                        onChange={e => setEventForm({...eventForm, descriptionEn: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all h-32 no-scrollbar whitespace-pre-wrap"
                        placeholder="Describe the cultural significance..."
                      />
                    </div>
                    
                    <div className="h-px w-full bg-brand-ink/5" />

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Event Title (Mongolian)</label>
                      <input 
                        value={eventForm.titleMn}
                        onChange={e => setEventForm({...eventForm, titleMn: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Description (Mongolian)</label>
                      <textarea 
                        value={eventForm.descriptionMn}
                        onChange={e => setEventForm({...eventForm, descriptionMn: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all h-32 no-scrollbar whitespace-pre-wrap"
                      />
                    </div>

                    <div className="h-px w-full bg-brand-ink/5" />

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Event Title (German)</label>
                      <input 
                        value={eventForm.titleDe}
                        onChange={e => setEventForm({...eventForm, titleDe: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Description (German)</label>
                      <textarea 
                        value={eventForm.descriptionDe}
                        onChange={e => setEventForm({...eventForm, descriptionDe: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all h-32 no-scrollbar whitespace-pre-wrap"
                      />
                    </div>
                    
                    <div className="h-px w-full bg-brand-ink/5" />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Date</label>
                        <input 
                          required
                          type="date"
                          value={eventForm.date}
                          onChange={e => setEventForm({...eventForm, date: e.target.value})}
                          className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Time</label>
                        <input 
                          required
                          type="time"
                          value={eventForm.time}
                          onChange={e => setEventForm({...eventForm, time: e.target.value})}
                          className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Location</label>
                        <input 
                          value={eventForm.location}
                          onChange={e => setEventForm({...eventForm, location: e.target.value})}
                          className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all"
                          placeholder="e.g. Ulaanbaatar"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Capacity (Tickets)</label>
                        <input 
                          type="number"
                          min="0"
                          value={eventForm.capacity === 0 ? '' : eventForm.capacity}
                          onChange={e => setEventForm({...eventForm, capacity: Number(e.target.value)})}
                          className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all"
                          placeholder="Leave empty for unlimited"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40">Price (EUR)</label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={eventForm.price === 0}
                            onChange={(e) => setEventForm({...eventForm, price: e.target.checked ? 0 : 10})}
                            className="w-3 h-3 text-brand-gold focus:ring-brand-gold rounded border-brand-ink/20"
                          />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/60">Free Event</span>
                        </label>
                      </div>
                      <input 
                        required={eventForm.price !== 0}
                        type="number"
                        min="0"
                        step="0.01"
                        disabled={eventForm.price === 0}
                        value={eventForm.price === 0 ? '' : eventForm.price}
                        onChange={e => setEventForm({...eventForm, price: Number(e.target.value)})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder={eventForm.price === 0 ? "Free" : "0.00"}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Image URL</label>
                      <input 
                        required
                        value={eventForm.imageUrl}
                        onChange={e => setEventForm({...eventForm, imageUrl: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Gallery Images (Comma separated URLs)</label>
                      <textarea 
                        value={eventForm.galleryImages}
                        onChange={e => setEventForm({...eventForm, galleryImages: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all h-24 no-scrollbar"
                        placeholder="https://images.unsplash.com/..., https://images.unsplash.com/..."
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">What's Included (Comma separated)</label>
                      <textarea 
                        value={eventForm.whatsIncluded}
                        onChange={e => setEventForm({...eventForm, whatsIncluded: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all h-24 no-scrollbar"
                        placeholder="e.g. Traditional Lunch, Guided Tour, Exhibition Entry"
                      />
                    </div>
                    <div className="flex gap-4">
                      {isEditing && (
                        <button 
                          type="button"
                          onClick={() => { setIsEditing(false); setEventForm({ id: '', titleEn: '', titleMn: '', titleDe: '', descriptionEn: '', descriptionMn: '', descriptionDe: '', date: '', time: '', location: '', category: '', price: 0, capacity: 0, imageUrl: '', galleryImages: '', whatsIncluded: '' }); }}
                          className="flex-1 bg-brand-paper text-brand-ink py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-brand-sand transition-all"
                        >
                          Cancel
                        </button>
                      )}
                      <button 
                        disabled={isSubmitting}
                        className="flex-[2] bg-brand-ink text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-brand-gold transition-all disabled:opacity-50 shadow-xl shadow-brand-ink/10"
                      >
                        {isSubmitting ? 'Processing...' : isEditing ? 'Update Event' : 'Create Event'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-2xl font-serif">Upcoming Events</h3>
                <div className="grid gap-6">
                  {events.length > 0 ? events.map((event) => (
                    <div key={event.id} className="group bg-white p-6 rounded-[40px] border border-brand-ink/5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-8 items-center">
                      <div className="w-full sm:w-32 h-32 rounded-[32px] overflow-hidden shrink-0">
                        <img src={event.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                          <span className="px-3 py-1 bg-brand-paper rounded-full text-[8px] uppercase tracking-widest font-bold text-brand-gold">
                            {event.category || 'General'}
                          </span>
                          <span className="text-[10px] text-brand-ink/40 font-bold uppercase tracking-widest">{event.date}</span>
                        </div>
                        <h4 className="text-2xl font-serif truncate mb-2">{event.title}</h4>
                        <p className="text-xs text-brand-ink/50 font-light line-clamp-1">{event.description}</p>
                      </div>
                      <div className="flex gap-3 shrink-0">
                        <button 
                          onClick={() => editEvent(event)}
                          className="p-4 bg-brand-paper text-brand-ink hover:bg-brand-gold hover:text-white rounded-2xl transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => confirmDelete('events', event.id)}
                          className="p-4 bg-brand-paper text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="p-20 bg-white rounded-[40px] border border-brand-ink/5 text-center">
                      <Calendar size={48} className="mx-auto text-brand-ink/10 mb-4" />
                      <p className="text-brand-ink/40 italic">No events created yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'posts' && (
            <motion.div 
              key="posts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
              <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-[40px] border border-brand-ink/5 shadow-sm lg:sticky lg:top-32">
                  <h3 className="text-2xl font-serif mb-8 flex items-center gap-3">
                    {isEditing ? <Edit3 size={24} className="text-brand-gold" /> : <Plus size={24} className="text-brand-gold" />}
                    {isEditing ? 'Edit Post' : 'New Post'}
                  </h3>
                  <form onSubmit={handleAddPost} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Post Title (English)</label>
                      <input 
                        required
                        value={postForm.titleEn}
                        onChange={e => setPostForm({...postForm, titleEn: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">URL Slug (Optional)</label>
                      <input 
                        value={postForm.slug}
                        onChange={e => setPostForm({...postForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')})}
                        placeholder="e.g. latest-news-update"
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all"
                      />
                      <p className="text-[10px] text-brand-ink/40 mt-2">Leave blank to auto-generate from title</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Content (English)</label>
                      <textarea 
                        required
                        value={postForm.contentEn}
                        onChange={e => setPostForm({...postForm, contentEn: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all h-32 no-scrollbar"
                      />
                    </div>

                    <div className="h-px w-full bg-brand-ink/5" />

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Post Title (Mongolian)</label>
                      <input 
                        value={postForm.titleMn}
                        onChange={e => setPostForm({...postForm, titleMn: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Content (Mongolian)</label>
                      <textarea 
                        value={postForm.contentMn}
                        onChange={e => setPostForm({...postForm, contentMn: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all h-32 no-scrollbar"
                      />
                    </div>

                    <div className="h-px w-full bg-brand-ink/5" />

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Post Title (German)</label>
                      <input 
                        value={postForm.titleDe}
                        onChange={e => setPostForm({...postForm, titleDe: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Content (German)</label>
                      <textarea 
                        value={postForm.contentDe}
                        onChange={e => setPostForm({...postForm, contentDe: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all h-32 no-scrollbar"
                      />
                    </div>

                    <div className="h-px w-full bg-brand-ink/5" />

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Cover Image URL</label>
                      <input 
                        required
                        value={postForm.imageUrl}
                        onChange={e => setPostForm({...postForm, imageUrl: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all"
                      />
                    </div>
                    <div className="flex gap-4">
                      {isEditing && (
                        <button 
                          type="button"
                          onClick={() => { setIsEditing(false); setPostForm({ id: '', slug: '', titleEn: '', titleMn: '', titleDe: '', contentEn: '', contentMn: '', contentDe: '', imageUrl: '' }); }}
                          className="flex-1 bg-brand-paper text-brand-ink py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-brand-sand transition-all"
                        >
                          Cancel
                        </button>
                      )}
                      <button 
                        disabled={isSubmitting}
                        className="flex-[2] bg-brand-ink text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-brand-gold transition-all disabled:opacity-50 shadow-xl shadow-brand-ink/10"
                      >
                        {isSubmitting ? 'Publishing...' : isEditing ? 'Update Post' : 'Publish Post'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-2xl font-serif">Published News</h3>
                <div className="grid gap-6">
                  {posts.length > 0 ? posts.map((post) => (
                    <div key={post.id} className="group bg-white p-6 rounded-[40px] border border-brand-ink/5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-8 items-center">
                      <div className="w-full sm:w-32 h-32 rounded-[32px] overflow-hidden shrink-0">
                        <img src={post.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <h4 className="text-2xl font-serif truncate mb-2">{post.title}</h4>
                        <p className="text-xs text-brand-ink/50 font-light line-clamp-2">{post.content}</p>
                      </div>
                      <div className="flex gap-3 shrink-0">
                        <button 
                          onClick={() => editPost(post)}
                          className="p-4 bg-brand-paper text-brand-ink hover:bg-brand-gold hover:text-white rounded-2xl transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => confirmDelete('posts', post.id)}
                          className="p-4 bg-brand-paper text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="p-20 bg-white rounded-[40px] border border-brand-ink/5 text-center">
                      <FileText size={48} className="mx-auto text-brand-ink/10 mb-4" />
                      <p className="text-brand-ink/40 italic">No news posts published yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div 
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
              <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-[40px] border border-brand-ink/5 shadow-sm lg:sticky lg:top-32">
                  <h3 className="text-2xl font-serif mb-8 flex items-center gap-3">
                    {isEditing ? <Edit3 size={24} className="text-brand-gold" /> : <Plus size={24} className="text-brand-gold" />}
                    {isEditing ? 'Edit Item' : 'Add to Gallery'}
                  </h3>
                  <form onSubmit={handleAddGalleryItem} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Title (English)</label>
                      <input 
                        required
                        value={galleryForm.titleEn}
                        onChange={e => setGalleryForm({...galleryForm, titleEn: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all"
                        placeholder="Artwork title"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Description (English)</label>
                      <textarea 
                        required
                        value={galleryForm.descriptionEn}
                        onChange={e => setGalleryForm({...galleryForm, descriptionEn: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all h-32 no-scrollbar whitespace-pre-wrap"
                        placeholder="Tell the story behind this piece..."
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Artist (English)</label>
                      <input 
                        value={galleryForm.artistEn}
                        onChange={e => setGalleryForm({...galleryForm, artistEn: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all"
                        placeholder="Artist name"
                      />
                    </div>

                    <div className="h-px w-full bg-brand-ink/5" />

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Title (Mongolian)</label>
                      <input 
                        value={galleryForm.titleMn}
                        onChange={e => setGalleryForm({...galleryForm, titleMn: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Description (Mongolian)</label>
                      <textarea 
                        value={galleryForm.descriptionMn}
                        onChange={e => setGalleryForm({...galleryForm, descriptionMn: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all h-32 no-scrollbar whitespace-pre-wrap"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Artist (Mongolian)</label>
                      <input 
                        value={galleryForm.artistMn}
                        onChange={e => setGalleryForm({...galleryForm, artistMn: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all"
                      />
                    </div>

                    <div className="h-px w-full bg-brand-ink/5" />

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Title (German)</label>
                      <input 
                        value={galleryForm.titleDe}
                        onChange={e => setGalleryForm({...galleryForm, titleDe: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Description (German)</label>
                      <textarea 
                        value={galleryForm.descriptionDe}
                        onChange={e => setGalleryForm({...galleryForm, descriptionDe: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all h-32 no-scrollbar whitespace-pre-wrap"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Artist (German)</label>
                      <input 
                        value={galleryForm.artistDe}
                        onChange={e => setGalleryForm({...galleryForm, artistDe: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all"
                      />
                    </div>

                    <div className="h-px w-full bg-brand-ink/5" />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Year</label>
                        <input 
                          value={galleryForm.year}
                          onChange={e => setGalleryForm({...galleryForm, year: e.target.value})}
                          className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all"
                          placeholder="2026"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Category</label>
                      <select
                        value={galleryForm.category}
                        onChange={e => setGalleryForm({...galleryForm, category: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all"
                      >
                        <option value="">Select Category</option>
                        <option value="Traditional">Traditional</option>
                        <option value="Contemporary">Contemporary</option>
                        <option value="Cross-Cultural">Cross-Cultural</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40 mb-2 block">Image URL</label>
                      <input 
                        required
                        value={galleryForm.imageUrl}
                        onChange={e => setGalleryForm({...galleryForm, imageUrl: e.target.value})}
                        className="w-full bg-brand-paper border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-brand-gold/20 transition-all"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <div className="flex gap-4">
                      {isEditing && (
                        <button 
                          type="button"
                          onClick={() => { setIsEditing(false); setGalleryForm({ id: '', titleEn: '', titleMn: '', titleDe: '', artistEn: '', artistMn: '', artistDe: '', year: '', descriptionEn: '', descriptionMn: '', descriptionDe: '', imageUrl: '', category: '' }); }}
                          className="flex-1 bg-brand-paper text-brand-ink py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-brand-sand transition-all"
                        >
                          Cancel
                        </button>
                      )}
                      <button 
                        disabled={isSubmitting}
                        className="flex-[2] bg-brand-ink text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-brand-gold transition-all disabled:opacity-50 shadow-xl shadow-brand-ink/10"
                      >
                        {isSubmitting ? 'Saving...' : isEditing ? 'Update Item' : 'Add to Gallery'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-2xl font-serif">Gallery Items</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {gallery.length > 0 ? gallery.map((item) => (
                    <div key={item.id} className="group bg-white rounded-[40px] border border-brand-ink/5 shadow-sm overflow-hidden hover:shadow-md transition-all">
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => editGalleryItem(item)}
                            className="p-3 bg-white/90 backdrop-blur-sm text-brand-ink hover:bg-brand-gold hover:text-white rounded-xl transition-all shadow-lg"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => confirmDelete('gallery', item.id)}
                            className="p-3 bg-white/90 backdrop-blur-sm text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <span className="px-3 py-1 bg-brand-gold text-brand-ink text-[8px] uppercase tracking-widest font-bold rounded-full">
                            {item.category || 'General'}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h4 className="text-xl font-serif truncate mb-1">{item.title}</h4>
                        <p className="text-xs text-brand-ink/40 italic">{item.artist} • {item.year}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="sm:col-span-2 p-20 bg-white rounded-[40px] border border-brand-ink/5 text-center">
                      <ImageIcon size={48} className="mx-auto text-brand-ink/10 mb-4" />
                      <p className="text-brand-ink/40 italic">No gallery items yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'registrations' && (
            <motion.div 
              key="registrations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[40px] border border-brand-ink/5 shadow-sm overflow-hidden"
            >
              <div className="p-10 border-b border-brand-ink/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                  <h3 className="text-3xl font-serif mb-1">Event Registrations</h3>
                  <p className="text-xs text-brand-ink/40 uppercase tracking-widest font-bold">Tracking all community participation</p>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <input 
                      type="text"
                      placeholder="Search registrations..."
                      value={regSearch}
                      onChange={e => setRegSearch(e.target.value)}
                      className="w-full bg-brand-paper border-none rounded-full px-6 py-3 text-xs focus:ring-2 focus:ring-brand-gold/20 transition-all"
                    />
                  </div>
                  <button 
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-paper rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-sand transition-all shrink-0"
                  >
                    <Download size={14} />
                    Export CSV
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left min-w-[800px]">
                  <thead>
                    <tr className="bg-brand-paper/50">
                      <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-brand-ink/40">Attendee</th>
                      <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-brand-ink/40">Event Title</th>
                      <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-brand-ink/40">Contact Info</th>
                      <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-brand-ink/40">Status</th>
                      <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-brand-ink/40">Registration Date</th>
                      <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-brand-ink/40">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-ink/5">
                    {filteredRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-brand-paper/30 transition-colors">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold font-bold text-xs uppercase">
                              {reg.name ? reg.name.charAt(0) : getUserEmail(reg.userId).charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-brand-ink">{reg.name || 'N/A'}</p>
                              <p className="text-[10px] text-brand-ink/40 uppercase tracking-widest mt-0.5">UID: {reg.userId.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <p className="text-sm font-serif text-brand-ink">{getEventTitle(reg.eventId)}</p>
                          <p className="text-[10px] text-brand-ink/40 uppercase tracking-widest mt-0.5">ID: {reg.eventId.slice(0, 8)}...</p>
                        </td>
                        <td className="px-10 py-8">
                          <p className="text-sm text-brand-ink">{reg.email || getUserEmail(reg.userId)}</p>
                          {reg.phone && <p className="text-[10px] text-brand-ink/60 mt-0.5">{reg.phone}</p>}
                          {reg.notes && <p className="text-[10px] text-brand-ink/40 italic mt-1 line-clamp-2" title={reg.notes}>Note: {reg.notes}</p>}
                        </td>
                        <td className="px-10 py-8">
                          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            reg.status === 'paid' || reg.status === 'completed' ? 'bg-green-100 text-green-700' : 
                            reg.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              reg.status === 'paid' || reg.status === 'completed' ? 'bg-green-500' : 
                              reg.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                            {reg.status}
                          </span>
                        </td>
                        <td className="px-10 py-8 text-brand-ink/40 text-[10px] font-bold uppercase tracking-widest">
                          {reg.createdAt?.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-10 py-8">
                          <button 
                            onClick={() => { setItemToDelete({ id: reg.id, collection: 'registrations' }); setIsDeleteModalOpen(true); }}
                            className="w-10 h-10 rounded-full border border-brand-ink/10 flex items-center justify-center text-brand-ink/40 hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-all group"
                            title="Delete Registration"
                          >
                            <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredRegistrations.length === 0 && (
                <div className="p-20 text-center">
                  <p className="text-brand-ink/40 italic">No registrations found matching your search.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[40px] border border-brand-ink/5 shadow-sm overflow-hidden"
            >
              <div className="p-10 border-b border-brand-ink/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-serif">Community Members</h3>
                  <p className="text-brand-ink/40 text-[10px] font-bold uppercase tracking-widest mt-2">View and manage all registered users</p>
                </div>
                <div className="bg-brand-paper px-6 py-3 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40">Total Members: </span>
                  <span className="text-sm font-bold text-brand-gold">{users.length}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-paper/30">
                      <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-brand-ink/40">User</th>
                      <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-brand-ink/40">Email</th>
                      <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-brand-ink/40">System Role</th>
                      <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-brand-ink/40">Membership</th>
                      <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-brand-ink/40">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-brand-ink/5 hover:bg-brand-paper/30 transition-colors">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold overflow-hidden border border-brand-gold/20">
                              {u.photoURL ? (
                                <img src={u.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <UserIcon size={16} />
                              )}
                            </div>
                            <span className="text-sm font-medium text-brand-ink">{u.displayName || 'Anonymous'}</span>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-sm text-brand-ink/60 font-medium">{u.email}</td>
                        <td className="px-10 py-8">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            disabled={!isSuperAdmin || u.email?.toLowerCase() === 'emeraldtorstein@gmail.com'}
                            className={cn(
                              "px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest outline-none cursor-pointer appearance-none",
                              u.role === 'admin' ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/20" : 
                              u.role === 'moderator' ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" : 
                              "bg-brand-ink/5 text-brand-ink/40 border-none"
                            )}
                          >
                            <option value="user">User</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-10 py-8">
                          <select
                            value={u.membershipTier || 'user'}
                            onChange={(e) => handleMembershipTierChange(u.id, e.target.value)}
                            disabled={!isSuperAdmin && u.email?.toLowerCase() === 'emeraldtorstein@gmail.com'}
                            className={cn(
                              "px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest outline-none cursor-pointer border border-brand-ink/10 bg-brand-paper",
                              u.membershipTier === 'student' ? "bg-purple-500/10 text-purple-600 border-purple-500/20" :
                              u.membershipTier === 'professional' ? "bg-amber-600/10 text-amber-600 border-amber-600/20" :
                              u.membershipTier === 'institutional' ? "bg-green-600/10 text-green-600 border-green-600/20" :
                              u.membershipTier === 'partner' ? "bg-blue-600/10 text-blue-600 border-blue-600/20" :
                              "bg-brand-ink/5 text-brand-ink/40 border-transparent"
                            )}
                          >
                            <option value="user">Non-Member</option>
                            <option value="student">Student / Youth</option>
                            <option value="professional">Professional</option>
                            <option value="partner">Partner</option>
                            <option value="institutional">Institutional</option>
                          </select>
                        </td>
                        <td className="px-10 py-8 text-brand-ink/40 text-[10px] font-bold uppercase tracking-widest">
                          {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {users.length === 0 && (
                <div className="p-20 text-center">
                  <Users size={48} className="mx-auto text-brand-ink/10 mb-6" />
                  <p className="text-brand-ink/40 italic">No users found.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'applications' && (
            <motion.div
              key="applications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[40px] border border-brand-ink/5 shadow-sm overflow-hidden"
            >
              <div className="p-10 border-b border-brand-ink/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-serif">Membership Applications</h3>
                  <p className="text-brand-ink/40 text-[10px] font-bold uppercase tracking-widest mt-2">Review and manage student, professional, and institutional membership requests</p>
                </div>
                <div className="bg-brand-paper px-6 py-3 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-ink/40">Pending Applications: </span>
                  <span className="text-sm font-bold text-amber-500">{applications.filter(a => a.status === 'pending').length}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-paper/30">
                      <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-brand-ink/40">Applicant</th>
                      <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-brand-ink/40">Requested Tier</th>
                      <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-brand-ink/40">Details</th>
                      <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-brand-ink/40">Statement / Motivation</th>
                      <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-brand-ink/40">Status</th>
                      <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-brand-ink/40">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id} className="border-b border-brand-ink/5 hover:bg-brand-paper/30 transition-colors">
                        <td className="px-8 py-6">
                          <div className="font-medium text-sm text-brand-ink">{app.firstName} {app.lastName}</div>
                          <div className="text-xs text-brand-ink/40 mt-1">{app.userEmail}</div>
                          <div className="text-[10px] text-brand-ink/60 mt-1 font-bold">
                            DOB: {app.dob || 'N/A'} {app.age ? `(Age: ${app.age})` : ''}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={cn(
                            "px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                            app.tier === 'student' ? "bg-purple-500/10 text-purple-600 border-purple-500/20" :
                            app.tier === 'professional' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                            "bg-green-500/10 text-green-600 border-green-500/20"
                          )}>
                            {app.tier}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-xs text-brand-ink/70">
                          {app.tier === 'student' && (
                            <div>
                              <p><strong>School:</strong> {app.schoolOrUniversity}</p>
                              <p className="mt-1"><strong>ID No:</strong> {app.studentIdNumber}</p>
                            </div>
                          )}
                          {app.tier === 'professional' && (
                            <div>
                              <p><strong>Org:</strong> {app.organizationName}</p>
                              <p className="mt-1"><strong>Position:</strong> {app.position}</p>
                              {app.websiteOrLinkedin && <a href={app.websiteOrLinkedin} target="_blank" rel="referrer" className="text-brand-gold hover:underline flex items-center gap-1 mt-1 text-[10px] inline-flex items-center">Website <ExternalLink size={10} className="ml-1" /></a>}
                            </div>
                          )}
                          {app.tier === 'institutional' && (
                            <div>
                              <p><strong>Org:</strong> {app.organizationName}</p>
                              {app.websiteOrLinkedin && <a href={app.websiteOrLinkedin} target="_blank" rel="referrer" className="text-brand-gold hover:underline flex items-center gap-1 mt-1 text-[10px] inline-flex items-center">Website <ExternalLink size={10} className="ml-1" /></a>}
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-xs text-brand-ink/60 line-clamp-3 max-w-xs whitespace-pre-wrap" title={app.statementOfPurpose}>
                            {app.statementOfPurpose || 'N/A'}
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest",
                            app.status === 'pending' ? "bg-amber-500/10 text-amber-500" :
                            app.status === 'approved' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                          )}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          {app.status === 'pending' ? (
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleReviewApplication(app.id, app.userId, app.tier, 'approved')}
                                className="p-2 rounded-xl bg-green-500/10 hover:bg-green-500 hover:text-white text-green-600 hover:text-white transition-all border border-green-500/20 cursor-pointer"
                                title="Approve Application"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => handleReviewApplication(app.id, app.userId, app.tier, 'rejected')}
                                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white text-red-600 hover:text-white transition-all border border-red-500/20 cursor-pointer"
                                title="Reject Application"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-brand-ink/30 italic">Reviewed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {applications.length === 0 && (
                <div className="p-20 text-center">
                  <FileText size={48} className="mx-auto text-brand-ink/10 mb-6" />
                  <p className="text-brand-ink/40 italic">No applications found.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Confirm Deletion"
      >
        <div className="text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-8">
            <AlertCircle size={40} />
          </div>
          <p className="text-brand-ink/60 mb-10 leading-relaxed">
            Are you sure you want to delete this item? This action is permanent and cannot be undone.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 px-8 py-5 rounded-2xl bg-brand-paper text-brand-ink font-bold uppercase tracking-widest text-[10px] hover:bg-brand-sand transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete}
              className="flex-1 px-8 py-5 rounded-2xl bg-red-500 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
