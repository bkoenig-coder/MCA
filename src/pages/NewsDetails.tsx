import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
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
  }, [id]);

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

          {/* Featured Newspaper Photo */}
          {post.imageUrl && (
            <div className="border border-slate-300 p-2 bg-white shadow-sm mb-10">
              <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={post.imageUrl}
                  alt={dTitle}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="font-serif italic text-xs text-slate-600 pt-2 text-center border-t border-slate-200 mt-2">
                Official Press Photograph — Austrian-Mongolian Center Dispatch
              </p>
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

          {/* Dispatch Photo Gallery Grid (If multiple images attached) */}
          {Array.isArray(post?.galleryImages) && post.galleryImages.length > 0 && (
            <div className="mt-12 pt-8 border-t-2 border-slate-900">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-slate-800 font-sans">
                  OFFICIAL DISPATCH PHOTO GALLERY ({post.galleryImages.length} PHOTOS)
                </span>
                <span className="text-[9px] uppercase tracking-widest font-sans font-bold text-slate-400">
                  PRESS ARCHIVE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {post.galleryImages.map((imgUrl: string, gIdx: number) => (
                  <div key={gIdx} className="border border-slate-300 p-2 bg-white shadow-sm group hover:border-brand-gold transition-colors">
                    <div className="aspect-[4/3] overflow-hidden bg-slate-900">
                      <img 
                        src={imgUrl} 
                        alt={`Dispatch Photo ${gIdx + 1}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <p className="font-serif italic text-[11px] text-slate-600 pt-2 text-center border-t border-slate-200 mt-2">
                      Plate {gIdx + 1} — Dispatch Archive Photo
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Newspaper End Ornament */}
          <div className="mt-12 pt-6 border-t-2 border-slate-900 text-center flex flex-col items-center justify-center">
            <UlziiSymbol className="w-8 h-8 text-brand-gold/60 mb-2" />
            <span className="text-[9px] font-sans uppercase tracking-[0.3em] font-extrabold text-slate-500">
              — END OF OFFICIAL DISPATCH —
            </span>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
