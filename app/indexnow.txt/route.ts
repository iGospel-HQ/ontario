/**
 * IndexNow key file. Django (blog/indexnow.py) tells Bing, Yandex, ... about new
 * and changed pages and points them here to prove the submission comes from
 * this site. INDEXNOW_KEY must equal the backend's INDEXNOW_KEY. Not secret:
 * the key is public by design.
 */
export function GET() {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key || !/^[A-Za-z0-9-]{8,128}$/.test(key)) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(key, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
