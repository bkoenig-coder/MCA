import React, { Suspense, lazy, useEffect } from 'react';
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
import SEO from './components/SEO';
import { UlziiSymbol } from './components/MongolianDesign';
import { motion } from 'motion/react';

// Lazy loaded page components for optimal bundle splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Events = lazy(() => import('./pages/Events'));
const EventDetails = lazy(() => import('./pages/EventDetails'));
const News = lazy(() => import('./pages/News'));
const NewsDetails = lazy(() => import('./pages/NewsDetails'));
const Gallery = lazy(() => import('./pages/Gallery'));
const GalleryDetails = lazy(() => import('./pages/GalleryDetails'));
const Profile = lazy(() => import('./pages/Profile'));
const Impact = lazy(() => import('./pages/Impact'));
const Contact = lazy(() => import('./pages/Contact'));
const Partners = lazy(() => import('./pages/Partners'));
const Game = lazy(() => import('./pages/Game'));
const Membership = lazy(() => import('./pages/Membership'));
const ApplyStudent = lazy(() => import('./pages/ApplyStudent'));
const ApplyProfessional = lazy(() => import('./pages/ApplyProfessional'));
const ApplyInstitutional = lazy(() => import('./pages/ApplyInstitutional'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Imprint = lazy(() => import('./pages/Imprint'));
const Governance = lazy(() => import('./pages/Governance'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const TeamMember = lazy(() => import('./pages/TeamMember'));
const InitiativeDetails = lazy(() => import('./pages/InitiativeDetails'));
const EasterEgg = lazy(() => import('./pages/EasterEgg'));
const Heritage = lazy(() => import('./pages/Heritage'));
const Careers = lazy(() => import('./pages/Careers'));
const CareerDetails = lazy(() => import('./pages/CareerDetails'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Shown while a page's code loads: the endless knot, still, on the page colour
const PageLoader = () => (
  <div className="flex min-h-[60vh] w-full items-center justify-center bg-brand-paper" role="status" aria-label="Loading">
    <UlziiSymbol className="w-10 h-10 text-brand-ink/25" />
  </div>
);

// Soft fade/rise whenever the route changes (no exit animation, so lazy pages never wait on it)
function PageTransition({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

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
          <SEO />
          <Toaster position="top-center" richColors />
          <AnalyticsTracker />
          <CookieConsent />
          <CarpetIntro />
          <div className="relative min-h-screen flex flex-col">
            <ScrollToTop />
            <Navbar />
            <main className="flex-grow">
              <Suspense fallback={<PageLoader />}>
                <PageTransition>
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
                  <Route path="/partners" element={<Partners />} />
                  <Route path="/game" element={<Game />} />
                  <Route path="/membership" element={<Membership />} />
                  <Route path="/membership/apply-student" element={<ApplyStudent />} />
                  <Route path="/membership/apply-professional" element={<ApplyProfessional />} />
                  <Route path="/membership/apply-institutional" element={<ApplyInstitutional />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/imprint" element={<Imprint />} />
                  <Route path="/governance" element={<Governance />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/team/:id" element={<TeamMember />} />
                  <Route path="/initiative/:id" element={<InitiativeDetails />} />
                  <Route path="/diorama" element={<EasterEgg />} />
                  <Route path="/heritage" element={<Heritage />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/careers/:id" element={<CareerDetails />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                </PageTransition>
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
