import React from "react";
import Hero from "@/components/website/store-components/Hero";
import Left from "@/components/website/store-components/Left";
import Righttop from "@/components/website/store-components/Righttop";

export default function Layout({ children }) {
  return (
    <div>
      <Hero />

      <div className="m-4 flex min-w-0 flex-col gap-4 sm:m-6 lg:flex-row lg:gap-5">
        {/* Left Sidebar */}
        <details className="group w-full shrink-0 rounded-2xl bg-white lg:block lg:w-[280px]" open={false}>
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between rounded-2xl border border-[#E8DDD3] px-5 text-sm font-semibold text-[#1e1e1e] lg:hidden">
            Filters
            <span className="transition group-open:rotate-180">⌄</span>
          </summary>
          <div className="hidden group-open:block lg:block">
            <Left />
          </div>
        </details>

        {/* Right Content */}
        <div className="min-w-0 flex-1">
          <Righttop />

          {children}

        </div>
      </div>
    </div>
  );
}
