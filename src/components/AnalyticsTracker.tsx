import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { db, auth, addDoc, collection, serverTimestamp } from '../firebase';
import { CONSENT_EVENT, hasAnalyticsConsent, loadGoogleAnalytics } from '../lib/consent';

export default function AnalyticsTracker() {
  const location = useLocation();

  // Google Analytics starts only once the visitor has accepted analytics cookies
  useEffect(() => {
    const start = () => {
      if (hasAnalyticsConsent()) loadGoogleAnalytics();
    };
    start();
    window.addEventListener(CONSENT_EVENT, start);
    return () => window.removeEventListener(CONSENT_EVENT, start);
  }, []);

  // Our own visit counter. It records the page and time for everyone; the signed-in user id and
  // browser details are added only when the visitor has accepted analytics.
  useEffect(() => {
    const trackPageView = async () => {
      try {
        const consented = hasAnalyticsConsent();
        await addDoc(collection(db, 'analytics'), {
          path: location.pathname,
          timestamp: serverTimestamp(),
          // The analytics table only has path/timestamp/metadata columns.
          metadata: consented
            ? { userId: auth.currentUser?.uid || 'anonymous', userAgent: navigator.userAgent }
            : { userId: 'anonymous' },
        });
      } catch (error) {
        console.error("Error tracking page view:", error);
      }
    };

    trackPageView();
  }, [location.pathname]);

  return null;
}
