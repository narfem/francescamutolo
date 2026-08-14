import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.SUPABASE_URL || 'https://jqgfsvdtbwedmoduykdb.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxZ2ZzdmR0YndlZG1vZHV5a2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDA0MzksImV4cCI6MjA4Njk3NjQzOX0.2BgSHLe_ZlNeKkE3rcjJv2WDkF-vZOQc9p_8Xs7dmME';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BASE_URL = "https://www.francescamutolo.it";

export interface SitemapUrlEntry {
  loc: string;
  lastmod: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: string;
}

function formatDate(dateInput?: string | Date | null): string {
  if (!dateInput) {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) {
      return new Date().toISOString().split("T")[0];
    }
    return d.toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

export async function generateSitemapXml(): Promise<string> {
  const today = formatDate();

  // 1. Fetch latest portfolio items to get real updated dates and any dynamic categories
  let portfolioItems: any[] = [];
  let latestPortfolioDate = today;

  try {
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .not('category', 'ilike', '%CV%')
      .not('category', 'ilike', '%Curriculum%')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      portfolioItems = data;
      if (data.length > 0 && data[0].created_at) {
        latestPortfolioDate = formatDate(data[0].created_at);
      }
    }
  } catch (err) {
    console.warn("Could not fetch portfolio items for dynamic sitemap:", err);
  }

  // 2. Fetch latest reviews/feedbacks to determine review page lastmod
  let latestReviewDate = today;
  try {
    const { data: feedbackData, error: fbError } = await supabase
      .from('feedbacks')
      .select('created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!fbError && feedbackData && feedbackData.length > 0 && feedbackData[0].created_at) {
      latestReviewDate = formatDate(feedbackData[0].created_at);
    }
  } catch (err) {
    console.warn("Could not fetch feedbacks for dynamic sitemap:", err);
  }

  // Define known core categories and find their latest item dates
  const categoryConfigs: { slug: string; categoryName: string; defaultDate: string }[] = [
    { slug: 'branding', categoryName: 'Branding', defaultDate: latestPortfolioDate },
    { slug: 'flyer-poster', categoryName: 'Flyer & Poster', defaultDate: latestPortfolioDate },
    { slug: 'social-media', categoryName: 'Social Media', defaultDate: latestPortfolioDate },
    { slug: 'web', categoryName: 'Web', defaultDate: latestPortfolioDate },
  ];

  const entries: SitemapUrlEntry[] = [];

  // 1. Homepage
  entries.push({
    loc: `${BASE_URL}/`,
    lastmod: latestPortfolioDate || today,
    changefreq: "weekly",
    priority: "1.0"
  });

  // 2. Portfolio Category Pages (Priority: 0.8, changefreq: monthly)
  categoryConfigs.forEach(cat => {
    // Find latest item date in this category if available
    const catItems = portfolioItems.filter(item => 
      item.category && item.category.toLowerCase().includes(cat.categoryName.toLowerCase().split(' ')[0])
    );
    const catLastmod = catItems.length > 0 && catItems[0].created_at 
      ? formatDate(catItems[0].created_at) 
      : cat.defaultDate;

    entries.push({
      loc: `${BASE_URL}/portfolio/${cat.slug}`,
      lastmod: catLastmod,
      changefreq: "monthly",
      priority: "0.8"
    });
  });

  // Check if any additional categories exist in database dynamically
  const existingCategorySlugs = new Set(categoryConfigs.map(c => c.slug));
  portfolioItems.forEach(item => {
    if (item.category) {
      const rawCat = item.category.trim();
      const slug = rawCat
        .toLowerCase()
        .replace(/&/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      if (slug && !existingCategorySlugs.has(slug) && slug !== 'tutti' && slug !== 'cv' && slug !== 'curriculum') {
        existingCategorySlugs.add(slug);
        entries.push({
          loc: `${BASE_URL}/portfolio/${slug}`,
          lastmod: formatDate(item.created_at),
          changefreq: "monthly",
          priority: "0.8"
        });
      }
    }
  });

  // 3. Recensioni Page (Priority: 0.6, changefreq: monthly)
  entries.push({
    loc: `${BASE_URL}/recensioni`,
    lastmod: latestReviewDate || today,
    changefreq: "monthly",
    priority: "0.6"
  });

  // Construct XML
  const xmlLines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  ];

  for (const entry of entries) {
    xmlLines.push('  <url>');
    xmlLines.push(`    <loc>${entry.loc}</loc>`);
    xmlLines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    xmlLines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    xmlLines.push(`    <priority>${entry.priority}</priority>`);
    xmlLines.push('  </url>');
  }

  xmlLines.push('</urlset>');
  xmlLines.push('');

  return xmlLines.join('\n');
}

/**
 * Express route handler for /sitemap.xml
 */
export async function sitemapHandler(req: any, res: any) {
  try {
    const xml = await generateSitemapXml();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    return res.status(200).send(xml);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return res.status(500).send("Error generating sitemap");
  }
}
