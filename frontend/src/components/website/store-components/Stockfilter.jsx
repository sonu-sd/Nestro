"use client";

import { consumeDynamicAccess } from "next/dist/server/app-render/dynamic-rendering";
import { useSearchParams, useRouter } from "next/navigation";
// import { useRouter } from 'next/router';
import React from "react";

export default function Stockfilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectValue = searchParams.get("stock") === "true";
  function stockhandle() {
    // filter by stock true or false
    const params = new URLSearchParams(searchParams.toString());
    if (selectValue) {
      params.delete("stock");
    } else {
      params.set("stock", "true");
    }

    router.push(`/store?${params.toString()}`, { scroll: false });
  }
  return (
    <div className="border-b border-[#E7DDD1] pb-4">
      <h3 className="font-semibold mb-3 mt-4 text-[#1e1e1e] text-[13px] ">
        Availability
      </h3>

      <label
        // key={item.id}
        className="flex gap-2 mb-1 text-[#444444] text-[12px]"
      >
        <input type="checkbox" checked={selectValue} onChange={stockhandle} />
        <span>in stock</span>
      </label>
    </div>
  );
}
