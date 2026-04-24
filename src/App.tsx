import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import AnalyticsTracker from './components/AnalyticsTracker';
import CookieConsent from './components/CookieConsent';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/ErrorBoundary';
import AIAssistant from './components/AIAssistant';
import ToonoIntro from './components/ToonoIntro';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Loader2 } from 'lucide-react';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Events = lazy(() => import('./pages/Events'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Impact = lazy(() => import('./pages/Impact'));
const Contact = lazy(() => import('./pages/Contact'));
const News = lazy(() => import('./pages/News'));
const NewsDetails = lazy(() => import('./pages/NewsDetails'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Imprint = lazy(() => import('./pages/Imprint'));
const Governance = lazy(() => import('./pages/Governance'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const EventDetails = lazy(() => import('./pages/EventDetails'));
const GalleryDetails = lazy(() => import('./pages/GalleryDetails'));
const Profile = lazy(() => import('./pages/Profile'));
const EasterEgg = lazy(() => import('./pages/EasterEgg'));

const PageLoader = () => (
  <div className="flex h-[80vh] items-center justify-center bg-transparent">
    <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
  </div>
);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Toaster position="top-center" richColors />
          <AnalyticsTracker />
          <CookieConsent />
          <ToonoIntro />
          <div className="min-h-screen flex flex-col selection:bg-brand-indigo/20 selection:text-brand-indigo">
            <ScrollToTop />
            <Navbar />
            <main className="flex-grow">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:id" element={<EventDetails />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/news/:id" element={<NewsDetails />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/gallery/:id" element={<GalleryDetails />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/impact" element={<Impact />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/imprint" element={<Imprint />} />
                  <Route path="/governance" element={<Governance />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/diorama" element={<EasterEgg />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <AIAssistant />
            <SpeedInsights />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
