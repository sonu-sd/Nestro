import { Suspense } from "react";
import Hero from "@/components/website/store-components/Hero";
import Left from "@/components/website/store-components/Left";
import Righttop from "@/components/website/store-components/Righttop";

export default function Layout({ children }) {
  return (
    <div>
      <Hero />

      <div className="m-4 flex min-w-0 flex-col gap-4 sm:m-6 lg:flex-row lg:gap-5">

        {/* Left Sidebar */}
        <aside className="w-full shrink-0 lg:sticky lg:top-20 lg:block lg:w-[280px]">
          <Suspense fallback={null}>
            <Left />
          </Suspense>
        </aside>

        {/* Right Content */}
        <main className="min-w-0 flex-1">
          <Suspense fallback={null}>
            <Righttop />
          </Suspense>

          <Suspense fallback={null}>
            {children}
          </Suspense>
        </main>

      </div>
    </div>
  );
}
