#!/usr/bin/env node
/**
 * Generates a JSON manifest from the TypeScript redirect configuration.
 * Used by validate-redirects.mjs to avoid TypeScript import issues.
 *
 * Usage: npx tsx scripts/generate-redirect-manifest.mjs
 */
import { LEGACY_REDIRECTS, RETIRED_URLS } from '../lib/redirects';
import { writeFileSync } from 'fs';

writeFileSync('/tmp/redirect_manifest.json', JSON.stringify({
  redirects: LEGACY_REDIRECTS,
  retired: Array.from(RETIRED_URLS),
}, null, 2));

console.log(`Manifest written: ${LEGACY_REDIRECTS.length} redirects, ${RETIRED_URLS.size} retired URLs`);
