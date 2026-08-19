import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Globe, ShieldCheck, TrendingUp, ArrowRight, Loader2, CheckCircle2, AlertCircle, Sparkles, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UlziiSymbol, SoyomboSymbol, ArcherSymbol, MongolianLine, MongolianFormalFrame, MongolianKhasDivider } from '../components/MongolianDesign';
import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle } from '../firebase';

const EMBER_PARTICLES = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  size: Math.random() * 3 + 1,
  left: `${Math.random() * 100}%`,
  top: `${10 + Math.random() * 90}%`,
  duration: `${Math.random() * 5 + 4}s`,
  delay: `${Math.random() * 5}s`,
  xMove: `${(Math.random() - 0.5) * 80}px`,
  yMove: `${-(Math.random() * 180 + 120)}px`,
  color: ['bg-amber-400', 'bg-yellow-500', 'bg-orange-400'][Math.floor(Math.random() * 3)],
  blur: Math.random() > 0.5 ? 'blur-[1px]' : 'blur-[2px]',
}));

const EmberBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {EMBER_PARTICLES.map((p) => (
      <div
        key={`ember-${p.id}`}
        className={`absolute rounded-full animate-ember ${p.color} ${p.blur}`}
        style={{
          left: p.left,
          top: p.top,
          width: `${p.size}px`,
          height: `${p.size}px`,
          '--x-move': p.xMove,
          '--y-move': p.yMove,
          '--duration': p.duration,
          '--delay': p.delay,
        } as React.CSSProperties}
      />
    ))}
  </div>
);

export default function Impact() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [loadingAmount, setLoadingAmount] = useState<number | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(2500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeFundFilter, setActiveFundFilter] = useState('All');

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

  const fundCategories = [
    { id: 'All', label: 'All Funds' },
    { id: 'Heritage', label: 'Nomadic Heritage' },
    { id: 'Bridge', label: 'Bilateral Bridges' },
    { id: 'Exchange', label: 'Youth Exchange' }
  ];

  const stats = [
    { label: t('impact.stats.events'), value: "3+", icon: <Globe className="w-6 h-6" /> },
    { label: t('impact.stats.members'), value: "+500", icon: <Heart className="w-6 h-6" /> },
    { label: t('impact.stats.partnerships'), value: "+5", icon: <TrendingUp className="w-6 h-6" /> }
  ];

  const initiatives = [
    {
      id: "preservation",
      category: "Heritage",
      title: t('impact.initiatives.preservation'),
      desc: t('impact.initiatives.preservationDesc'),
      image: "https://images.unsplash.com/photo-1745155541633-da6d9bb28f5c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: "bridge",
      category: "Bridge",
      title: t('impact.initiatives.bridge'),
      desc: t('impact.initiatives.bridgeDesc'),
      image: "https://images.unsplash.com/photo-1623266880158-c683344cd073?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: "exchange",
      category: "Exchange",
      title: t('impact.initiatives.exchange'),
      desc: t('impact.initiatives.exchangeDesc'),
      image: "https://images.unsplash.com/photo-1645539818874-1801c031a86a?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  ];

  const filteredInitiatives = initiatives.filter(item => activeFundFilter === 'All' || item.category === activeFundFilter);

  return (
    <div className="pt-[140px] md:pt-[152px] bg-brand-paper text-slate-900 min-h-screen">
      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-950 text-white px-8 py-4 rounded-full shadow-2xl border border-brand-gold/50 flex items-center gap-4 min-w-[320px]"
          >
            <div className="bg-brand-gold/20 p-2 rounded-full">
              <CheckCircle2 className="text-brand-gold" size={24} />
            </div>
            <div>
              <p className="font-extrabold text-sm">{t('impact.donation.successTitle')}</p>
              <p className="text-xs text-slate-300">{t('impact.donation.successDesc')}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Executive Hero */}
      <section className="relative min-h-[380px] md:h-[460px] flex items-center px-6 text-white overflow-hidden border-b border-[#D4AF37]/30">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1630559878810-fe220c9273a7?q=80&w=1600&auto=format&fit=crop" 
            alt="Mongolian Landscape" 
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/25" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 py-10 md:py-0">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <UlziiSymbol className="w-5 h-5 text-brand-gold" />
                <span className="text-[10px] uppercase tracking-[0.4em] font-extrabold text-brand-gold">{t('impact.tag')}</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-tight mb-4">
                {t('impact.title')} <br className="hidden md:block" /><span className="italic text-brand-gold font-light">{t('impact.titleItalic')}</span>
              </h1>
              <p className="text-base md:text-lg text-slate-300 font-sans font-light max-w-xl leading-relaxed">
                {t('impact.subtitle')}
              </p>
            </motion.div>

            {/* Fund Category Filter Pills */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-3"
            >
              {fundCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFundFilter(cat.id)}
                  className={`px-6 py-3 rounded-full text-[10px] uppercase tracking-widest font-extrabold transition-all border ${
                    activeFundFilter === cat.id 
                      ? "bg-brand-gold text-slate-950 border-brand-gold shadow-md" 
                      : "bg-white/10 text-white/80 border-white/20 hover:border-brand-gold hover:text-brand-gold backdrop-blur-md"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bright Executive Donation Suite */}
      <section className="py-16 md:py-24 px-6 bg-brand-paper relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="inline-flex items-center gap-3 text-brand-gold">
                <Heart className="fill-brand-gold w-5 h-5" />
                <span className="text-[10px] uppercase tracking-[0.4em] font-extrabold">{t('impact.donation.tag')}</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight tracking-tight font-medium">
                {t('impact.donation.title1')} <span className="italic text-brand-gold font-light">{t('impact.donation.title2')}</span> <br />
                {t('impact.donation.title3')} <span className="italic font-light">{t('impact.donation.title4')}</span>
              </h2>

              <p className="text-base md:text-lg text-slate-600 font-sans font-light leading-relaxed">
                {t('impact.donation.mainDesc')}
              </p>
              
              <div className="flex items-center gap-5 p-6 bg-white rounded-[24px] border border-brand-gold/30 shadow-md">
                <div className="bg-brand-gold/15 border border-brand-gold/30 p-3.5 rounded-xl shrink-0 text-brand-gold">
                  <Sparkles size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-1">{t('impact.donation.impactNote')}</p>
                  <p className="text-xs text-slate-500 font-light">{t('impact.donation.taxNote')}</p>
                </div>
              </div>
            </motion.div>

            {/* Bright White Donation Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-6"
            >
              <div className="bg-white border border-brand-gold/30 p-8 md:p-12 rounded-[32px] md:rounded-[48px] shadow-2xl relative overflow-hidden">
                <form onSubmit={handleDonateSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold uppercase tracking-widest text-slate-900">{t('impact.donation.select', 'Select Amount')}</label>
                      <span className="text-[10px] uppercase tracking-widest text-slate-400 font-sans">EUR (€)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {donationAmounts.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setSelectedAmount(opt.value);
                            setError(null);
                          }}
                          className={`p-4 rounded-2xl border-2 transition-all duration-300 text-center font-extrabold ${
                            selectedAmount === opt.value
                              ? 'border-brand-gold bg-brand-gold/10 text-slate-950 shadow-md'
                              : 'border-slate-200 hover:border-brand-gold/50 bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className={`text-2xl font-serif ${selectedAmount === opt.value ? 'text-brand-gold' : 'text-slate-900'}`}>
                            {opt.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-extrabold uppercase tracking-widest text-slate-900">{t('impact.donation.custom', 'Custom Amount')}</label>
                    <div className={`flex items-center px-5 py-4 rounded-2xl border-2 transition-all duration-300 ${
                      selectedAmount === 'custom' 
                        ? 'border-brand-gold bg-brand-gold/5 shadow-sm' 
                        : 'border-slate-200 bg-white'
                    }`}>
                      <span className="text-2xl font-serif text-slate-400 mr-3">€</span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="0.00"
                        className="bg-transparent text-2xl font-serif text-slate-900 outline-none w-full placeholder:text-slate-300 font-semibold"
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
                    <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-start gap-2.5 font-medium">
                      <AlertCircle className="shrink-0 w-4 h-4 mt-0.5" />
                      <p>{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loadingAmount !== null}
                    className="w-full bg-brand-gold hover:bg-amber-400 text-slate-950 p-5 rounded-full uppercase tracking-[0.2em] font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-3 disabled:opacity-70 group"
                  >
                    {loadingAmount !== null ? (
                      <><Loader2 className="animate-spin w-5 h-5" /> {t('common.processing')}</>
                    ) : (
                      <>
                        <span>{t('impact.donation.btn', 'Donate Now')}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bright Cultural Heritage Funds & Initiatives */}
      <section className="py-16 md:py-24 px-6 bg-brand-paper relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-brand-gold/40" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-brand-gold">{t('impact.initiatives.tag')}</span>
              <div className="h-px w-8 bg-brand-gold/40" />
            </div>
            <h2 className="text-4xl md:text-6xl font-serif text-slate-900 mb-4 tracking-tight">{t('impact.initiatives.title')}</h2>
            <p className="text-base md:text-lg text-slate-600 font-sans font-light max-w-3xl mx-auto leading-relaxed">{t('impact.initiatives.desc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredInitiatives.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white border border-brand-gold/30 rounded-[32px] md:rounded-[40px] p-6 flex flex-col justify-between relative overflow-hidden group shadow-lg hover:shadow-xl hover:border-brand-gold transition-all duration-300"
              >
                <div>
                  <div className="aspect-[16/10] rounded-[24px] overflow-hidden mb-6 relative bg-slate-900 border border-slate-200">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-slate-950/90 text-brand-gold px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-extrabold border border-brand-gold/40">
                      Fund 0{idx + 1}
                    </div>
                  </div>

                  <h3 className="text-2xl font-serif text-slate-900 mb-3 group-hover:text-brand-gold transition-colors duration-300 font-semibold">{item.title}</h3>
                  <p className="text-xs text-slate-600 font-sans font-light leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                <Link 
                  to={`/initiative/${item.id}`} 
                  className="inline-flex items-center justify-between text-[11px] uppercase tracking-[0.18em] font-extrabold text-slate-900 hover:text-brand-gold transition-colors pt-4 border-t border-slate-100"
                >
                  <span>Explore Fund</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform text-brand-gold" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <MongolianKhasDivider className="max-w-4xl mx-auto my-16" />
      </section>

      {/* Bright Impact Metrics Bento Grid */}
      <section className="py-16 md:py-24 px-6 bg-brand-paper relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.4em] font-extrabold text-brand-gold mb-3 block">{t('impact.tag')}</span>
            <h2 className="text-4xl md:text-6xl font-serif text-slate-900 tracking-tight">{t('impact.totalImpact')}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-brand-gold/30 rounded-[32px] md:rounded-[40px] p-8 md:p-10 relative overflow-hidden group flex flex-col justify-between min-h-[220px] shadow-lg hover:shadow-xl hover:border-brand-gold transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="text-brand-gold">
                    {stat.icon}
                  </div>
                  <SoyomboSymbol className="w-10 h-10 text-brand-gold/20" />
                </div>
                <div>
                  <div className="text-5xl md:text-7xl font-serif text-slate-900 mb-2 font-bold">{stat.value}</div>
                  <div className="text-xs uppercase tracking-[0.25em] font-extrabold text-brand-gold">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency Suite */}
      <section className="py-16 md:py-24 px-6 bg-[#0A1128] text-white relative overflow-hidden border-t border-brand-gold/20">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="flex items-center gap-3 text-brand-gold">
                <ShieldCheck size={22} />
                <span className="text-[10px] uppercase tracking-[0.4em] font-extrabold">Accountability</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tight font-medium">
                {t('impact.transparency.title')} <br/><span className="italic text-brand-gold font-light">{t('impact.transparency.titleItalic')}</span>
              </h2>
              <p className="text-base md:text-lg text-slate-300 font-sans font-light leading-relaxed">
                {t('impact.transparency.desc')}
              </p>
              <button className="inline-flex items-center gap-3 bg-brand-gold text-slate-950 hover:bg-amber-400 px-8 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-extrabold transition-all duration-300 shadow-md">
                <span>{t('impact.transparency.cta')}</span>
                <ArrowRight size={14} />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-5"
            >
              <div className="bg-slate-900/90 border border-brand-gold/40 p-8 md:p-12 rounded-[32px] md:rounded-[48px] shadow-2xl text-center">
                <div className="w-16 h-16 bg-brand-gold/20 border border-brand-gold/40 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-gold">
                  <ShieldCheck className="w-8 h-8 text-brand-gold" />
                </div>
                <h3 className="text-2xl font-serif text-white mb-2 font-semibold">Fiscal Impact Report</h3>
                <p className="text-brand-gold text-[10px] uppercase tracking-[0.25em] font-extrabold mb-6">Fiscal Year 2025/2026</p>
                <p className="text-xs text-slate-300 font-sans font-light leading-relaxed mb-6">
                  Complete audited overview of financial accountability, cultural endowment funds, and bilateral community impact.
                </p>
                <div className="px-5 py-2.5 bg-slate-950 border border-brand-gold/40 rounded-full inline-block text-brand-gold text-[10px] uppercase tracking-widest font-extrabold shadow-lg">
                  100% Audited & Transparent
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
