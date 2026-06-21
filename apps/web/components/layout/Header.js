"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { 
  Menu, X, Search, Bell, Sun, Moon, 
  ShoppingCart, Factory, Info, ChevronDown, ChevronRight, 
  Compass, Package, Wallet, HelpCircle, Plus, 
  BookOpen, Terminal, Mail, Award
} from "lucide-react";
import { USER, CATEGORIES } from "@/lib/mock-data";

function HeaderContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeRail, setActiveRail] = useState("buyer");
  const [labelsExpanded, setLabelsExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);

  // Synchronize theme attribute
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
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
          sidebarExpanded ? "280px" : "0px"
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
      {/* ─────────────────────────────────────────────
         Top Header Bar
      ───────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 bg-neutral-950/80 backdrop-blur-xl border-b border-white/5 z-[1050] select-none">
        
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
            {/* Minimal High-End stacked boxes style logo */}
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-display font-black text-white text-base shadow-lg shadow-primary/25">
              B
            </div>
            <div className="flex flex-col justify-center leading-none">
              <span className="text-sm font-display font-black tracking-tight text-white">BulkBlitz</span>
              <span className="text-[9px] font-medium tracking-wide text-neutral-500 uppercase mt-0.5">Buy Together. Pay Less.</span>
            </div>
          </Link>
        </div>

        {/* Center Side: Search Bar */}
        <div className="flex-1 max-w-lg mx-8 hidden md:block">
          <form className="relative flex items-center w-full bg-neutral-900/50 hover:bg-neutral-900/80 border border-white/5 rounded-xl px-4 py-1.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all duration-200" onSubmit={handleSearchSubmit}>
            <Search className="w-4 h-4 text-neutral-500 mr-2.5 flex-shrink-0" />
            <input
              type="text"
              className="w-full bg-transparent border-none outline-none text-white text-xs placeholder-neutral-500"
              placeholder="Search active batches, categories, manufacturers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="text-neutral-500 hover:text-neutral-300 text-xs px-1 cursor-pointer"
                onClick={handleSearchClear}
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>

        {/* Right Side: Quick Settings & User Status */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-primary/20 bg-primary/10 text-primary">
            {activeRail === "buyer" ? "🛒 Buyer" : activeRail === "mfg" ? "🏭 Mfg" : "ℹ️ Info"}
          </span>

          {/* Theme Switcher */}
          <button
            className="p-2 hover:bg-neutral-900 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
          </button>

          {/* Get Started CTA */}
          <Link href="/auth" className="hidden sm:inline-flex items-center justify-center px-4 py-1.5 rounded-lg btn-primary-new font-bold text-xs">
            Get Started
          </Link>

          {/* User Profile Tooltip */}
          <Link href="/profile" className="relative group flex items-center cursor-pointer" title="My Profile">
            <div className="w-8 h-8 rounded-full border border-primary/30 bg-primary/10 text-primary flex items-center justify-center text-xs font-bold hover:scale-105 transition-transform duration-200">
              {USER.avatar}
            </div>
            <span className="absolute top-12 right-0 bg-neutral-900 border border-white/5 text-white text-[10px] font-semibold px-2 py-1 rounded-md shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
              Trust Score: {USER.trustScore}
            </span>
          </Link>
        </div>
      </header>

      {/* ─────────────────────────────────────────────
         Left Sidebar Container
      ───────────────────────────────────────────── */}
      <aside className={`fixed top-16 left-0 bottom-0 z-50 flex border-white/5 bg-neutral-950/90 backdrop-blur-2xl transition-all duration-300 overflow-hidden ${sidebarExpanded ? "w-[280px] border-r" : "w-0 border-r-0"}`}>
        
        {/* Leftmost Column: App Rail (72px / w-18) */}
        <div className="w-18 flex flex-col items-center py-4 gap-6 border-r border-white/5 flex-shrink-0">
          {railConfig.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeRail === item.id;
            return (
              <button
                key={item.id}
                className={`flex flex-col items-center gap-1.5 w-full py-2 text-neutral-400 hover:text-white transition-colors cursor-pointer ${isActive ? "text-primary hover:text-primary" : ""}`}
                onClick={() => {
                  setActiveRail(item.id);
                  setSidebarExpanded(true);
                }}
                aria-label={`${item.label} navigation`}
              >
                <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-primary/10 text-primary" : "hover:bg-neutral-900"}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                {/* Hide text when collapsed to avoid cramped layout */}
                <span className={`text-[9px] font-bold tracking-wider uppercase transition-all duration-200 ${sidebarExpanded ? "opacity-100 scale-100" : "opacity-0 scale-90 h-0 overflow-hidden"}`}>
                  {item.label}
                </span>
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
                <Link href="/manufacturer/batch/new" className="w-full flex items-center justify-center gap-2 py-2 rounded-xl btn-primary-new text-xs font-bold shadow-lg shadow-primary/20">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Batch</span>
                </Link>
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
                    className={`flex items-center gap-3 px-3 py-2 rounded-full text-neutral-400 hover:text-white text-xs font-semibold hover:bg-neutral-900 transition-colors ${pathname === "/" ? "bg-primary/10 text-primary font-bold hover:bg-primary/10" : ""}`}
                  >
                    <Compass className="w-4 h-4" />
                    <span>Discover Batches</span>
                  </Link>
                  <Link
                    href="/orders"
                    className={`flex items-center gap-3 px-3 py-2 rounded-full text-neutral-400 hover:text-white text-xs font-semibold hover:bg-neutral-900 transition-colors ${pathname === "/orders" ? "bg-primary/10 text-primary font-bold hover:bg-primary/10" : ""}`}
                  >
                    <Package className="w-4 h-4" />
                    <span>My Orders</span>
                    <span className="ml-auto text-[10px] font-bold bg-danger/10 text-danger px-1.5 py-0.5 rounded-full">2</span>
                  </Link>
                  <Link
                    href="/wallet"
                    className={`flex items-center gap-3 px-3 py-2 rounded-full text-neutral-400 hover:text-white text-xs font-semibold hover:bg-neutral-900 transition-colors ${pathname === "/wallet" ? "bg-primary/10 text-primary font-bold hover:bg-primary/10" : ""}`}
                  >
                    <Wallet className="w-4 h-4" />
                    <span>BulkCash Wallet</span>
                  </Link>
                  <Link
                    href="/#how-it-works"
                    className="flex items-center gap-3 px-3 py-2 rounded-full text-neutral-400 hover:text-white text-xs font-semibold hover:bg-neutral-900 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>How It Works</span>
                  </Link>
                </>
              )}

              {activeRail === "mfg" && (
                <>
                  <Link
                    href="/manufacturer"
                    className={`flex items-center gap-3 px-3 py-2 rounded-full text-neutral-400 hover:text-white text-xs font-semibold hover:bg-neutral-900 transition-colors ${pathname === "/manufacturer" ? "bg-primary/10 text-primary font-bold hover:bg-primary/10" : ""}`}
                  >
                    <Terminal className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/manufacturer/analytics"
                    className={`flex items-center gap-3 px-3 py-2 rounded-full text-neutral-400 hover:text-white text-xs font-semibold hover:bg-neutral-900 transition-colors ${pathname === "/manufacturer/analytics" ? "bg-primary/10 text-primary font-bold hover:bg-primary/10" : ""}`}
                  >
                    <Award className="w-4 h-4" />
                    <span>Analytics</span>
                  </Link>
                  <Link
                    href="/manufacturer/batch/new"
                    className={`flex items-center gap-3 px-3 py-2 rounded-full text-neutral-400 hover:text-white text-xs font-semibold hover:bg-neutral-900 transition-colors ${pathname === "/manufacturer/batch/new" ? "bg-primary/10 text-primary font-bold hover:bg-primary/10" : ""}`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Batch</span>
                  </Link>
                </>
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

            <div className="h-px bg-white/5 my-4" />

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
                      return (
                        <Link
                          key={cat.id}
                          href={`/?category=${cat.id}`}
                          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full text-neutral-400 hover:text-white text-xs transition-colors ${isActive ? "bg-neutral-900 text-white font-semibold" : ""}`}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="text-xs">{cat.icon}</span>
                          <span className="truncate flex-1">{cat.name}</span>
                          <span className="text-[10px] font-bold text-neutral-500">{cat.count}</span>
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
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center font-display font-black text-white text-sm">
              B
            </div>
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
              <>
                <Link href="/manufacturer" className="flex items-center gap-3 px-4 py-2.5 text-neutral-400 hover:text-white text-sm font-semibold hover:bg-neutral-900 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                  <Terminal className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link href="/manufacturer/analytics" className="flex items-center gap-3 px-4 py-2.5 text-neutral-400 hover:text-white text-sm font-semibold hover:bg-neutral-900 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                  <Award className="w-4 h-4" />
                  <span>Analytics</span>
                </Link>
                <Link href="/manufacturer/batch/new" className="flex items-center gap-3 px-4 py-2.5 text-neutral-400 hover:text-white text-sm font-semibold hover:bg-neutral-900 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                  <Plus className="w-4 h-4" />
                  <span>Create Batch</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}

function HeaderSkeleton() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-neutral-950 border-b border-white/5 z-[1050]" />
  );
}

export default function Header() {
  return (
    <Suspense fallback={<HeaderSkeleton />}>
      <HeaderContent />
    </Suspense>
  );
}
