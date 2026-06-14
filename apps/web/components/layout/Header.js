"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { USER, CATEGORIES } from "@/lib/mock-data";

function HeaderContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeRail, setActiveRail] = useState("buyer");
  const [labelsExpanded, setLabelsExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");
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

  return (
    <>
      {/* ─────────────────────────────────────────────
         Gmail-Style Top Header Bar
      ───────────────────────────────────────────── */}
      <header className="gmail-header">
        <div className="gmail-header__left">
          {/* Hamburger toggle */}
          <button
            className="gmail-header__hamburger"
            onClick={handleHamburgerClick}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Logo & Subtitle */}
          <Link href="/" className="gmail-header__logo">
            <div className="gmail-header__logo-icon">
              <svg
                width="28"
                height="28"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="32" height="32" rx="8" fill="url(#logo-grad)" />
                <path d="M8 20L12 10H15L11 20H8Z" fill="white" fillOpacity="0.9" />
                <path d="M14 20L18 10H21L17 20H14Z" fill="white" fillOpacity="0.9" />
                <path d="M20 20L24 10H27L23 20H20Z" fill="white" fillOpacity="0.7" />
                <defs>
                  <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32">
                    <stop stopColor="#0D6EFD" />
                    <stop offset="1" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="gmail-header__logo-text">
              <span className="gmail-header__logo-name">BulkBlitz</span>
              <span className="gmail-header__logo-tagline">bulk up. price down.</span>
            </div>
          </Link>
        </div>

        {/* Central Search Bar */}
        <div className="gmail-header__search-container">
          <form className="gmail-header__search-form" onSubmit={handleSearchSubmit}>
            <span className="gmail-header__search-icon">🔍</span>
            <input
              type="text"
              className="gmail-header__search-input"
              placeholder="Search active batches, categories, manufacturers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="gmail-header__search-clear"
                onClick={handleSearchClear}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </form>
        </div>

        {/* Right Section Actions */}
        <div className="gmail-header__right">
          <span className="gmail-header__portal-badge">
            {activeRail === "buyer" ? "🛒 Buyer" : activeRail === "mfg" ? "🏭 Mfg" : "ℹ️ Info"}
          </span>

          {/* Theme switcher */}
          <button
            className="gmail-header__icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          {/* Quick Action Button */}
          <Link href="/auth" className="btn btn--primary btn--sm header-action-btn">
            Get Started
          </Link>

          {/* User Profile initials */}
          <Link href="/profile" className="gmail-header__profile" title="My Profile">
            <div className="gmail-header__avatar">
              {USER.avatar}
            </div>
            <span className="gmail-header__trust-tooltip">Trust Score: {USER.trustScore}</span>
          </Link>
        </div>
      </header>

      {/* ─────────────────────────────────────────────
         Gmail-Style Left Sidebar (App Rail + Pane)
      ───────────────────────────────────────────── */}
      <aside className={`gmail-sidebar ${sidebarExpanded ? "gmail-sidebar--expanded" : "gmail-sidebar--collapsed"}`}>
        
        {/* Leftmost Column: App Rail (72px) */}
        <div className="gmail-sidebar__rail">
          <button
            className={`gmail-sidebar__rail-btn ${activeRail === "buyer" ? "gmail-sidebar__rail-btn--active" : ""}`}
            onClick={() => {
              setActiveRail("buyer");
              setSidebarExpanded(true);
            }}
            aria-label="Buyer navigation"
          >
            <span className="rail-icon">🛒</span>
            <span className="rail-label">Buyer</span>
          </button>

          <button
            className={`gmail-sidebar__rail-btn ${activeRail === "mfg" ? "gmail-sidebar__rail-btn--active" : ""}`}
            onClick={() => {
              setActiveRail("mfg");
              setSidebarExpanded(true);
            }}
            aria-label="Manufacturer navigation"
          >
            <span className="rail-icon">🏭</span>
            <span className="rail-label">Mfg</span>
          </button>

          <button
            className={`gmail-sidebar__rail-btn ${activeRail === "help" ? "gmail-sidebar__rail-btn--active" : ""}`}
            onClick={() => {
              setActiveRail("help");
              setSidebarExpanded(true);
            }}
            aria-label="Help & Info"
          >
            <span className="rail-icon">ℹ️</span>
            <span className="rail-label">Help</span>
          </button>
        </div>

        {/* Right Column: Navigation Pane (208px) */}
        {sidebarExpanded && (
          <div className="gmail-sidebar__pane">
            
            {/* Gmail-style Compose button */}
            <div className="gmail-sidebar__action-box">
              {activeRail === "buyer" && (
                <Link href="/" className="gmail-sidebar__compose-btn">
                  <span className="compose-icon">🔍</span>
                  <span className="compose-text">Shop Batches</span>
                </Link>
              )}
              {activeRail === "mfg" && (
                <Link href="/manufacturer/batch/new" className="gmail-sidebar__compose-btn">
                  <span className="compose-icon">➕</span>
                  <span className="compose-text">Create Batch</span>
                </Link>
              )}
              {activeRail === "help" && (
                <button
                  className="gmail-sidebar__compose-btn"
                  onClick={() => alert("Customer Support Sandbox Triggered!")}
                >
                  <span className="compose-icon">💬</span>
                  <span className="compose-text">Get Help</span>
                </button>
              )}
            </div>

            {/* List Links */}
            <nav className="gmail-sidebar__nav-list">
              {activeRail === "buyer" && (
                <>
                  <Link
                    href="/"
                    className={`gmail-sidebar__nav-item ${pathname === "/" ? "gmail-sidebar__nav-item--active" : ""}`}
                  >
                    <span className="nav-icon">🏠</span>
                    <span className="nav-label">Discover Batches</span>
                  </Link>
                  <Link
                    href="/orders"
                    className={`gmail-sidebar__nav-item ${pathname === "/orders" ? "gmail-sidebar__nav-item--active" : ""}`}
                  >
                    <span className="nav-icon">📦</span>
                    <span className="nav-label">My Orders</span>
                    <span className="nav-badge">2</span>
                  </Link>
                  <Link
                    href="/wallet"
                    className={`gmail-sidebar__nav-item ${pathname === "/wallet" ? "gmail-sidebar__nav-item--active" : ""}`}
                  >
                    <span className="nav-icon">💰</span>
                    <span className="nav-label">BulkCash Wallet</span>
                  </Link>
                  <Link
                    href="/#how-it-works"
                    className="gmail-sidebar__nav-item"
                  >
                    <span className="nav-icon">❓</span>
                    <span className="nav-label">How It Works</span>
                  </Link>
                </>
              )}

              {activeRail === "mfg" && (
                <>
                  <Link
                    href="/manufacturer"
                    className={`gmail-sidebar__nav-item ${pathname === "/manufacturer" ? "gmail-sidebar__nav-item--active" : ""}`}
                  >
                    <span className="nav-icon">📊</span>
                    <span className="nav-label">Dashboard</span>
                  </Link>
                  <Link
                    href="/manufacturer/analytics"
                    className={`gmail-sidebar__nav-item ${pathname === "/manufacturer/analytics" ? "gmail-sidebar__nav-item--active" : ""}`}
                  >
                    <span className="nav-icon">📈</span>
                    <span className="nav-label">Analytics</span>
                  </Link>
                  <Link
                    href="/manufacturer/batch/new"
                    className={`gmail-sidebar__nav-item ${pathname === "/manufacturer/batch/new" ? "gmail-sidebar__nav-item--active" : ""}`}
                  >
                    <span className="nav-icon">➕</span>
                    <span className="nav-label">Create Batch</span>
                  </Link>
                  <Link href="#" className="gmail-sidebar__nav-item">
                    <span className="nav-icon">🏆</span>
                    <span className="nav-label">Success Stories</span>
                  </Link>
                </>
              )}

              {activeRail === "help" && (
                <>
                  <Link href="#" className="gmail-sidebar__nav-item">
                    <span className="nav-icon">📖</span>
                    <span className="nav-label">Help Center</span>
                  </Link>
                  <Link href="#" className="gmail-sidebar__nav-item">
                    <span className="nav-icon">⚙️</span>
                    <span className="nav-label">Sandbox Tool</span>
                  </Link>
                  <Link href="#" className="gmail-sidebar__nav-item">
                    <span className="nav-icon">✉️</span>
                    <span className="nav-label">Contact Support</span>
                  </Link>
                </>
              )}
            </nav>

            <div className="gmail-sidebar__divider"></div>

            {/* Labels collapsable Category list (only under buyer mode) */}
            {activeRail === "buyer" && (
              <div className="gmail-sidebar__labels-section">
                <div
                  className="gmail-sidebar__labels-header"
                  onClick={() => setLabelsExpanded(!labelsExpanded)}
                  role="button"
                  aria-expanded={labelsExpanded}
                >
                  <span className={`labels-arrow ${labelsExpanded ? "labels-arrow--expanded" : ""}`}>
                    ▶
                  </span>
                  <span className="labels-title">Product Categories</span>
                </div>

                {labelsExpanded && (
                  <div className="gmail-sidebar__labels-list">
                    {CATEGORIES.map((cat) => {
                      const isActive = searchParams.get("category") === cat.id;
                      return (
                        <Link
                          key={cat.id}
                          href={`/?category=${cat.id}`}
                          className={`gmail-sidebar__label-item ${isActive ? "gmail-sidebar__label-item--active" : ""}`}
                        >
                          <span
                            className="label-dot"
                            style={{ backgroundColor: cat.color }}
                          ></span>
                          <span className="label-icon">{cat.icon}</span>
                          <span className="label-name">{cat.name}</span>
                          <span className="label-count">{cat.count}</span>
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
         Gmail-Style Responsive Mobile Drawer
      ───────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div
          className="gmail-mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={`gmail-mobile-drawer ${mobileMenuOpen ? "gmail-mobile-drawer--open" : ""}`}>
        <div className="gmail-mobile-drawer__header">
          <Link href="/" className="gmail-header__logo" onClick={() => setMobileMenuOpen(false)}>
            <div className="gmail-header__logo-icon">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="url(#mobile-logo-grad)" />
                <path d="M8 20L12 10H15L11 20H8Z" fill="white" fillOpacity="0.9" />
                <path d="M14 20L18 10H21L17 20H14Z" fill="white" fillOpacity="0.9" />
                <path d="M20 20L24 10H27L23 20H20Z" fill="white" fillOpacity="0.7" />
                <defs>
                  <linearGradient id="mobile-logo-grad" x1="0" y1="0" x2="32" y2="32">
                    <stop stopColor="#0D6EFD" />
                    <stop offset="1" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="gmail-header__logo-text">
              <span className="gmail-header__logo-name">BulkBlitz</span>
            </div>
          </Link>
          <button
            className="gmail-mobile-drawer__close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <div className="gmail-mobile-drawer__content">
          {/* Quick switcher buttons */}
          <div className="gmail-mobile-drawer__modes">
            <button
              className={`gmail-mobile-drawer__mode-btn ${activeRail === "buyer" ? "active" : ""}`}
              onClick={() => setActiveRail("buyer")}
            >
              Buyer Portal
            </button>
            <button
              className={`gmail-mobile-drawer__mode-btn ${activeRail === "mfg" ? "active" : ""}`}
              onClick={() => setActiveRail("mfg")}
            >
              Manufacturer Portal
            </button>
          </div>

          <nav className="gmail-mobile-drawer__links">
            {activeRail === "buyer" && (
              <>
                <Link href="/" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                  🏠 Discover Batches
                </Link>
                <Link href="/orders" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                  📦 My Orders <span className="mobile-badge">2</span>
                </Link>
                <Link href="/wallet" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                  💰 BulkCash Wallet
                </Link>
                <Link href="/#how-it-works" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                  ❓ How It Works
                </Link>

                <div className="gmail-sidebar__divider" style={{ margin: "var(--space-4) 0" }}></div>
                <div style={{ paddingLeft: "var(--space-2)", fontSize: "0.8rem", textTransform: "uppercase", color: "var(--text-tertiary)", fontWeight: "600", marginBottom: "var(--space-2)" }}>Categories</div>
                
                {CATEGORIES.map(cat => (
                  <Link
                    key={cat.id}
                    href={`/?category=${cat.id}`}
                    className="mobile-link"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ fontSize: '0.85rem', opacity: 0.9 }}
                  >
                    <span style={{ marginRight: '8px' }}>{cat.icon}</span>
                    {cat.name}
                  </Link>
                ))}
              </>
            )}

            {activeRail === "mfg" && (
              <>
                <Link href="/manufacturer" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                  📊 Dashboard
                </Link>
                <Link href="/manufacturer/analytics" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                  📈 Analytics
                </Link>
                <Link href="/manufacturer/batch/new" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                  ➕ Create a Batch
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      <style jsx global>{`
        /* ─────────────────────────────────────────────
           Gmail Top Header styles
        ───────────────────────────────────────────── */
        .gmail-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-6);
          background: var(--bg-glass);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-light);
          z-index: 1050;
        }

        .gmail-header__left {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .gmail-header__hamburger {
          display: flex;
          flex-direction: column;
          gap: 5px;
          width: 20px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .gmail-header__hamburger span {
          display: block;
          height: 2px;
          background: var(--text-primary);
          border-radius: 2px;
          width: 100%;
        }

        .gmail-header__logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          text-decoration: none;
          color: var(--text-primary);
        }

        .gmail-header__logo-icon {
          flex-shrink: 0;
        }

        .gmail-header__logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .gmail-header__logo-name {
          font-family: var(--font-heading), sans-serif;
          font-weight: 800;
          font-size: 1.1rem;
          background: linear-gradient(135deg, #0d6efd, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .gmail-header__logo-tagline {
          font-size: 0.6rem;
          color: var(--text-tertiary);
          letter-spacing: 0.05em;
        }

        /* Search bar */
        .gmail-header__search-container {
          flex: 1;
          max-width: 720px;
          margin: 0 var(--space-6);
          display: none;
        }

        @media (min-width: 768px) {
          .gmail-header__search-container {
            display: block;
          }
        }

        .gmail-header__search-form {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          background: var(--bg-elevated);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-light);
          padding: 0 var(--space-4);
          height: 44px;
          transition: all var(--transition-fast);
        }

        .gmail-header__search-form:focus-within {
          background: var(--bg-surface);
          border-color: var(--accent-primary);
          box-shadow: var(--shadow-sm);
        }

        .gmail-header__search-icon {
          font-size: 1rem;
          color: var(--text-secondary);
          margin-right: var(--space-3);
        }

        .gmail-header__search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .gmail-header__search-clear {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-tertiary);
          font-size: 0.9rem;
          padding: var(--space-1);
        }

        /* Right actions */
        .gmail-header__right {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .gmail-header__portal-badge {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          background: var(--bg-elevated);
          color: var(--text-secondary);
          padding: 3px 8px;
          border-radius: var(--radius-sm);
          letter-spacing: 0.05em;
          display: none;
        }

        @media (min-width: 640px) {
          .gmail-header__portal-badge {
            display: inline-block;
          }
        }

        .gmail-header__icon-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: var(--space-2);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .gmail-header__icon-btn:hover {
          background: var(--bg-elevated);
          color: var(--text-primary);
        }

        .header-action-btn {
          display: none !important;
        }

        @media (min-width: 640px) {
          .header-action-btn {
            display: flex !important;
          }
        }

        /* User profile avatar */
        .gmail-header__profile {
          position: relative;
          display: flex;
          align-items: center;
          text-decoration: none;
          cursor: pointer;
        }

        .gmail-header__avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, var(--accent-primary-light), var(--accent-premium-light));
          border: 1.5px solid var(--border-default);
          color: var(--accent-primary);
          font-weight: 700;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform var(--transition-fast);
        }

        .gmail-header__profile:hover .gmail-header__avatar {
          transform: scale(1.05);
        }

        .gmail-header__trust-tooltip {
          position: absolute;
          top: calc(100% + var(--space-2));
          right: 0;
          background: var(--text-primary);
          color: var(--bg-surface);
          font-size: 0.72rem;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          white-space: nowrap;
          transition: all var(--transition-fast);
          box-shadow: var(--shadow-md);
        }

        .gmail-header__profile:hover .gmail-header__trust-tooltip {
          opacity: 1;
          visibility: visible;
        }

        /* ─────────────────────────────────────────────
           Gmail Left Sidebar styles
        ───────────────────────────────────────────── */
        .gmail-sidebar {
          position: fixed;
          top: 64px;
          left: 0;
          bottom: 0;
          display: none;
          z-index: 1000;
          transition: width var(--transition-base);
          border-right: 1px solid var(--border-light);
          overflow: hidden;
        }

        @media (min-width: 992px) {
          .gmail-sidebar {
            display: flex;
          }
        }

        .gmail-sidebar--expanded {
          width: 280px;
        }

        .gmail-sidebar--collapsed {
          width: 72px;
        }

        /* Glassmorphism backing with theme logic */
        [data-theme='dark'] .gmail-sidebar {
          background: rgba(12, 12, 12, 0.9);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
        }

        [data-theme='light'] .gmail-sidebar {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
        }

        /* Left Rail (72px) */
        .gmail-sidebar__rail {
          width: 72px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--space-4) 0;
          gap: var(--space-6);
          border-right: 1px solid var(--border-light);
          flex-shrink: 0;
        }

        .gmail-sidebar__rail-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-1);
          background: none;
          border: none;
          color: var(--text-secondary);
          font-family: inherit;
          cursor: pointer;
          width: 100%;
          padding: var(--space-2) 0;
          transition: all var(--transition-fast);
        }

        .rail-icon {
          font-size: 1.4rem;
          padding: 6px 16px;
          border-radius: var(--radius-xl);
          transition: all var(--transition-fast);
          display: inline-block;
          line-height: 1;
        }

        .rail-label {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .gmail-sidebar__rail-btn:hover .rail-icon {
          background: var(--bg-elevated);
          color: var(--text-primary);
        }

        .gmail-sidebar__rail-btn--active {
          color: var(--accent-primary);
        }

        .gmail-sidebar__rail-btn--active .rail-icon {
          background: var(--accent-primary-light);
          color: var(--accent-primary);
        }

        /* Wide Pane (208px) */
        .gmail-sidebar__pane {
          width: 208px;
          display: flex;
          flex-direction: column;
          padding: var(--space-4) var(--space-3);
          flex-shrink: 0;
          overflow-y: auto;
        }

        /* Compose-style button */
        .gmail-sidebar__action-box {
          margin-bottom: var(--space-5);
        }

        .gmail-sidebar__compose-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--space-3);
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          padding: 12px 20px;
          text-decoration: none;
          color: var(--text-primary);
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-fast);
        }

        .gmail-sidebar__compose-btn:hover {
          box-shadow: var(--shadow-md), var(--shadow-glow-primary);
          border-color: var(--accent-primary);
          transform: translateY(-1px);
        }

        .compose-icon {
          font-size: 1.15rem;
        }

        /* Navigation List Items */
        .gmail-sidebar__nav-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .gmail-sidebar__nav-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-full);
          text-decoration: none;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 500;
          transition: all var(--transition-fast);
        }

        .gmail-sidebar__nav-item:hover {
          background: var(--bg-elevated);
          color: var(--text-primary);
        }

        .gmail-sidebar__nav-item--active {
          background: var(--accent-primary-light) !important;
          color: var(--accent-primary) !important;
          font-weight: 700;
        }

        .nav-badge {
          margin-left: auto;
          font-size: 0.7rem;
          font-weight: 700;
          background: var(--accent-danger-light);
          color: var(--accent-danger);
          padding: 1px 6px;
          border-radius: var(--radius-full);
        }

        .gmail-sidebar__divider {
          height: 1px;
          background: var(--border-light);
          margin: var(--space-4) 0;
        }

        /* Collapsible Labels */
        .gmail-sidebar__labels-section {
          margin-top: var(--space-2);
        }

        .gmail-sidebar__labels-header {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
          color: var(--text-tertiary);
          cursor: pointer;
          user-select: none;
        }

        .gmail-sidebar__labels-header:hover {
          color: var(--text-secondary);
        }

        .labels-arrow {
          font-size: 0.55rem;
          transition: transform var(--transition-fast);
          display: inline-block;
        }

        .labels-arrow--expanded {
          transform: rotate(90deg);
        }

        .gmail-sidebar__labels-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: var(--space-1);
          padding-left: var(--space-2);
        }

        .gmail-sidebar__label-item {
          display: flex;
          align-items: center;
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-full);
          text-decoration: none;
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 500;
          transition: all var(--transition-fast);
        }

        .gmail-sidebar__label-item:hover {
          background: var(--bg-elevated);
          color: var(--text-primary);
        }

        .gmail-sidebar__label-item--active {
          background: var(--bg-elevated);
          color: var(--text-primary);
          font-weight: 700;
        }

        .label-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: var(--space-3);
          flex-shrink: 0;
        }

        .label-icon {
          font-size: 0.95rem;
        }

        .label-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }

        .label-count {
          font-size: 0.7rem;
          color: var(--text-tertiary);
          font-weight: 600;
          margin-left: var(--space-2);
        }

        /* ─────────────────────────────────────────────
           Gmail Mobile Sidebar Drawer & Backdrop
        ───────────────────────────────────────────── */
        .gmail-mobile-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 1100;
        }

        .gmail-mobile-drawer {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          width: 280px;
          background: var(--bg-surface);
          box-shadow: var(--shadow-xl);
          z-index: 1200;
          display: flex;
          flex-direction: column;
          transform: translateX(-100%);
          transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .gmail-mobile-drawer--open {
          transform: translateX(0);
        }

        .gmail-mobile-drawer__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4) var(--space-5);
          border-bottom: 1px solid var(--border-light);
        }

        .gmail-mobile-drawer__close {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 1.1rem;
          cursor: pointer;
        }

        .gmail-mobile-drawer__content {
          flex: 1;
          overflow-y: auto;
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .gmail-mobile-drawer__modes {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-2);
          margin-bottom: var(--space-2);
        }

        .gmail-mobile-drawer__mode-btn {
          padding: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-default);
          background: var(--bg-primary);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .gmail-mobile-drawer__mode-btn.active {
          background: var(--accent-primary-light);
          color: var(--accent-primary);
          border-color: var(--accent-primary);
        }

        .gmail-mobile-drawer__links {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .mobile-link {
          display: flex;
          align-items: center;
          padding: var(--space-3) var(--space-4);
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          border-radius: var(--radius-md);
          transition: background var(--transition-fast);
        }

        .mobile-link:hover {
          background: var(--bg-elevated);
          color: var(--text-primary);
        }

        .mobile-badge {
          margin-left: auto;
          font-size: 0.7rem;
          font-weight: 700;
          background: var(--accent-danger-light);
          color: var(--accent-danger);
          padding: 1px 6px;
          border-radius: var(--radius-full);
        }
      `}</style>
    </>
  );
}

function HeaderSkeleton() {
  return (
    <header className="gmail-header" style={{ height: "64px", borderBottom: "1px solid var(--border-light)" }} />
  );
}

export default function Header() {
  return (
    <Suspense fallback={<HeaderSkeleton />}>
      <HeaderContent />
    </Suspense>
  );
}
