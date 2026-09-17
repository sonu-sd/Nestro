"use client";

import Link from "next/link";

export default function ProductError({ reset }) {
  return <main className="mx-auto max-w-xl px-4 py-24 text-center"><h1 className="text-2xl font-semibold text-[#29211B]">Product details couldn’t load</h1><p className="mt-3 text-sm text-[#665548]">Please try again in a moment.</p><div className="mt-6 flex justify-center gap-3"><button onClick={() => reset()} className="min-h-11 rounded-lg bg-[#8B5E3C] px-5 text-sm font-semibold text-white">Try again</button><Link href="/store" className="inline-flex min-h-11 items-center rounded-lg border border-[#CDBBA9] px-5 text-sm font-semibold text-[#8B5E3C]">Back to store</Link></div></main>;
}
