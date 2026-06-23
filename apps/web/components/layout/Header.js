"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Menu, X, Search, Bell, Sun, Moon,
  ShoppingCart, Factory, Info, ChevronDown, ChevronRight,
  Compass, Package, Wallet, HelpCircle, Plus,
  BookOpen, Terminal, Mail, Award, Zap, Users, UserPlus,
  TrendingUp, ShoppingBag, Cpu, Shirt, Home, Wheat, Sparkles,
  PenTool, Dumbbell, LogOut, ArrowRight, Briefcase
} from "lucide-react";
import { CATEGORIES } from "@/lib/mock-data";
import Logo from "@/components/ui/Logo";
import { useSession } from "@/lib/useSession";

const CATEGORY_ICON_MAP = {
  fmcg: ShoppingBag,
  electronics: Cpu,
  apparel: Shirt,
  'home-kitchen': Home,
  agriculture: Wheat,
  'personal-care': Sparkles,
  stationery: PenTool,
  'sports-fitness': Dumbbell,
};

function HeaderContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthed, isSeller, logout } = useSession();

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeRail, setActiveRail] = useState("buyer");
  const [labelsExpanded, setLabelsExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);
  const [customAvatar, setCustomAvatar] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const searchInputRef = useRef(null);

  useEffect(() => {
    const loadAvatar = () => {
      const stored = localStorage.getItem(`profile_avatar_ashish.sharma@gmail.com`);
      if (stored) {
        setCustomAvatar(stored);
      } else {
        setCustomAvatar(null);
      }
    };
    loadAvatar();
    window.addEventListener("avatarChanged", loadAvatar);
    return () => window.removeEventListener("avatarChanged", loadAvatar);
  }, []);

  // Scroll listener for bottom border on navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut listener (Cmd/Ctrl + K or /)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "/" && document.activeElement !== searchInputRef.current && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // — On mount, restore saved theme from localStorage (only runs once on client)
  useEffect(() => {
    const saved = localStorage.getItem("bb_theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  // — On change, persist to localStorage + sync to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("bb_theme", theme);
  }, [theme]);

  // Synchronize search input text with URL query params
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  // Auto-switch rail depending on the current route
  useEffect(() => {
    if (pathname.startsWith("/manufacturer")) {
      setActiveRail("mfg");
    } else {
      setActiveRail("buyer");
    }
  }, [pathname]);

  // Lock body scroll on mobile drawer open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Dynamically configure left margin offset for page elements based on sidebar width
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 992;
      setIsDesktop(desktop);
      if (desktop) {
        document.documentElement.style.setProperty(
          "--current-sidebar-width",
          sidebarExpanded ? "280px" : "72px"
        );
      } else {
        document.documentElement.style.setProperty("--current-sidebar-width", "0px");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarExpanded]);

  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  const handleHamburgerClick = () => {
    if (isDesktop) {
      setSidebarExpanded(!sidebarExpanded);
    } else {
      setMobileMenuOpen(!mobileMenuOpen);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/");
    }
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    router.push("/");
  };

  const railConfig = [
    { id: "buyer", icon: ShoppingCart, label: "Buyer" },
    { id: "mfg", icon: Factory, label: "Mfg" },
    { id: "help", icon: Info, label: "Help" },
  ];

  return (
    <>
      {/* Top Navbar */}
      <header className={`fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-6 bg-[#09090b]/85 backdrop-blur-[12px] z-[1050] select-none transition-all duration-200 ${scrolled ? "navbar--scrolled border-b border-white/7" : "border-b border-transparent"}`}>
        
        {/* Left Side: Hamburger & Brand Logo */}
        <div className="flex items-center gap-4">
          <button
            className="p-2 hover:bg-neutral-900 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
            onClick={handleHamburgerClick}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex items-center gap-3 text-white decoration-transparent">
            <Logo className="w-8 h-8" />
            <div className="flex flex-col justify-center leading-none">
              <span className="text-sm font-display font-extrabold tracking-[-0.02em] text-white">BulkBlitz</span>
            </div>
          </Link>
        </div>

        {/* Center Side: Search Bar */}
        <div className="flex-1 max-w-[480px] focus-within:max-w-[560px] mx-8 hidden md:block transition-all duration-200 ease-in-out">
          <form className="relative flex items-center w-full bg-[#111113] hover:bg-[#18181b] border border-white/5 rounded-xl px-4 py-1.5 focus-within:border-[var(--color-brand)] focus-within:ring-2 focus-within:ring-[var(--color-brand-glow)] transition-all duration-200" onSubmit={handleSearchSubmit}>
            <Search className="w-4 h-4 text-neutral-500 mr-2.5 flex-shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              className="w-full bg-transparent border-none outline-none text-white text-xs placeholder-neutral-500"
              placeholder="Search batches, categories, manufacturers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery ? (
              <button
                type="button"
                className="text-neutral-500 hover:text-neutral-300 text-xs px-1 cursor-pointer"
                onClick={handleSearchClear}
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[9px] font-medium text-neutral-500 leading-none">
                <span>⌘</span>K
              </kbd>
            )}
          </form>
        </div>

        {/* Right Side: Quick Settings & User Status */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-[0.08em] uppercase border border-white/5 bg-neutral-900 text-neutral-400">
            {activeRail === "buyer" ? "Buyer" : activeRail === "mfg" ? "Mfg" : "Info"}
          </span>

          {/* Notifications bell */}
          <button
            className="p-2 hover:bg-neutral-900 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center relative"
            onClick={() => alert("Notifications sandbox triggered!")}
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-brand)] animate-pulse" />
          </button>

          {/* Theme Switcher */}
          <button
            className="p-2 hover:bg-neutral-900 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
          </button>

          {/* Auth state: Sign-in CTA when logged out · Avatar + (optional) "Go to Seller Hub" when logged in */}
          {!isAuthed ? (
            <>
              <Link
                href="/auth"
                className="hidden sm:inline-flex items-center justify-center px-4 py-1.5 rounded-lg btn-primary-new font-bold text-xs"
              >
                Sign in
              </Link>
            </>
          ) : (
            <>
              {isSeller && (
                <Link
                  href="/manufacturer"
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--primary)]/12 text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-colors"
                  title="Switch to Seller Hub"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Seller Hub
                </Link>
              )}
              <Link href="/profile" className="relative group flex items-center cursor-pointer" title="My Profile">
                <div className="w-8 h-8 rounded-full border border-primary/30 bg-primary/10 text-primary flex items-center justify-center text-xs font-bold hover:scale-105 transition-transform duration-200 overflow-hidden">
                  {customAvatar ? (
                    <img src={customAvatar} className="w-full h-full object-cover" alt="User Profile" />
                  ) : (
                    <span>{(user?.name || "U").charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="absolute top-12 right-0 bg-neutral-900 border border-white/5 text-white text-[10px] font-semibold px-2 py-1 rounded-md shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                  {user?.name} · Trust {user?.trustScore ?? 100}
                </span>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ─────────────────────────────────────────────
         Left Sidebar Container
      ───────────────────────────────────────────── */}
      <aside className={`fixed top-14 left-0 bottom-0 z-50 flex bg-[#09090b]/90 backdrop-blur-2xl transition-all duration-300 overflow-hidden ${
        isDesktop
          ? sidebarExpanded
            ? "w-[280px] border-r border-white/5"
            : "w-18 border-r border-white/5"
          : "w-0 border-r-0"
      }`}>
        
        {/* Leftmost Column: App Rail (72px / w-18) */}
        <div className="w-18 flex flex-col items-center py-4 gap-6 border-r border-white/5 flex-shrink-0">
          {railConfig.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeRail === item.id;
            return (
              <button
                key={item.id}
                className={`relative flex flex-col items-center justify-center w-full py-3 text-neutral-400 hover:text-white transition-all duration-150 cursor-pointer hover:bg-neutral-900/50 hover:translate-x-0.5 ${isActive ? "text-primary hover:text-primary" : ""}`}
                onClick={() => {
                  setActiveRail(item.id);
                  setSidebarExpanded(isActive ? !sidebarExpanded : true);
                }}
                title={item.label}
                aria-label={`${item.label} navigation`}
              >
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-[var(--color-brand)] rounded-r transition-all duration-200" />
                )}
                <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-primary/10 text-primary" : ""}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Navigation Pane (208px) */}
        {sidebarExpanded && (
          <div className="w-[208px] flex flex-col py-4 px-3 flex-shrink-0 overflow-y-auto select-none">
            
            {/* Compose/Action Button */}
            <div className="mb-4">
              {activeRail === "buyer" && (
                <Link href="/" className="w-full flex items-center justify-center gap-2 py-2 rounded-xl btn-primary-new text-xs font-bold shadow-lg shadow-primary/20">
                  <Search className="w-3.5 h-3.5" />
                  <span>Shop Batches</span>
                </Link>
              )}
              {activeRail === "mfg" && (
                isSeller ? (
                  <Link href="/manufacturer/batch/new" className="w-full flex items-center justify-center gap-2 py-2 rounded-xl btn-primary-new text-xs font-bold shadow-lg shadow-primary/20">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Batch</span>
                  </Link>
                ) : (
                  <Link href={isAuthed ? "/become-a-seller" : "/auth?intent=seller"} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl btn-primary-new text-xs font-bold shadow-lg shadow-primary/20">
                    <Factory className="w-3.5 h-3.5" />
                    <span>Become a Seller</span>
                  </Link>
                )
              )}
              {activeRail === "help" && (
                <button
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl btn-primary-new text-xs font-bold shadow-lg shadow-primary/20 cursor-pointer"
                  onClick={() => alert("Customer Support Sandbox Triggered!")}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Get Help</span>
                </button>
              )}
            </div>

            {/* Navigation Lists */}
            <nav className="flex flex-col gap-1">
              {activeRail === "buyer" && (
                <>
                  <Link
                    href="/"
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold hover:bg-neutral-900 transition-colors ${pathname === "/" ? "bg-primary/10 text-primary font-bold hover:bg-primary/10" : ""}`}
                  >
                    <Zap className="w-4 h-4 shrink-0 text-[var(--color-live)]" />
                    <div className="flex flex-col items-start leading-tight">
                      <span>Shop Batches</span>
                      <span className="text-[10px] text-[var(--color-live)]">86 live now</span>
                    </div>
                  </Link>
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold hover:bg-neutral-900 transition-colors"
                  >
                    <Compass className="w-4 h-4 shrink-0" />
                    <span>Discover Batches</span>
                  </Link>
                  <Link
                    href="/orders"
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold hover:bg-neutral-900 transition-colors ${pathname === "/orders" ? "bg-primary/10 text-primary font-bold hover:bg-primary/10" : ""}`}
                  >
                    <Package className="w-4 h-4 shrink-0" />
                    <div className="flex-1 flex items-center justify-between">
                      <span>My Orders</span>
                      <span className="text-[10px] font-bold bg-[var(--color-brand-dim)] text-[var(--color-brand)] px-1.5 py-0.5 rounded-full">2</span>
                    </div>
                  </Link>
                  <Link
                    href="/wallet"
                    className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold hover:bg-neutral-900 transition-colors ${pathname === "/wallet" ? "bg-primary/10 text-primary font-bold hover:bg-primary/10" : ""}`}
                  >
                    <Wallet className="w-4 h-4 shrink-0" />
                    <div className="flex flex-col items-start leading-tight">
                      <span>BulkCash Wallet</span>
                      <span className="text-[10px] text-neutral-500 group-hover:hidden transition-all">₹0 balance</span>
                      <span className="text-[10px] text-[var(--color-brand)] font-bold hidden group-hover:inline transition-all">+ Add Funds</span>
                    </div>
                  </Link>
                  <Link
                    href="/#how-it-works"
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold hover:bg-neutral-900 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 shrink-0" />
                    <span>How It Works</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold hover:bg-neutral-900 transition-colors"
                  >
                    <UserPlus className="w-4 h-4 shrink-0 text-[var(--color-brand)]" />
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex flex-col items-start leading-tight">
                        <span>Invite & Earn</span>
                        <span className="text-[9px] text-neutral-500">₹50 per referral</span>
                      </div>
                      <span className="text-[8px] font-extrabold bg-[var(--color-brand-dim)] text-[var(--color-brand)] px-1.5 py-0.5 rounded">NEW</span>
                    </div>
                  </Link>
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold hover:bg-neutral-900 transition-colors"
                  >
                    <TrendingUp className="w-4 h-4 shrink-0" />
                    <span>Trending Batches</span>
                  </Link>
                </>
              )}

              {activeRail === "mfg" && (
                isSeller ? (
                  <>
                    <Link href="/manufacturer" className={`flex items-center gap-3 px-3 py-2 rounded-full text-neutral-400 hover:text-white text-xs font-semibold hover:bg-neutral-900 transition-colors ${pathname === "/manufacturer" ? "bg-primary/10 text-primary font-bold hover:bg-primary/10" : ""}`}>
                      <Terminal className="w-4 h-4" /><span>Dashboard</span>
                    </Link>
                    <Link href="/manufacturer/batches" className="flex items-center gap-3 px-3 py-2 rounded-full text-neutral-400 hover:text-white text-xs font-semibold hover:bg-neutral-900 transition-colors">
                      <Package className="w-4 h-4" /><span>My Batches</span>
                    </Link>
                    <Link href="/manufacturer/orders" className="flex items-center gap-3 px-3 py-2 rounded-full text-neutral-400 hover:text-white text-xs font-semibold hover:bg-neutral-900 transition-colors">
                      <ShoppingBag className="w-4 h-4" /><span>Orders</span>
                    </Link>
                    <Link href="/manufacturer/analytics" className={`flex items-center gap-3 px-3 py-2 rounded-full text-neutral-400 hover:text-white text-xs font-semibold hover:bg-neutral-900 transition-colors ${pathname === "/manufacturer/analytics" ? "bg-primary/10 text-primary font-bold hover:bg-primary/10" : ""}`}>
                      <Award className="w-4 h-4" /><span>Analytics</span>
                    </Link>
                    <Link href="/manufacturer/payouts" className="flex items-center gap-3 px-3 py-2 rounded-full text-neutral-400 hover:text-white text-xs font-semibold hover:bg-neutral-900 transition-colors">
                      <Wallet className="w-4 h-4" /><span>Payouts</span>
                    </Link>
                    <Link href="/manufacturer/onboarding" className="flex items-center gap-3 px-3 py-2 rounded-full text-neutral-400 hover:text-white text-xs font-semibold hover:bg-neutral-900 transition-colors">
                      <Award className="w-4 h-4" /><span>KYC</span>
                    </Link>
                  </>
                ) : (
                  <div className="p-3 rounded-xl bg-neutral-900/70 border border-white/5">
                    <p className="text-[11px] font-semibold text-white mb-1.5">Manufacture & list batches.</p>
                    <p className="text-[10px] text-neutral-400 leading-relaxed mb-2.5">Get pre-paid orders. 4% fee, 3-day payout.</p>
                    <Link
                      href={isAuthed ? "/become-a-seller" : "/auth?intent=seller"}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary hover:underline"
                    >
                      <Factory className="w-3 h-3" /> Become a Seller <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )
              )}

              {activeRail === "help" && (
                <>
                  <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-full text-neutral-400 hover:text-white text-xs font-semibold hover:bg-neutral-900 transition-colors">
                    <BookOpen className="w-4 h-4" />
                    <span>Help Center</span>
                  </Link>
                  <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-full text-neutral-400 hover:text-white text-xs font-semibold hover:bg-neutral-900 transition-colors">
                    <Terminal className="w-4 h-4" />
                    <span>Sandbox Tool</span>
                  </Link>
                  <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-full text-neutral-400 hover:text-white text-xs font-semibold hover:bg-neutral-900 transition-colors">
                    <Mail className="w-4 h-4" />
                    <span>Contact Support</span>
                  </Link>
                </>
              )}
            </nav>

            <div className="h-px bg-white/5 my-4 border-[var(--color-border)]" />

            {/* Collapsible Labels / Categories list (only in buyer mode) */}
            {activeRail === "buyer" && (
              <div className="flex flex-col gap-1">
                <div
                  className="flex items-center justify-between px-3 py-1.5 text-[9px] font-bold text-neutral-500 hover:text-neutral-400 uppercase tracking-widest cursor-pointer"
                  onClick={() => setLabelsExpanded(!labelsExpanded)}
                  role="button"
                  aria-expanded={labelsExpanded}
                >
                  <span>Product Categories</span>
                  {labelsExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </div>

                {labelsExpanded && (
                  <div className="flex flex-col gap-0.5 mt-1">
                    {CATEGORIES.map((cat) => {
                      const isActive = searchParams.get("category") === cat.id;
                      const CatIcon = CATEGORY_ICON_MAP[cat.id] || Compass;
                      return (
                        <Link
                          key={cat.id}
                          href={`/?category=${cat.id}`}
                          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-neutral-400 hover:text-white text-xs transition-colors relative group ${isActive ? "bg-neutral-900 text-white font-semibold" : ""}`}
                        >
                          {isActive && (
                            <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[var(--color-brand)] rounded-r" />
                          )}
                          <CatIcon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-[var(--color-brand)]" : "text-neutral-500 group-hover:text-neutral-300"}`} />
                          <span className="truncate flex-1">{cat.name}</span>
                          <span className="text-[11px] font-semibold text-neutral-500 ml-auto">{cat.count}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </aside>

      {/* ─────────────────────────────────────────────
         Responsive Mobile Drawer
      ───────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1100]"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={`fixed top-0 bottom-0 left-0 w-[280px] bg-neutral-950/95 backdrop-blur-2xl shadow-2xl z-[1200] flex flex-col transform transition-transform duration-300 ease-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 text-white decoration-transparent" onClick={() => setMobileMenuOpen(false)}>
            <Logo className="w-7 h-7" />
            <span className="text-sm font-display font-black tracking-tight">BulkBlitz</span>
          </Link>
          <button
            className="text-neutral-400 hover:text-white text-lg p-1 cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {/* Mobile Portal Mode Switcher */}
          <div className="grid grid-cols-2 gap-2">
            <button
              className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border cursor-pointer ${activeRail === "buyer" ? "bg-primary/10 text-primary border-primary/30" : "bg-neutral-900 border-white/5 text-neutral-400"}`}
              onClick={() => setActiveRail("buyer")}
            >
              Buyer Portal
            </button>
            <button
              className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border cursor-pointer ${activeRail === "mfg" ? "bg-primary/10 text-primary border-primary/30" : "bg-neutral-900 border-white/5 text-neutral-400"}`}
              onClick={() => setActiveRail("mfg")}
            >
              Mfg Portal
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {activeRail === "buyer" && (
              <>
                <Link href="/" className="flex items-center gap-3 px-4 py-2.5 text-neutral-400 hover:text-white text-sm font-semibold hover:bg-neutral-900 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                  <Compass className="w-4 h-4" />
                  <span>Discover Batches</span>
                </Link>
                <Link href="/orders" className="flex items-center gap-3 px-4 py-2.5 text-neutral-400 hover:text-white text-sm font-semibold hover:bg-neutral-900 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                  <Package className="w-4 h-4" />
                  <span>My Orders</span>
                  <span className="ml-auto text-[10px] font-bold bg-danger/10 text-danger px-1.5 py-0.5 rounded-full">2</span>
                </Link>
                <Link href="/wallet" className="flex items-center gap-3 px-4 py-2.5 text-neutral-400 hover:text-white text-sm font-semibold hover:bg-neutral-900 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                  <Wallet className="w-4 h-4" />
                  <span>BulkCash Wallet</span>
                </Link>
                <Link href="/#how-it-works" className="flex items-center gap-3 px-4 py-2.5 text-neutral-400 hover:text-white text-sm font-semibold hover:bg-neutral-900 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                  <HelpCircle className="w-4 h-4" />
                  <span>How It Works</span>
                </Link>

                <div className="h-px bg-white/5 my-4" />
                <div className="px-4 text-[9px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Categories</div>
                
                {CATEGORIES.map(cat => (
                  <Link
                    key={cat.id}
                    href={`/?category=${cat.id}`}
                    className="flex items-center gap-3 px-4 py-2 text-neutral-400 hover:text-white text-xs rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </>
            )}

            {activeRail === "mfg" && (
              isSeller ? (
                <>
                  <Link href="/manufacturer" className="flex items-center gap-3 px-4 py-2.5 text-neutral-400 hover:text-white text-sm font-semibold hover:bg-neutral-900 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    <Terminal className="w-4 h-4" /><span>Dashboard</span>
                  </Link>
                  <Link href="/manufacturer/batches" className="flex items-center gap-3 px-4 py-2.5 text-neutral-400 hover:text-white text-sm font-semibold hover:bg-neutral-900 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    <Package className="w-4 h-4" /><span>My Batches</span>
                  </Link>
                  <Link href="/manufacturer/orders" className="flex items-center gap-3 px-4 py-2.5 text-neutral-400 hover:text-white text-sm font-semibold hover:bg-neutral-900 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    <ShoppingBag className="w-4 h-4" /><span>Orders</span>
                  </Link>
                  <Link href="/manufacturer/analytics" className="flex items-center gap-3 px-4 py-2.5 text-neutral-400 hover:text-white text-sm font-semibold hover:bg-neutral-900 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    <Award className="w-4 h-4" /><span>Analytics</span>
                  </Link>
                  <Link href="/manufacturer/payouts" className="flex items-center gap-3 px-4 py-2.5 text-neutral-400 hover:text-white text-sm font-semibold hover:bg-neutral-900 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    <Wallet className="w-4 h-4" /><span>Payouts</span>
                  </Link>
                  <Link href="/manufacturer/batch/new" className="flex items-center gap-3 px-4 py-2.5 text-primary text-sm font-bold hover:bg-primary/10 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    <Plus className="w-4 h-4" /><span>Create Batch</span>
                  </Link>
                </>
              ) : (
                <Link
                  href={isAuthed ? "/become-a-seller" : "/auth?intent=seller"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary text-sm font-bold"
                >
                  <Factory className="w-4 h-4" /><span>Become a Seller</span><ArrowRight className="w-4 h-4 ml-auto" />
                </Link>
              )
            )}
          </nav>

          {/* Account section (mobile) */}
          <div className="mt-auto pt-4 border-t border-white/5 space-y-1">
            {isAuthed ? (
              <button
                onClick={() => { setMobileMenuOpen(false); logout(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-neutral-400 hover:text-danger hover:bg-danger/5 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" /><span>Sign out</span>
              </button>
            ) : (
              <Link href="/auth" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-4 py-2.5 rounded-lg btn-primary-new text-sm font-bold">
                Sign in / Sign up
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function HeaderSkeleton() {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[#09090b] border-b border-white/5 z-[1050]" />
  );
}

function HeaderRouteGate() {
  const pathname = usePathname();
  // SellerShell renders its own chrome on /manufacturer/*; skip the global header there.
  if (pathname?.startsWith("/manufacturer")) return null;
  return <HeaderContent />;
}

export default function Header() {
  return (
    <Suspense fallback={<HeaderSkeleton />}>
      <HeaderRouteGate />
    </Suspense>
  );
}
