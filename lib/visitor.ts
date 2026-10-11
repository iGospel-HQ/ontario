const VISITOR_KEY = "igospel_visitor_id";

/**
 * Anonymous per-browser id, so people sharing an IP count separately in post
 * views and song streams. undefined when storage is blocked (the API then
 * falls back to the IP address).
 */
export function visitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return undefined;
  }
}
