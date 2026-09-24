"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiArrowRight, FiSearch, FiX } from "react-icons/fi";

const suggestions = ["Sofa", "Dining table", "Bed", "Chair"];

export default function ProductSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const search = (value) => {
    const term = value.trim().slice(0, 80);
    const params = new URLSearchParams();
    if (term) params.set("search", term);
    router.push(`/store${params.size ? `?${params.toString()}` : ""}`);
    setOpen(false);
  };

  const toggleSearch = () => {
    if (open) return setOpen(false);
    setQuery(
      pathname.startsWith("/store") ? searchParams.get("search") || "" : "",
    );
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close product search" : "Search products"}
        aria-expanded={open}
        aria-controls="product-search-panel"
        onClick={toggleSearch}
        className="flex h-10 w-10 items-center justify-center rounded-full text-xl transition hover:bg-[#F0EBE3] hover:text-[#8b5e3c]"
      >
        {open ? <FiX /> : <FiSearch />}
      </button>

      {open && (
        <section
          id="product-search-panel"
          className="absolute inset-x-0 top-full border-y border-[#e8e1d9] bg-[#fffdf9] px-4 py-5 shadow-xl sm:px-6"
          aria-label="Product search"
        >
          <form
            className="mx-auto max-w-3xl"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              search(query);
            }}
          >
            <label
              htmlFor="global-product-search"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8B5E3C]"
            >
              What are you looking for?
            </label>
            <div className="flex items-center rounded-xl border border-[#DCCDBD] bg-white p-1.5 shadow-sm focus-within:border-[#8B5E3C] focus-within:ring-2 focus-within:ring-[#8B5E3C]/15">
              <FiSearch
                className="ml-3 shrink-0 text-lg text-[#8B5E3C]"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                id="global-product-search"
                type="search"
                value={query}
                maxLength={80}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search sofas, tables, beds, materials…"
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-[#29211B] outline-none placeholder:text-[#998B7F] sm:text-base"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#75675C] hover:bg-[#F4EEE7]"
                >
                  <FiX />
                </button>
              )}
              <button
                type="submit"
                className="flex min-h-10 shrink-0 items-center gap-2 rounded-lg bg-[#8B5E3C] px-3 text-xs font-semibold text-white hover:bg-[#70482E] sm:px-5 sm:text-sm"
              >
                Search <FiArrowRight aria-hidden="true" />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#76685C]">
              <span>Popular:</span>
              {suggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => search(item)}
                  className="rounded-full border border-[#DED2C6] bg-white px-3 py-1.5 transition hover:border-[#8B5E3C] hover:text-[#8B5E3C]"
                >
                  {item}
                </button>
              ))}
            </div>
          </form>
        </section>
      )}
    </>
  );
}
