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
    rejectUnauthorized: false,
  }
});

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

app.post("/api/newsletter/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    await notifyAdmin(
      "New Newsletter Subscriber",
      `<p>A new user has subscribed to the newsletter!</p>
       <p><strong>Email:</strong> ${email}</p>`
    );
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
  return firebaseConfig;
};

// Dynamic SSR routes for Vercel
app.get(['/events/:id', '/news/:id', '/diorama'], async (req, res, next) => {
  try {
    let html = "";
    const htmlPaths = [
      path.join(process.cwd(), 'dist', 'index.html'),
      path.join(process.cwd(), 'index.html')
    ];
    for (const p of htmlPaths) {
      try {
        if (fs.existsSync(p)) {
          html = fs.readFileSync(p, 'utf-8');
          break;
        }
      } catch (e) {}
    }

    if (!html) {
      console.error("DEBUG: No index.html found at absolute paths", htmlPaths);
      return res.status(500).send("index.html not found");
    }

    const config = getFirebaseConfig();
    if (!config) {
      console.warn("DEBUG: Firebase config not found. Falling back to default index.html");
      return res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    }

    const isEvent = req.path.startsWith('/events/');
    const isNews = req.path.startsWith('/news/');
    const isDiorama = req.path.startsWith('/diorama');
    
    let title = "";
    let desc = "";
    let image = "";

    const databaseId = config.firestoreDatabaseId || "(default)";

    if (isEvent) {
      const docId = req.params.id;
      const response = await fetch(`https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/${databaseId}/documents/events/${docId}`);
      if (response.ok) {
        const data = await response.json();
        const fields = data.fields;
        if (fields) {
          title = fields.title?.stringValue || "";
          desc = fields.description?.stringValue || "";
          image = fields.imageUrl?.stringValue || "";
        }
      }
    } else if (isNews) {
      const docId = req.params.id;
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
            title = fields.title?.stringValue || "";
            desc = fields.excerpt?.stringValue || "";
            image = fields.imageUrl?.stringValue || fields.image?.stringValue || "";
          }
        }
      }
    } else if (isDiorama) {
       title = "Mongolian Center - Gobi Desert Runner";
       desc = "Play our interactive Gobi Desert infinite runner game and compete for the highest score on the leaderboard!";
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

    const fullUrl = `https://mongoliancenter.org${req.originalUrl}`;
    html = html.replace(/<meta\s+(?:property|name)="og:url"\s+content="[^"]*"[^>]*>/g, `<meta property="og:url" content="${fullUrl}" />`);
    html = html.replace(/<meta\s+(?:property|name)="twitter:url"\s+content="[^"]*"[^>]*>/g, `<meta name="twitter:url" content="${fullUrl}" />`);

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
  } catch (e) {
    console.error("SSR metadata error:", e);
    next();
  }
});

export default app;
