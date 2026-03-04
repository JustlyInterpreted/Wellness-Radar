import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("trends.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS trends (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    velocity INTEGER NOT NULL,
    market_potential INTEGER NOT NULL,
    competition_intensity INTEGER NOT NULL,
    time_to_mainstream TEXT NOT NULL,
    summary TEXT NOT NULL,
    opportunity_brief TEXT NOT NULL,
    signals TEXT NOT NULL, -- JSON string of signals
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Migration: Add new columns if they don't exist
const tableInfo = db.prepare("PRAGMA table_info(trends)").all() as any[];
const columns = tableInfo.map(c => c.name);

console.log("Current database columns:", columns);

if (!columns.includes('seasonality_score')) {
  console.log("Adding seasonality_score column...");
  db.exec("ALTER TABLE trends ADD COLUMN seasonality_score INTEGER NOT NULL DEFAULT 0");
}
if (!columns.includes('influencer_score')) {
  console.log("Adding influencer_score column...");
  db.exec("ALTER TABLE trends ADD COLUMN influencer_score INTEGER NOT NULL DEFAULT 0");
}
if (!columns.includes('sentiment_score')) {
  console.log("Adding sentiment_score column...");
  db.exec("ALTER TABLE trends ADD COLUMN sentiment_score INTEGER NOT NULL DEFAULT 0");
}
if (!columns.includes('product_ideas')) {
  console.log("Adding product_ideas column...");
  db.exec("ALTER TABLE trends ADD COLUMN product_ideas TEXT NOT NULL DEFAULT '[]'");
}
if (!columns.includes('target_audience')) {
  console.log("Adding target_audience column...");
  db.exec("ALTER TABLE trends ADD COLUMN target_audience TEXT NOT NULL DEFAULT '{}'");
}
if (!columns.includes('marketing_angles')) {
  console.log("Adding marketing_angles column...");
  db.exec("ALTER TABLE trends ADD COLUMN marketing_angles TEXT NOT NULL DEFAULT '[]'");
}
if (!columns.includes('competitors')) {
  console.log("Adding competitors column...");
  db.exec("ALTER TABLE trends ADD COLUMN competitors TEXT NOT NULL DEFAULT '[]'");
}
if (!columns.includes('market_value')) {
  console.log("Adding market_value column...");
  db.exec("ALTER TABLE trends ADD COLUMN market_value TEXT NOT NULL DEFAULT '₹50Cr+'");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/trends", (req, res) => {
    const trends = db.prepare("SELECT * FROM trends ORDER BY created_at DESC").all();
    res.json(trends.map(t => ({
        ...t,
        product_ideas: JSON.parse(t.product_ideas),
        target_audience: JSON.parse(t.target_audience),
        marketing_angles: JSON.parse(t.marketing_angles),
        competitors: JSON.parse(t.competitors),
        signals: JSON.parse(t.signals)
    })));
  });

  app.post("/api/trends", (req, res) => {
    const { 
      id, title, category, velocity, market_potential, market_value, competition_intensity, 
      seasonality_score, influencer_score, sentiment_score,
      time_to_mainstream, summary, opportunity_brief, 
      product_ideas, target_audience, marketing_angles, competitors, signals 
    } = req.body;
    
    const upsert = db.prepare(`
      INSERT OR REPLACE INTO trends (
        id, title, category, velocity, market_potential, market_value, competition_intensity, 
        seasonality_score, influencer_score, sentiment_score,
        time_to_mainstream, summary, opportunity_brief, 
        product_ideas, target_audience, marketing_angles, competitors, signals
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    upsert.run(
      id, title, category, velocity, market_potential, market_value, competition_intensity, 
      seasonality_score, influencer_score, sentiment_score,
      time_to_mainstream, summary, opportunity_brief, 
      JSON.stringify(product_ideas), JSON.stringify(target_audience), 
      JSON.stringify(marketing_angles), JSON.stringify(competitors), JSON.stringify(signals)
    );
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
