"use client";

// =============================================================================
// SellerShell — the dashboard frame for every /manufacturer/* page.
//
// Provides a persistent left sidebar with the full Seller menu, a topbar with
// quick KYC status + a "Switch to buyer" pill, and a content area. Sidebar
// collapses to icons on tablet, drawer on mobile.
// =============================================================================

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Users,
  Wallet as WalletIcon,
  BarChart3,
  Star,
  ShieldCheck,
  Settings,
  Megaphone,
  Bell,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ArrowLeftRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/ui/Logo";
import { useSession } from "@/lib/useSession";

const MENU = [
  {
    section: "Overview",
    items: [
      { href: "/manufacturer", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/manufacturer/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    section: "Batches",
    items: [
      { href: "/manufacturer/batches", label: "My Batches", icon: Package },
      { href: "/manufacturer/batch/new", label: "Create Batch", icon: PlusCircle, accent: true },
      { href: "/manufacturer/orders", label: "Orders", icon: ShoppingBag },
    ],
  },
  {
    section: "Growth",
    items: [
      { href: "/manufacturer/customers", label: "Customers", icon: Users },
      { href: "/manufacturer/reviews", label: "Reviews", icon: Star },
      { href: "/manufacturer/promotions", label: "Promotions", icon: Megaphone },
    ],
  },
  {
    section: "Money",
    items: [
      { href: "/manufacturer/payouts", label: "Payouts", icon: WalletIcon },
    ],
  },
  {
    section: "Account",
    items: [
      { href: "/manufacturer/onboarding", label: "KYC & Verification", icon: ShieldCheck },
      { href: "/manufacturer/settings", label: "Settings", icon: Settings },
      { href: "/help", label: "Help Center", icon: HelpCircle },
    ],
  },
];

function isActive(pathname, item) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

export default function SellerShell({ children, manufacturer, user, kycStatus = "UNSUBMITTED" }) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Persist collapsed state
  useEffect(() => {
    const saved = localStorage.getItem("seller_sidebar_collapsed");
    if (saved === "1") setCollapsed(true);
  }, []);
  useEffect(() => {
    localStorage.setItem("seller_sidebar_collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  // Close drawer on route change
  useEffect(() => setDrawerOpen(false), [pathname]);

  const sidebarWidth = collapsed ? "w-[72px]" : "w-[256px]";

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex">
      {/* ====== Sidebar (desktop) ====== */}
      <aside
        className={`hidden lg:flex ${sidebarWidth} shrink-0 flex-col fixed inset-y-0 left-0 z-40
          bg-[var(--bg-surface)] border-r border-[var(--border-default)]
          transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]`}
      >
        <div className="h-16 px-4 flex items-center justify-between border-b border-[var(--border-default)]">
          <Link href="/manufacturer" className="flex items-center gap-2 overflow-hidden">
            <Logo size={28} />
            {!collapsed && (
              <span className="font-bold tracking-tight text-[var(--text-primary)] truncate">
                Seller<span className="text-[var(--primary)]">Hub</span>
              </span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-1.5 rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors"
            title={collapsed ? "Expand" : "Collapse"}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {manufacturer && (
          <div className={`px-4 py-3 border-b border-[var(--border-default)] ${collapsed ? "px-2" : ""}`}>
            <BusinessBadge manufacturer={manufacturer} kycStatus={kycStatus} collapsed={collapsed} />
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-none">
          {MENU.map((group) => (
            <div key={group.section}>
              {!collapsed && (
                <h4 className="px-3 text-[10px] uppercase tracking-[0.14em] font-bold text-[var(--text-tertiary)] mb-1.5">
                  {group.section}
                </h4>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(pathname, item);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                          ${active
                            ? "bg-[var(--primary)]/12 text-[var(--primary)] shadow-[inset_0_0_0_1px_rgba(255,106,0,0.18)]"
                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"}
                          ${collapsed ? "justify-center" : ""}
                          ${item.accent && !active ? "text-[var(--primary)]" : ""}
                        `}
                      >
                        <Icon className="w-[18px] h-[18px] shrink-0" />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className={`p-2 border-t border-[var(--border-default)] space-y-1 ${collapsed ? "px-1" : ""}`}>
          <Link
            href="/"
            title="Switch to buyer view"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors ${collapsed ? "justify-center" : ""}`}
          >
            <ArrowLeftRight className="w-[18px] h-[18px]" />
            {!collapsed && <span>Switch to buyer</span>}
          </Link>
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--accent-danger-light)] hover:text-[var(--accent-danger)] transition-colors ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut className="w-[18px] h-[18px]" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* ====== Mobile drawer ====== */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="relative w-[280px] h-full bg-[var(--bg-surface)] border-r border-[var(--border-default)] flex flex-col animate-in slide-in-from-left duration-300">
            <div className="h-16 px-4 flex items-center justify-between border-b border-[var(--border-default)]">
              <div className="flex items-center gap-2">
                <Logo size={28} />
                <span className="font-bold">Seller<span className="text-[var(--primary)]">Hub</span></span>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-md hover:bg-[var(--bg-elevated)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            {manufacturer && (
              <div className="px-4 py-3 border-b border-[var(--border-default)]">
                <BusinessBadge manufacturer={manufacturer} kycStatus={kycStatus} />
              </div>
            )}
            <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
              {MENU.map((group) => (
                <div key={group.section}>
                  <h4 className="px-2 text-[10px] uppercase tracking-[0.14em] font-bold text-[var(--text-tertiary)] mb-1.5">
                    {group.section}
                  </h4>
                  <ul className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(pathname, item);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                              ${active ? "bg-[var(--primary)]/12 text-[var(--primary)]" : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"}`}
                          >
                            <Icon className="w-[18px] h-[18px]" />
                            <span>{item.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
            <div className="p-3 border-t border-[var(--border-default)] space-y-1">
              <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)]">
                <ArrowLeftRight className="w-[18px] h-[18px]" />
                <span>Switch to buyer</span>
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--accent-danger)]"
              >
                <LogOut className="w-[18px] h-[18px]" />
                <span>Sign out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ====== Main content area ====== */}
      <div className={`flex-1 min-w-0 flex flex-col ${collapsed ? "lg:ml-[72px]" : "lg:ml-[256px]"} transition-[margin] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]`}>
        <SellerTopbar
          onMenuClick={() => setDrawerOpen(true)}
          user={user}
          manufacturer={manufacturer}
          kycStatus={kycStatus}
        />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

function BusinessBadge({ manufacturer, kycStatus, collapsed = false }) {
  if (collapsed) {
    return (
      <div className="flex justify-center" title={manufacturer.businessName}>
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-bold text-sm">
          {manufacturer.businessName?.charAt(0).toUpperCase()}
        </div>
      </div>
    );
  }
  const verified = kycStatus === "VERIFIED";
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-10 h-10 shrink-0 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-bold text-sm">
        {manufacturer.businessName?.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
            {manufacturer.businessName}
          </p>
          {verified && <ShieldCheck className="w-3.5 h-3.5 text-[var(--success)] shrink-0" />}
        </div>
        <p className="text-[11px] text-[var(--text-tertiary)] truncate">
          {manufacturer.city}, {manufacturer.state}
        </p>
      </div>
    </div>
  );
}

function SellerTopbar({ onMenuClick, user, manufacturer, kycStatus }) {
  const needsKyc = kycStatus !== "VERIFIED";
  return (
    <header className="sticky top-0 z-30 h-14 border-b border-[var(--border-default)] bg-[var(--bg-glass)] backdrop-blur-xl">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          {needsKyc && (
            <Link
              href="/manufacturer/onboarding"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold
                bg-[var(--accent-warning-light)] text-[var(--accent-warning)] hover:bg-[var(--accent-warning-light)]/60 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Complete KYC to start selling
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          {manufacturer?.slug && (
            <Link
              href={`/manufacturer/${manufacturer.slug}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
              title="View your public seller page"
            >
              View storefront
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
          <Link
            href="/manufacturer/notifications"
            className="p-2 rounded-md hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-[18px] h-[18px]" />
          </Link>
          <div className="hidden sm:flex items-center gap-2 pl-2 ml-1 border-l border-[var(--border-default)]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "S"}
            </div>
            <div className="leading-tight">
              <p className="text-[12px] font-semibold text-[var(--text-primary)]">{user?.name || "Seller"}</p>
              <p className="text-[10px] text-[var(--text-tertiary)]">Seller account</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
