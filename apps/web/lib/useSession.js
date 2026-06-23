"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Lightweight client session hook backed by /api/auth/session.
 * Exposes user, manufacturer, role helpers, and a logout() function.
 */
export function useSession() {
  const [user, setUser] = useState(null);
  const [manufacturer, setManufacturer] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/auth/session", { cache: "no-store" });
      const d = await r.json();
      setUser(d.user || null);
      setManufacturer(d.manufacturer || null);
    } catch {
      setUser(null);
      setManufacturer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    // Refresh on focus / when something dispatches "session:refresh"
    const onFocus = () => load();
    const onRefresh = () => load();
    window.addEventListener("focus", onFocus);
    window.addEventListener("session:refresh", onRefresh);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("session:refresh", onRefresh);
    };
  }, [load]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
    setUser(null);
    setManufacturer(null);
    window.location.href = "/";
  }, []);

  return {
    user,
    manufacturer,
    loading,
    isAuthed: Boolean(user),
    isSeller: Boolean(manufacturer),
    isAdmin: user?.role === "ADMIN",
    refresh: load,
    logout,
  };
}
