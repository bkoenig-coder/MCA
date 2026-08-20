import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import Stripe from "stripe";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";

dotenv.config();

let stripe: Stripe | null = null;

function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY environment variable is missing. Please add it in the Secrets panel.");
    }
    if (key.startsWith('pk_')) {
      throw new Error("STRIPE_SECRET_KEY appears to be a Publishable Key (starts with 'pk_'). Please use your Secret Key (starts with 'sk_') instead.");
    }
    stripe = new Stripe(key);
  }
  return stripe;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set up Vite server in dev mode first to allow transformIndexHtml
  let vite: any = null;
  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
  }

  // Trust proxy for correct IP detection behind load balancers/proxies
  app.set('trust proxy', 1);

  // Security Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled to prevent conflicts with Vite dev server and inline scripts
    crossOriginEmbedderPolicy: false, // Disabled to allow external images/resources
  }));

  // Rate Limiting for API routes
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
    validate: {
      trustProxy: false,
      xForwardedForHeader: false,
    },
  });

  app.use(express.json({ limit: '10kb' })); // Limit body size to prevent payload too large attacks

  // Apply rate limiter to all API routes
  app.use("/api/", apiLimiter);

  // Setup Hostinger SMTP Transporter via Nodemailer
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // Using 587 standard which starts with STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production', // Enforce cert verification in production
    }
  });

  // Helper to send email notification to info@mongoliancenter.org
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

  // API routes
  app.post("/api/ai/chat", async (req, res) => {
    const { message, language = 'en' } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "Valid message string is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Graceful fallback response when API key is not configured in environment
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
        const errText = await response.text();
        console.error("Gemini API error:", errText);
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
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      // Send notification via Hostinger SMTP
      // This will send the notification email to info@mongoliancenter.org directly
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
    
    console.log("Contact form submission received:");
    console.log(`From: ${firstName} ${lastName} <${email}>`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);

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
    console.log("Received donation request:", req.body);
    try {
      const { amount, userId, userEmail, message, returnUrl } = req.body;
      
      if (!amount) {
        return res.status(400).json({ error: "Missing required fields: amount" });
      }

      const baseUrl = returnUrl || process.env.APP_URL || req.headers.origin || `http://localhost:${PORT}`;

      let stripeClient;
      try {
        stripeClient = getStripe();
      } catch (e) {
        console.warn("Stripe is not configured. Mocking donation session...", e);
        return res.status(200).json({ url: `${baseUrl}/impact?success=true&donation=true` });
      }

      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: "Donation to Mongolian Cultural Association",
                description: "Your support helps us preserve and share Mongolian heritage.",
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${baseUrl}/impact?success=true&donation=true`,
        cancel_url: `${baseUrl}/impact?cancelled=true`,
        customer_email: userEmail,
        metadata: {
          type: "donation",
          userId,
          message: message || "",
        },
      });

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error("Stripe donation error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  app.post("/api/cancel-subscription", async (req, res) => {
    try {
      const { sessionId } = req.body;
      if (!sessionId) {
        return res.status(400).json({ error: "Missing session ID" });
      }

      let stripeClient;
      try {
        stripeClient = getStripe();
      } catch (e) {
        console.warn("Stripe is not configured. Mocking cancelation...");
        return res.status(200).json({ success: true });
      }

      const session = await stripeClient.checkout.sessions.retrieve(sessionId);
      if (session.subscription) {
        await stripeClient.subscriptions.update(session.subscription as string, {
          cancel_at_period_end: true,
        });
        res.json({ success: true });
      } else {
        res.status(400).json({ error: "No subscription found for this session." });
      }
    } catch (error: any) {
      console.error("Cancel subscription error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  app.post("/api/create-membership-subscription", async (req, res) => {
    console.log("Received membership subscription request:", req.body);
    try {
      const { tier, email, userId, firstName, lastName, returnUrl } = req.body;
      
      const baseUrl = returnUrl || process.env.APP_URL || req.headers.origin || `http://localhost:${PORT}`;

      if (tier === 'student') {
        // Free tier: immediately trigger success redirect without going through Stripe checkout
        return res.status(200).json({ url: `${baseUrl}/profile?success=true&membership=student` });
      }

      let price;
      let description;
      
      if (tier === 'professional') {
        price = 8000; // 80 EUR
        description = "Professional Membership";
      } else if (tier === 'institutional') {
        price = 25000; // 250 EUR
        description = "Institutional Partner";
      } else {
        return res.status(400).json({ error: "Invalid membership tier" });
      }

      let stripeClient;
      try {
        stripeClient = getStripe();
      } catch (e) {
        console.warn("Stripe is not configured. Mocking subscription checkout session...", e);
        return res.status(200).json({ url: `${baseUrl}/profile?success=true&membership=${tier}` });
      }

      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: description,
                description: `Annual ${description}`,
              },
              unit_amount: price,
              recurring: {
                interval: "year",
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${baseUrl}/profile?success=true&session_id={CHECKOUT_SESSION_ID}&membership=${tier}`,
        cancel_url: `${baseUrl}?cancelled=true`,
        ...(email ? { customer_email: email } : {}),
        metadata: {
          type: "membership",
          tier,
          userId: userId || "",
          firstName,
          lastName
        },
      });

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error("Stripe subscription error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  app.post("/api/create-checkout-session", async (req, res) => {
    console.log("Received checkout request:", req.body);
    try {
      const { eventId, eventTitle, price, userId, userEmail, returnUrl } = req.body;
      
      if (!eventId || !price || !userId) {
        return res.status(400).json({ error: "Missing required fields: eventId, price, or userId" });
      }

      // Use APP_URL from env, fallback to origin header if absolutely necessary for dev
      const baseUrl = returnUrl || process.env.APP_URL || req.headers.origin || `http://localhost:${PORT}`;
      console.log("Using base URL for Stripe redirect:", baseUrl);

      let stripeClient;
      try {
        stripeClient = getStripe();
      } catch (e) {
        console.warn("Stripe is not configured. Mocking event checkout session...", e);
        return res.status(200).json({ url: `${baseUrl}/events?success=true&event_id=${eventId}` });
      }

      console.log("Creating Stripe session for:", eventTitle);
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: eventTitle,
                description: `Ticket for ${eventTitle}`,
              },
              unit_amount: price,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${baseUrl}/events?success=true&event_id=${eventId}`,
        cancel_url: `${baseUrl}/events?cancelled=true`,
        customer_email: userEmail,
        metadata: {
          eventId,
          userId,
        },
      });

      console.log("Stripe session created successfully:", session.id);
      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error("Stripe route error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // Helpers to read index.html
  const readIndexHtml = async (req: express.Request) => {
    const isProd = process.env.NODE_ENV === "production";
    let template = "";
    if (isProd) {
      template = fs.readFileSync(path.join(process.cwd(), 'dist', 'index.html'), 'utf-8');
    } else {
      template = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(req.url, template);
    }
    return template;
  };

  const getFirebaseConfig = () => {
    let firebaseConfig: any = null;
    try {
      firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf-8'));
    } catch(e) {}
    if (!firebaseConfig && process.env.FIREBASE_PROJECT_ID) {
      firebaseConfig = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        firestoreDatabaseId: process.env.FIREBASE_DATABASE_ID || "(default)"
      };
    }
    return firebaseConfig;
  };

  // Dynamic SSR routes for social crawlers
  app.get(['/events', '/events/:id', '/news/:id', '/news', '/diorama', '/gallery', '/gallery/:id', '/'], async (req, res, next) => {
    try {
      const config = getFirebaseConfig();
      if (!config) return next();

      const isEvent = req.path.startsWith('/events');
      const isNews = req.path.startsWith('/news');
      const isGallery = req.path.startsWith('/gallery');
      const isDiorama = req.path.startsWith('/diorama');
      const hasScore = !!req.query.score;

      if (!isEvent && !isNews && !isGallery && !isDiorama && !hasScore) {
        return next();
      }
      
      let title = "";
      let desc = "";
      let image = "";

      const databaseId = config.firestoreDatabaseId || "(default)";

      if (isEvent) {
        const docId = req.params.id;
        // Fetch event by ID
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
      } else if (isNews) {
        const docId = req.params.id;
        
        if (!docId) {
          // Just the /news section
          title = "Мэдээ, мэдээлэл | Вена дахь Монгол Төв";
          desc = "Вена хот дахь Монгол Төвийн сүүлийн үеийн мэдээ, мэдэгдэл болон соёлын арга хэмжээнүүдийн мэдээллийг цаг алдалгүй хүлээн аваарай.";
        } else {
          // Fetch news/post by slug using runQuery
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
              // runQuery returns [{document: ...}, ...]
              if (data && data.length > 0 && data[0].document) {
                const fields = data[0].document.fields;
                if (fields) {
                  title = fields.titleMn?.stringValue || fields.title?.stringValue || fields.titleEn?.stringValue || "";
                  desc = fields.contentMn?.stringValue || fields.content?.stringValue || fields.excerptMn?.stringValue || fields.excerpt?.stringValue || fields.contentEn?.stringValue || fields.excerptEn?.stringValue || "";
                  image = fields.imageUrl?.stringValue || fields.image?.stringValue || "";
                  
                  if (desc.length > 200) desc = desc.substring(0, 197) + '...';
                  found = true;
                }
              }
            }
          } catch(e) {}
          
          if (!found) {
            // Fallback to fetch by ID
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
             desc = "Сүүлийн үеийн мэдээ, удирдамж, соёлын арга хэмжээнүүдтэй танилцаарай.";
          }
        }
      } else if (isGallery) {
        const docId = req.params.id;
        
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
                title = fields.titleMn?.stringValue || fields.titleEn?.stringValue || "Зургийн бүтээл";
                desc = fields.descriptionMn?.stringValue || fields.descriptionEn?.stringValue || "";
                image = fields.imageUrl?.stringValue || "";
                
                if (desc.length > 200) desc = desc.substring(0, 197) + '...';
                foundGallery = true;
              }
            }
          } catch(e) {}
          
          if (!foundGallery) {
             title = "Виртуал уран бүтээл | Вена дахь Монгол Төв";
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

      let html = await readIndexHtml(req);

      if (title) {
        // Update both standard title and OG tags
        html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
        html = html.replace(/<meta\s+(?:property|name)="title"\s+content="[^"]*"[^>]*>/g, `<meta name="title" content="${title}" />`);
        html = html.replace(/<meta\s+(?:property|name)="og:title"\s+content="[^"]*"[^>]*>/g, `<meta property="og:title" content="${title}" />`);
        html = html.replace(/<meta\s+(?:property|name)="twitter:title"\s+content="[^"]*"[^>]*>/g, `<meta name="twitter:title" content="${title}" />`);
      }
      if (desc) {
        html = html.replace(/<meta\s+(?:property|name)="description"\s+content="[^"]*"[^>]*>/g, `<meta property="description" content="${desc}" />`);
        html = html.replace(/<meta\s+(?:property|name)="og:description"\s+content="[^"]*"[^>]*>/g, `<meta property="og:description" content="${desc}" />`);
        html = html.replace(/<meta\s+(?:property|name)="twitter:description"\s+content="[^"]*"[^>]*>/g, `<meta name="twitter:description" content="${desc}" />`);
      }
      if (image) {
        html = html.replace(/<meta\s+(?:property|name)="og:image"\s+content="[^"]*"[^>]*>/g, `<meta property="og:image" content="${image}" />`);
        html = html.replace(/<meta\s+(?:property|name)="twitter:image"\s+content="[^"]*"[^>]*>/g, `<meta name="twitter:image" content="${image}" />`);
      }

      // Automatically replace og:url and twitter:url
      const fullUrl = `https://mongoliancenter.org${req.originalUrl}`;
      html = html.replace(/<meta\s+(?:property|name)="og:url"\s+content="[^"]*"[^>]*>/g, `<meta property="og:url" content="${fullUrl}" />`);
      html = html.replace(/<meta\s+(?:property|name)="twitter:url"\s+content="[^"]*"[^>]*>/g, `<meta name="twitter:url" content="${fullUrl}" />`);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      console.error("SSR metadata error:", e);
      next(); // fallback to normal SPA serving
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
