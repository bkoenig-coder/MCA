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
import CarpetIntro from './components/CarpetIntro';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Loader2 } from 'lucide-react';

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
import TeamMember from './pages/TeamMember';
import InitiativeDetails from './pages/InitiativeDetails';
import Membership from './pages/Membership';
import MembersDirectory from './pages/MembersDirectory';
import Heritage from './pages/Heritage';
import NotFound from './pages/NotFound';

import ApplyStudent from './pages/ApplyStudent';
import ApplyProfessional from './pages/ApplyProfessional';
import ApplyInstitutional from './pages/ApplyInstitutional';

const PageLoader = () => (
  <div className="flex min-h-screen bg-transparent">
    {/* Loading SVG removed intentionally */}
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
          <CarpetIntro />
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
                <Route path="/donate" element={<Impact />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/membership/apply-student" element={<ApplyStudent />} />
                <Route path="/membership/apply-professional" element={<ApplyProfessional />} />
                <Route path="/membership/apply-institutional" element={<ApplyInstitutional />} />
                <Route path="/members" element={<MembersDirectory />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/imprint" element={<Imprint />} />
                <Route path="/governance" element={<Governance />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/team/:id" element={<TeamMember />} />
                <Route path="/initiative/:id" element={<InitiativeDetails />} />
                <Route path="/diorama" element={<EasterEgg />} />
                <Route path="/heritage" element={<Heritage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
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
