import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4 px-6 text-center">
      <SearchX className="w-10 h-10 text-neutral-500" />
      <h1 className="text-4xl font-black tracking-tight">404</h1>
      <p className="text-neutral-400 max-w-sm">This page doesn&apos;t exist or has been moved.</p>
      <Link href="/" className="mt-2 px-5 py-2.5 rounded-xl bg-[var(--color-brand,#F97316)] text-black font-bold text-sm">
        Back to home
      </Link>
    </div>
  );
}
