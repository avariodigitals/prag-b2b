// Fetch all published WooCommerce products with full detail fields and save to JSON.
// Uses the same env vars as the Next.js app. Run from the prag-b2b project root:
//   node scripts/fetch-all-products.mjs
//
// Output: scripts/out/all-products.json

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local manually (no dotenv dependency).
const envPath = path.join(__dirname, '..', '.env.local');
const envText = fs.readFileSync(envPath, 'utf8');
const env = {};
for (const line of envText.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eq = trimmed.indexOf('=');
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq).trim();
  const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
  env[key] = val;
}

const WP_API_URL = env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';
const WC_KEY = env.WC_CONSUMER_KEY;
const WC_SECRET = env.WC_CONSUMER_SECRET;

if (!WC_KEY || !WC_SECRET) {
  console.error('Missing WC_CONSUMER_KEY / WC_CONSUMER_SECRET in .env.local');
  process.exit(1);
}

const base = `${WP_API_URL}/wc/v3`;
const auth = `consumer_key=${encodeURIComponent(WC_KEY)}&consumer_secret=${encodeURIComponent(WC_SECRET)}`;

const DETAIL_FIELDS = [
  'id,name,slug,sku,permalink,price,regular_price,sale_price,on_sale,stock_status,',
  'date_created,date_modified,date_on_sale_from,date_on_sale_to,featured,',
  'short_description,description,images,categories,tags,attributes,',
  'dimensions,weight,related_ids,upsell_ids,cross_sell_ids,',
  'total_sales,average_rating,rating_count,review_count,purchase_note,',
  'external_url,button_text,menu_order,status,type,virtual,downloadable',
].join('');

async function fetchPage(page, perPage = 100) {
  const url = `${base}/products?status=publish&per_page=${perPage}&page=${page}&_fields=${DETAIL_FIELDS}&${auth}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} on page ${page}: ${body.slice(0, 200)}`);
    }
    const total = Number(res.headers.get('X-WP-Total') ?? 0);
    const totalPages = Number(res.headers.get('X-WP-TotalPages') ?? 0);
    const data = await res.json();
    return { data, total, totalPages };
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const all = [];
  let page = 1;
  let total = 0;
  let totalPages = 0;
  // First page to get totals
  const first = await fetchPage(page);
  total = first.total;
  totalPages = first.totalPages || Math.ceil(total / 100);
  all.push(...first.data);
  console.log(`Page 1: ${first.data.length} products (total=${total}, pages=${totalPages})`);
  for (page = 2; page <= totalPages; page++) {
    // small delay to be polite
    await new Promise((r) => setTimeout(r, 250));
    const res = await fetchPage(page);
    all.push(...res.data);
    console.log(`Page ${page}: ${res.data.length} products (cumulative=${all.length})`);
  }

  const outDir = path.join(__dirname, 'out');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'all-products.json');
  fs.writeFileSync(outPath, JSON.stringify({ total, fetched: all.length, products: all }, null, 2));
  console.log(`\nSaved ${all.length} products to ${outPath}`);
}

main().catch((err) => {
  console.error('Fetch failed:', err);
  process.exit(1);
});
