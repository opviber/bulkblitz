"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
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
        </nav>

        {/* Actions */}
        <div className="header__actions">
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="header__mobile-menu animate-fade-in" id="mobile-menu">
          <nav className="header__mobile-nav">
            <Link
              href="/"
              className="header__mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              🏠 Discover Batches
            </Link>
            <Link
              href="/orders"
              className="header__mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              📦 My Orders
            </Link>
            <Link
              href="/wallet"
              className="header__mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              💰 BulkCash Wallet
            </Link>
            <Link
              href="/manufacturer"
              className="header__mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              🏭 For Manufacturers
            </Link>
            <Link
              href="/auth"
              className="header__mobile-link header__mobile-link--cta"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started →
            </Link>
          </nav>
        </div>
      )}

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

        .header__mobile-menu {
          position: absolute;
          top: 64px;
          left: 0;
          right: 0;
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border-default);
          box-shadow: var(--shadow-lg);
          padding: var(--space-4);
        }

        @media (min-width: 768px) {
          .header__mobile-menu {
            display: none;
          }
        }

        .header__mobile-nav {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .header__mobile-link {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-primary);
          text-decoration: none;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .header__mobile-link:hover {
          background: var(--bg-elevated);
        }

        .header__mobile-link--cta {
          margin-top: var(--space-2);
          background: var(--accent-primary);
          color: white;
          justify-content: center;
          font-weight: 600;
        }

        .header__mobile-link--cta:hover {
          background: var(--accent-primary-hover);
        }
      `}</style>
    </header>
  );
}
