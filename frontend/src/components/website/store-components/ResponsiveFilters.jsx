"use client";

import { useState } from "react";
import { FiSliders, FiX } from "react-icons/fi";

export default function ResponsiveFilters({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#d9cabc] bg-white text-sm font-semibold text-[#493329] lg:hidden"
      >
        <FiSliders /> Filter products
      </button>
      {open && (
        <button
          type="button"
          aria-label="Close filters"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[60] bg-black/35 lg:hidden"
        />
      )}
      <aside
        className={`${open ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-[70] w-[min(88vw,360px)] overflow-y-auto bg-[#f7f3ee] p-4 shadow-2xl transition-transform lg:sticky lg:top-20 lg:z-auto lg:block lg:w-[280px] lg:translate-x-0 lg:overflow-visible lg:bg-transparent lg:p-0 lg:shadow-none`}
      >
        <div className="mb-3 flex items-center justify-between lg:hidden">
          <h2 className="font-semibold text-[#29211B]">Filter products</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white"
            aria-label="Close filters"
          >
            <FiX />
          </button>
        </div>
        {children}
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-3 min-h-11 w-full rounded-xl bg-[#8B5E3C] text-sm font-semibold text-white lg:hidden"
        >
          Show results
        </button>
      </aside>
    </>
  );
}
