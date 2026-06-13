import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import "./animations.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

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
  openGraph: {
    title: "BulkBlitz — Bulk Up. Price Down.",
    description:
      "Join the crowd. Drop the price. India's first dynamic group-buy platform.",
    type: "website",
    locale: "en_IN",
    siteName: "BulkBlitz",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
