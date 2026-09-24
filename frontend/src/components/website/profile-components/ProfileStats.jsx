"use client";

import React from "react";

export default function ProfileStats() {
  const stats = [
    {
      value: "7",
      label: "Orders",
    },
    {
      value: "₹4.2L",
      label: "Spent",
    },
    {
      value: "420",
      label: "Points",
    },
    {
      value: "3",
      label: "Reviews",
    },
  ];

  return (
    <section className="rounded-2xl border border-[#e8e1d9] bg-white p-5 md:p-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="flex h-[72px] flex-col items-center justify-center rounded-xl bg-[#f7f4f0]"
          >
            <p className="text-[20px] font-medium text-[#9a6739]">
              {item.value}
            </p>

            <p className="mt-0.5 text-[11px] text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
