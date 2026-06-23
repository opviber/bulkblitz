// =============================================================================
// BulkBlitz — Authentication & session helpers (server-side)
//
// Uses Supabase Auth (phone OTP + social). The Supabase access token is stored
// in an httpOnly cookie ("bb-access-token"). On every request we verify the
// token with Supabase and map the Supabase user to our Prisma User row by phone.
//
// SECURITY: This replaces the previous spoofable `x-user-id` header trust.
// A development-only fallback (DEV_FALLBACK_USER) is gated behind
// NODE_ENV !== "production" so local work without Supabase still functions.
// =============================================================================
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const ACCESS_COOKIE = "bb-access-token";

/** True when sandbox/dev shortcuts (e.g. OTP 123456) are permitted. */
export const allowSandbox = process.env.NODE_ENV !== "production";

/** Admin client (service role) — server only. */
export function supabaseAdmin() {
  if (!supabaseUrl || !serviceKey) return null;
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** Public client (anon) for token verification. */
export function supabaseAuthClient() {
  if (!supabaseUrl || !anonKey) return null;
  return createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Resolve the authenticated Prisma user from the request cookie.
 * Returns null if unauthenticated.
 */
export async function getSessionUser() {
  let token = null;
  try {
    const cookieStore = await cookies();
    token = cookieStore.get(ACCESS_COOKIE)?.value || null;
  } catch {
    token = null;
  }

  const client = supabaseAuthClient();
  if (token && client) {
    const { data, error } = await client.auth.getUser(token);
    if (!error && data?.user) {
      const phone = (data.user.phone || "").replace(/^91/, "");
      const email = data.user.email || null;
      const user = await prisma.user.findFirst({
        where: {
          OR: [phone ? { phone } : undefined, email ? { email } : undefined].filter(Boolean),
        },
      });
      if (user) return user;
    }
  }

  // Development-only fallback so local work without Supabase still functions.
  if (process.env.NODE_ENV !== "production") {
    const devId = process.env.DEV_FALLBACK_USER;
    if (devId) {
      const u = await prisma.user.findUnique({ where: { id: devId } });
      if (u) return u;
    }
    return prisma.user.findFirst({ where: { role: "BUYER" } });
  }

  return null;
}

/** Require an authenticated user with one of the allowed roles. Throws AuthError. */
export async function requireUser(roles = null) {
  const user = await getSessionUser();
  if (!user) {
    const err = new Error("Authentication required");
    err.status = 401;
    throw err;
  }
  if (roles && !roles.includes(user.role)) {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }
  return user;
}

/** Resolve the authenticated user's manufacturer profile (or null). */
export async function getSessionManufacturer() {
  const user = await getSessionUser();
  if (!user) return null;
  return prisma.manufacturer.findFirst({ where: { userId: user.id } });
}

/** Wrap a handler so thrown AuthErrors become proper JSON responses. */
export function handleAuthError(err) {
  const { NextResponse } = require("next/server");
  const status = err?.status || 500;
  const message =
    status === 401 ? "Authentication required" : status === 403 ? "Forbidden" : "Server error";
  return NextResponse.json({ error: message }, { status });
}
