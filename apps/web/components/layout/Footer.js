import Link from 'next/link';

const marketplaceLinks = [
  { label: 'Browse Batches', href: '/' },
  { label: 'Trending Now', href: '/' },
  { label: 'Ending Soon', href: '/' },
  { label: 'New Arrivals', href: '/' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'For Manufacturers', href: '/manufacturer' },
];

const companyLinks = [
  { label: 'About Us', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'Press Kit', href: '#' },
  { label: 'Sitemap', href: '#' },
];

const trustItems = [
  { icon: '🔒', title: 'SSL Secured', desc: 'All transactions encrypted' },
  { icon: '🏦', title: 'Escrow Protected', desc: 'Funds held until delivery' },
  { icon: '📋', title: 'GST Registered', desc: 'GSTIN: 27AABCB1234Z1ZX' },
  { icon: '🇮🇳', title: 'India Hosted', desc: 'Data stored locally' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Refund Policy', href: '#' },
  { label: 'Cookie Policy', href: '#' },
];

function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.733-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="footer">

      {/* ── NEWSLETTER STRIP ── */}
      <div className="footer__newsletter">
        <div className="container">
          <div className="newsletter__inner">
            <div className="newsletter__copy">
              <h3 className="newsletter__heading">Stay ahead of every price drop.</h3>
              <p className="newsletter__sub">
                Get notified when new batches launch in your categories.
              </p>
            </div>
            <div className="newsletter__form">
              <input
                type="email"
                className="newsletter__input"
                placeholder="you@example.com"
                aria-label="Email address"
              />
              <button className="btn btn--primary newsletter__btn">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN FOOTER BODY ── */}
      <div className="container">
        <div className="footer__grid">

          {/* Column 1 — Brand */}
          <div className="footer__col footer__col--brand">
            <Link href="/" className="footer__logo-link">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="footer__logo-svg">
                <rect width="32" height="32" rx="8" fill="url(#footerGrad)" />
                <path d="M8 10h10a4 4 0 010 8H8V10z" fill="white" fillOpacity="0.95" />
                <path d="M8 18h12a4 4 0 010 8H8V18z" fill="white" fillOpacity="0.7" />
                <defs>
                  <linearGradient id="footerGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366f1" />
                    <stop offset="1" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="footer__brand-name">BulkBlitz</span>
            </Link>

            <p className="footer__desc">
              India's first crowd-powered manufacturing marketplace. Join batches, pool together,
              and unlock bulk pricing — in real time.
            </p>

            <div className="footer__social">
              <a href="#" aria-label="Twitter / X" className="social-btn">
                <TwitterIcon />
              </a>
              <a href="#" aria-label="Instagram" className="social-btn">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="LinkedIn" className="social-btn">
                <LinkedInIcon />
              </a>
              <a href="#" aria-label="YouTube" className="social-btn">
                <YouTubeIcon />
              </a>
            </div>

            <div className="footer__india-badge">
              <span>🇮🇳</span>
              <span>Made in India</span>
            </div>
          </div>

          {/* Column 2 — Marketplace */}
          <div className="footer__col">
            <h4 className="footer__heading">Marketplace</h4>
            <ul className="footer__links">
              {marketplaceLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="footer__link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Company */}
          <div className="footer__col">
            <h4 className="footer__heading">Company</h4>
            <ul className="footer__links">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="footer__link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Trust & Safety */}
          <div className="footer__col">
            <h4 className="footer__heading">Trust & Safety</h4>
            <div className="footer__trust-list">
              {trustItems.map((item) => (
                <div key={item.title} className="footer__trust-item">
                  <span className="footer__trust-icon">{item.icon}</span>
                  <div className="footer__trust-text">
                    <span className="footer__trust-title">{item.title}</span>
                    <span className="footer__trust-desc">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="footer__app-buttons">
              <button className="app-btn" disabled>
                <span className="app-btn__icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                </span>
                <span className="app-btn__text">
                  <span className="app-btn__label">Coming Soon</span>
                  <span className="app-btn__store">App Store</span>
                </span>
              </button>
              <button className="app-btn" disabled>
                <span className="app-btn__icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.18 23.76c.3.17.64.24.99.19l12.6-7.27-2.7-2.7-10.89 9.78zM.47 1.51C.17 1.84 0 2.33 0 2.96v18.08c0 .63.17 1.12.48 1.44l.07.07 10.13-10.13v-.24L.54 1.44l-.07.07zM20.12 10.44l-2.71-1.57-3.03 3.03 3.03 3.03 2.73-1.58c.78-.45.78-1.46-.02-1.91zM4.17.24l12.6 7.27-2.7 2.7L3.18.43C3.48-.03 3.87-.13 4.17.24z" />
                  </svg>
                </span>
                <span className="app-btn__text">
                  <span className="app-btn__label">Coming Soon</span>
                  <span className="app-btn__store">Google Play</span>
                </span>
              </button>
            </div>
          </div>

        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © 2026 BulkBlitz Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="footer__legal">
            {legalLinks.map((link, i) => (
              <span key={link.label} className="footer__legal-item">
                {i > 0 && <span className="footer__legal-sep" aria-hidden="true">|</span>}
                <Link href={link.href} className="footer__link footer__legal-link">
                  {link.label}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--bg-surface);
          border-top: 1px solid var(--border-default);
          margin-top: var(--space-20);
        }

        /* ── Container ── */
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--space-6);
        }

        /* ── Newsletter Strip ── */
        .footer__newsletter {
          background: var(--bg-elevated);
          padding: var(--space-8) 0;
          border-bottom: 1px solid var(--border-default);
        }

        .newsletter__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-6);
          flex-wrap: wrap;
        }

        .newsletter__copy {
          flex: 1;
          min-width: 240px;
        }

        .newsletter__heading {
          font-family: var(--font-heading);
          font-size: clamp(1rem, 2vw, 1.2rem);
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 var(--space-1) 0;
          line-height: 1.3;
        }

        .newsletter__sub {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin: 0;
          line-height: 1.5;
        }

        .newsletter__form {
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
          align-items: center;
        }

        .newsletter__input {
          border: 1px solid var(--border-default);
          background: var(--bg-surface);
          border-radius: var(--radius-md);
          padding: var(--space-3) var(--space-4);
          font-size: 0.875rem;
          min-width: 240px;
          color: var(--text-primary);
          outline: none;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
          font-family: var(--font-body);
        }

        .newsletter__input::placeholder {
          color: var(--text-tertiary);
        }

        .newsletter__input:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent-primary) 15%, transparent);
        }

        .newsletter__btn {
          border-radius: var(--radius-md);
          white-space: nowrap;
        }

        /* ── Grid ── */
        .footer__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-10);
          padding: var(--space-12) 0;
        }

        @media (min-width: 768px) {
          .footer__grid {
            grid-template-columns: 2fr 1fr 1fr 1fr;
          }
        }

        /* ── Brand Column ── */
        .footer__logo-link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          text-decoration: none;
          margin-bottom: var(--space-4);
        }

        .footer__logo-svg {
          flex-shrink: 0;
        }

        .footer__brand-name {
          font-family: var(--font-heading);
          font-size: 1.2rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-premium));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
        }

        .footer__desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.65;
          margin: 0 0 var(--space-5) 0;
          max-width: 320px;
        }

        .footer__social {
          display: flex;
          gap: var(--space-2);
          margin-bottom: var(--space-5);
        }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--bg-elevated);
          color: var(--text-secondary);
          text-decoration: none;
          transition:
            background var(--transition-fast),
            color var(--transition-fast),
            transform var(--transition-fast);
          border: 1px solid var(--border-light);
        }

        .social-btn:hover {
          background: var(--accent-primary);
          color: white;
          transform: translateY(-2px);
          border-color: transparent;
        }

        .footer__india-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-1) var(--space-3);
          border-radius: 100px;
          background: color-mix(in srgb, var(--accent-primary) 12%, transparent);
          color: var(--accent-primary);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        /* ── Headings & Links ── */
        .footer__heading {
          font-family: var(--font-heading);
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-primary);
          margin: 0 0 var(--space-4) 0;
        }

        .footer__links {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .footer__link {
          font-size: 0.875rem;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color var(--transition-fast);
          line-height: 1.4;
        }

        .footer__link:hover {
          color: var(--accent-primary);
        }

        /* ── Trust Items ── */
        .footer__trust-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          margin-bottom: var(--space-6);
        }

        .footer__trust-item {
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .footer__trust-icon {
          font-size: 1rem;
          line-height: 1;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .footer__trust-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .footer__trust-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.2;
        }

        .footer__trust-desc {
          font-size: 0.72rem;
          color: var(--text-tertiary);
          line-height: 1.3;
        }

        /* ── App Buttons ── */
        .footer__app-buttons {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .app-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          background: transparent;
          color: var(--text-secondary);
          cursor: not-allowed;
          opacity: 0.6;
          font-family: var(--font-body);
          transition: border-color var(--transition-fast);
          text-align: left;
        }

        .app-btn__icon {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .app-btn__text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .app-btn__label {
          font-size: 0.65rem;
          color: var(--text-tertiary);
          line-height: 1;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .app-btn__store {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          line-height: 1;
        }

        /* ── Bottom Bar ── */
        .footer__bottom {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-3);
          border-top: 1px solid var(--border-light);
          margin-top: var(--space-8);
          padding-top: var(--space-6);
          padding-bottom: var(--space-8);
        }

        @media (min-width: 768px) {
          .footer__bottom {
            flex-direction: row;
          }
        }

        .footer__copyright {
          font-size: 0.78rem;
          color: var(--text-tertiary);
          margin: 0;
          line-height: 1.5;
        }

        .footer__legal {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--space-1);
          justify-content: center;
        }

        .footer__legal-item {
          display: flex;
          align-items: center;
          gap: var(--space-1);
        }

        .footer__legal-sep {
          color: var(--border-default);
          font-size: 0.75rem;
          user-select: none;
        }

        .footer__legal-link {
          font-size: 0.78rem;
          color: var(--text-tertiary);
        }

        .footer__legal-link:hover {
          color: var(--accent-primary);
        }
      `}</style>
    </footer>
  );
}
