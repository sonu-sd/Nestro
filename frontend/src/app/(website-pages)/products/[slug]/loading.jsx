export default function ProductLoading() {
  return <main className="mx-auto max-w-[1440px] space-y-8 px-4 py-8 sm:px-6 lg:px-8" aria-label="Loading product details">
    <div className="h-4 w-44 animate-pulse rounded bg-[#E7D9C9]" />
    <div className="grid gap-8 lg:grid-cols-2"><div className="aspect-square animate-pulse rounded-2xl bg-[#E7D9C9]" /><div className="space-y-5 rounded-2xl bg-white p-8"><div className="h-5 w-28 animate-pulse rounded bg-[#E7D9C9]" /><div className="h-10 w-3/4 animate-pulse rounded bg-[#E7D9C9]" /><div className="h-5 w-1/2 animate-pulse rounded bg-[#E7D9C9]" /><div className="h-12 w-36 animate-pulse rounded bg-[#E7D9C9]" /><div className="h-11 w-44 animate-pulse rounded bg-[#E7D9C9]" /></div></div>
    <div className="grid gap-8 lg:grid-cols-2"><div className="h-60 animate-pulse rounded-2xl bg-[#E7D9C9]" /><div className="h-60 animate-pulse rounded-2xl bg-[#E7D9C9]" /></div>
  </main>;
}
