import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import fs from "fs";
import path from "path";

// --- MEMORY-BASED IP RATE LIMITER FOR THE SERVERLESS INSTANCE ---
const ipRequests = new Map<string, { count: number; resetAt: number }>();

// Periodic pruning of expired rate limit buckets
if (global && !(global as any)._pruneIntervalSet) {
  (global as any)._pruneIntervalSet = true;
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipRequests.entries()) {
      if (now > data.resetAt) {
        ipRequests.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}

// Helper to sanitize HTML tags
function cleanHtml(text: string): string {
  if (!text) return "";
  return text.replace(/<[^>]*>/g, ""); 
}

export default async function handler(req: any, res: any) {
  // 1. Configure CORS & preflight
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Support health/status checking via simple standard protocol
  if (req.method === 'GET') {
    try {
      const fileDbPath = path.join(process.cwd(), 'contacts_db.json');
      let localCount = 0;
      if (fs.existsSync(fileDbPath)) {
        try {
          const data = JSON.parse(fs.readFileSync(fileDbPath, 'utf8'));
          localCount = Array.isArray(data) ? data.length : 0;
        } catch {
          localCount = 0;
        }
      }

      const telegramBotTokenExists = !!process.env.TELEGRAM_BOT_TOKEN;
      const telegramChatIdExists = !!process.env.TELEGRAM_CHAT_ID;
      const emailSmtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.EMAIL_TO);

      return res.status(200).json({
        success: true,
        config: {
          ENABLE_SHEETS: process.env.ENABLE_SHEETS === "true",
          GOOGLE_SHEETS_ID: process.env.GOOGLE_SHEETS_ID ? `${process.env.GOOGLE_SHEETS_ID.slice(0, 5)}...` : null,
          ENABLE_FILE_DB: process.env.ENABLE_FILE_DB !== "false",
          ENABLE_TELEGRAM: process.env.ENABLE_TELEGRAM !== "false" && telegramBotTokenExists && telegramChatIdExists,
          ENABLE_EMAIL: process.env.ENABLE_EMAIL !== "false" && emailSmtpConfigured,
          EMAIL_TO: process.env.EMAIL_TO || null,
          ENABLE_WEBHOOK: process.env.ENABLE_WEBHOOK === "true",
          env_checks: {
            TELEGRAM_BOT_TOKEN_PRESENTE: telegramBotTokenExists,
            TELEGRAM_CHAT_ID_PRESENTE: telegramChatIdExists,
            SMTP_HOST_PRESENTE: !!process.env.SMTP_HOST,
            SMTP_USER_PRESENTE: !!process.env.SMTP_USER,
            SMTP_PASS_PRESENTE: !!process.env.SMTP_PASS,
            EMAIL_TO_PRESENTE: !!process.env.EMAIL_TO,
            GOOGLE_SHEETS_ID_PRESENTE: !!process.env.GOOGLE_SHEETS_ID,
            GOOGLE_SERVICE_ACCOUNT_JSON_PRESENTE: !!process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
            SUPABASE_URL_PRESENTE: !!process.env.SUPABASE_URL,
            SUPABASE_ANON_KEY_PRESENTE: !!process.env.SUPABASE_ANON_KEY,
          }
        },
        local_file_contacts_count: localCount,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Metodo non consentito. Usa POST o GET' });
  }

  // 2. IP Rate Limiting Check
  const ip = (req.headers['x-forwarded-for'] as string) || req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const limitWindow = 60 * 1000; // 1 minute
  const maxRequests = 5;

  const limitData = ipRequests.get(ip);
  if (!limitData || now > limitData.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + limitWindow });
  } else {
    limitData.count++;
    if (limitData.count > maxRequests) {
      return res.status(429).json({ 
        success: false, 
        error: "Troppe richieste da questo indirizzo IP. Riprova tra un minuto." 
      });
    }
  }

  // 3. Honeypot check for bots
  if (req.body.website_url) {
    console.log("Honeypot field detected! Spam submission ignored silently.");
    return res.status(200).json({ success: true, message: "Contact received (filtered)" });
  }

  // 4. Extract inputs
  let { name, email, phone, company, message, source_page, timestamp } = req.body;

  // 5. Trim & Sanitize
  name = cleanHtml(name || "").trim();
  email = cleanHtml(email || "").trim();
  phone = cleanHtml(phone || "").trim();
  company = cleanHtml(company || "").trim();
  message = cleanHtml(message || "").trim();
  source_page = cleanHtml(source_page || "").trim();

  // 6. Validation
  if (!name) {
    return res.status(400).json({ success: false, error: "Validation failed: Nome richiesto obbligatoriamente." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: "Validation failed: Indirizzo e-mail non valido." });
  }

  if (!message) {
    return res.status(400).json({ success: false, error: "Validation failed: Messaggio vuoto non consentito." });
  }

  // Apply sensible limitations on sizes
  if (name.length > 200) name = name.substring(0, 200);
  if (email.length > 200) email = email.substring(0, 200);
  if (phone.length > 50) phone = phone.substring(0, 50);
  if (company.length > 200) company = company.substring(0, 200);
  if (message.length > 5000) message = message.substring(0, 5000);
  if (source_page.length > 500) source_page = source_page.substring(0, 500);

  // Normalize data payload
  const normalizedData = {
    name,
    email,
    phone: phone || "",
    company: company || "",
    message,
    source_page: source_page || req.headers.referer || "unknown",
    timestamp: timestamp || new Date().toISOString()
  };

  const modulesTrack: Record<string, 'success' | 'failed' | 'disabled'> = {};

  // --- SUB-TRIGGER 1: GOOGLE SHEETS DB LOGGER ---
  if (process.env.ENABLE_SHEETS === "true" && process.env.GOOGLE_SHEETS_ID && process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      const authClient = new google.auth.JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });

      const sheets = google.sheets({ version: 'v4', auth: authClient });
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEETS_ID,
        range: 'A:H',
        valueInputOption: 'RAW',
        requestBody: {
          values: [[
            normalizedData.timestamp,
            normalizedData.name,
            normalizedData.email,
            normalizedData.phone,
            normalizedData.company,
            normalizedData.message,
            normalizedData.source_page,
            'new'
          ]]
        }
      });
      modulesTrack.sheets = 'success';
    } catch (err: any) {
      modulesTrack.sheets = 'failed';
      console.error("❌ Google Sheets Error:", err.message);
    }
  } else {
    modulesTrack.sheets = 'disabled';
  }

  // --- SUB-TRIGGER 2: LOCAL JSON BACKUP FILE (with read-only robustness) ---
  if (process.env.ENABLE_FILE_DB !== "false") {
    try {
      const dbPath = path.join(process.cwd(), 'contacts_db.json');
      let localRecords: any[] = [];
      if (fs.existsSync(dbPath)) {
        try {
          localRecords = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        } catch {
          localRecords = [];
        }
      }
      
      if (!Array.isArray(localRecords)) localRecords = [];
      localRecords.push({ ...normalizedData, status: 'new' });
      fs.writeFileSync(dbPath, JSON.stringify(localRecords, null, 2), 'utf8');
      
      modulesTrack.file_db = 'success';
    } catch (err: any) {
      // Graceful bypass of read-only directories on strict container environments like Vercel serverless
      modulesTrack.file_db = 'failed';
      console.warn("⚠️ File DB Save skipped (Read-only host/Vercel serverless):", err.message);
    }
  } else {
    modulesTrack.file_db = 'disabled';
  }

  // --- SUB-TRIGGER 3: SUPABASE SYNC FOR PORTFOLIO DASHBOARD ---
  const supabaseUrl = process.env.SUPABASE_URL || 'https://jqgfsvdtbwedmoduykdb.supabase.co';
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxZ2ZzdmR0YndlZG1vZHV5a2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDA0MzksImV4cCI6MjA4Njk3NjQzOX0.2BgSHLe_ZlNeKkE3rcjJv2WDkF-vZOQc9p_8Xs7dmME';
  
  if (supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const isBrief = !!(req.body.services && Array.isArray(req.body.services) && req.body.services.length > 0);
      
      if (isBrief) {
        await supabase.from('contacts_brief').insert([{
          name: normalizedData.name,
          email: normalizedData.email,
          phone: normalizedData.phone,
          colors: req.body.colors || "",
          notes: normalizedData.message,
          services: req.body.services || [],
          created_at: normalizedData.timestamp,
          is_read: false,
          is_deleted: false
        }]);
      } else {
        await supabase.from('contacts_simple').insert([{
          name: normalizedData.name,
          email: normalizedData.email,
          message: normalizedData.message,
          created_at: normalizedData.timestamp,
          is_read: false,
          is_deleted: false
        }]);
      }
      modulesTrack.supabase_sync = 'success';
    } catch (err: any) {
      modulesTrack.supabase_sync = 'failed';
      console.error("⚠️ Supabase synchronization skipped (Optional):", err.message);
    }
  } else {
    modulesTrack.supabase_sync = 'disabled';
  }

  // --- SUB-TRIGGER 4: TELEGRAM NOTIFICATION BOT ---
  if (process.env.ENABLE_TELEGRAM !== "false" && process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    try {
      console.log("📤 Attempting to dispatch Telegram notification bot...");
      const textMsg = `🛎️ <b>NUOVO CONTATTO UNIVERSALE</b> 🛎️\n\n` +
        `👤 <b>Nome:</b> ${normalizedData.name}\n` +
        `✉️ <b>Email:</b> ${normalizedData.email}\n` +
        `📞 <b>Telefono:</b> ${normalizedData.phone || 'N/D'}\n` +
        `🏢 <b>Azienda:</b> ${normalizedData.company || 'N/D'}\n` +
        `📄 <b>Sorgente:</b> ${normalizedData.source_page}\n` +
        `⏰ <b>Orario:</b> ${normalizedData.timestamp}\n\n` +
        `💬 <b>Messaggio:</b>\n<i>${normalizedData.message}</i>`;

      const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: textMsg,
          parse_mode: 'HTML'
        })
      });

      if (!response.ok) {
        throw new Error(`Telegram error: ${response.status}`);
      }
      modulesTrack.telegram = 'success';
      console.log("✅ Telegram dispatch succeeded!");
    } catch (err: any) {
      modulesTrack.telegram = 'failed';
      console.error("❌ Telegram Dispatch Error:", err.message);
    }
  } else {
    modulesTrack.telegram = 'disabled';
    console.log("ℹ️ Telegram dispatch skipped (disabled or credentials missing)");
  }

  // --- SUB-TRIGGER 5: SMTP EMAIL DISPATCHER ---
  if (process.env.ENABLE_EMAIL !== "false" && process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.EMAIL_TO) {
    try {
      console.log("📤 Attempting to dispatch SMTP email notification...");
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true", // support fallback or standard
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      await transporter.sendMail({
        from: `"Universal Contacts Panel" <${process.env.SMTP_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `[Contatto] Nuovo messaggio da ${normalizedData.name}`,
        text: `Nuovo contatto universale:\n\n` +
          `Nome: ${normalizedData.name}\n` +
          `Email: ${normalizedData.email}\n` +
          `Telefono: ${normalizedData.phone || 'N/D'}\n` +
          `Azienda: ${normalizedData.company || 'N/D'}\n` +
          `Sorgente: ${normalizedData.source_page}\n` +
          `Orario: ${normalizedData.timestamp}\n\n` +
          `Messaggio:\n${normalizedData.message}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px; line-height: 1.6;">
            <h2 style="color: #4F14EE; margin-bottom: 20px;">Nuovo Contatto Ricevuto</h2>
            <p><b>Nome:</b> ${normalizedData.name}</p>
            <p><b>E-mail:</b> <a href="mailto:${normalizedData.email}">${normalizedData.email}</a></p>
            <p><b>Telefono:</b> ${normalizedData.phone || 'N/D'}</p>
            <p><b>Azienda:</b> ${normalizedData.company || 'N/D'}</p>
            <p><b>Sorgente:</b> <code style="background: #f5f5f5; padding: 2px 6px; rounded: 4px;">${normalizedData.source_page}</code></p>
            <p><b>Orario:</b> ${normalizedData.timestamp}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p><b>Contenuto del Messaggio:</b></p>
            <div style="background: #fafafa; padding: 15px; border-radius: 8px; border-left: 4px solid #4F14EE; font-style: italic; white-space: pre-wrap;">${normalizedData.message}</div>
          </div>
        `
      });

      modulesTrack.email = 'success';
      console.log("✅ SMTP email dispatch succeeded!");
    } catch (err: any) {
      modulesTrack.email = 'failed';
      console.error("❌ SMTP Dispatch Error:", err.message);
    }
  } else {
    modulesTrack.email = 'disabled';
    console.log("ℹ️ SMTP email dispatch skipped (disabled or credentials missing)");
  }

  // --- SUB-TRIGGER 6: OUTBOUND OTHER WEBHOOKS ---
  if (process.env.ENABLE_WEBHOOK === "true" && process.env.WEBHOOK_URL) {
    try {
      const response = await fetch(process.env.WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedData)
      });

      if (!response.ok) {
        throw new Error(`Webhook response status: ${response.status}`);
      }
      modulesTrack.webhook = 'success';
    } catch (err: any) {
      modulesTrack.webhook = 'failed';
      console.error("❌ Outbound Webhook Error:", err.message);
    }
  } else {
    modulesTrack.webhook = 'disabled';
  }

  // 7. Complete successfully
  return res.status(200).json({
    success: true,
    message: "Contact received",
    modules_report: modulesTrack
  });
}
