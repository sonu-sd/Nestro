import Link from "next/link";

export default function ProductNotFound() {
  return <main className="mx-auto max-w-xl px-4 py-24 text-center"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B5E3C]">Product unavailable</p><h1 className="mt-3 text-3xl font-semibold text-[#29211B]">We couldn’t find this product</h1><p className="mt-3 text-sm leading-6 text-[#665548]">It may have been removed or is no longer available in the store.</p><Link href="/store" className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-[#8B5E3C] px-5 text-sm font-semibold text-white hover:bg-[#70482e]">Browse products</Link></main>;
}
