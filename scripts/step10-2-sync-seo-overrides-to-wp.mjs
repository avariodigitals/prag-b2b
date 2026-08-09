// PRAG Step 10.2 — Sync SEO overrides from local admin config to WordPress
//
// In production, the admin config is stored in WordPress (not the local
// .admin-data/b2b-admin-config.json file). This script reads the local
// admin config, extracts the seoOverrides, and merges them into the
// WordPress admin-config endpoint.
//
// This ensures the production prag-b2b site can resolve the SEO overrides
// via either:
//   1. Prag-Admin public API → WordPress admin-config
//   2. WordPress admin-config (direct fallback)
//
// Run from prag-b2b root:
//   node scripts/step10-2-sync-seo-overrides-to-wp.mjs
//   DRY_RUN=1 node scripts/step10-2-sync-seo-overrides-to-wp.mjs  (dry run)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// Load env
const envText = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8');
const env = {};
for (const line of envText.split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('=');
  if (eq === -1) continue;
  env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
}

const WP_API_URL = env.NEXT_PUBLIC_WP_API_URL ?? 'https://central.prag.global/wp-json';
const WP_APP_USER = env.WP_APP_USER;
const WP_APP_PASSWORD = env.WP_APP_PASSWORD;

// WordPress application password auth (same as Prag-Admin uses)
const authHeader = 'Basic ' + Buffer.from(`${WP_APP_USER}:${WP_APP_PASSWORD}`).toString('base64');

const ADMIN_CONFIG_PATH = path.join(ROOT, '..', 'Prag-Admin', '.admin-data', 'b2b-admin-config.json');

async function main() {
  const DRY_RUN = process.env.DRY_RUN === '1';

  // 1. Read local admin config
  const raw = fs.readFileSync(ADMIN_CONFIG_PATH, 'utf8');
  const localConfig = JSON.parse(raw);
  const seoOverrides = localConfig.seoOverrides ?? {};

  console.log(`${DRY_RUN ? '[DRY RUN] ' : ''}Step 10.2 — Syncing ${Object.keys(seoOverrides).length} SEO overrides to WordPress\n`);
  console.log(`WP API: ${WP_API_URL}`);
  console.log(`Endpoint: ${WP_API_URL}/prag-core/v1/admin-config\n`);

  // 2. Read current WordPress admin config
  console.log('Reading current WordPress admin config...');
  const readRes = await fetch(`${WP_API_URL}/prag-core/v1/admin-config`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
    },
    cache: 'no-store',
  });

  let currentConfig = {};
  if (readRes.ok && readRes.status !== 204) {
    currentConfig = await readRes.json();
    console.log(`  Read OK (HTTP ${readRes.status})`);
  } else {
    console.log(`  Read returned HTTP ${readRes.status} — starting from empty config`);
  }

  // 3. Merge SEO overrides
  const currentOverrides = currentConfig?.b2bAdminStore?.seoOverrides ?? currentConfig?.seoOverrides ?? {};
  const mergedOverrides = {
    ...currentOverrides,
    ...seoOverrides,
  };

  console.log(`\n  Existing WP SEO overrides: ${Object.keys(currentOverrides).length}`);
  console.log(`  New SEO overrides to merge: ${Object.keys(seoOverrides).length}`);
  console.log(`  Merged total: ${Object.keys(mergedOverrides).length}`);

  if (DRY_RUN) {
    console.log('\n[DRY RUN] Would write merged config to WordPress');
    return;
  }

  // 4. Write merged config back to WordPress
  // Preserve existing config structure, only update seoOverrides
  const payload = {
    ...currentConfig,
    b2bAdminStore: {
      ...(currentConfig?.b2bAdminStore ?? {}),
      seoOverrides: mergedOverrides,
    },
  };

  console.log('\nWriting merged config to WordPress...');
  const writeRes = await fetch(`${WP_API_URL}/prag-core/v1/admin-config`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
    },
    body: JSON.stringify(payload),
  });

  if (writeRes.ok) {
    console.log(`  Write OK (HTTP ${writeRes.status})`);
    console.log(`\n✓ ${Object.keys(seoOverrides).length} SEO overrides synced to WordPress`);
  } else {
    const body = await writeRes.text().catch(() => '');
    throw new Error(`Write failed: HTTP ${writeRes.status}: ${body.slice(0, 300)}`);
  }

  // 5. Verify by reading back
  console.log('\nVerifying...');
  const verifyRes = await fetch(`${WP_API_URL}/prag-core/v1/admin-config`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
    },
    cache: 'no-store',
  });

  if (verifyRes.ok) {
    const verified = await verifyRes.json();
    const verifiedOverrides = verified?.b2bAdminStore?.seoOverrides ?? verified?.seoOverrides ?? {};
    const verifiedCount = Object.keys(verifiedOverrides).length;
    console.log(`  Verified: ${verifiedCount} SEO overrides in WordPress`);

    // Check a sample
    const sampleKey = Object.keys(seoOverrides)[0];
    if (verifiedOverrides[sampleKey]) {
      console.log(`  Sample "${sampleKey}": ✓ present`);
    } else {
      console.log(`  Sample "${sampleKey}": ✗ MISSING`);
    }
  }
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
