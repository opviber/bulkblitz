import Link from 'next/link';
import Logo from '@/components/ui/Logo';

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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.733-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-white/5 mt-20 select-none">
      
      {/* ── NEWSLETTER STRIP ── */}
      <div className="bg-primary/5 py-8 border-b border-primary/10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col text-center md:text-left gap-1">
            <h3 className="font-display font-black text-lg text-white">Stay ahead of every price drop.</h3>
            <p className="text-xs text-neutral-400">Get notified when new batches launch in your categories.</p>
          </div>
          <div className="flex w-full md:w-auto items-center max-w-sm gap-2 bg-neutral-900 border border-white/5 rounded-xl p-1">
            <input
              type="email"
              className="flex-1 bg-transparent border-none outline-none text-xs text-white px-3 py-1.5 placeholder-neutral-500"
              placeholder="you@example.com"
              aria-label="Email address"
            />
            <button className="px-4 py-1.5 rounded-lg btn-primary-new font-bold text-xs cursor-pointer">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN FOOTER BODY ── */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        
        {/* Column 1 — Brand info */}
        <div className="md:col-span-4 flex flex-col gap-4 text-left">
          <Link href="/" className="flex items-center gap-3 text-white">
            <Logo className="w-8 h-8" />
            <span className="font-display font-black text-lg text-white tracking-tight">BulkBlitz</span>
          </Link>

          <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
            India&apos;s first crowd-powered manufacturing marketplace. Join batches, pool together,
            and unlock bulk pricing from manufacturers — in real time.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Twitter / X" className="p-2 rounded-lg bg-neutral-900 border border-white/5 text-neutral-400 hover:text-white transition-colors">
              <TwitterIcon />
            </a>
            <a href="#" aria-label="Instagram" className="p-2 rounded-lg bg-neutral-900 border border-white/5 text-neutral-400 hover:text-white transition-colors">
              <InstagramIcon />
            </a>
            <a href="#" aria-label="LinkedIn" className="p-2 rounded-lg bg-neutral-900 border border-white/5 text-neutral-400 hover:text-white transition-colors">
              <LinkedInIcon />
            </a>
          </div>

          <div className="flex items-center gap-1.5 mt-2 self-start px-2.5 py-1 rounded-md border border-neutral-900 bg-neutral-950 text-[10px] text-neutral-400 font-bold">
            <span>🇮🇳</span>
            <span>Made in India</span>
          </div>
        </div>

        {/* Column 2 — Marketplace */}
        <div className="md:col-span-2 flex flex-col gap-3 text-left">
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-neutral-300">Marketplace</h4>
          <ul className="flex flex-col gap-2">
            {marketplaceLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-xs text-neutral-400 hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 — Company */}
        <div className="md:col-span-2 flex flex-col gap-3 text-left">
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-neutral-300">Company</h4>
          <ul className="flex flex-col gap-2">
            {companyLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-xs text-neutral-400 hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4 — Trust & Safety */}
        <div className="md:col-span-4 flex flex-col gap-4 text-left">
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-neutral-300">Trust & Safety</h4>
          <div className="grid grid-cols-2 gap-4">
            {trustItems.map((item) => (
              <div key={item.title} className="flex gap-2.5">
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-neutral-300 leading-tight">{item.title}</span>
                  <span className="text-[9px] text-neutral-500 mt-0.5 leading-tight">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/5 opacity-50 cursor-not-allowed">
              <span className="text-[9px] font-bold text-neutral-400 text-left">
                <div className="text-[7px] text-neutral-500 uppercase tracking-widest leading-none">Coming Soon</div>
                <div className="font-sans leading-none mt-0.5">App Store</div>
              </span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/5 opacity-50 cursor-not-allowed">
              <span className="text-[9px] font-bold text-neutral-400 text-left">
                <div className="text-[7px] text-neutral-500 uppercase tracking-widest leading-none">Coming Soon</div>
                <div className="font-sans leading-none mt-0.5">Google Play</div>
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-white/5 bg-neutral-950/40">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-neutral-500 font-semibold">
          <p>© 2026 BulkBlitz Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {legalLinks.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
