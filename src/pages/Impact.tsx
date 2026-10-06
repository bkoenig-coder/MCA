import React, { useState, useEffect } from 'react';
import CloudHeader from '../components/CloudHeader';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Users, HandHeart, Handshake, Landmark, Heart, Globe, ShieldCheck, TrendingUp, ArrowRight, Loader2, CheckCircle2, AlertCircle, Sparkles, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UlziiSymbol, SoyomboSymbol, ArcherSymbol, MongolianLine, MongolianFormalFrame, MongolianKhasDivider, EyebrowMark, SectionSeam } from '../components/MongolianDesign';

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

  const handleDonate = (amount: number) => {
    setError(null);
    setLoadingAmount(amount);
    const amountInEuro = amount / 100;
    const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=artxcorestudio@gmail.com&item_name=Donation+to+Mongolian+Center+Austria&currency_code=EUR&amount=${amountInEuro}`;
    window.open(paypalUrl, '_blank', 'noopener,noreferrer');
    setLoadingAmount(null);
  };

  const customValue = parseFloat(customAmount);
  const giveAmount = selectedAmount === 'custom' ? (customValue > 0 ? customValue : 0) : selectedAmount / 100;
  const giveLabel = giveAmount > 0 ? t('impact.donation.giveBtn', { amount: giveAmount }) : t('impact.donate');

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
    { id: 'All', label: t('siteUi.impact.fundAll') },
    { id: 'Heritage', label: t('siteUi.impact.fundHeritage') },
    { id: 'Bridge', label: t('siteUi.impact.fundBridge') },
    { id: 'Exchange', label: t('siteUi.impact.fundExchange') }
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
    <div className="pt-[140px] md:pt-[152px] bg-white text-slate-900 min-h-screen">
      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-950 text-white px-8 py-4 rounded-full shadow-lg border border-brand-gold/50 flex items-center gap-4 min-w-[320px]"
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

      {/* Header */}
      <CloudHeader tag={t('impact.tag')} title={t('impact.title')} italic={t('impact.titleItalic')} subtitle={t('impact.subtitle')} />

      {/* Donation */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7"
            >
              <div className="flex items-center gap-4 mb-5">
                <EyebrowMark />
                <span className="text-xs uppercase tracking-[0.18em] font-semibold text-brand-gold">{t('impact.donation.tag')}</span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-ink leading-[1.08] tracking-tight">
                {t('impact.donation.title1')} <span className="italic text-brand-gold">{t('impact.donation.title2')}</span>{' '}
                {t('impact.donation.title3')} <span className="italic">{t('impact.donation.title4')}</span>
              </h2>

              <p className="mt-6 text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl">{t('impact.donation.mainDesc')}</p>

              <div className="mt-10 pt-8 border-t border-slate-200 max-w-2xl">
                <p className="text-xs uppercase tracking-[0.16em] font-semibold text-slate-500 mb-5">{t('impact.donation.gives')}</p>
                <ul className="space-y-4">
                  {['g1', 'g2', 'g3'].map((k) => (
                    <li key={k} className="flex items-start gap-4">
                      <span aria-hidden="true" className="mt-2.5 w-2 h-2 rotate-45 bg-brand-gold shrink-0" />
                      <span className="text-lg font-serif text-brand-ink leading-snug">{t(`impact.donation.${k}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-10 font-serif italic text-xl text-brand-blue">{t('impact.donation.thanks')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-5"
            >
              <form onSubmit={handleDonateSubmit} className="bg-white border border-slate-200 rounded-2xl p-7 md:p-9 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.25)] border-t-4 border-t-brand-gold">
                <div className="flex items-center gap-2.5 mb-6">
                  <Heart className="w-5 h-5 text-brand-gold fill-brand-gold" />
                  <span className="text-xs uppercase tracking-[0.16em] font-semibold text-brand-ink">{t('impact.donation.oneTime')}</span>
                </div>

                <div role="radiogroup" aria-label={t('impact.donation.chooseAmount')} className="grid grid-cols-2 gap-3">
                  {donationAmounts.map((opt) => {
                    const active = selectedAmount === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => {
                          setSelectedAmount(opt.value);
                          setError(null);
                        }}
                        className={`py-4 rounded-xl border text-2xl font-serif transition-colors ${
                          active ? 'border-brand-ink bg-brand-ink text-white' : 'border-slate-300 text-brand-ink hover:border-brand-gold'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                <div
                  className={`mt-3 flex items-center px-5 py-3.5 rounded-xl border transition-colors ${
                    selectedAmount === 'custom' ? 'border-brand-ink' : 'border-slate-300'
                  }`}
                >
                  <span className="text-xl font-serif text-slate-400 mr-3">€</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    inputMode="decimal"
                    aria-label={t('siteUi.impact.customAmount')}
                    placeholder={t('impact.donation.customPlaceholder')}
                    className="bg-transparent text-lg text-brand-ink outline-none w-full placeholder:text-slate-400"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount('custom');
                      setError(null);
                    }}
                    onClick={() => setSelectedAmount('custom')}
                  />
                </div>

                {error && (
                  <div role="alert" className="mt-4 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs flex items-start gap-2.5 font-medium">
                    <AlertCircle className="shrink-0 w-4 h-4 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loadingAmount !== null}
                  className="mt-6 w-full bg-brand-gold hover:bg-amber-400 text-slate-950 py-4 rounded-xl uppercase tracking-[0.16em] font-semibold text-xs transition-colors flex items-center justify-center gap-3 disabled:opacity-70 group"
                >
                  {loadingAmount !== null ? (
                    <><Loader2 className="animate-spin w-5 h-5" /> {t('siteUi.impact.processing')}</>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 fill-slate-950" />
                      <span>{giveLabel}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </>
                  )}
                </button>

                <p className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-brand-blue" /> {t('impact.donation.secure')}
                </p>
                <p className="mt-3 text-xs text-slate-500 text-center leading-relaxed">{t('impact.donation.impactNote')}</p>
                <p className="mt-2 text-xs text-slate-400 text-center leading-relaxed">{t('impact.donation.taxNote')}</p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <SectionSeam />
      {/* Bright Cultural Heritage Funds & Initiatives */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <EyebrowMark />
              <span className="text-xs uppercase tracking-[0.18em] font-semibold text-brand-gold">{t('impact.initiatives.tag')}</span>
              <EyebrowMark />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4 tracking-tight">{t('impact.initiatives.title')}</h2>
            <p className="text-base md:text-lg text-slate-600 font-sans font-normal max-w-3xl mx-auto leading-relaxed">{t('impact.initiatives.desc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredInitiatives.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white border border-brand-gold/30 rounded-2xl md:rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group shadow-lg hover:shadow-xl hover:border-brand-gold transition-all duration-300"
              >
                <div>
                  <div className="aspect-[16/10] rounded-[24px] overflow-hidden mb-6 relative bg-slate-900 border border-slate-200">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-slate-950/90 text-brand-gold px-3 py-1 rounded-lg text-[11px] uppercase tracking-widest font-semibold border border-brand-gold/40">
                      0{idx + 1}
                    </div>
                  </div>

                  <h3 className="text-2xl font-serif text-slate-900 mb-3 group-hover:text-brand-gold transition-colors duration-300 font-semibold">{item.title}</h3>
                  <p className="text-xs text-slate-600 font-sans font-normal leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                <Link 
                  to={`/initiative/${item.id}`} 
                  className="inline-flex items-center justify-between text-[11px] uppercase tracking-[0.18em] font-semibold text-slate-900 hover:text-brand-gold transition-colors pt-4 border-t border-slate-100"
                >
                  <span>{t('impact.more.explore')}</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform text-brand-gold" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <MongolianKhasDivider className="max-w-4xl mx-auto my-16" />
      </section>

      <SectionSeam />
      {/* More ways to give */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl mb-12">
            <div className="flex items-center gap-4 mb-4">
              <EyebrowMark />
              <span className="text-xs uppercase tracking-[0.18em] font-semibold text-brand-gold">{t('impact.more.tag')}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-brand-ink leading-tight">{t('impact.more.title')}</h2>
            <p className="mt-4 text-base md:text-lg text-slate-600 leading-relaxed">{t('impact.more.desc')}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { key: 'w1', icon: <Users className="w-6 h-6" />, to: '/membership' },
              { key: 'w2', icon: <HandHeart className="w-6 h-6" />, to: '/careers' },
              { key: 'w3', icon: <Handshake className="w-6 h-6" />, to: '/contact' },
              { key: 'w4', icon: <Landmark className="w-6 h-6" />, href: 'mailto:info@mongoliancenter.org?subject=Donation%20by%20bank%20transfer' },
            ].map((w, i) => {
              const body = (
                <>
                  <div className="text-brand-blue mb-5">{w.icon}</div>
                  <h3 className="text-xl font-serif text-brand-ink mb-2">{t(`impact.more.${w.key}Title`)}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed flex-1">{t(`impact.more.${w.key}Desc`)}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-semibold text-brand-ink group-hover:text-brand-blue transition-colors">
                    {t(`impact.more.${w.key}Cta`)} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </>
              );
              const cls = 'group flex flex-col h-full p-7 rounded-2xl border border-slate-200 bg-white hover:border-brand-gold hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.3)] transition-all';
              return (
                <motion.div key={w.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                  {w.to ? (
                    <Link to={w.to} className={cls}>{body}</Link>
                  ) : (
                    <a href={w.href} className={cls}>{body}</a>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionSeam />
      {/* Accountability */}
      <section className="py-16 md:py-24 bg-brand-ink text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-7">
              <div className="flex items-center gap-3 text-brand-gold mb-5">
                <ShieldCheck size={20} />
                <span className="text-xs uppercase tracking-[0.18em] font-semibold">{t('impact.trust.tag')}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-serif leading-tight">{t('impact.trust.title')}</h2>
              <p className="mt-5 text-base md:text-lg text-white/75 leading-relaxed max-w-xl">{t('impact.trust.desc')}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/governance" className="inline-flex items-center gap-3 bg-brand-gold text-slate-950 hover:bg-amber-400 px-7 py-3.5 rounded-lg text-xs uppercase tracking-[0.14em] font-semibold transition-colors">
                  {t('impact.trust.cta')} <ArrowRight size={14} />
                </Link>
                <Link to="/imprint" className="inline-flex items-center gap-3 border border-white/30 hover:border-brand-gold hover:text-brand-gold px-7 py-3.5 rounded-lg text-xs uppercase tracking-[0.14em] font-semibold transition-colors">
                  {t('impact.trust.cta2')}
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="lg:col-span-5">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-8">
                <p className="text-xs uppercase tracking-[0.16em] font-semibold text-brand-gold mb-5">{t('impact.trust.cardTitle')}</p>
                <dl className="space-y-4 text-sm">
                  <div>
                    <dt className="text-white/50 text-xs uppercase tracking-[0.12em]">{t('impact.trust.nameLabel')}</dt>
                    <dd className="mt-1 font-serif text-lg">{t('siteUi.org.name')}</dd>
                  </div>
                  <div>
                    <dt className="text-white/50 text-xs uppercase tracking-[0.12em]">{t('siteUi.impact.zvrLabel')}</dt>
                    <dd className="mt-1">1673049268 · {t('siteUi.impact.zvrRegister')}</dd>
                  </div>
                  <div>
                    <dt className="text-white/50 text-xs uppercase tracking-[0.12em]">{t('impact.trust.addressLabel')}</dt>
                    <dd className="mt-1">Schöpfleuthergasse 25, 1210 {t('contact.info.vienna')}</dd>
                  </div>
                </dl>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
