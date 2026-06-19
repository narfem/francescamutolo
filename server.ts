import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import contactHandler from "./api/contact.js";

// Initialize express app
const app = express();
const PORT = 3000;

// Set up JSON body parser and CORS
app.use(express.json());
app.use(cors({
  origin: '*', // Allows universal contact integration from other external platforms!
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Route standard calls to the Vercel-compatible router handler
app.post("/api/contact", contactHandler);
app.get("/api/contact", contactHandler);

// Keep the old /api/contact/status route pointing to the GET request of the contactHandler for backward-compatibility
app.get("/api/contact/status", contactHandler);


// --- INTEGRATE VITE DEVSERVER MIDDLEWARE AND SPA SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode configuration (Vite runs as custom middleware)
    console.log("🛠️ Starting Full-Stack server in Dev Mode (Vite devserver active)...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving compiled client-side single page app assets
    console.log("🚀 Starting Full-Stack server in Production Mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    // Fallback everything else to SPA template
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind server listener to port 3000 on host 0.0.0.0 (Mandatory for Cloud Run container ingress)
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`📡 Full-Stack Server routing running at http://localhost:${PORT}`);
  });
}

startServer();
