"use client";
import { useSearchParams, useRouter } from "next/navigation";

export default function Pagenation({ pages = 1 }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const pageNumber = Array.from(
    { length: pages },
    (_, index) => index + 1,
  ).filter(
    (page) => page === 1 || page === pages || Math.abs(page - currentPage) <= 1,
  );

  function handelPage(page) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page);
    router.push(`/store?${params.toString()}`, { scroll: false });
  }
  if (pages <= 1) return null;

  return (
    <div className="flex flex-col items-center gap-3 py-8">
      {/* Pagination */}
      <div className="flex max-w-full items-center gap-2 overflow-x-auto px-1 pb-2">
        <button
          disabled={currentPage === 1}
          onClick={() => handelPage(currentPage - 1)}
          className="w-11 h-11 rounded-lg border border-gray-200 text-black"
        >
          ‹
        </button>

        {pageNumber.map((page, index) => (
          <span key={page} className="flex items-center gap-2">
            {index > 0 && page - pageNumber[index - 1] > 1 && (
              <span className="flex h-11 w-7 items-center justify-center text-[#76685C]">
                …
              </span>
            )}
            <button
              key={page}
              onClick={() => handelPage(page)}
              className={`w-11 h-11 rounded-lg border border-gray-300 ${
                currentPage === page
                  ? "bg-[#94623d] text-white"
                  : "bg-[#efece6] text-black"
              }`}
            >
              {page}
            </button>
          </span>
        ))}

        <button
          disabled={currentPage === pages}
          onClick={() => handelPage(currentPage + 1)}
          className="w-11 h-11 rounded-lg border border-gray-300 bg-[#efece6] text-black"
        >
          ›
        </button>
      </div>
    </div>
  );
}
