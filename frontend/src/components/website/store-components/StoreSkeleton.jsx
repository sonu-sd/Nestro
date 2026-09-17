export default function StoreSkeleton({ sidebar = false }) {
  const bar = "animate-pulse rounded-lg bg-[#E4D7C9]";
  if (sidebar) return <div aria-busy="true" className="rounded-2xl border border-[#E8DDD3] bg-white p-6"><div className={`${bar} h-5 w-24`}/>{Array.from({ length: 4 }, (_, index) => <div key={index} className="mt-7 space-y-3"><div className={`${bar} h-4 w-28`}/>{Array.from({ length: 3 }, (_, row) => <div key={row} className={`${bar} h-3 w-full`}/>)}</div>)}</div>;
  return <div aria-busy="true" aria-label="Loading products" className="space-y-4"><div className={`${bar} h-14 w-full`}/><div className="grid gap-4 min-[540px]:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="overflow-hidden rounded-xl border border-[#E8DDD3] bg-white"><div className={`${bar} aspect-square w-full rounded-none`}/><div className="space-y-3 p-4"><div className={`${bar} h-4 w-3/4`}/><div className={`${bar} h-4 w-1/2`}/></div></div>)}</div></div>;
}
