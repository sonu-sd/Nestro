"use client";

import Link from "next/link";

export default function ProductColorPicker({ colors, selected = [], onChange, legacyColor = "" }) {
  function toggle(id) {
    if (!selected.includes(id) && selected.length >= 12) return;
    onChange(selected.includes(id) ? selected.filter((value) => value !== id) : [...selected, id]);
  }

  return <div className="space-y-3"><div className="flex items-center justify-between gap-3"><h3 className="text-sm font-semibold">Product colors</h3><Link href="/admin/colors" className="admin-link text-xs">Manage colors →</Link></div><div className="flex flex-wrap gap-2">{colors.map((color) => <label key={color._id} className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs ${color.status === false && !selected.includes(color._id) ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${selected.includes(color._id) ? "border-[#8B5E3C] bg-[#F4E9DD]" : "border-[#DCCDBD]"}`}><input type="checkbox" checked={selected.includes(color._id)} disabled={color.status === false && !selected.includes(color._id)} onChange={() => toggle(color._id)} className="accent-[#8B5E3C]"/><span className="h-4 w-4 rounded-full border border-[#DCCDBD]" style={{ backgroundColor: color.hex }}/>{color.name}{color.status === false ? " (archived)" : ""}</label>)}{!colors.length && <p className="text-xs opacity-70">No active colors. Add one in Color Management.</p>}</div>{legacyColor && <p className="text-xs opacity-70">Existing legacy color: {legacyColor}. It stays saved until you update it.</p>}</div>;
}
