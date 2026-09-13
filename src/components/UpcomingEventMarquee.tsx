import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { db, collection, query, orderBy, limit, onSnapshot, OperationType, handleFirestoreError } from '../firebase';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { DEFAULT_EVENTS } from '../data/fallbackContent';

export default function UpcomingEventMarquee() {
  const { t } = useTranslation();
  const [nextEvent, setNextEvent] = useState<any>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'events'),
      orderBy('date', 'asc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setNextEvent({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        setNextEvent(DEFAULT_EVENTS[0]);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'events');
      setNextEvent(DEFAULT_EVENTS[0]);
    });

    return () => unsubscribe();
  }, []);

  if (!nextEvent) return null;

  return (
    <div className="bg-brand-indigo text-white py-2 overflow-hidden whitespace-nowrap relative z-40 border-b border-white/10">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="inline-block"
      >
        <div className="flex items-center gap-12 px-4">
          {[...Array(10)].map((_, i) => (
            <Link 
              key={i} 
              to={`/events/${nextEvent.id}`}
              className="flex items-center gap-3 hover:text-brand-cream transition-colors"
            >
              <Calendar size={16} />
              <span className="font-bold uppercase tracking-widest text-xs">
                {t('marquee.next')}: {nextEvent.title} — {new Date(nextEvent.date).toLocaleDateString(t('common.locale'))}
              </span>
              <span className="text-brand-cream/50">•</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
