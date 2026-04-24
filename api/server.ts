import express from "express";
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

export default app;
