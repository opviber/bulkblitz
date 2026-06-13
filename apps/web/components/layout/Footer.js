import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand Column */}
          <div className="footer__brand">
            <div className="footer__logo">
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
                  fill="url(#footer-logo-gradient)"
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
                    id="footer-logo-gradient"
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
              <span className="footer__logo-text">BulkBlitz</span>
            </div>
            <p className="footer__description">
              India&apos;s first crowd-powered manufacturing marketplace. Join
              batches, pool together, and unlock bulk pricing — in real time.
            </p>
            <div className="footer__social">
              <a href="#" aria-label="Twitter" className="footer__social-link">
                𝕏
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="footer__social-link"
              >
                📷
              </a>
              <a href="#" aria-label="LinkedIn" className="footer__social-link">
                in
              </a>
              <a href="#" aria-label="YouTube" className="footer__social-link">
                ▶
              </a>
            </div>
          </div>

          {/* Links Columns */}


          <div className="footer__links-group">
            <h4 className="footer__heading">Company</h4>
            <Link href="#" className="footer__link">
              About Us
            </Link>
            <Link href="#" className="footer__link">
              Careers
            </Link>
            <Link href="#" className="footer__link">
              Blog
            </Link>
            <Link href="#" className="footer__link">
              Contact
            </Link>
            <Link href="#" className="footer__link">
              Press Kit
            </Link>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__bottom-left">
            <p className="footer__copyright">
              © 2026 BulkBlitz Technologies Pvt. Ltd. All rights reserved.
            </p>
          </div>
          <div className="footer__bottom-right">
            <Link href="#" className="footer__bottom-link">
              Privacy Policy
            </Link>
            <Link href="#" className="footer__bottom-link">
              Terms of Service
            </Link>
            <Link href="#" className="footer__bottom-link">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--bg-surface);
          border-top: 1px solid var(--border-default);
          padding: var(--space-12) 0 var(--space-8);
          margin-top: var(--space-16);
        }

        .footer__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-8);
        }

        @media (min-width: 768px) {
          .footer__grid {
            grid-template-columns: 2fr 1fr;
            gap: var(--space-10);
          }
        }

        .footer__brand {
          max-width: 320px;
        }

        .footer__logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-4);
        }

        .footer__logo-text {
          font-family: var(--font-heading), sans-serif;
          font-weight: 800;
          font-size: 1.25rem;
          background: linear-gradient(135deg, #0d6efd, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .footer__description {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: var(--space-5);
        }

        .footer__social {
          display: flex;
          gap: var(--space-2);
        }

        .footer__social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: var(--bg-elevated);
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.85rem;
          transition: all var(--transition-fast);
        }

        .footer__social-link:hover {
          background: var(--accent-primary);
          color: white;
          transform: translateY(-2px);
        }

        .footer__heading {
          font-family: var(--font-heading), sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-primary);
          margin-bottom: var(--space-4);
        }

        .footer__links-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .footer__link {
          font-size: 0.875rem;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color var(--transition-fast);
        }

        .footer__link:hover {
          color: var(--accent-primary);
        }

        .footer__bottom {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          align-items: center;
          justify-content: space-between;
          margin-top: var(--space-10);
          padding-top: var(--space-6);
          border-top: 1px solid var(--border-light);
        }

        @media (min-width: 768px) {
          .footer__bottom {
            flex-direction: row;
          }
        }

        .footer__copyright {
          font-size: 0.8rem;
          color: var(--text-tertiary);
        }

        .footer__bottom-right {
          display: flex;
          gap: var(--space-5);
        }

        .footer__bottom-link {
          font-size: 0.8rem;
          color: var(--text-tertiary);
          text-decoration: none;
          transition: color var(--transition-fast);
        }

        .footer__bottom-link:hover {
          color: var(--text-secondary);
        }
      `}</style>
    </footer>
  );
}
