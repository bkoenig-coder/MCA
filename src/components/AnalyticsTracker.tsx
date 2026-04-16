import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { db, auth, addDoc, collection, serverTimestamp } from '../firebase';

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        await addDoc(collection(db, 'analytics'), {
          path: location.pathname,
          timestamp: serverTimestamp(),
          userId: auth.currentUser?.uid || 'anonymous',
          userAgent: navigator.userAgent,
        });
      } catch (error) {
        console.error("Error tracking page view:", error);
      }
    };

    trackPageView();
  }, [location.pathname]);

  return null;
}
