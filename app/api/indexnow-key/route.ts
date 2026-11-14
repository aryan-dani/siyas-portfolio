/**
 * Serves the IndexNow verification key as plain UTF-8 text.
 * Rewritten from `/{INDEXNOW_KEY}.txt` via next.config.ts rewrites.
 */
export async function GET() {
  const key = process.env.INDEXNOW_KEY?.trim();

  if (!key) {
    return new Response("Not found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  return new Response(key, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
