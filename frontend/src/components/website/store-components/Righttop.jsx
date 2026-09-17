"use client";

import { FiX } from "react-icons/fi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Righttop({ total = 0 }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "featured";
  const activeFilters = ["category", "room", "material", "color"].flatMap((key) => (searchParams.get(key)?.split(",").filter(Boolean) || []).map((value) => ({ key, value })));

  const removeFilter = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    const values = (params.get(key)?.split(",") || []).filter((item) => item !== value);
    if (values.length) params.set(key, values.join(",")); else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSort = (e) => {
    const value = e.target.value;

    const params = new URLSearchParams(searchParams.toString());

    if (value === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    // Sort change hone par page 1 par chale jao
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex w-full flex-col gap-3 rounded-xl border border-[#E8DDD3] bg-white px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between">

      {/* Left */}
      <div className="text-base sm:text-[18px]">
        <span className="font-semibold text-[#1E293B]">
          {total}
        </span>

        <span className="text-gray-500 ml-1">
          products found
        </span>
      </div>

      {/* Right */}
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">

        {/* Active Filters */}
        <div className="flex max-w-full items-center gap-2 overflow-x-auto pb-1 sm:pb-0">

          {activeFilters.map(({ key, value }) => <button key={`${key}-${value}`} onClick={() => removeFilter(key, value)} className="flex items-center gap-1 bg-[#F5EDE5] text-[#8B5E3C] px-3 py-1 rounded-full text-sm hover:bg-[#EADBCB] transition">{value.replaceAll("-", " ")}<FiX size={14} /></button>)}

        </div>

        {/* Sort */}
        <select
          value={currentSort}
          onChange={handleSort}
          className="min-h-11 w-full rounded-lg border border-[#E8DDD3] bg-white px-4 py-2 text-sm text-black outline-none sm:w-auto"
        >
          <option value="featured">Sort: Featured</option>
          <option value="newest">Newest</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="bestselling">Best Selling</option>
        </select>

      </div>
    </div>
  );
}
