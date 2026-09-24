"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Colorfilter({ colors }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected = searchParams.get("color")?.split(",").filter(Boolean) || [];

  function toggle(slug) {
    const params = new URLSearchParams(searchParams.toString());
    const next = selected.includes(slug)
      ? selected.filter((value) => value !== slug)
      : [...selected, slug];
    if (next.length) params.set("color", next.join(","));
    else params.delete("color");
    params.delete("page");
    router.push(`/store?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="border-b border-[#E7DDD1] py-6">
      <h3 className="text-[13px] font-semibold text-[#1e1e1e]">Color</h3>
      <div className="mt-4 flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color._id}
            type="button"
            onClick={() => toggle(color.slug)}
            title={color.name}
            aria-label={`Filter ${color.name}`}
            aria-pressed={selected.includes(color.slug)}
            className={`h-9 w-9 rounded-full border-2 transition hover:scale-110 ${selected.includes(color.slug) ? "ring-2 ring-[#8B5E3C] ring-offset-2" : ""}`}
            style={{
              backgroundColor: color.hex,
              borderColor: color.hex === "#FFFFFF" ? "#D7C8B8" : "#FFFFFF",
            }}
          />
        ))}
        {!colors.length && (
          <p className="text-xs text-[#666]">No color filters available.</p>
        )}
      </div>
      {selected.length > 0 && (
        <button
          type="button"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("color");
            params.delete("page");
            router.push(`/store?${params.toString()}`, { scroll: false });
          }}
          className="mt-3 text-xs font-medium text-[#8B5E3C] underline"
        >
          Clear colors
        </button>
      )}
    </div>
  );
}
