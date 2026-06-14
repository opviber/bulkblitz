"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { USER } from "@/lib/mock-data";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalSidebarOpen, setPortalSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (portalSidebarOpen || mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [portalSidebarOpen, mobileMenuOpen]);

  const toggleTheme = () =>
    setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <>
      <header
        className={`header ${scrolled ? "header--scrolled" : ""}`}
        id="main-header"
      >
      <div className="header__inner container">
        {/* Logo */}
        <Link href="/" className="header__logo" id="logo-link">
          <div className="header__logo-icon">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="32"
                height="32"
                rx="8"
                fill="url(#logo-gradient)"
              />
              <path
                d="M8 20L12 10H15L11 20H8Z"
                fill="white"
                fillOpacity="0.9"
              />
              <path
                d="M14 20L18 10H21L17 20H14Z"
                fill="white"
                fillOpacity="0.9"
              />
              <path
                d="M20 20L24 10H27L23 20H20Z"
                fill="white"
                fillOpacity="0.7"
              />
              <defs>
                <linearGradient
                  id="logo-gradient"
                  x1="0"
                  y1="0"
                  x2="32"
                  y2="32"
                >
                  <stop stopColor="#0D6EFD" />
                  <stop offset="1" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="header__logo-text">
            <span className="header__logo-name">BulkBlitz</span>
            <span className="header__logo-tagline">bulk up. price down.</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="header__nav" id="main-nav">
          <Link href="/" className="header__nav-link header__nav-link--active">
            Discover
          </Link>
          <Link href="/orders" className="header__nav-link">
            My Orders
          </Link>
          <Link href="/wallet" className="header__nav-link">
            Wallet
          </Link>
          <Link href="/manufacturer" className="header__nav-link">
            For Manufacturers
          </Link>
          <button 
            className="header__nav-link header__portal-btn"
            onClick={() => setPortalSidebarOpen(true)}
            id="portal-sidebar-trigger"
          >
            🌐 Roles & Portals
          </button>
        </nav>

        {/* Actions */}
        <div className="header__actions">
          <button
            className="header__portal-toggle"
            onClick={() => setPortalSidebarOpen(true)}
            aria-label="Open portal navigation"
            id="mobile-portal-trigger"
          >
            🌐
          </button>

          <button
            className="header__theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            id="theme-toggle"
          >
            {theme === "light" ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          <Link href="/auth" className="btn btn--primary btn--sm" id="login-btn">
            Get Started
          </Link>

          {/* Mobile menu button */}
          <button
            className="header__mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            <span
              className={`header__hamburger ${mobileMenuOpen ? "header__hamburger--open" : ""}`}
            >
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>
    </header>

      {/* Mobile Menu Sidebar */}
      {mobileMenuOpen && (
        <div 
          className="sidebar-backdrop animate-fade-in" 
          onClick={() => setMobileMenuOpen(false)}
          id="mobile-menu-backdrop"
        />
      )}
      
      <div className={`sidebar-drawer sidebar-drawer--left ${mobileMenuOpen ? 'sidebar-drawer--open' : ''}`} id="mobile-menu">
        <div className="sidebar-drawer__header">
          <Link href="/" className="header__logo" onClick={() => setMobileMenuOpen(false)}>
            <div className="header__logo-icon">
              <svg
                width="28"
                height="28"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="32"
                  height="32"
                  rx="8"
                  fill="url(#logo-gradient-mobile)"
                />
                <path
                  d="M8 20L12 10H15L11 20H8Z"
                  fill="white"
                  fillOpacity="0.9"
                />
                <path
                  d="M14 20L18 10H21L17 20H14Z"
                  fill="white"
                  fillOpacity="0.9"
                />
                <path
                  d="M20 20L24 10H27L23 20H20Z"
                  fill="white"
                  fillOpacity="0.7"
                />
                <defs>
                  <linearGradient
                    id="logo-gradient-mobile"
                    x1="0"
                    y1="0"
                    x2="32"
                    y2="32"
                  >
                    <stop stopColor="#0D6EFD" />
                    <stop offset="1" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="header__logo-text">
              <span className="header__logo-name">BulkBlitz</span>
              <span className="header__logo-tagline">bulk up. price down.</span>
            </div>
          </Link>
          <button 
            className="sidebar-drawer__close" 
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <div className="sidebar-drawer__content">
          <nav className="mobile-menu-nav">
            <Link
              href="/"
              className={`mobile-menu-link ${pathname === "/" ? "mobile-menu-link--active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="mobile-menu-emoji">🏠</span>
              <span>Discover Batches</span>
            </Link>
            <Link
              href="/orders"
              className={`mobile-menu-link ${pathname === "/orders" ? "mobile-menu-link--active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="mobile-menu-emoji">📦</span>
              <span>My Orders</span>
            </Link>
            <Link
              href="/wallet"
              className={`mobile-menu-link ${pathname === "/wallet" ? "mobile-menu-link--active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="mobile-menu-emoji">💰</span>
              <span>BulkCash Wallet</span>
            </Link>
            <Link
              href="/manufacturer"
              className={`mobile-menu-link ${pathname === "/manufacturer" ? "mobile-menu-link--active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="mobile-menu-emoji">🏭</span>
              <span>For Manufacturers</span>
            </Link>

            <div className="sidebar-drawer__divider" style={{ margin: 'var(--space-3) 0' }} />

            <button 
              className="mobile-menu-link mobile-menu-portal-trigger"
              onClick={() => {
                setMobileMenuOpen(false);
                setPortalSidebarOpen(true);
              }}
            >
              <span className="mobile-menu-emoji">🌐</span>
              <span>Roles & Portals</span>
            </button>
          </nav>

          <div style={{ marginTop: 'auto' }} />

          <div className="mobile-menu-user">
            <div className="avatar avatar--md">
              <span className="avatar-initials">{USER.avatar}</span>
            </div>
            <div className="mobile-menu-user__info">
              <span className="mobile-menu-user__name">{USER.name}</span>
              <span className="mobile-menu-user__trust">Trust Score: {USER.trustScore}</span>
            </div>
          </div>

          <Link
            href="/auth"
            className="btn btn--primary w-full"
            onClick={() => setMobileMenuOpen(false)}
            style={{ marginTop: 'var(--space-2)' }}
          >
            Get Started
          </Link>
        </div>

        <div className="sidebar-drawer__footer">
          <p className="sidebar-drawer__footer-tagline">BulkBlitz • Bulk Up. Price Down.</p>
        </div>
      </div>

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border-light);
          transition: all var(--transition-base);
        }

        .header--scrolled {
          background: var(--bg-glass);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom-color: var(--border-default);
          box-shadow: var(--shadow-md);
        }

        .header__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          padding: 0 var(--space-6);
        }

        .header__logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          text-decoration: none;
          color: var(--text-primary);
        }

        .header__logo-icon {
          flex-shrink: 0;
        }

        .header__logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .header__logo-name {
          font-family: var(--font-heading), sans-serif;
          font-weight: 800;
          font-size: 1.2rem;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #0D6EFD, #8B5CF6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header__logo-tagline {
          font-size: 0.65rem;
          color: var(--text-tertiary);
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: lowercase;
        }

        .header__nav {
          display: none;
          align-items: center;
          gap: var(--space-1);
        }

        @media (min-width: 768px) {
          .header__nav {
            display: flex;
          }
        }

        .header__nav-link {
          padding: var(--space-2) var(--space-4);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .header__nav-link:hover {
          color: var(--text-primary);
          background: var(--bg-elevated);
        }

        .header__nav-link--active {
          color: var(--accent-primary);
          background: var(--accent-primary-light);
        }

        .header__actions {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .header__theme-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-default);
          background: var(--bg-surface);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .header__theme-toggle:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          background: var(--accent-primary-light);
        }

        .header__mobile-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          background: none;
          cursor: pointer;
          padding: 0;
        }

        @media (min-width: 768px) {
          .header__mobile-toggle {
            display: none;
          }
        }

        .header__hamburger {
          display: flex;
          flex-direction: column;
          gap: 5px;
          width: 20px;
        }

        .header__hamburger span {
          display: block;
          height: 2px;
          background: var(--text-primary);
          border-radius: 2px;
          transition: all var(--transition-fast);
        }

        .header__hamburger--open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .header__hamburger--open span:nth-child(2) {
          opacity: 0;
        }

        .header__hamburger--open span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        /* Left Sidebar Drawer subclasses */
        .sidebar-drawer--left {
          left: 0;
          right: auto;
          border-left: none;
          border-right: 1px solid var(--border-default);
          transform: translateX(-100%);
        }

        .sidebar-drawer--left.sidebar-drawer--open {
          transform: translateX(0);
        }

        @media (min-width: 768px) {
          .sidebar-drawer--left {
            display: none !important;
          }
        }

        /* Mobile Menu Content Styles */
        .mobile-menu-nav {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .mobile-menu-link {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
          background: transparent;
          width: 100%;
          text-align: left;
        }

        .mobile-menu-link:hover {
          background: var(--bg-elevated);
          color: var(--text-primary);
          transform: translateX(4px);
        }

        .mobile-menu-link--active {
          color: var(--accent-primary);
          background: var(--accent-primary-light);
          font-weight: 600;
        }

        .mobile-menu-emoji {
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .mobile-menu-portal-trigger {
          color: var(--accent-premium);
          font-weight: 600;
          border: 1px solid transparent;
        }
        
        .mobile-menu-portal-trigger:hover {
          background: var(--accent-premium-light);
          color: var(--accent-premium);
        }

        .mobile-menu-user {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          background: var(--bg-elevated);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-light);
          margin-bottom: var(--space-3);
        }

        .mobile-menu-user__info {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .mobile-menu-user__name {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .mobile-menu-user__trust {
          font-size: 0.75rem;
          color: var(--accent-success);
          font-weight: 500;
        }

        .avatar-initials {
          font-weight: 700;
          color: var(--accent-primary);
          font-size: 0.9rem;
        }

        /* Portal Trigger Styles */
        .header__portal-btn {
          background: var(--accent-primary-light);
          color: var(--accent-primary);
          border: 1px solid transparent;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .header__portal-btn:hover {
          background: var(--accent-primary);
          color: white;
          border-color: var(--accent-primary);
        }

        .header__portal-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-default);
          background: var(--bg-surface);
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 1.1rem;
          transition: all var(--transition-fast);
        }

        .header__portal-toggle:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          background: var(--accent-primary-light);
        }

        @media (min-width: 768px) {
          .header__portal-toggle {
            display: none;
          }
        }

        /* Sidebar Styling */
        .sidebar-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 1100;
        }

        .sidebar-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          max-width: 380px;
          background: var(--bg-glass);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border-left: 1px solid var(--border-default);
          box-shadow: var(--shadow-xl);
          z-index: 1200;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .sidebar-drawer--open {
          transform: translateX(0);
        }

        .sidebar-drawer__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-5) var(--space-6);
          border-bottom: 1px solid var(--border-light);
        }

        .sidebar-drawer__title-container {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .sidebar-drawer__title-icon {
          font-size: 1.25rem;
        }

        .sidebar-drawer__title {
          font-family: var(--font-heading), sans-serif;
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-primary);
          margin: 0;
        }

        .sidebar-drawer__close {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 1.2rem;
          cursor: pointer;
          padding: var(--space-1);
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
        }

        .sidebar-drawer__close:hover {
          background: var(--bg-elevated);
          color: var(--text-primary);
        }

        .sidebar-drawer__content {
          flex: 1;
          overflow-y: auto;
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .sidebar-drawer__section {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .sidebar-drawer__section-title {
          font-family: var(--font-heading), sans-serif;
          font-weight: 700;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin: 0;
        }

        .sidebar-drawer__links {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .sidebar-drawer__link {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          padding: var(--space-3);
          border-radius: var(--radius-md);
          text-decoration: none;
          transition: all var(--transition-fast);
          background: transparent;
        }

        .sidebar-drawer__link:hover {
          background: var(--bg-elevated);
          transform: translateX(4px);
        }

        .sidebar-drawer__link-emoji {
          font-size: 1.25rem;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .sidebar-drawer__link-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar-drawer__link-label {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .sidebar-drawer__link-desc {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .sidebar-drawer__divider {
          height: 1px;
          background: var(--border-light);
        }

        .sidebar-drawer__footer {
          padding: var(--space-4) var(--space-6);
          border-top: 1px solid var(--border-light);
          background: var(--bg-elevated);
          text-align: center;
        }

        .sidebar-drawer__footer-tagline {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin: 0;
          font-weight: 500;
        }
      `}</style>

      {/* Portal Sidebar */}
      {portalSidebarOpen && (
        <div 
          className="sidebar-backdrop animate-fade-in" 
          onClick={() => setPortalSidebarOpen(false)}
          id="sidebar-backdrop"
        />
      )}
      
      <div className={`sidebar-drawer ${portalSidebarOpen ? 'sidebar-drawer--open' : ''}`} id="portal-sidebar">
        <div className="sidebar-drawer__header">
          <div className="sidebar-drawer__title-container">
            <span className="sidebar-drawer__title-icon">🌐</span>
            <h3 className="sidebar-drawer__title">Navigation Portal</h3>
          </div>
          <button 
            className="sidebar-drawer__close" 
            onClick={() => setPortalSidebarOpen(false)}
            aria-label="Close menu"
            id="sidebar-close"
          >
            ✕
          </button>
        </div>
        
        <div className="sidebar-drawer__content">
          {/* Buyer Section */}
          <div className="sidebar-drawer__section">
            <h4 className="sidebar-drawer__section-title text-gradient">For Buyers</h4>
            <div className="sidebar-drawer__links">
              <Link href="/" className="sidebar-drawer__link" onClick={() => setPortalSidebarOpen(false)}>
                <span className="sidebar-drawer__link-emoji">🏠</span>
                <div className="sidebar-drawer__link-text">
                  <span className="sidebar-drawer__link-label">Browse Batches</span>
                  <span className="sidebar-drawer__link-desc">Explore active group-buy offers</span>
                </div>
              </Link>
              <Link href="/orders" className="sidebar-drawer__link" onClick={() => setPortalSidebarOpen(false)}>
                <span className="sidebar-drawer__link-emoji">📦</span>
                <div className="sidebar-drawer__link-text">
                  <span className="sidebar-drawer__link-label">My Orders</span>
                  <span className="sidebar-drawer__link-desc">Track active orders & history</span>
                </div>
              </Link>
              <Link href="/wallet" className="sidebar-drawer__link" onClick={() => setPortalSidebarOpen(false)}>
                <span className="sidebar-drawer__link-emoji">💰</span>
                <div className="sidebar-drawer__link-text">
                  <span className="sidebar-drawer__link-label">BulkCash Wallet</span>
                  <span className="sidebar-drawer__link-desc">Manage escrow funds & credits</span>
                </div>
              </Link>
              <Link href="/#how-it-works" className="sidebar-drawer__link" onClick={() => setPortalSidebarOpen(false)}>
                <span className="sidebar-drawer__link-emoji">❓</span>
                <div className="sidebar-drawer__link-text">
                  <span className="sidebar-drawer__link-label">How It Works</span>
                  <span className="sidebar-drawer__link-desc">Learn about group-buy dynamic pricing</span>
                </div>
              </Link>
              <Link href="/#categories-section" className="sidebar-drawer__link" onClick={() => setPortalSidebarOpen(false)}>
                <span className="sidebar-drawer__link-emoji">📍</span>
                <div className="sidebar-drawer__link-text">
                  <span className="sidebar-drawer__link-label">Pickup Points</span>
                  <span className="sidebar-drawer__link-desc">Find closest local hub details</span>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="sidebar-drawer__divider" />
          
          {/* Manufacturer Section */}
          <div className="sidebar-drawer__section">
            <h4 className="sidebar-drawer__section-title text-gradient" style={{ backgroundImage: 'linear-gradient(135deg, var(--accent-premium), var(--accent-primary))' }}>For Manufacturers</h4>
            <div className="sidebar-drawer__links">
              <Link href="/manufacturer" className="sidebar-drawer__link" onClick={() => setPortalSidebarOpen(false)}>
                <span className="sidebar-drawer__link-emoji">🏭</span>
                <div className="sidebar-drawer__link-text">
                  <span className="sidebar-drawer__link-label">Manufacturer Dashboard</span>
                  <span className="sidebar-drawer__link-desc">Manage active listings & orders</span>
                </div>
              </Link>
              <Link href="/manufacturer/batch/new" className="sidebar-drawer__link" onClick={() => setPortalSidebarOpen(false)}>
                <span className="sidebar-drawer__link-emoji">➕</span>
                <div className="sidebar-drawer__link-text">
                  <span className="sidebar-drawer__link-label">Create a Batch</span>
                  <span className="sidebar-drawer__link-desc">List a new product & price tiers</span>
                </div>
              </Link>
              <Link href="/manufacturer/analytics" className="sidebar-drawer__link" onClick={() => setPortalSidebarOpen(false)}>
                <span className="sidebar-drawer__link-emoji">📈</span>
                <div className="sidebar-drawer__link-text">
                  <span className="sidebar-drawer__link-label">Analytics & Pricing</span>
                  <span className="sidebar-drawer__link-desc">Calculate margins & view trends</span>
                </div>
              </Link>
              <Link href="#" className="sidebar-drawer__link" onClick={() => setPortalSidebarOpen(false)}>
                <span className="sidebar-drawer__link-emoji">🏆</span>
                <div className="sidebar-drawer__link-text">
                  <span className="sidebar-drawer__link-label">Success Stories</span>
                  <span className="sidebar-drawer__link-desc">How other businesses scaled</span>
                </div>
              </Link>
              <Link href="/manufacturer" className="sidebar-drawer__link" onClick={() => setPortalSidebarOpen(false)}>
                <span className="sidebar-drawer__link-emoji">📄</span>
                <div className="sidebar-drawer__link-text">
                  <span className="sidebar-drawer__link-label">API Documentation</span>
                  <span className="sidebar-drawer__link-desc">Integrate inventory system</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="sidebar-drawer__footer">
          <p className="sidebar-drawer__footer-tagline">BulkBlitz • Bulk Up. Price Down.</p>
        </div>
      </div>
    </>
  );
}
