import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Calendar, User, Tag, Share2 } from "lucide-react";
import {
  db,
  doc,
  onSnapshot,
  handleFirestoreError,
  OperationType,
} from "../firebase";
import { SoyomboSymbol } from "../components/MongolianDesign";

export default function GalleryDetails() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const unsubscribe = onSnapshot(
      doc(db, "gallery", id),
      (doc) => {
        if (doc.exists()) {
          setItem({ id: doc.id, ...doc.data() });
        } else {
          navigate("/gallery");
        }
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `gallery/${id}`);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-paper">
        <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!item) return null;

  const lang = i18n.language;
  const dTitle =
    lang === "mn"
      ? item.titleMn || item.title
      : lang === "de"
        ? item.titleDe || item.title
        : item.titleEn || item.title;
  const dArtist =
    lang === "mn"
      ? item.artistMn || item.artist
      : lang === "de"
        ? item.artistDe || item.artist
        : item.artistEn || item.artist;
  const dDesc =
    lang === "mn"
      ? item.descriptionMn || item.description
      : lang === "de"
        ? item.descriptionDe || item.description
        : item.descriptionEn || item.description;
  const dCat =
    lang === "mn"
      ? item.categoryMn || item.category
      : lang === "de"
        ? item.categoryDe || item.category
        : item.categoryEn || item.category;

  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-20 px-6 relative overflow-hidden bg-brand-paper">
      {/* Background Graphic */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,17,40,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,17,40,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <Link
          to="/gallery"
          className="inline-flex items-center gap-2 text-brand-ink/50 hover:text-brand-gold transition-colors mb-8 md:mb-10 font-bold uppercase tracking-widest text-[10px] group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          {t("gallery.back")}
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          {/* Header */}
          <header className="mb-10 md:mb-12 text-center max-w-4xl mx-auto flex flex-col items-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#b82736] bg-[#b82736]/10 px-3 py-1 rounded-sm">
                {dCat || "Gallery"}
              </span>
              <div className="h-px w-6 bg-brand-ink/20" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-ink/50">
                {item.year || ""}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif leading-[1.1] mb-8 text-brand-ink px-4 tracking-tight drop-shadow-sm">
              {dTitle}
            </h1>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex flex-col text-center">
                <span className="text-sm font-bold text-brand-ink leading-tight">
                  {dArtist || "Anonymous Artist"}
                </span>
                <span className="text-[10px] text-brand-ink/50 uppercase tracking-widest font-bold">
                  Featured Artwork
                </span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="-mx-6 w-[calc(100%+3rem)] md:mx-0 md:w-full relative md:rounded-[4px] overflow-hidden shadow-lg mb-12 md:mb-20 bg-brand-ink/5 border-y md:border border-brand-ink/10 flex justify-center items-center py-10 md:py-20 lg:h-[70vh]">
            {/* Blurred background */}
            <div className="absolute inset-0 overflow-hidden select-none pointer-events-none">
              <img
                src={item.imageUrl}
                alt=""
                className="w-full h-full object-cover filter blur-2xl opacity-30 scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Foreground image */}
            <img
              src={item.imageUrl}
              alt={dTitle}
              className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl relative z-10"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_8fr_1fr] gap-12 lg:gap-8 max-w-[1100px] mx-auto w-full px-4 md:px-0">
            {/* Left Sidebar (Meta/Social) */}
            <aside className="hidden lg:flex flex-col gap-4 sticky top-32 h-fit items-center text-brand-ink/40 pt-2">
              <span
                className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/30 mb-2 rotate-180"
                style={{ writingMode: "vertical-rl" }}
              >
                Share Artwork
              </span>
              <div className="w-px h-12 bg-brand-ink/10 mx-auto mb-2" />
              <button
                onClick={() => {
                  const shareUrl =
                    "https://mongoliancenter.org" + window.location.pathname;
                  navigator
                    .share?.({
                      title: dTitle,
                      text: `Check out this artwork: ${dTitle} by ${dArtist}`,
                      url: shareUrl,
                    })
                    .catch(() => {
                      navigator.clipboard.writeText(shareUrl);
                      alert("Link copied to clipboard!");
                    });
                }}
                className="w-10 h-10 rounded-full border border-brand-ink/10 flex items-center justify-center hover:bg-brand-ink hover:text-white transition-colors"
                aria-label="Share"
              >
                <Share2 size={16} />
              </button>
            </aside>

            {/* Content */}
            <div className="prose prose-lg md:prose-xl w-full max-w-2xl mx-auto text-brand-ink/90 font-light leading-[1.8] prose-p:mb-8 prose-strong:font-medium prose-strong:text-brand-ink">
              {/* Context Action */}
              <div className="flex justify-center mb-16">
                <Link
                  to="/contact"
                  className="flex items-center gap-3 px-8 py-4 bg-brand-ink text-white rounded-sm text-xs uppercase tracking-widest font-bold hover:bg-brand-gold transition-all shadow-xl shadow-brand-ink/20"
                >
                  Inquire About Piece
                </Link>
              </div>

              {/* Description styling */}
              {dDesc ? (
                (() => {
                  const paragraphs = dDesc.split(/\r?\n\s*\r?\n/).map((p: string) => p.trim()).filter(Boolean);
                  return paragraphs.map((text: string, pIdx: number) => {
                    return (
                      <p
                        key={pIdx}
                        className="mb-8 font-sans text-lg md:text-xl leading-[1.8] text-brand-ink/90 whitespace-pre-line"
                      >
                        {text}
                      </p>
                    );
                  });
                })()
              ) : (
                <p className="text-center italic text-brand-ink/50 mt-12 mb-12">
                  No detailed description provided for this artwork.
                </p>
              )}
            </div>

            <aside className="hidden lg:block"></aside>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
