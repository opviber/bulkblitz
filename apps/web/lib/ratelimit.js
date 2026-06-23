// =============================================================================
// BulkBlitz — Rate limiting (Upstash Redis when configured, in-memory fallback)
// =============================================================================
const memory = new Map();

function memoryLimit(key, limit, windowMs) {
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || now > entry.reset) {
    memory.set(key, { count: 1, reset: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }
  entry.count += 1;
  if (entry.count > limit) return { success: false, remaining: 0 };
  return { success: true, remaining: limit - entry.count };
}

/**
 * rateLimit(identifier, { limit, windowMs })
 * Uses Upstash REST API if UPSTASH_REDIS_REST_URL/TOKEN are set; otherwise an
 * in-process sliding window (best-effort, single instance only).
 */
export async function rateLimit(identifier, { limit = 10, windowMs = 60_000 } = {}) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const key = `rl:${identifier}`;

  if (!url || !token) return memoryLimit(key, limit, windowMs);

  try {
    const windowSec = Math.ceil(windowMs / 1000);
    const incr = await fetch(`${url}/incr/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());
    const count = incr.result;
    if (count === 1) {
      await fetch(`${url}/expire/${encodeURIComponent(key)}/${windowSec}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    return { success: count <= limit, remaining: Math.max(0, limit - count) };
  } catch {
    return memoryLimit(key, limit, windowMs);
  }
}

/** Extract a best-effort client identifier from a request. */
export function clientId(request) {
  const fwd = request.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0].trim() : null) || request.headers.get("x-real-ip") || "anon";
}
