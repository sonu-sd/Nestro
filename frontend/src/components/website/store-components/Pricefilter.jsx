"use client";
import { useSearchParams, useRouter } from "next/navigation";
import React, { use, useState } from "react";

export default function Pricefilter() {
  const [minPrice, setminPrice] = useState("");
  const [maxPrice, setmaxPrice] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  //get selected values from url and split then into an array

  const minprice = Number(searchParams.get("minprice")) || minPrice;
  const maxprice = Number(searchParams.get("maxprice")) || maxPrice;

  function Pricehandle() {
    if (Number(minPrice) > Number(maxPrice)) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("minprice", minPrice);
    params.set("maxprice", maxPrice);

    router.push(`/store?${params.toString()}`, { scroll: false });
  }

  function Clerehandle() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minprice");
    params.delete("maxprice");

    router.push(`/store?${params.toString()}`, { scroll: false });
  }
  return (
    <div className="mt-6 pb-4 border-b border-[#E7DDD1]">
      <h2 className="text-[13px] font-semibold text-[#1e1e1e]">Price Range</h2>

      <div className="mt-3 pb-4 items-center gap-3">
        <div className="flex">
          <input
            type="text"
            value={minprice}
            onChange={(e) => {
              setminPrice(e.target.value);
            }}
            placeholder="₹8,000"
            className="w-full rounded-lg border border-[#d9c8b8] px-3 py-1 text-[13px] outline-none focus:border-[#8B5E3C] text-[#444444]"
          />

          <span className="text-[#999]">—</span>

          <input
            type="text"
            value={maxprice}
            onChange={(e) => setmaxPrice(e.target.value)}
            placeholder="₹2,50,000"
            className="w-full rounded-lg border border-[#d9c8b8] px-3 py-1 text-[13px] outline-none focus:border-[#8B5E3C] text-[#444444] text-[12px"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={Pricehandle}
            className="px-3 py-1 rounded-2xl mt-2 text-white bg-[#8B5E3C]"
          >
            set price
          </button>
          <button
            onClick={Clerehandle}
            className="px-3 py-1 rounded-2xl mt-2 text-white bg-[#8B5E3C]"
          >
            clere price
          </button>
        </div>
        {Number(minPrice) > Number(maxPrice) && (
          <p className="text-red-700">
            minimum price cannot be greater than maximun price
          </p>
        )}
      </div>
    </div>
  );
}
