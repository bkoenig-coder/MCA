import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
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
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_PORT === '465' || process.env.SMTP_PORT === undefined, // 465 uses TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
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
      const { amount, userId, userEmail, message } = req.body;
      
      if (!amount || !userId) {
        return res.status(400).json({ error: "Missing required fields: amount or userId" });
      }

      const stripeClient = getStripe();
      const baseUrl = process.env.APP_URL || req.headers.origin || `http://localhost:${PORT}`;

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

  app.post("/api/create-checkout-session", async (req, res) => {
    console.log("Received checkout request:", req.body);
    try {
      const { eventId, eventTitle, price, userId, userEmail } = req.body;
      
      if (!eventId || !price || !userId) {
        return res.status(400).json({ error: "Missing required fields: eventId, price, or userId" });
      }

      const stripeClient = getStripe();
      
      // Use APP_URL from env, fallback to origin header if absolutely necessary for dev
      const baseUrl = process.env.APP_URL || req.headers.origin || `http://localhost:${PORT}`;
      console.log("Using base URL for Stripe redirect:", baseUrl);

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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
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
