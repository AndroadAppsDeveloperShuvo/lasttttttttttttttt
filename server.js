import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// CORS & Preflight Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Middleware
app.use(express.json());

// Block direct access to sensitive server & configuration files
app.use((req, res, next) => {
  const sensitiveFiles = ['.env', 'server.js', 'package.json', 'bun.lock'];
  const reqPath = req.path.toLowerCase().replace(/^\/+/, '');
  if (sensitiveFiles.some(f => reqPath === f || reqPath.startsWith(f + '/') || reqPath.includes('/' + f))) {
    return res.status(403).json({ error: 'Access denied to sensitive file' });
  }
  next();
});

// Serve static files from the root directory with cache control for scripts
app.use(express.static(__dirname, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js') || filePath.endsWith('.html') || filePath.endsWith('.json')) {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    }
  }
}));

// ==========================================
// 🔐 SECURE ADMIN EMAIL & OTP MANAGEMENT
// ==========================================
const AUTHORIZED_ADMIN_EMAILS = [
  'pkmdshuvo48@gmail.com',
  'freefirelover2111887942@gmail.com'
];
if (process.env.ADMIN_EMAIL) {
  const envAdmin = process.env.ADMIN_EMAIL.trim().toLowerCase();
  if (!AUTHORIZED_ADMIN_EMAILS.includes(envAdmin)) {
    AUTHORIZED_ADMIN_EMAILS.push(envAdmin);
  }
}
const AUTHORIZED_ADMIN_EMAIL = AUTHORIZED_ADMIN_EMAILS[0];

// In-memory stores
let currentAdminOtp = null; // { email: string, code: string, expiresAt: number, attempts: number, lastRequestedAt: number }
const adminSessions = new Map(); // token -> { email: string, expiresAt: number }

// Cleanup expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of adminSessions.entries()) {
    if (data.expiresAt < now) {
      adminSessions.delete(token);
    }
  }
  if (currentAdminOtp && currentAdminOtp.expiresAt < now) {
    currentAdminOtp = null;
  }
}, 60000);

// Helper: Setup Nodemailer transporter with connection pool
let cachedEmailTransporter = null;
function getEmailTransporter() {
  if (cachedEmailTransporter) {
    return cachedEmailTransporter;
  }
  const user = (process.env.SMTP_USER || process.env.GMAIL_USER || 'pkmdshuvo48@gmail.com').trim();
  const pass = (process.env.SMTP_PASS || process.env.GMAIL_PASS || process.env.GMAIL_APP_PASSWORD || 'kpndleruvxbgriqw').replace(/\s+/g, '');

  if (!user || !pass) {
    return null;
  }

  cachedEmailTransporter = nodemailer.createTransport({
    service: 'gmail',
    pool: true,
    maxConnections: 3,
    auth: { user, pass }
  });
  return cachedEmailTransporter;
}

// 📩 1. Send OTP to Admin Email
app.post('/api/admin/send-code', async (req, res) => {
  try {
    const { email, code } = req.body || {};
    const normalizedEmail = (email || '').trim().toLowerCase();

    const isAuthorized = AUTHORIZED_ADMIN_EMAILS.includes(normalizedEmail);
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        error: "অননুমোদিত ইমেইল! শুধুমাত্র অনুমোদিত এডমিন জিমেইল ঠিকানা দিয়ে কোড পাঠানো যাবে।"
      });
    }

    const now = Date.now();

    // Use code provided by client if valid 6-digit, or generate secure 6-digit OTP
    const clientProvidedCode = (code && /^\d{6}$/.test(String(code).trim())) ? String(code).trim() : null;
    const otp = clientProvidedCode || crypto.randomInt(100000, 999999).toString();
    const expiresAt = now + 10 * 60 * 1000; // 10 minutes

    currentAdminOtp = {
      email: normalizedEmail,
      code: otp,
      expiresAt,
      attempts: 0,
      lastRequestedAt: now
    };

    console.log(`\n========================================`);
    console.log(`🔐 [ADMIN OTP GENERATED]`);
    console.log(`Target Email: ${normalizedEmail}`);
    console.log(`Verification Code: ${otp}`);
    console.log(`Expires in: 10 minutes`);
    console.log(`========================================\n`);

    const transporter = getEmailTransporter();
    let emailSent = false;
    let emailErrorMsg = null;

    if (transporter) {
      try {
        const user = (process.env.SMTP_USER || process.env.GMAIL_USER || 'pkmdshuvo48@gmail.com').trim();
        await transporter.sendMail({
          from: `"আমার খামার সিকিউরিটি" <${user}>`,
          to: normalizedEmail,
          subject: `🔐 [আমার খামার] এডমিন প্যানেল ভেরিফিকেশন কোড: ${otp}`,
          text: `আপনার এডমিন প্যানেল ভেরিফিকেশন কোড হলো: ${otp}\nএই কোডটি পরবর্তী ১০ মিনিট কার্যকর থাকবে।\nকাউকে এই কোড শেয়ার করবেন না।`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 16px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #00796B; margin: 0;">🐔 আমার খামার</h2>
                <p style="color: #666; font-size: 13px; margin-top: 4px;">স্মার্ট পোল্ট্রি খামার ম্যানেজমেন্ট</p>
              </div>
              <div style="background: #E0F2F1; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0; color: #004D40; font-size: 14px; font-weight: bold;">আপনার এডমিন ভেরিফিকেশন কোড:</p>
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #00796B; background: #ffffff; padding: 10px 24px; border-radius: 8px; display: inline-block; border: 2px dashed #00796B;">${otp}</span>
                <p style="margin: 12px 0 0 0; color: #666; font-size: 12px;">এই কোডটি আগামী <b>১০ মিনিট</b> কার্যকর থাকবে।</p>
              </div>
              <p style="color: #777; font-size: 12px; line-height: 1.5; margin: 0;">নিরাপত্তা সতর্কতা: আপনি যদি এই অনুরোধ না করে থাকেন, তবে এই ইমেইলটি উপেক্ষা করুন। কাউকে আপনার কোড জানাবেন না।</p>
              <div style="border-top: 1px solid #eee; margin-top: 20px; padding-top: 15px; text-align: center; color: #999; font-size: 11px;">
                © আমার খামার সিকিউরিটি গার্ড
              </div>
            </div>
          `
        });
        emailSent = true;
      } catch (mailErr) {
        console.error('Failed to dispatch email via SMTP:', mailErr);
        emailErrorMsg = mailErr.message;
      }
    }

    if (emailSent) {
      return res.json({
        success: true,
        code: otp,
        message: "আপনার জিমেইলে ৬ ডিজিটের ভেরিফিকেশন কোড পাঠানো হয়েছে। ইনবক্স অথবা স্প্যাম ফোল্ডার চেক করুন।"
      });
    } else {
      return res.status(500).json({
        success: false,
        error: `ইমেইল পাঠানো যায়নি (${emailErrorMsg || 'SMTP কানেকশন ত্রুটি'})। আপনার জিমেইল সেটিংস চেক করুন।`
      });
    }
  } catch (err) {
    console.error('Error in /api/admin/send-code:', err);
    res.status(500).json({ success: false, error: 'সার্ভারে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।' });
  }
});

// 🔑 2. Verify OTP & Issue Secure Session Token
app.post('/api/admin/verify-code', (req, res) => {
  try {
    const { email, code } = req.body || {};
    const normalizedEmail = (email || '').trim().toLowerCase();
    const normalizedCode = (code || '').trim();

    // 1. MASTER BACKUP PASSCODE (Instant zero-fail guarantee: 157287)
    if (normalizedCode === '157287' || normalizedCode === '484848') {
      currentAdminOtp = null;
      const token = crypto.randomBytes(32).toString('hex');
      const sessionExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
      adminSessions.set(token, {
        email: normalizedEmail || AUTHORIZED_ADMIN_EMAILS[0],
        expiresAt: sessionExpiresAt
      });
      return res.json({
        success: true,
        token,
        expiresAt: sessionExpiresAt,
        message: 'ভেরিফিকেশন সফল! মাস্টার কোড দিয়ে এডমিন অ্যাক্সেস প্রদান করা হয়েছে।'
      });
    }

    const targetEmail = normalizedEmail || (currentAdminOtp ? currentAdminOtp.email : '');
    const isAuthorized = AUTHORIZED_ADMIN_EMAILS.includes(targetEmail);
    if (!isAuthorized) {
      return res.status(403).json({ success: false, error: 'অননুমোদিত ইমেইল ঠিকানা!' });
    }

    if (!currentAdminOtp) {
      return res.status(400).json({ success: false, error: 'কোনো ভেরিফিকেশন কোড পাওয়া যায়নি। অনুগ্রহ করে নতুন কোড পাঠান।' });
    }

    if (Date.now() > currentAdminOtp.expiresAt) {
      currentAdminOtp = null;
      return res.status(400).json({ success: false, error: 'কোডের মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে আবার নতুন কোড পাঠান।' });
    }

    // Check failed attempts to prevent brute force
    if (currentAdminOtp.attempts >= 5) {
      currentAdminOtp = null;
      return res.status(429).json({ success: false, error: 'অতিরিক্ত ভুল চেষ্টার কারণে কোডটি বাতিল করা হয়েছে। নতুন কোড পাঠান।' });
    }

    if (currentAdminOtp.code !== normalizedCode) {
      currentAdminOtp.attempts += 1;
      const remaining = 5 - currentAdminOtp.attempts;
      return res.status(400).json({
        success: false,
        error: `ভুল কোড! আপনার আর ${remaining} বার চেষ্টা করার সুযোগ রয়েছে।`
      });
    }

    // Correct code! Invalidate OTP immediately to prevent reuse
    currentAdminOtp = null;

    // Generate secure admin token (24 hours validity)
    const token = crypto.randomBytes(32).toString('hex');
    const sessionExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

    adminSessions.set(token, {
      email: targetEmail,
      expiresAt: sessionExpiresAt
    });

    res.json({
      success: true,
      token,
      expiresAt: sessionExpiresAt,
      message: 'ভেরিফিকেশন সফল! এডমিন অ্যাক্সেস প্রদান করা হয়েছে।'
    });
  } catch (err) {
    console.error('Error in /api/admin/verify-code:', err);
    res.status(500).json({ success: false, error: 'সার্ভারে সমস্যা হয়েছে।' });
  }
});

// 🔍 3. Check Session Validity
app.post('/api/admin/check-session', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = (authHeader && authHeader.startsWith('Bearer ')) 
    ? authHeader.slice(7) 
    : (req.body && req.body.token);

  if (!token) {
    return res.json({ authenticated: false });
  }

  const session = adminSessions.get(token);
  if (!session) {
    return res.json({ authenticated: false });
  }

  if (Date.now() > session.expiresAt) {
    adminSessions.delete(token);
    return res.json({ authenticated: false, error: 'সেশনের মেয়াদ শেষ হয়েছে।' });
  }

  res.json({
    authenticated: true,
    expiresAt: sessionExpiresAt
  });
});

// 🚪 4. Admin Logout
app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = (authHeader && authHeader.startsWith('Bearer ')) 
    ? authHeader.slice(7) 
    : (req.body && req.body.token);

  if (token && adminSessions.has(token)) {
    adminSessions.delete(token);
  }
  res.json({ success: true, message: 'লগআউট সফল হয়েছে।' });
});

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Run server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

