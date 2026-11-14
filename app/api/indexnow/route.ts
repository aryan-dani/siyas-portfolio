import { NextRequest, NextResponse } from "next/server";
import { submitToIndexNow } from "@/lib/indexnow";

/**
 * Authenticated webhook endpoint to push URLs to IndexNow.
 * Protected by `Authorization: Bearer <token>` matching `INDEXNOW_SECRET` or `INDEXNOW_KEY`.
 */
export async function POST(request: NextRequest) {
  const expectedSecret =
    process.env.INDEXNOW_SECRET?.trim() || process.env.INDEXNOW_KEY?.trim();

  if (!expectedSecret) {
    return NextResponse.json(
      {
        ok: false,
        error: "INDEXNOW_SECRET or INDEXNOW_KEY is not configured on the server.",
      },
      { status: 500 },
    );
  }

  const authHeader = request.headers.get("authorization") || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  const providedToken = match ? match[1].trim() : null;

  if (!providedToken || providedToken !== expectedSecret) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized. Missing or invalid Bearer token.",
      },
      { status: 401 },
    );
  }

  let urls: string[] | undefined;
  try {
    const body = await request.json();
    if (Array.isArray(body?.urls)) {
      urls = body.urls;
    }
  } catch {
    // Body is optional; omitting triggers full sitemap submission
  }

  const result = await submitToIndexNow(urls);

  return NextResponse.json(result, {
    status: result.ok
      ? result.status === 202
        ? 202
        : 200
      : result.status || 500,
  });
}
