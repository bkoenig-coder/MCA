import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

dotenv.config();

let stripe: Stripe | null = null;

function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY environment variable is missing.");
    }
    if (key.startsWith('pk_')) {
      throw new Error("STRIPE_SECRET_KEY appears to be a Publishable Key instead of a Secret Key.");
    }
    stripe = new Stripe(key);
  }
  return stripe;
}

const app = express();

app.set('trust proxy', 1);

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    trustProxy: false,
    xForwardedForHeader: false,
  },
});

app.use(express.json({ limit: '10kb' }));
app.use("/api/", apiLimiter);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === 'production',
  }
});

/**
 * Adds a subscriber to MailerLite (https://developers.mailerlite.com). It needs two settings:
 * MAILERLITE_API_KEY (required) and MAILERLITE_GROUP_ID (optional, the list people join).
 * Switch on "double opt-in" in the MailerLite account so every address is confirmed by email.
 */
async function addToMailerLite(email: string): Promise<"added" | "not-configured"> {
  const key = process.env.MAILERLITE_API_KEY;
  if (!key) return "not-configured";
  const body: Record<string, unknown> = { email };
  if (process.env.MAILERLITE_GROUP_ID) body.groups = [process.env.MAILERLITE_GROUP_ID];
  const r = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const detail = await r.text().catch(() => "");
    throw new Error(`MailerLite ${r.status}: ${detail.slice(0, 200)}`);
  }
  return "added";
}

const looksLikeEmail = (v: unknown): v is string => typeof v === "string" && v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

async function notifyAdmin(subject: string, htmlContent: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("No SMTP credentials set, skipping email notification.");
    return;
  }
  try {
    await transporter.sendMail({
      from: `"Website Notification" <${process.env.SMTP_USER}>`,
      to: "info@mongoliancenter.org",
      subject: subject,
      html: htmlContent
    });
    console.log(`Admin notification sent successfully: ${subject}`);
  } catch (e) {
    console.error("Error sending admin notification:", e);
  }
}

app.post("/api/ai/chat", async (req, res) => {
  const { message, language = 'en' } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: "Valid message string is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.json({
      reply: "The Mongolian Center in Vienna is dedicated to preserving and celebrating Mongolian heritage, language, and culture in Austria. Explore our Events, 3D Diorama, or Contact page for more information!"
    });
  }

  try {
    const systemInstruction = `You are the friendly, knowledgeable AI Assistant for the Mongolian Center Austria (Вена дахь Монгол Төв) located in Vienna, Austria.
Your role is to assist visitors with information about Mongolian culture, language courses, cultural events, membership options (Student is free, Professional is €80/year, Institutional is €250/year), traditional arts (Ger, Morin Khuur, Shagai, Naadam), and getting involved with our community in Austria.
Keep responses concise, polite, helpful, and respond in the language the user asks in (or current site language: ${language}).`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: message }]
          }
        ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        }
      })
    });

    if (!response.ok) {
      return res.json({
        reply: "The Mongolian Center in Vienna warmly welcomes you! For specific inquiries, you can reach our team directly at info@mongoliancenter.org or visit our Contact page."
      });
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "How else can I assist you with the Mongolian Center Austria today?";
    res.json({ reply });
  } catch (err: any) {
    console.error("AI chat endpoint error:", err);
    res.json({
      reply: "Welcome to the Mongolian Center Austria! Feel free to explore our Events, Cultural Heritage, or Membership pages."
    });
  }
});

app.post("/api/newsletter/subscribe", async (req, res) => {
  const { email } = req.body || {};
  if (!looksLikeEmail(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  try {
    // 1. the newsletter list (MailerLite sends the confirmation email)
    let listed: "added" | "not-configured" = "not-configured";
    try {
      listed = await addToMailerLite(email.trim().toLowerCase());
    } catch (e) {
      console.error("MailerLite error:", e);
      return res.status(502).json({ error: "We could not save your subscription right now. Please try again later." });
    }

    // 2. a short note to the team (never blocks the signup)
    notifyAdmin(
      "New Newsletter Subscriber",
      `<p>A new user has subscribed to the newsletter${listed === "added" ? " (added to MailerLite)" : ""}.</p>
       <p><strong>Email:</strong> ${email.replace(/[<>&]/g, "")}</p>`
    ).catch((e: unknown) => console.error("Admin notification failed:", e));

    res.status(201).json({ message: "Successfully subscribed!" });
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

app.post("/api/contact", async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;
  await notifyAdmin(
    `New Website Contact: ${subject}`,
    `<h2>New Contact Form Submission</h2>
     <p><strong>Name:</strong> ${firstName} ${lastName || ''}</p>
     <p><strong>Email:</strong> ${email}</p>
     <p><strong>Subject:</strong> ${subject}</p>
     <p><strong>Message:</strong></p>
     <p>${message.replace(/\n/g, '<br/>')}</p>`
  );
  res.status(200).json({ message: "Message received! We will get back to you soon." });
});

app.post("/api/create-donation-session", async (req, res) => {
  try {
    const { amount, userId, userEmail, message } = req.body;
    if (!amount) return res.status(400).json({ error: "Missing required fields: amount" });

    const baseUrl = process.env.APP_URL || req.headers.origin;
    let stripeClient;
    try {
      stripeClient = getStripe();
    } catch (e) {
      console.warn("Stripe missing. Mocking...", e);
      return res.status(200).json({ url: `${baseUrl}/impact?success=true&donation=true` });
    }

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price_data: { currency: "eur", product_data: { name: "Donation to Mongolian Cultural Association", description: "Your support helps us preserve and share Mongolian heritage." }, unit_amount: amount }, quantity: 1 }],
      mode: "payment",
      success_url: `${baseUrl}/impact?success=true&donation=true`,
      cancel_url: `${baseUrl}/impact?cancelled=true`,
      customer_email: userEmail,
      metadata: { type: "donation", userId, message: message || "" },
    });
    res.json({ id: session.id, url: session.url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { eventId, eventTitle, price, userId, userEmail } = req.body;
    if (!eventId || !price || !userId) return res.status(400).json({ error: "Missing fields" });

    const baseUrl = process.env.APP_URL || req.headers.origin;
    let stripeClient;
    try {
      stripeClient = getStripe();
    } catch (e) {
      console.warn("Stripe missing. Mocking...", e);
      return res.status(200).json({ url: `${baseUrl}/events?success=true&event_id=${eventId}` });
    }

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price_data: { currency: "eur", product_data: { name: eventTitle, description: `Ticket for ${eventTitle}` }, unit_amount: price }, quantity: 1 }],
      mode: "payment",
      success_url: `${baseUrl}/events?success=true&event_id=${eventId}`,
      cancel_url: `${baseUrl}/events?cancelled=true`,
      customer_email: userEmail,
      metadata: { eventId, userId },
    });
    res.json({ id: session.id, url: session.url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const getFirebaseConfig = () => {
  let firebaseConfig: any = null;
  const paths = [
    path.join(process.cwd(), 'firebase-applet-config.json'),
    path.join(process.cwd(), 'api', 'firebase-applet-config.json')
  ];
  for (const p of paths) {
    try {
      if (fs.existsSync(p)) {
        firebaseConfig = JSON.parse(fs.readFileSync(p, 'utf-8'));
        break;
      }
    } catch(e) {}
  }
  if (!firebaseConfig && process.env.FIREBASE_PROJECT_ID) {
    firebaseConfig = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      firestoreDatabaseId: process.env.FIREBASE_DATABASE_ID || "(default)"
    };
  }
  return firebaseConfig;
};

// ---------- Link previews (Facebook, WhatsApp, Telegram, LinkedIn ...) ----------
// Social crawlers do not run JavaScript, so for a news / event / gallery link we put the
// item's own title, summary and cover photo into the page's share tags.
const SITE_URL = "https://mongoliancenter.org";
const SB_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://jfmpjkptjfjolnbuahiq.supabase.co";
const SB_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "sb_publishable_vIKfeLyEYMX7Svm5eto-cg_9P3jlUaK";
const SHARE_TABLES: Record<string, { table: string; bySlug: boolean; text: string[] }> = {
  news: { table: "posts", bySlug: true, text: ["content_mn", "content", "content_en", "content_de"] },
  events: { table: "events", bySlug: false, text: ["description_mn", "description", "description_en", "description_de"] },
  gallery: { table: "gallery", bySlug: false, text: ["description_mn", "description", "description_en", "description_de"] },
};

async function sbRow(table: string, column: string, value: string): Promise<any | null> {
  const url = `${SB_URL}/rest/v1/${table}?${column}=eq.${encodeURIComponent(value)}&select=*&limit=1`;
  const r = await fetch(url, { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } });
  if (!r.ok) return null;
  const rows = await r.json();
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

async function findShareRow(section: string, key: string) {
  const cfg = SHARE_TABLES[section];
  if (!cfg) return null;
  let row = cfg.bySlug ? await sbRow(cfg.table, "slug", key) : null;
  if (!row) row = await sbRow(cfg.table, "id", key);
  return row ? { cfg, row } : null;
}

const escAttr = (v: string) => v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const plainText = (v: string) =>
  v.replace(/<[^>]*>/g, " ").replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[#*_`>~]/g, "").replace(/\s+/g, " ").trim();

// Cover photos are stored inside the database as data: URLs; crawlers need a real image address.
app.get("/api/og/:section/:key.jpg", async (req, res) => {
  try {
    const found = await findShareRow(req.params.section, req.params.key);
    const src: string = found?.row?.image_url || "";
    const m = /^data:(image\/[a-z+.-]+);base64,(.*)$/s.exec(src);
    res.set({ "Cross-Origin-Resource-Policy": "cross-origin", "Cache-Control": "public, max-age=3600, s-maxage=86400" });
    if (m) return res.status(200).type(m[1]).send(Buffer.from(m[2], "base64"));
    if (/^https?:\/\//.test(src)) return res.redirect(302, src);
    return res.redirect(302, `${SITE_URL}/og-image.png?v=2`);
  } catch {
    return res.redirect(302, `${SITE_URL}/og-image.png?v=2`);
  }
});

// Share texts for the Steppe Runner game (a shared score link looks like /heritage?score=1234&lang=de)
const GAME_TEXT: Record<string, { title: string; titleScore: string; desc: string }> = {
  en: {
    title: "Steppe Runner | Mongolian Center in Austria",
    titleScore: "I scored {n} points in Steppe Runner! Can you beat me?",
    desc: "Ride across the golden Mongolian steppe, collect treasures and jump the obstacles. Play free at the Mongolian Center in Austria.",
  },
  de: {
    title: "Steppen-Läufer | Mongolisches Zentrum in Österreich",
    titleScore: "Ich habe {n} Punkte im Steppen-Läufer erreicht! Schaffst du mehr?",
    desc: "Reite über die goldene mongolische Steppe, sammle Schätze und springe über Hindernisse. Kostenlos spielen beim Mongolischen Zentrum in Österreich.",
  },
  mn: {
    title: "Талын Гүйгч | Австри дахь Монголын Төв",
    titleScore: "Би Талын Гүйгч тоглоомд {n} оноо авлаа! Та миний оноог давах уу?",
    desc: "Алтан монгол тал нутгаар давхиж, эрдэнэ цуглуулж, саад бэрхшээлийг үсэрч давж үзээрэй. Австри дахь Монголын Төвийн вэбсайтад үнэгүй тоглоорой.",
  },
  tr: {
    title: "Bozkır Koşucusu | Avusturya Moğol Merkezi",
    titleScore: "Bozkır Koşucusu’nda {n} puan yaptım! Sen geçebilir misin?",
    desc: "Altın Moğol bozkırında dörtnala git, hazineleri topla ve engellerin üzerinden atla. Avusturya Moğol Merkezi’nde ücretsiz oyna.",
  },
};

app.get("*", async (req, res, next) => {
  try {
    const rawGamePath = String((req.query.ssrPath as string) || req.path).replace(/\/+$/, "") || "/";
    const isGamePage = rawGamePath === "/game";
    const hasScore = req.query.score !== undefined;
    // /game always gets the game preview; older /heritage?score=... links keep working
    if (!isGamePage && !(rawGamePath === "/heritage" && (hasScore || req.query.game !== undefined))) return next();
    const lang = String(req.query.lang || "").slice(0, 2).toLowerCase();
    const tx = GAME_TEXT[lang] || GAME_TEXT.en;
    const n = parseInt(String(req.query.score), 10);
    const title = hasScore && n > 0 ? tx.titleScore.replace("{n}", String(Math.min(n, 1000000))) : tx.title;
    const url = `${SITE_URL}/game` + (hasScore && n > 0 ? `?score=${n}${lang ? `&lang=${lang}` : ""}` : "");
    const image = `${SITE_URL}/og-game.jpg`;

    let html = "";
    for (const f of [path.join(process.cwd(), "dist", "index.html"), path.join(process.cwd(), "index.html")]) {
      if (fs.existsSync(f)) { html = fs.readFileSync(f, "utf-8"); break; }
    }
    if (!html) html = await (await fetch(SITE_URL)).text();

    const setTag = (attr: "property" | "name", name: string, value: string) => {
      const re = new RegExp(`<meta\\s+${attr}="${name}"\\s+content="[^"]*"[^>]*>`, "g");
      const tag = `<meta ${attr}="${name}" content="${escAttr(value)}" />`;
      html = re.test(html) ? html.replace(re, () => tag) : html.replace("</head>", () => `${tag}
</head>`);
    };
    html = html.replace(/<title>.*?<\/title>/, () => `<title>${escAttr(title)}</title>`);
    html = html.replace(/<meta\s+property="og:image:(width|height|type)"[^>]*>\s*/g, "");
    setTag("property", "og:title", title);
    setTag("name", "twitter:title", title);
    setTag("name", "description", tx.desc);
    setTag("property", "og:description", tx.desc);
    setTag("name", "twitter:description", tx.desc);
    setTag("property", "og:image", image);
    setTag("name", "twitter:image", image);
    setTag("property", "og:image:width", "1200");
    setTag("property", "og:image:height", "630");
    setTag("property", "og:image:alt", "Steppe Runner");
    setTag("property", "og:url", url);
    setTag("name", "twitter:url", url);
    res.status(200).set({ "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" }).end(html);
  } catch (e) {
    console.error("Game share preview error:", e);
    next();
  }
});

app.get("*", async (req, res, next) => {
  try {
    const rawPath = (req.query.ssrPath as string) || req.path;
    const parts = rawPath.replace(/\/+$/, "").split("/").filter(Boolean);
    if (parts.length < 2 || !SHARE_TABLES[parts[0]]) return next();
    const section = parts[0];
    const key = decodeURIComponent(parts.slice(1).join("/"));
    const found = await findShareRow(section, key);
    if (!found) return next();
    const { cfg, row } = found;

    const title = plainText(String(row.title_mn || row.title || row.title_en || row.title_de || ""));
    let desc = "";
    for (const f of cfg.text) {
      if (row[f]) { desc = plainText(String(row[f])); break; }
    }
    if (desc.length > 200) desc = desc.substring(0, 197) + "...";
    const img: string = row.image_url || "";
    const image = /^https?:\/\//.test(img)
      ? img
      : img
        ? `${SITE_URL}/api/og/${section}/${encodeURIComponent(row.slug && cfg.bySlug ? row.slug : row.id)}.jpg`
        : `${SITE_URL}/og-image.png?v=2`;
    const url = `${SITE_URL}/${section}/${parts.slice(1).join("/")}`;

    let html = "";
    for (const f of [path.join(process.cwd(), "dist", "index.html"), path.join(process.cwd(), "index.html")]) {
      if (fs.existsSync(f)) { html = fs.readFileSync(f, "utf-8"); break; }
    }
    if (!html) html = await (await fetch(SITE_URL)).text();

    const setTag = (attr: "property" | "name", name: string, value: string) => {
      const re = new RegExp(`<meta\\s+${attr}="${name}"\\s+content="[^"]*"[^>]*>`, "g");
      const tag = `<meta ${attr}="${name}" content="${escAttr(value)}" />`;
      html = re.test(html) ? html.replace(re, () => tag) : html.replace("</head>", () => `${tag}\n</head>`);
    };
    if (title) {
      html = html.replace(/<title>.*?<\/title>/, () => `<title>${escAttr(title)}</title>`);
      setTag("property", "og:title", title);
      setTag("name", "twitter:title", title);
    }
    if (desc) {
      setTag("name", "description", desc);
      setTag("property", "og:description", desc);
      setTag("name", "twitter:description", desc);
    }
    setTag("property", "og:image", image);
    setTag("name", "twitter:image", image);
    setTag("property", "og:image:alt", title);
    setTag("property", "og:type", "article");
    setTag("property", "og:url", url);
    setTag("name", "twitter:url", url);
    // image size is unknown for uploaded photos; drop the fixed logo size so it is not misreported
    html = html.replace(/<meta\s+property="og:image:(width|height|type)"[^>]*>\s*/g, "");

    res.status(200).set({ "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" }).end(html);
  } catch (e) {
    console.error("Share preview error:", e);
    next();
  }
});

// Dynamic SSR routes for Vercel
app.get('*', async (req, res, next) => {
  try {
    const rawPath = (req.query.ssrPath as string) || req.path;
    // Strip trailing slashes, but keep single '/'
    const checkPath = rawPath.length > 1 ? rawPath.replace(/\/+$/, '') : rawPath;

    const isEvent = checkPath === '/events' || checkPath.startsWith('/events/');
    const isNews = checkPath === '/news' || checkPath.startsWith('/news/');
    const isGallery = checkPath === '/gallery' || checkPath.startsWith('/gallery/');
    const isDiorama = checkPath === '/diorama' || checkPath.startsWith('/diorama/');
    const hasScore = !!req.query.score;
    
    console.log("DEBUG SSR:", { path: req.path, query: req.query, checkPath, isNews, isEvent, isGallery, isDiorama, hasScore });

    let html = "";
    
    // Try reading local bundled html files first
    const distHtmlPath = path.join(process.cwd(), 'dist', 'index.html');
    const rootHtmlPath = path.join(process.cwd(), 'index.html');
    if (fs.existsSync(distHtmlPath)) {
      try {
        html = fs.readFileSync(distHtmlPath, 'utf-8');
      } catch (e) {}
    } else if (fs.existsSync(rootHtmlPath)) {
      try {
        html = fs.readFileSync(rootHtmlPath, 'utf-8');
      } catch (e) {}
    }

    // Fetch the base HTML from the live production frontend, or localhost in dev if not available locally
    if (!html) {
      try {
        const baseUrl = process.env.NODE_ENV === 'production' ? 'https://mongoliancenter.org' : `http://localhost:${process.env.PORT || 3000}`;
        const response = await fetch(baseUrl);
        if (response.ok) {
          html = await response.text();
        }
      } catch (e) {
        console.error("Failed to fetch base HTML:", e);
      }
    }

    if (!html) {
      return res.status(200).set({ 'Content-Type': 'text/html' }).end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Монгол Төв Вена | Mongolian Center Austria</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`);
    }

    const config = getFirebaseConfig();
    if (!config || (!isEvent && !isNews && !isGallery && !isDiorama && !hasScore)) {
      return res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    }
    
    let title = "";
    let desc = "";
    let image = "";

    const databaseId = config.firestoreDatabaseId || "(default)";

    if (isEvent) {
      const parts = checkPath.split('/');
      const docId = parts.length > 2 ? parts.slice(2).join('/') : "";
      if (!docId) {
        title = "Арга хэмжээ | Вена дахь Монгол Төв";
        desc = "Вена хот дахь Монгол Төвөөс зохион байгуулж буй соёлын болон олон нийтийн арга хэмжээнүүдтэй танилцаарай.";
      } else {
        const response = await fetch(`https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/${databaseId}/documents/events/${docId}`);
        if (response.ok) {
          const data = await response.json();
          const fields = data.fields;
          if (fields) {
            title = fields.titleMn?.stringValue || fields.title?.stringValue || fields.titleEn?.stringValue || "";
            desc = fields.descriptionMn?.stringValue || fields.description?.stringValue || fields.descriptionEn?.stringValue || "";
            image = fields.imageUrl?.stringValue || "";
          }
        }
      }
    } else if (isNews) {
      const parts = checkPath.split('/');
      const docId = parts.length > 2 ? parts.slice(2).join('/') : "";
      
      if (!docId) {
        // Just the /news section
        title = "Мэдээ, мэдээлэл | Вена дахь Монгол Төв";
        desc = "Вена хот дахь Монгол Төвийн сүүлийн үеийн мэдээ, мэдэгдэл болон соёлын арга хэмжээнүүдийн мэдээллийг цаг алдалгүй хүлээн аваарай.";
      } else {
        // First try by slug
        const queryBody = {
          structuredQuery: {
            from: [{ collectionId: "posts" }],
            where: {
              fieldFilter: {
                field: { fieldPath: "slug" },
                op: "EQUAL",
                value: { stringValue: docId }
              }
            },
            limit: 1
          }
        };
        
        let found = false;
        try {
          const response = await fetch(`https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/${databaseId}/documents:runQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(queryBody)
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0 && data[0].document) {
              const fields = data[0].document.fields;
              if (fields) {
                title = fields.titleMn?.stringValue || fields.title?.stringValue || fields.titleEn?.stringValue || "";
                desc = fields.contentMn?.stringValue || fields.content?.stringValue || fields.excerptMn?.stringValue || fields.excerpt?.stringValue || fields.contentEn?.stringValue || fields.excerptEn?.stringValue || "";
                image = fields.imageUrl?.stringValue || fields.image?.stringValue || "";
                
                // Truncate desc if too long
                if (desc.length > 200) desc = desc.substring(0, 197) + '...';
                found = true;
              }
            }
          }
        } catch(e) {}
        
        if (!found) {
          // Fallback to fetch by document ID
          try {
            const fallbackResponse = await fetch(`https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/${databaseId}/documents/posts/${docId}`);
            if (fallbackResponse.ok) {
              const fallbackData = await fallbackResponse.json();
              const fields = fallbackData.fields;
              if (fields) {
                title = fields.titleMn?.stringValue || fields.title?.stringValue || fields.titleEn?.stringValue || "";
                desc = fields.contentMn?.stringValue || fields.content?.stringValue || fields.excerptMn?.stringValue || fields.excerpt?.stringValue || fields.contentEn?.stringValue || fields.excerptEn?.stringValue || "";
                image = fields.imageUrl?.stringValue || "";
                
                if (desc.length > 200) desc = desc.substring(0, 197) + '...';
                found = true;
              }
            }
          } catch(e) {}
        }
        
        if (!found) {
           title = "Мэдээ, мэдээлэл | Вена дахь Монгол Төв";
           desc = "Вена хот дахь Монгол Төвийн сүүлийн үеийн мэдээ, мэдэгдэл болон соёлын арга хэмжээнүүдийн мэдээллийг цаг алдалгүй хүлээн аваарай.";
        }
      }
    } else if (isGallery) {
      const parts = checkPath.split('/');
      const docId = parts.length > 2 ? parts.slice(2).join('/') : "";
      
      if (!docId) {
        title = "Виртуал галлерей | Вена дахь Монгол Төв";
        desc = "Монгол уран бүтээлчдийн уран зураг, соёлын өвийг харуулсан виртуал галлерейтай танилцана уу.";
      } else {
        let foundGallery = false;
        try {
          const fallbackResponse = await fetch(`https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/${databaseId}/documents/gallery/${docId}`);
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            const fields = fallbackData.fields;
            if (fields) {
              title = fields.titleMn?.stringValue || fields.titleEn?.stringValue || "Gallery Artwork";
              desc = fields.descriptionMn?.stringValue || fields.descriptionEn?.stringValue || "";
              image = fields.imageUrl?.stringValue || "";
              
              if (desc.length > 200) desc = desc.substring(0, 197) + '...';
              foundGallery = true;
            }
          }
        } catch(e) {}
        
        if (!foundGallery) {
           title = "Виртуал галлерей | Вена дахь Монгол Төв";
           desc = "Манай дижитал галерейгаас сонирхох боломжтой гайхалтай уран бүтээл.";
        }
      }
    } else if (isDiorama || hasScore) {
       const score = req.query?.score;
       if (score) {
         title = `Би Монгол Төв - Талын Гүйгч тоглоомонд ${score} оноо авлаа!`;
         desc = "Та миний оноог даваарай! Саад бэрхшээлийг давж, Монгол өв соёлын ховор олдворуудыг цуглуулан, уудам тал нутгаар хязгааргүй аялаарай.";
       } else {
         title = "Монгол Төв - Талын Гүйгч тоглоом";
         desc = "Монголын соёл, уламжлалыг харуулсан гүйгч тоглоомыг тоглож, олдвор цуглуулж, өндөр онооны тэргүүлэгчдийн самбарт өрсөлдөөрэй!";
       }
       image = "https://images.unsplash.com/photo-1542642596-f3310061e888?q=80&w=1170&auto=format&fit=crop";
    }

    if (title) {
      html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
      html = html.replace(/<meta\s+(?:property|name)="og:title"\s+content="[^"]*"[^>]*>/g, `<meta property="og:title" content="${title}" />`);
      html = html.replace(/<meta\s+(?:property|name)="twitter:title"\s+content="[^"]*"[^>]*>/g, `<meta name="twitter:title" content="${title}" />`);
    }
    if (desc) {
      html = html.replace(/<meta\s+(?:property|name)="og:description"\s+content="[^"]*"[^>]*>/g, `<meta property="og:description" content="${desc}" />`);
      html = html.replace(/<meta\s+(?:property|name)="twitter:description"\s+content="[^"]*"[^>]*>/g, `<meta name="twitter:description" content="${desc}" />`);
    }
    if (image) {
      html = html.replace(/<meta\s+(?:property|name)="og:image"\s+content="[^"]*"[^>]*>/g, `<meta property="og:image" content="${image}" />`);
      html = html.replace(/<meta\s+(?:property|name)="twitter:image"\s+content="[^"]*"[^>]*>/g, `<meta name="twitter:image" content="${image}" />`);
    }

    let fullUrl = `https://mongoliancenter.org${checkPath}`;
    if (req.query?.score) {
      fullUrl += `?score=${req.query.score}`;
    }
    html = html.replace(/<meta\s+(?:property|name)="og:url"\s+content="[^"]*"[^>]*>/g, `<meta property="og:url" content="${fullUrl}" />`);
    html = html.replace(/<meta\s+(?:property|name)="twitter:url"\s+content="[^"]*"[^>]*>/g, `<meta name="twitter:url" content="${fullUrl}" />`);

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
  } catch (e) {
    console.error("SSR metadata error:", e);
    // Even on error, return a fallback HTML page so client React Router can take over
    res.status(200).set({ 'Content-Type': 'text/html' }).end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Монгол Төв Вена | Mongolian Center Austria</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`);
  }
});

export default app;
