import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Globe, ShieldCheck, TrendingUp, ArrowRight, Loader2, CheckCircle2, AlertCircle, Sparkles, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UlziiSymbol, SoyomboSymbol, ArcherSymbol, MongolianLine } from '../components/MongolianDesign';
import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle } from '../firebase';

export default function Impact() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [loadingAmount, setLoadingAmount] = useState<number | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(2500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === 'true' && searchParams.get('donation') === 'true') {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const donationAmounts = [
    { value: 1000, label: '€10' },
    { value: 2500, label: '€25' },
    { value: 5000, label: '€50' },
    { value: 10000, label: '€100' }
  ];

  const handleDonate = async (amount: number) => {
    setError(null);
    let currentUser = user;
    if (!currentUser) {
      try {
        const result = await signInWithGoogle();
        if (!result) return;
        currentUser = result;
      } catch (err) {
        setError(t('common.error.signIn'));
        return;
      }
    }

    setLoadingAmount(amount);
    try {
      const amountInEuro = amount / 100;
      const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=artxcorestudio@gmail.com&item_name=Donation+to+Mongolian+Center+Austria&currency_code=EUR&amount=${amountInEuro}`;
      window.open(paypalUrl, '_blank', 'noopener,noreferrer');
      setLoadingAmount(null);
    } catch (err: any) {
      setError(err.message || t('common.error.unexpected'));
      setLoadingAmount(null);
    }
  };

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAmount === 'custom') {
      const amount = parseFloat(customAmount);
      if (isNaN(amount) || amount <= 0) {
        setError(t('impact.donation.invalidAmount'));
        return;
      }
      handleDonate(Math.round(amount * 100));
    } else {
      handleDonate(selectedAmount);
    }
  };

  const stats = [
    { label: t('impact.stats.events'), value: "3+", icon: <Globe className="w-6 h-6" /> },
    { label: t('impact.stats.members'), value: "5,000+", icon: <Heart className="w-6 h-6" /> },
    { label: t('impact.stats.partnerships'), value: "+5", icon: <TrendingUp className="w-6 h-6" /> }
  ];

  const initiatives = [
    {
      id: "preservation",
      title: t('impact.initiatives.preservation'),
      desc: t('impact.initiatives.preservationDesc'),
      image: "https://images.unsplash.com/photo-1745155541633-da6d9bb28f5c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: "bridge",
      title: t('impact.initiatives.bridge'),
      desc: t('impact.initiatives.bridgeDesc'),
      image: "https://images.unsplash.com/photo-1623266880158-c683344cd073?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: "exchange",
      title: t('impact.initiatives.exchange'),
      desc: t('impact.initiatives.exchangeDesc'),
      image: "https://images.unsplash.com/photo-1645539818874-1801c031a86a?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  ];

  return (
    <div className="pt-20">
      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-brand-ink text-white px-8 py-4 rounded-2xl shadow-2xl border border-brand-gold/30 flex items-center gap-4 min-w-[320px]"
          >
            <div className="bg-brand-gold/20 p-2 rounded-full">
              <CheckCircle2 className="text-brand-gold" size={24} />
            </div>
            <div>
              <p className="font-bold text-sm">{t('impact.donation.successTitle')}</p>
              <p className="text-xs text-white/60">{t('impact.donation.successDesc')}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative min-h-[40vh] md:h-[60vh] flex items-center px-6 bg-brand-ink overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1630559878810-fe220c9273a7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Mongolian Landscape" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-brand-gold/40" />
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold">{t('impact.tag')}</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-[112px] font-serif text-white tracking-tight leading-[0.9] mb-6">
              {t('impact.title')} <br className="hidden md:block" /><span className="italic text-brand-gold">{t('impact.titleItalic')}</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 font-light max-w-2xl leading-relaxed">
              {t('impact.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-24 md:py-40 px-6 bg-brand-ink text-white relative overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-50"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-wild-horses-running-in-the-snow-4168-large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-brand-ink/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-ink via-transparent to-brand-ink" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-8">
                <Heart className="text-brand-gold fill-brand-gold" size={32} />
                <div className="h-px w-12 bg-brand-gold/40" />
                <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold">{t('impact.donation.tag')}</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-tight tracking-tight">
                {t('impact.donation.title1')} <span className="italic text-brand-gold">{t('impact.donation.title2')}</span> <br />
                {t('impact.donation.title3')} <span className="italic">{t('impact.donation.title4')}</span>
              </h2>
              <p className="text-xl md:text-2xl text-white/60 font-light leading-relaxed mb-10">
                {t('impact.donation.mainDesc')}
              </p>
              
              <div className="flex items-center gap-6 p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                <div className="bg-brand-gold/20 p-4 rounded-2xl">
                  <Sparkles className="text-brand-gold" size={28} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/90 mb-1">{t('impact.donation.impactNote')}</p>
                  <p className="text-xs text-white/50">{t('impact.donation.taxNote')}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[40px] md:rounded-[48px] p-8 md:p-12 text-brand-ink shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[500px]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-bl-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-indigo/5 rounded-tr-full pointer-events-none" />
              
              <div className="relative z-10 w-full max-w-md mx-auto">
                <form onSubmit={handleDonateSubmit} className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-widest text-brand-ink/80">{t('impact.donation.select', 'Select Amount')}</label>
                    <div className="grid grid-cols-2 gap-4">
                      {donationAmounts.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setSelectedAmount(opt.value);
                            setError(null);
                          }}
                          className={`p-4 rounded-3xl border-2 transition-all duration-300 text-center ${
                            selectedAmount === opt.value
                              ? 'border-brand-gold bg-brand-gold/5 shadow-[0_0_20px_rgba(197,160,89,0.1)]'
                              : 'border-brand-ink/10 hover:border-brand-gold/50 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`text-2xl font-serif ${selectedAmount === opt.value ? 'text-brand-gold' : 'text-brand-ink'}`}>
                            {opt.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-widest text-brand-ink/80">{t('impact.donation.custom', 'Custom Amount')}</label>
                    <div className={`flex items-center p-4 rounded-3xl border-2 transition-all duration-300 ${
                      selectedAmount === 'custom' 
                        ? 'border-brand-gold bg-brand-gold/5' 
                        : 'border-brand-ink/10 bg-white'
                    }`}>
                      <span className="text-2xl font-serif text-brand-ink/50 mr-4">€</span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="0.00"
                        className="bg-transparent text-2xl font-serif text-brand-ink outline-none w-full placeholder:text-brand-ink/20"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setSelectedAmount('custom');
                          setError(null);
                        }}
                        onClick={() => setSelectedAmount('custom')}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm flex items-start gap-3">
                      <AlertCircle className="shrink-0 w-5 h-5" />
                      <p>{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loadingAmount !== null}
                    className="w-full bg-brand-gold hover:bg-brand-gold/90 text-white p-5 rounded-full uppercase tracking-[0.2em] font-bold text-sm transition-all shadow-xl shadow-brand-gold/20 flex items-center justify-center gap-3 disabled:opacity-70 group"
                  >
                    {loadingAmount !== null ? (
                      <><Loader2 className="animate-spin w-5 h-5" /> {t('common.processing')}</>
                    ) : (
                      <>
                        {t('impact.donation.btn', 'Donate Now')}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Initiatives */}
      <section className="py-24 md:py-40 px-6 bg-white relative overflow-hidden">
        {/* Background Symbol */}
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none">
          <SoyomboSymbol className="w-[800px] h-[800px] text-brand-gold" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 md:mb-32">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-brand-gold/40" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">{t('impact.initiatives.tag')}</span>
              <div className="h-px w-8 bg-brand-gold/40" />
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-brand-ink mb-8 tracking-tight">{t('impact.initiatives.title')}</h2>
            <p className="text-lg md:text-2xl text-brand-ink/60 font-light max-w-3xl mx-auto leading-relaxed">{t('impact.initiatives.desc')}</p>
          </div>
          
          <div className="space-y-24 md:space-y-40">
            {initiatives.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`flex flex-col ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 md:gap-24 items-center`}
              >
                <div className="w-full md:w-1/2 aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl relative group">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-ink/20 group-hover:bg-transparent transition-colors duration-700" />
                  <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm text-brand-ink px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold shadow-lg">
                    {t('impact.initiatives.tag')} 0{idx + 1}
                  </div>
                </div>
                <div className="w-full md:w-1/2 space-y-6 md:space-y-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold/10 text-brand-gold mb-2">
                    <span className="font-serif text-2xl">0{idx + 1}</span>
                  </div>
                  <h3 className="text-3xl md:text-5xl font-serif text-brand-ink leading-tight">{item.title}</h3>
                  <p className="text-lg md:text-xl text-brand-ink/60 font-light leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="pt-4">
                    <Link to={`/initiative/${item.id}`} className="inline-flex items-center gap-3 text-brand-gold font-bold uppercase tracking-widest text-xs hover:text-brand-ink transition-colors group">
                      Learn More
                      <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <section className="py-24 md:py-40 px-6 bg-brand-paper relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-brand-gold/40" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">{t('impact.tag')}</span>
              <div className="h-px w-8 bg-brand-gold/40" />
            </div>
            <h2 className="text-4xl md:text-6xl font-serif text-brand-ink tracking-tight">{t('impact.totalImpact')}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {stats.map((stat, idx) => {
              const bentoClasses = [
                "md:col-span-2 bg-brand-ink text-white",
                "bg-brand-gold text-brand-ink",
                "md:col-span-3 bg-brand-paper text-brand-ink border border-brand-ink/10 shadow-xl shadow-brand-ink/5"
              ];
              const iconColors = [
                "text-brand-gold",
                "text-brand-ink",
                "text-brand-gold"
              ];
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-10 md:p-12 rounded-[40px] group relative overflow-hidden transition-transform duration-500 hover:-translate-y-2 ${bentoClasses[idx % 3]}`}
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 transform group-hover:scale-110 group-hover:rotate-12">
                    {stat.icon}
                  </div>
                  <div className={`mb-8 md:mb-12 relative z-10 ${iconColors[idx % 4]}`}>
                    {stat.icon}
                  </div>
                  <div className="mt-auto relative z-10">
                    <div className="text-5xl md:text-7xl font-serif mb-4 tracking-tight">{stat.value}</div>
                    <div className="text-xs md:text-sm uppercase tracking-[0.2em] font-bold opacity-70">{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Transparency */}
      <section className="py-24 md:py-40 px-6 bg-brand-ink text-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 opacity-[0.03] pointer-events-none">
          <ArcherSymbol className="w-[600px] h-[600px] text-brand-gold" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-12 bg-brand-gold/40" />
                <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold">Accountability</span>
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-8 tracking-tight">
                {t('impact.transparency.title')} <br/><span className="italic text-brand-gold">{t('impact.transparency.titleItalic')}</span>
              </h2>
              <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed mb-10 md:mb-12">
                {t('impact.transparency.desc')}
              </p>
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.3em] font-bold text-brand-ink bg-brand-gold px-10 py-5 rounded-full hover:bg-white hover:shadow-lg hover:shadow-white/10 transition-all group">
                {t('impact.transparency.cta')}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, type: "spring" }}
              className="relative mx-auto w-full max-w-md"
            >
              <div className="aspect-[3/4] bg-brand-paper rounded-[40px] p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 relative z-10">
                <div className="w-full h-full border border-brand-ink/10 rounded-[24px] p-8 flex flex-col items-center justify-center text-center bg-white">
                  <div className="w-20 h-20 bg-brand-gold/10 rounded-full flex items-center justify-center mb-8">
                    <ShieldCheck className="w-10 h-10 text-brand-gold" />
                  </div>
                  <h3 className="text-3xl font-serif text-brand-ink mb-3">Impact Report</h3>
                  <p className="text-brand-ink/50 uppercase tracking-[0.2em] text-xs font-bold mb-8">Fiscal Year 2025</p>
                  <div className="w-16 h-1 bg-brand-gold/30 rounded-full mb-8" />
                  <p className="text-sm text-brand-ink/60 font-light leading-relaxed">
                    A comprehensive overview of our financial accountability, cultural initiatives, and community impact.
                  </p>
                </div>
              </div>
              
              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-8 -left-8 bg-brand-gold text-brand-ink p-6 md:p-8 rounded-[32px] shadow-2xl z-20"
              >
                <p className="text-4xl md:text-5xl font-serif mb-1">100%</p>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-80">Transparent</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
