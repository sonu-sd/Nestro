import { fetchProduct } from "@/api/api";
import ProductCard from "@/components/website/store-components/ProductCard";
import Pagenation from "@/components/website/store-components/Pagenation";
import Righttop from "@/components/website/store-components/Righttop";
import Link from "next/link";

import React from "react";

export default async function Page({ searchParams }) {
  const query = await searchParams;

  const category = query.category || null;
  const room = query.room || null;
  const material = query.material || null;
  const color = query.color || null;
  const stock = query.stock || null;
  const minPrice = query.minprice || null;
  const maxPrice = query.maxprice || null;

  const page = Number(query.page) || 1;
  const sort = query.sort || "featured";
  const search =
    typeof query.search === "string" ? query.search.trim().slice(0, 80) : "";

  const response = await fetchProduct({
    category,
    room,
    stock,
    minPrice,
    maxPrice,
    page,
    sort,
    material,
    color,
    search,
  });

  return (
    <>
      <Righttop total={response?.total || 0} />
      {response?.data?.length ? (
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:mt-4 sm:gap-4 xl:grid-cols-3">
          {response.data.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <section className="mt-4 rounded-2xl border border-[#E8DDD3] bg-white px-5 py-14 text-center sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B5E3C]">
            No matching products
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-[#29211B]">
            {search
              ? `We couldn’t find “${search}”`
              : "No products match these filters"}
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#76685C]">
            Try a shorter product name, another material, or clear the current
            search and filters.
          </p>
          <Link
            href="/store"
            className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-[#8B5E3C] px-5 text-sm font-semibold text-white hover:bg-[#70482E]"
          >
            Clear search & filters
          </Link>
        </section>
      )}

      <Pagenation pages={response?.pages || 1} />
    </>
  );
}
