import React, { Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Impact from './pages/Impact';
import Contact from './pages/Contact';
import News from './pages/News';
import NewsDetails from './pages/NewsDetails';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Imprint from './pages/Imprint';
import Governance from './pages/Governance';
import AdminDashboard from './pages/AdminDashboard';
import EventDetails from './pages/EventDetails';
import GalleryDetails from './pages/GalleryDetails';
import Profile from './pages/Profile';
import EasterEgg from './pages/EasterEgg';
import { AuthProvider } from './contexts/AuthContext';
import AnalyticsTracker from './components/AnalyticsTracker';
import CookieConsent from './components/CookieConsent';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/ErrorBoundary';
import AIAssistant from './components/AIAssistant';
import ToonoIntro from './components/ToonoIntro';

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
            </main>
            <Footer />
            <AIAssistant />
          </div>
          <SpeedInsights />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
