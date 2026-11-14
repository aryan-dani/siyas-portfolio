#!/usr/bin/env node
/**
 * Zero-dependency Node ESM CLI script to push URLs to IndexNow.
 *
 * Usage:
 *   node scripts/indexnow.mjs
 *   node scripts/indexnow.mjs https://www.heartsfromsiya.com/collaborate
 *   npm run indexnow
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

/**
 * Minimal zero-dependency .env loader.
 */
function loadEnvFile(filename) {
  const filePath = path.join(rootDir, filename);
  if (!fs.existsSync(filePath)) return;

  try {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) {
        process.env[key] = val;
      }
    }
  } catch (error) {
    console.warn(`[IndexNow] Note: Could not read ${filename}:`, error.message);
  }
}

// Load .env.local first, then .env
loadEnvFile(".env.local");
loadEnvFile(".env");

const INDEXNOW_API_ENDPOINT = "https://api.indexnow.org/IndexNow";
const KEY_REGEX = /^[a-zA-Z0-9-]{8,128}$/;
const MAX_BATCH_SIZE = 10000;

const key = process.env.INDEXNOW_KEY?.trim();
const isStrict =
  process.argv.includes("--strict") ||
  Boolean(process.env.CI) ||
  Boolean(process.env.GITHUB_ACTIONS);

if (!key) {
  if (isStrict) {
    console.error(
      "\n[IndexNow] ❌ Error: INDEXNOW_KEY environment variable is not defined.",
    );
    console.error(
      "[IndexNow] Provide INDEXNOW_KEY in your environment, CI secrets, or .env.local file.\n",
    );
    process.exit(1);
  } else {
    console.warn(
      "\n[IndexNow] ⚠️ Warning: INDEXNOW_KEY is not configured.",
    );
    console.warn(
      "[IndexNow] Skipping IndexNow ping. Add INDEXNOW_KEY to your .env.local to enable instant indexing.\n",
    );
    process.exit(0);
  }
}

if (!KEY_REGEX.test(key)) {
  console.error(
    `\n[IndexNow] ❌ Error: INDEXNOW_KEY is invalid (length: ${key.length}). Must be 8-128 alphanumeric characters or hyphens.\n`,
  );
  process.exit(1);
}

const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://www.heartsfromsiya.com";
const siteUrl = rawSiteUrl.replace(/\/+$/, "");

let canonicalHost;
try {
  canonicalHost = new URL(siteUrl).host;
} catch {
  canonicalHost = "www.heartsfromsiya.com";
}

const keyLocation = `${siteUrl}/${key}.txt`;

// Parse CLI URL arguments (ignoring flags like --strict)
const cliUrls = process.argv
  .slice(2)
  .filter((arg) => arg.startsWith("http://") || arg.startsWith("https://"));

let targetUrls = cliUrls;

if (targetUrls.length === 0) {
  console.log(`[IndexNow] Fetching sitemap from ${siteUrl}/sitemap.xml...`);
  try {
    const sitemapRes = await fetch(`${siteUrl}/sitemap.xml`, {
      headers: { Accept: "application/xml, text/xml, */*" },
      signal: AbortSignal.timeout(8000),
    });

    if (sitemapRes.ok) {
      const xmlText = await sitemapRes.text();
      const locMatches = xmlText.matchAll(/<loc>\s*(https?:\/\/[^\s<]+)\s*<\/loc>/gi);
      for (const match of locMatches) {
        if (match[1]) targetUrls.push(match[1].trim());
      }
    } else {
      console.warn(
        `[IndexNow] Warning: Could not fetch ${siteUrl}/sitemap.xml (HTTP ${sitemapRes.status}).`,
      );
    }
  } catch (error) {
    console.warn(
      `[IndexNow] Warning: Failed to fetch sitemap from ${siteUrl}/sitemap.xml: ${error.message}`,
    );
  }

  // Fallback to canonical routes if sitemap fetch produced 0 URLs
  if (targetUrls.length === 0) {
    console.log("[IndexNow] Falling back to default canonical routes...");
    targetUrls = [
      `${siteUrl}/`,
      `${siteUrl}/collaborate`,
      `${siteUrl}/copyright`,
    ];
  }
}

// Filter to canonical host and deduplicate
const filteredUrls = Array.from(
  new Set(
    targetUrls.filter((item) => {
      try {
        const u = new URL(item);
        return (
          (u.protocol === "http:" || u.protocol === "https:") &&
          u.host.toLowerCase() === canonicalHost.toLowerCase()
        );
      } catch {
        return false;
      }
    }),
  ),
);

if (filteredUrls.length === 0) {
  console.error(
    `[IndexNow] ❌ No valid URLs matched canonical host: ${canonicalHost}`,
  );
  process.exit(1);
}

console.log(`[IndexNow] Host: ${canonicalHost}`);
console.log(`[IndexNow] Key Location: ${keyLocation}`);
console.log(`[IndexNow] Submitting ${filteredUrls.length} URL(s)...`);

let hasError = false;

for (let i = 0; i < filteredUrls.length; i += MAX_BATCH_SIZE) {
  const batch = filteredUrls.slice(i, i + MAX_BATCH_SIZE);
  const payload = {
    host: canonicalHost,
    key,
    keyLocation,
    urlList: batch,
  };

  try {
    const res = await fetch(INDEXNOW_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12000),
    });

    const status = res.status;
    if (status === 200 || status === 202) {
      console.log(
        `[IndexNow] ✅ Success! HTTP ${status} ${status === 202 ? "(Accepted/Pending Verification)" : "(OK)"} — ${batch.length} URL(s) submitted.`,
      );
    } else {
      const errBody = await res.text().catch(() => "");
      console.error(
        `[IndexNow] ❌ Failed! HTTP ${status}: ${errBody || res.statusText}`,
      );
      hasError = true;
    }
  } catch (error) {
    console.error(`[IndexNow] ❌ Network error: ${error.message}`);
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
} else {
  console.log("[IndexNow] Done. Search engines notified.");
  process.exit(0);
}
