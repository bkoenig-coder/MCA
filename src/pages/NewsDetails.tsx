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

  const shareUrl = "https://mongoliancenter.org" + window.location.pathname;
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
    <div className="pt-24 md:pt-32 pb-16 md:pb-20 px-6 relative overflow-hidden bg-brand-paper">
      {/* Background Graphic */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,17,40,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,17,40,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] z-0 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-brand-ink/50 hover:text-brand-gold transition-colors mb-8 md:mb-10 font-bold uppercase tracking-widest text-[10px] group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />{" "}
          {t("news.details.back")}
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col"
        >
          {/* Header */}
          <header className="mb-10 md:mb-12 text-center max-w-4xl mx-auto flex flex-col items-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#b82736] bg-[#b82736]/10 px-3 py-1 rounded-sm">
                {t("news.update", "LATEST")}
              </span>
              <div className="h-px w-6 bg-brand-ink/20" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-ink/50">
                {post.createdAt
                  ?.toDate()
                  .toLocaleDateString(t("common.locale"), {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif leading-[1.1] mb-8 text-brand-ink px-4 tracking-tight drop-shadow-sm">
              {dTitle}
            </h1>

            <div className="flex items-center gap-4 mt-2">
              <div className="w-12 h-12 rounded-full border border-brand-ink/10 flex items-center justify-center p-1 bg-white shadow-sm overflow-hidden">
                <img
                  src={mcaLogo}
                  alt="MCA"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-brand-ink leading-tight">
                  MONGOLIAN CENTER
                </span>
                <span className="text-[10px] text-brand-ink/50 uppercase tracking-widest font-bold">
                  Official Press Release • 4 Min Read
                </span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="-mx-6 w-[calc(100%+3rem)] md:mx-0 md:w-full relative aspect-[4/3] md:aspect-[2.5/1] md:rounded-[4px] overflow-hidden shadow-lg mb-12 md:mb-20 bg-brand-ink/5 border-y md:border border-brand-ink/10">
            <img
              src={post.imageUrl}
              alt={dTitle}
              className="w-full h-full object-cover mix-blend-multiply"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/20 to-transparent mix-blend-overlay"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_8fr_1fr] gap-12 lg:gap-8 max-w-[1100px] mx-auto w-full px-4 md:px-0">
            {/* Left Sidebar (Meta/Social) */}
            <aside className="hidden lg:flex flex-col gap-4 sticky top-32 h-fit items-center text-brand-ink/40 pt-2">
              <span
                className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/30 mb-2 rotate-180"
                style={{ writingMode: "vertical-rl" }}
              >
                Share Article
              </span>
              <div className="w-px h-12 bg-brand-ink/10 mx-auto mb-2" />
              <button
                onClick={() => handleShare("facebook")}
                className="w-10 h-10 rounded-full border border-brand-ink/10 flex items-center justify-center hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors"
                aria-label="Share Facebook"
              >
                <Facebook size={16} />
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="w-10 h-10 rounded-full border border-brand-ink/10 flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-colors"
                aria-label="Share Twitter"
              >
                <Twitter size={16} />
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                className="w-10 h-10 rounded-full border border-brand-ink/10 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-colors"
                aria-label="Share LinkedIn"
              >
                <Linkedin size={16} />
              </button>
              <button
                onClick={handleCopyLink}
                className="w-10 h-10 rounded-full border border-brand-ink/10 flex items-center justify-center hover:bg-brand-ink hover:text-white hover:border-brand-ink transition-colors"
                aria-label="Copy Link"
              >
                {copied ? <Check size={16} /> : <LinkIcon size={16} />}
              </button>
            </aside>

            {/* Content */}
            <div className="prose prose-lg md:prose-xl w-full max-w-2xl mx-auto text-brand-ink/90 font-light leading-[1.8] prose-p:mb-8 prose-strong:font-medium prose-strong:text-brand-ink">
              {/* Mobile Meta/Social */}
              <div className="flex lg:hidden items-center justify-between border-y border-brand-ink/10 py-4 mb-10">
                <span className="text-[10px] uppercase tracking-widest font-bold text-brand-ink/50">
                  Share Article
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleShare("facebook")}
                    className="w-8 h-8 rounded-full border border-brand-ink/10 flex items-center justify-center text-brand-ink/50 hover:bg-[#1877F2] hover:text-white transition-colors"
                  >
                    <Facebook size={14} />
                  </button>
                  <button
                    onClick={() => handleShare("twitter")}
                    className="w-8 h-8 rounded-full border border-brand-ink/10 flex items-center justify-center text-brand-ink/50 hover:bg-[#1DA1F2] hover:text-white transition-colors"
                  >
                    <Twitter size={14} />
                  </button>
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="w-8 h-8 rounded-full border border-brand-ink/10 flex items-center justify-center text-brand-ink/50 hover:bg-[#0A66C2] hover:text-white transition-colors"
                  >
                    <Linkedin size={14} />
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="w-8 h-8 rounded-full border border-brand-ink/10 flex items-center justify-center text-brand-ink/50 hover:bg-brand-ink hover:text-white transition-colors"
                    aria-label="Copy Link"
                  >
                    {copied ? <Check size={14} /> : <LinkIcon size={14} />}
                  </button>
                </div>
              </div>

              {/* Split content by newlines to render paragraphs */}
              {dContent.split("\n").map((paragraph: string, idx: number) => {
                const text = paragraph.trim();
                if (!text) return null;

                // Extract potential quote
                if (
                  text.startsWith('"') &&
                  text.endsWith('"') &&
                  text.length > 10
                ) {
                  return (
                    <blockquote
                      key={idx}
                      className="text-2xl md:text-4xl font-serif text-brand-ink italic border-l-4 border-brand-gold pl-6 md:pl-8 py-2 my-12 md:my-16 bg-gradient-to-r from-brand-gold/5 to-transparent relative"
                    >
                      <span className="absolute -left-4 -top-6 text-7xl text-brand-gold/20 font-serif">
                        "
                      </span>
                      {text.replace(/(^"|"$)/g, "")}
                    </blockquote>
                  );
                }

                // Identify potential headings (short, no ending punctuation)
                const isHeading =
                  text.length > 3 &&
                  text.length < 80 &&
                  !/[.!?]$/.test(text) &&
                  text.trim().split(/\s+/).length <= 10;
                if (isHeading && idx > 0) {
                  return (
                    <h2
                      key={idx}
                      className="text-2xl md:text-3xl font-serif text-brand-ink mt-16 mb-8 tracking-tight"
                    >
                      {text}
                    </h2>
                  );
                }

                // First paragraph styling (Drop Cap)
                if (idx === 0) {
                  return (
                    <p
                      key={idx}
                      className="mb-10 font-serif sm:font-sans first-letter:text-7xl first-letter:md:text-8xl first-letter:font-serif first-letter:font-bold first-letter:text-brand-ink first-letter:float-left first-letter:mr-6 first-letter:mt-2 first-letter:leading-[0.8] text-xl sm:text-lg md:text-xl leading-[1.8]"
                    >
                      {text}
                    </p>
                  );
                }

                // Check for bold wrapping
                if (text.startsWith("**") && text.endsWith("**")) {
                  return (
                    <p key={idx} className="mb-8 font-medium text-brand-ink">
                      {text.replace(/\*\*/g, "")}
                    </p>
                  );
                }

                return (
                  <p
                    key={idx}
                    className="mb-8 text-brand-ink/80 text-[18px] md:text-[20px]"
                  >
                    {text}
                  </p>
                );
              })}
            </div>

            {/* Right spacer for grid alignment */}
            <div className="hidden lg:block"></div>
          </div>
        </motion.article>

        <div className="mt-16 md:mt-24 max-w-2xl mx-auto">
          <MongolianLine className="w-full text-brand-gold/30 h-8 md:h-12" />
        </div>
      </div>
    </div>
  );
}
