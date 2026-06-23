"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Wallet, User, Heart } from "lucide-react";

const TABS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/wishlist", icon: Heart, label: "Saved" },
  { href: "/wallet", icon: Wallet, label: "Wallet" },
  { href: "/profile", icon: User, label: "Profile" },
];

// Mobile-only bottom navigation bar — hidden on md+ screens via Tailwind.
export default function BottomTabNav() {
  const pathname = usePathname();

  // Don't show on auth or admin pages
  if (pathname?.startsWith("/auth") || pathname?.startsWith("/admin")) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t border-white/10 bg-black/90 backdrop-blur-md pb-safe"
      aria-label="Mobile navigation"
    >
      {TABS.map(({ href, icon: Icon, label }) => {
        const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-[10px] font-medium transition-colors ${
              active
                ? "text-[var(--color-brand,#F97316)]"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <Icon className={`w-5 h-5 ${active ? "stroke-[2.5px]" : ""}`} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
