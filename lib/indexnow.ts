import { getSiteUrl } from "./site";
import sitemapFallback from "@/app/sitemap";

export interface IndexNowResult {
  ok: boolean;
  status: number;
  submittedCount: number;
  urls: string[];
  message: string;
}

const INDEXNOW_API_ENDPOINT = "https://api.indexnow.org/IndexNow";
const KEY_REGEX = /^[a-zA-Z0-9-]{8,128}$/;
const MAX_BATCH_SIZE = 10000;

/**
 * Resolves the canonical site URL and canonical host (preserving `www.` subdomain).
 */
export function getCanonicalSiteInfo(): { siteUrl: string; canonicalHost: string } {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl();
  const normalized = rawUrl.replace(/\/+$/, "");
  let canonicalHost: string;
  try {
    canonicalHost = new URL(normalized).host;
  } catch {
    canonicalHost = "www.heartsfromsiya.com";
  }
  return { siteUrl: normalized, canonicalHost };
}

/**
 * Parses <loc> URLs from a sitemap XML string.
 */
export function parseSitemapLocs(xmlText: string): string[] {
  const locRegex = /<loc>\s*(https?:\/\/[^\s<]+)\s*<\/loc>/gi;
  const urls: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = locRegex.exec(xmlText)) !== null) {
    if (match[1]) {
      urls.push(match[1].trim());
    }
  }
  return urls;
}

/**
 * Submits URLs to the central IndexNow API.
 * If `urls` is omitted or empty, fetches and parses the canonical `/sitemap.xml`.
 */
export async function submitToIndexNow(urls?: string[]): Promise<IndexNowResult> {
  const key = process.env.INDEXNOW_KEY?.trim();

  if (!key || !KEY_REGEX.test(key)) {
    return {
      ok: false,
      status: 400,
      submittedCount: 0,
      urls: [],
      message:
        "INDEXNOW_KEY must be between 8 and 128 alphanumeric characters or hyphens.",
    };
  }

  const { siteUrl, canonicalHost } = getCanonicalSiteInfo();

  let targetUrls = Array.isArray(urls) && urls.length > 0 ? urls : [];

  if (targetUrls.length === 0) {
    // Attempt fetching live sitemap.xml
    try {
      const sitemapUrl = `${siteUrl}/sitemap.xml`;
      const response = await fetch(sitemapUrl, {
        headers: { Accept: "application/xml, text/xml, */*" },
        signal: AbortSignal.timeout(6000),
      });

      if (response.ok) {
        const xml = await response.text();
        targetUrls = parseSitemapLocs(xml);
      }
    } catch {
      // In-process fallback when sitemap.xml is not served over HTTP yet
    }

    // If fetch returned empty or failed, fallback to in-memory sitemap function
    if (targetUrls.length === 0) {
      try {
        const entries = sitemapFallback();
        targetUrls = entries.map((entry) => entry.url);
      } catch {
        targetUrls = [];
      }
    }
  }

  if (targetUrls.length === 0) {
    return {
      ok: false,
      status: 400,
      submittedCount: 0,
      urls: [],
      message: "No URLs found to submit to IndexNow.",
    };
  }

  // Filter to exact canonical host and deduplicate
  const filteredUrls = Array.from(
    new Set(
      targetUrls.filter((item) => {
        try {
          const parsed = new URL(item);
          return (
            (parsed.protocol === "http:" || parsed.protocol === "https:") &&
            parsed.host.toLowerCase() === canonicalHost.toLowerCase()
          );
        } catch {
          return false;
        }
      }),
    ),
  );

  if (filteredUrls.length === 0) {
    return {
      ok: false,
      status: 422,
      submittedCount: 0,
      urls: [],
      message: `No URLs matched the canonical host (${canonicalHost}).`,
    };
  }

  const keyLocation = `${siteUrl}/${key}.txt`;
  let lastStatus = 200;
  let totalSubmitted = 0;
  const submittedUrls: string[] = [];

  // Batch up to 10,000 URLs per request
  for (let i = 0; i < filteredUrls.length; i += MAX_BATCH_SIZE) {
    const batch = filteredUrls.slice(i, i + MAX_BATCH_SIZE);
    const payload = {
      host: canonicalHost,
      key,
      keyLocation,
      urlList: batch,
    };

    try {
      const response = await fetch(INDEXNOW_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });

      lastStatus = response.status;

      // IndexNow returns 200 (OK) or 202 (Accepted) on success
      if (response.status !== 200 && response.status !== 202) {
        const errorText = await response.text().catch(() => "");
        return {
          ok: false,
          status: response.status,
          submittedCount: totalSubmitted,
          urls: submittedUrls,
          message: `IndexNow API responded with HTTP ${response.status}: ${errorText || response.statusText}`,
        };
      }

      totalSubmitted += batch.length;
      submittedUrls.push(...batch);
    } catch (error) {
      return {
        ok: false,
        status: 500,
        submittedCount: totalSubmitted,
        urls: submittedUrls,
        message:
          error instanceof Error
            ? `IndexNow request failed: ${error.message}`
            : "IndexNow request failed due to an unknown network error.",
      };
    }
  }

  return {
    ok: true,
    status: lastStatus,
    submittedCount: totalSubmitted,
    urls: submittedUrls,
    message: `Successfully submitted ${totalSubmitted} URL(s) to IndexNow for host ${canonicalHost}.`,
  };
}
