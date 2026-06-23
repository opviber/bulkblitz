import { Inter, Inter_Tight, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./animations.css";

const interTight = Inter_Tight({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-number",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

import JsonLd from "@/components/seo/JsonLd";
import { Toaster } from "sonner";
import BottomTabNav from "@/components/layout/BottomTabNav";

export const metadata = {
  title: "BulkBlitz — Bulk Up. Price Down.",
  description:
    "India's first crowd-powered manufacturing marketplace. Join batches, pool together, and unlock bulk pricing from manufacturers — in real time.",
  keywords: [
    "bulk buying",
    "group buy",
    "manufacturer direct",
    "wholesale India",
    "dynamic pricing",
    "BulkBlitz",
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "BulkBlitz — Bulk Up. Price Down.",
    description:
      "Join the crowd. Drop the price. India's first dynamic group-buy platform.",
    type: "website",
    locale: "en_IN",
    siteName: "BulkBlitz",
    url: "https://bulkblitz.in",
    images: [
      {
        url: "https://bulkblitz.in/images/og-default.png",
        width: 1200,
        height: 630,
        alt: "BulkBlitz Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BulkBlitz — Bulk Up. Price Down.",
    description:
      "Join the crowd. Drop the price. India's first dynamic group-buy platform.",
    site: "@bulkblitz",
    images: ["https://bulkblitz.in/images/og-default.png"],
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "BulkBlitz",
  "url": "https://bulkblitz.in",
  "logo": "https://bulkblitz.in/logo.png",
  "sameAs": [
    "https://twitter.com/bulkblitz",
    "https://instagram.com/bulkblitz"
  ]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "BulkBlitz",
  "url": "https://bulkblitz.in",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://bulkblitz.in/?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${interTight.variable} ${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <JsonLd data={orgSchema} />
        <JsonLd data={websiteSchema} />
      </head>
      <body className="pb-16 md:pb-0">
        {children}
        <BottomTabNav />
        <Toaster
          position="top-center"
          theme="dark"
          toastOptions={{
            style: {
              background: "var(--color-surface-raised, #18181B)",
              color: "var(--color-text-primary, #FAFAFA)",
              border: "1px solid var(--color-border, rgba(255,255,255,0.07))",
            },
          }}
        />
      </body>
    </html>
  );
}
