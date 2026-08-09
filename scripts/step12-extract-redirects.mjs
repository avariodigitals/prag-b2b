#!/usr/bin/env node
/**
 * Extracts LEGACY_REDIRECTS and RETIRED_URLS from lib/redirects.ts
 * without needing a TS loader. Writes /tmp/step12_redirect_data.json.
 */
import { readFileSync, writeFileSync } from 'fs';

const src = readFileSync('/Users/ralphmore/Documents/GitHub/prag-b2b/lib/redirects.ts', 'utf-8');

// Extract the LEGACY_REDIRECTS array body
const arrMatch = src.match(/export const LEGACY_REDIRECTS[^=]*=\s*\[([\s\S]*?)\];/);
const arrBody = arrMatch[1];
const redirects = [];
const re = /\{\s*source:\s*'([^']+)'\s*,\s*destination:\s*'([^']+)'\s*(?:,\s*permanent:\s*(true|false))?\s*\}/g;
let m;
while ((m = re.exec(arrBody)) !== null) {
  redirects.push({ source: m[1], destination: m[2], permanent: m[3] === 'true' });
}

// Extract RETIRED_URLS set
const setMatch = src.match(/export const RETIRED_URLS[^=]*=\s*new Set\(\[([\s\S]*?)\]\)/);
const setBody = setMatch[1];
const retired = [];
const re2 = /'([^']+)'/g;
while ((m = re2.exec(setBody)) !== null) retired.push(m[1]);

writeFileSync('/tmp/step12_redirect_data.json', JSON.stringify({ redirects, retired }, null, 2));
console.log(`Extracted: ${redirects.length} redirects, ${retired.length} retired URLs`);
