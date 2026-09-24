import { Suspense } from "react";
import Hero from "@/components/website/store-components/Hero";
import Left from "@/components/website/store-components/Left";
import StoreSkeleton from "@/components/website/store-components/StoreSkeleton";
import ResponsiveFilters from "@/components/website/store-components/ResponsiveFilters";

export default function Layout({ children }) {
  return (
    <div>
      <div className="hidden lg:block">
        <Hero />
      </div>

      <div className="mx-auto flex max-w-[1580px] min-w-0 flex-col gap-3 px-3 py-4 sm:gap-4 sm:px-6 sm:py-6 lg:flex-row lg:gap-5">
        {/* Left Sidebar */}
        <ResponsiveFilters>
          <Suspense fallback={<StoreSkeleton sidebar />}>
            <Left />
          </Suspense>
        </ResponsiveFilters>

        {/* Right Content */}
        <main className="min-w-0 flex-1">
          <Suspense fallback={<StoreSkeleton />}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
