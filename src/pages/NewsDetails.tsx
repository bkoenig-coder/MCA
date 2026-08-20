import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  db,
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  OperationType,
  handleFirestoreError,
} from "../firebase";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link as LinkIcon,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  ZoomIn,
} from "lucide-react";
import {
  UlziiSymbol,
  SoyomboSymbol,
  MongolianLine,
} from "../components/MongolianDesign";
import { useTranslation } from "react-i18next";
import mcaLogo from "../assets/media/mcalogo-1.png";

export default function NewsDetails() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const q = query(collection(db, "posts"), where("slug", "==", id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          const docRef = doc(db, "posts", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setPost({ id: docSnap.id, ...docSnap.data() });
          } else {
            setError(t("news.details.notFound"));
          }
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `posts/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, t]);

  const rawGallery: string[] = Array.isArray(post?.galleryImages)
    ? post.galleryImages.filter((img: any) => typeof img === 'string' && img.trim().length > 0)
    : (typeof post?.galleryImages === "string" && post.galleryImages.trim()
        ? post.galleryImages.split(/[,;\n]/).map((s: string) => s.trim().replace(/^["']|["']$/g, '')).filter((s: string) => s.length > 0 && (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/') || s.startsWith('data:')))
        : []);

  const allPhotos: string[] = [
    post?.imageUrl,
    ...rawGallery
  ].filter((img: any): img is string => typeof img === 'string' && img.trim().length > 0);

  const uniquePhotos: string[] = Array.from(new Set(allPhotos));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowLeft" && uniquePhotos.length > 1) {
        setCurrentSlide((prev) => (prev - 1 + uniquePhotos.length) % uniquePhotos.length);
      } else if (e.key === "ArrowRight" && uniquePhotos.length > 1) {
        setCurrentSlide((prev) => (prev + 1) % uniquePhotos.length);
      }
    };

    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, uniquePhotos.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-gold" size={48} />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h1 className="text-3xl font-serif mb-4">
          {error || t("common.error.unexpected")}
        </h1>
        <Link
          to="/news"
          className="text-brand-gold font-bold flex items-center gap-2"
        >
          <ArrowLeft size={20} /> {t("news.details.back")}
        </Link>
      </div>
    );
  }

  const lang = i18n.language;
  const dTitle =
    lang === "mn"
      ? post.titleMn || post.title
      : lang === "de"
        ? post.titleDe || post.title
        : post.titleEn || post.title;
  const dContent =
    lang === "mn"
      ? post.contentMn || post.content
      : lang === "de"
        ? post.contentDe || post.content
        : post.contentEn || post.content;

  const shareUrl = "https://mongoliancenter.org" + window.location.pathname + "?v=new";
  const shareTitle = dTitle;

  const handleShare = (platform: string) => {
    let url = "";
    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`;
        break;
    }
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-24 md:pt-32 pb-20 px-6 relative overflow-hidden bg-brand-paper min-h-screen">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Return Button */}
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-gold transition-colors mb-8 font-serif uppercase tracking-[0.2em] text-xs font-bold group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform text-brand-gold"
          />{" "}
          {t("news.details.back", "← BACK TO GAZETTE INDEX")}
        </Link>

        {/* Newspaper Article Container */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-300 p-6 md:p-12 shadow-xl"
        >
          {/* Gazette Top Banner */}
          <div className="text-center border-b-2 border-slate-900 pb-4 mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <UlziiSymbol className="w-4 h-4 text-brand-gold" />
              <span className="text-[9px] uppercase tracking-[0.3em] font-extrabold text-slate-500">
                THE AUSTRIAN-MONGOLIAN GAZETTE • OFFICIAL DISPATCH
              </span>
              <UlziiSymbol className="w-4 h-4 text-brand-gold" />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-black text-slate-900 leading-[1.08] tracking-tight my-4">
              {dTitle}
            </h1>

            {/* Newspaper Dateline Strip */}
            <div className="border-t-2 border-b-2 border-slate-900 my-4 py-2 flex flex-wrap items-center justify-between text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-sans font-extrabold text-slate-800 gap-2">
              <div>BY THE MCA EDITORIAL BOARD</div>
              <div>VIENNA, AUSTRIA</div>
              <div>
                {post.createdAt
                  ?.toDate()
                  .toLocaleDateString(t("common.locale"), {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
              </div>
              <div>SPECIAL DISPATCH</div>
            </div>
          </div>

          {/* Featured Newspaper Photo / Slide Gallery */}
          {uniquePhotos.length > 0 && (
            <div className="border border-slate-300 p-2 bg-white shadow-md mb-10 group">
              <div className="relative w-full min-h-[320px] sm:min-h-[450px] md:min-h-[540px] max-h-[82vh] aspect-[16/10] sm:aspect-[16/11] md:aspect-auto overflow-hidden bg-slate-950 select-none flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0 w-full h-full flex items-center justify-center cursor-zoom-in"
                    onClick={() => setIsLightboxOpen(true)}
                  >
                    {/* Blurred Backdrop for portrait/imperfect aspect ratio images */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <img
                        src={uniquePhotos[currentSlide]}
                        alt=""
                        className="w-full h-full object-cover filter blur-3xl opacity-40 scale-125"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {/* Main slide image auto-sized to maximum possible bounds */}
                    <motion.img
                      initial={{ scale: 1.02 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.35 }}
                      src={uniquePhotos[currentSlide]}
                      alt={`${dTitle} - Press Photograph ${currentSlide + 1}`}
                      className="w-full h-full max-h-[82vh] object-contain relative z-10 hover:scale-[1.01] transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      drag={uniquePhotos.length > 1 ? "x" : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(e, { offset }) => {
                        e.stopPropagation();
                        if (offset.x < -40) {
                          setCurrentSlide((prev) => (prev + 1) % uniquePhotos.length);
                        } else if (offset.x > 40) {
                          setCurrentSlide((prev) => (prev - 1 + uniquePhotos.length) % uniquePhotos.length);
                        }
                      }}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Top Left Click to Enlarge Badge */}
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute top-3 left-3 z-20 bg-slate-900/80 hover:bg-slate-900 backdrop-blur-sm text-white/90 hover:text-white text-[10px] font-sans font-bold tracking-wider px-2.5 py-1 rounded border border-white/10 shadow-sm flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="View full picture"
                >
                  <Maximize2 size={12} className="text-brand-gold" />
                  <span>VIEW FULL PIC</span>
                </button>

                {/* Top Right Plate Counter Badge */}
                {uniquePhotos.length > 1 && (
                  <div className="absolute top-3 right-3 z-20 bg-slate-900/80 backdrop-blur-sm text-amber-200 text-[10px] font-sans font-extrabold uppercase tracking-widest px-2.5 py-1 rounded border border-amber-400/20 shadow-sm">
                    PLATE {currentSlide + 1} / {uniquePhotos.length}
                  </div>
                )}

                {/* Left & Right Slide Navigation Arrows */}
                {uniquePhotos.length > 1 && (
                  <>
                    <div className="absolute inset-x-0 inset-y-0 flex items-center justify-between p-3 pointer-events-none z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentSlide((prev) => (prev - 1 + uniquePhotos.length) % uniquePhotos.length);
                        }}
                        className="p-2.5 bg-slate-900/70 hover:bg-brand-gold text-white rounded-full transition-all duration-200 opacity-90 sm:opacity-0 group-hover:opacity-100 pointer-events-auto backdrop-blur-sm shadow-md"
                        aria-label="Previous slide"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentSlide((prev) => (prev + 1) % uniquePhotos.length);
                        }}
                        className="p-2.5 bg-slate-900/70 hover:bg-brand-gold text-white rounded-full transition-all duration-200 opacity-90 sm:opacity-0 group-hover:opacity-100 pointer-events-auto backdrop-blur-sm shadow-md"
                        aria-label="Next slide"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>

                    {/* Bottom Indicator Dots */}
                    <div className="absolute bottom-3 inset-x-0 flex justify-center items-center gap-1.5 z-20 pointer-events-auto">
                      {uniquePhotos.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentSlide(idx);
                          }}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            idx === currentSlide
                              ? "w-6 bg-brand-gold shadow-sm"
                              : "w-2 bg-white/60 hover:bg-white"
                          }`}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Caption Line */}
              <div className="pt-2 text-center border-t border-slate-200 mt-2 flex flex-col sm:flex-row items-center justify-between gap-1 text-slate-600 px-1">
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="font-serif italic text-xs hover:text-brand-gold transition-colors text-left flex items-center gap-1.5 group/cap"
                >
                  <span>Official Press Photograph — Austrian-Mongolian Center Dispatch</span>
                  <ZoomIn size={12} className="opacity-0 group-hover/cap:opacity-100 text-brand-gold transition-opacity" />
                </button>
                {uniquePhotos.length > 1 && (
                  <span className="text-[10px] font-sans uppercase tracking-widest text-slate-500 font-bold">
                    PRESS ARCHIVE • {currentSlide + 1} OF {uniquePhotos.length}
                  </span>
                )}
              </div>

              {/* Thumbnail Strip for multi-photo sets */}
              {uniquePhotos.length > 1 && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {uniquePhotos.map((photoUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`relative flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                        idx === currentSlide
                          ? "border-brand-gold ring-1 ring-brand-gold"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={photoUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Social Share Bar */}
          <div className="flex items-center justify-between border-y border-slate-200 py-3 mb-10 text-slate-600">
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-slate-500">
              SHARE ARTICLE
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleShare("facebook")}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-colors"
                aria-label="Share Facebook"
              >
                <Facebook size={14} />
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-colors"
                aria-label="Share Twitter"
              >
                <Twitter size={14} />
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-colors"
                aria-label="Share LinkedIn"
              >
                <Linkedin size={14} />
              </button>
              <button
                onClick={handleCopyLink}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors"
                aria-label="Copy Link"
              >
                {copied ? <Check size={14} /> : <LinkIcon size={14} />}
              </button>
            </div>
          </div>

          {/* Newspaper Body Text Content */}
          <div className="font-serif text-slate-900 text-lg md:text-xl leading-[1.8] font-normal space-y-6">
            {(() => {
              if (!dContent) return null;
              // Split by double line breaks or single line breaks
              const rawBlocks = dContent.split(/\r?\n/);
              // Group text into logical paragraphs
              const blocks: string[] = [];
              let currentBlock = "";

              rawBlocks.forEach((line: string) => {
                const trimmed = line.trim();
                if (!trimmed) {
                  if (currentBlock) {
                    blocks.push(currentBlock);
                    currentBlock = "";
                  }
                } else if (trimmed.startsWith('#') || trimmed.startsWith('"') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
                  if (currentBlock) {
                    blocks.push(currentBlock);
                    currentBlock = "";
                  }
                  blocks.push(trimmed);
                } else {
                  if (currentBlock) {
                    currentBlock += " " + trimmed;
                  } else {
                    currentBlock = trimmed;
                  }
                }
              });
              if (currentBlock) blocks.push(currentBlock);

              // If splitting yielded only 1 huge block, fall back to line by line so spacing is enforced
              const paragraphs = blocks.length > 0 ? blocks : [dContent];

              return paragraphs.map((text: string, pIdx: number) => {
                // Pull Quote
                if (
                  (text.startsWith('"') && text.endsWith('"') && text.length > 10) ||
                  text.startsWith('>')
                ) {
                  return (
                    <blockquote
                      key={pIdx}
                      className="border-y-2 border-brand-gold py-6 my-8 font-serif text-xl md:text-3xl italic text-center text-slate-900 bg-slate-50 px-6 shadow-inner"
                    >
                      {text.replace(/(^"|"$|^>\s*)/g, "")}
                    </blockquote>
                  );
                }

                // Subheading
                const isMarkdownHeading = text.startsWith("#") && /^#{1,6}\s/.test(text);
                if (isMarkdownHeading) {
                  const headingText = text.replace(/^#+\s+/, "");
                  return (
                    <h2
                      key={pIdx}
                      className="font-serif font-black text-2xl md:text-3xl text-slate-900 mt-10 mb-4 tracking-tight border-b-2 border-slate-900 pb-1"
                    >
                      {headingText}
                    </h2>
                  );
                }

                // Bullet points
                if (text.startsWith('- ') || text.startsWith('• ')) {
                  return (
                    <div key={pIdx} className="flex items-start gap-3 my-2 pl-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-2.5 shrink-0" />
                      <p className="text-slate-900 font-serif text-lg md:text-xl leading-relaxed">
                        {text.replace(/^[-•]\s*/, "")}
                      </p>
                    </div>
                  );
                }

                // Paragraph with drop-cap on first block
                return (
                  <p
                    key={pIdx}
                    className={
                      pIdx === 0
                        ? "first-letter:text-6xl first-letter:font-serif first-letter:font-black first-letter:float-left first-letter:mr-3 first-letter:text-brand-gold first-letter:leading-none text-slate-900 font-serif mb-6 leading-[1.8] whitespace-pre-line"
                        : "text-slate-900 font-serif mb-6 leading-[1.8] whitespace-pre-line"
                    }
                  >
                    {text}
                  </p>
                );
              });
            })()}
          </div>

          {/* Newspaper End Ornament */}
          <div className="mt-12 pt-6 border-t-2 border-slate-900 text-center flex flex-col items-center justify-center">
            <UlziiSymbol className="w-8 h-8 text-brand-gold/60 mb-2" />
            <span className="text-[9px] font-sans uppercase tracking-[0.3em] font-extrabold text-slate-500">
              — END OF OFFICIAL DISPATCH —
            </span>
          </div>
        </motion.article>
      </div>

      {/* Full Picture Lightbox Modal (Fixed overlay outside transformed containers) */}
      <AnimatePresence>
        {isLightboxOpen && uniquePhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-2 sm:p-4 md:p-6 select-none"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Lightbox Top Header */}
            <div 
              className="flex items-center justify-between z-10 max-w-[98vw] mx-auto w-full text-white/90 px-2 pt-1"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <UlziiSymbol className="w-5 h-5 text-brand-gold shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-sans tracking-[0.25em] font-extrabold text-amber-300 block">
                    MCA PRESS ARCHIVE • OFFICIAL PRESS PHOTOGRAPH
                  </span>
                  <span className="text-xs text-white/70 font-serif truncate max-w-[240px] sm:max-w-md block">
                    {dTitle}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {uniquePhotos.length > 1 && (
                  <span className="text-xs font-sans font-bold bg-white/10 px-3 py-1 rounded-full text-amber-200 tracking-wider">
                    {currentSlide + 1} / {uniquePhotos.length}
                  </span>
                )}
                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="p-2.5 rounded-full bg-white/15 hover:bg-brand-gold hover:text-slate-950 text-white transition-colors flex items-center justify-center shadow-lg border border-white/10"
                  aria-label="Close full picture"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Main Full Image View Area (Autoresponsive maximum size) */}
            <div 
              className="relative flex-1 flex items-center justify-center max-w-[98vw] w-full my-1 sm:my-2 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  src={uniquePhotos[currentSlide]}
                  alt={`${dTitle} - Full Press Photograph ${currentSlide + 1}`}
                  className="max-h-[84vh] sm:max-h-[88vh] max-w-[98vw] sm:max-w-[96vw] w-auto h-auto object-contain shadow-2xl rounded-sm"
                  referrerPolicy="no-referrer"
                  drag={uniquePhotos.length > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, { offset }) => {
                    if (offset.x < -40) {
                      setCurrentSlide((prev) => (prev + 1) % uniquePhotos.length);
                    } else if (offset.x > 40) {
                      setCurrentSlide((prev) => (prev - 1 + uniquePhotos.length) % uniquePhotos.length);
                    }
                  }}
                />
              </AnimatePresence>

              {/* Navigation Arrows in Lightbox */}
              {uniquePhotos.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide((prev) => (prev - 1 + uniquePhotos.length) % uniquePhotos.length);
                    }}
                    className="absolute left-2 sm:left-6 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-brand-gold text-white hover:text-slate-950 transition-all backdrop-blur-sm shadow-xl z-20"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide((prev) => (prev + 1) % uniquePhotos.length);
                    }}
                    className="absolute right-2 sm:right-6 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-brand-gold text-white hover:text-slate-950 transition-all backdrop-blur-sm shadow-xl z-20"
                    aria-label="Next image"
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}
            </div>

            {/* Lightbox Footer & Thumbnails */}
            <div 
              className="z-10 max-w-[98vw] mx-auto w-full text-center flex flex-col items-center gap-2 pb-1"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-serif italic text-xs sm:text-sm text-slate-300">
                Official Press Photograph — Austrian-Mongolian Center Dispatch
              </p>

              {uniquePhotos.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
                  {uniquePhotos.map((photoUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`relative flex-shrink-0 w-12 h-9 sm:w-14 sm:h-10 rounded overflow-hidden border-2 transition-all ${
                        idx === currentSlide
                          ? "border-brand-gold ring-2 ring-brand-gold scale-105"
                          : "border-transparent opacity-50 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={photoUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
