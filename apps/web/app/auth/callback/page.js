"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Supabase OAuth returns the access token in the URL hash. We forward it to the
// server to set the httpOnly session cookie, then redirect home.
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function finish() {
      try {
        const hash = window.location.hash.startsWith("#")
          ? window.location.hash.slice(1)
          : window.location.hash;
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const expiresIn = params.get("expires_in");
        if (accessToken) {
          await fetch("/api/auth/callback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken, expiresIn }),
          });
        }
      } catch {
        /* ignore */
      } finally {
        router.replace("/");
      }
    }
    finish();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="flex items-center gap-3 text-neutral-300">
        <Loader2 className="w-5 h-5 animate-spin" />
        Signing you in…
      </div>
    </div>
  );
}
