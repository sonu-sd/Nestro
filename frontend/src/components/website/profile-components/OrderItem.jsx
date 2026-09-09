"use client";

import React from "react";
import {
  FiBox,
  FiGrid,
  FiHome,
} from "react-icons/fi";
export default function OrderItem({
  order,
  last,
}) {

  const getIcon = () => {
    if (order.name.includes("Table")) {
      return <FiBox />;
    }

    if (order.name.includes("Armchair")) {
      return <  FiGrid />;
    }

    return <FiHome />;
  };

  return (
    <div
      className={`flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between ${
        !last ? "border-b border-[#e8e1d9]" : ""
      }`}
    >

      {/* LEFT */}
      <div className="flex min-w-0 items-center gap-4">

        {/* ICON */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#f4f0eb] text-[20px] text-[#b8895b]">
          {getIcon()}
        </div>

        {/* INFO */}
        <div className="min-w-0">

          <h3 className="truncate text-[14px] font-medium text-[#171717]">
            {order.name}
          </h3>

          <p className="mt-1 text-[11px] text-gray-500">
            Order {order.id} · {order.date}
          </p>

        </div>

      </div>


      {/* RIGHT */}
      <div className="flex items-center justify-between gap-6 sm:justify-end">

        {/* STATUS */}
        <span
          className={`rounded-full px-3 py-1.5 text-[10px] font-medium ${
            order.status === "Delivered"
              ? "bg-[#e9f3dc] text-[#64832d]"
              : "bg-[#faefd9] text-[#a56c21]"
          }`}
        >
          {order.status}
        </span>

        {/* PRICE */}
        <p className="min-w-[70px] text-right text-[13px] font-semibold text-[#171717]">
          {order.price}
        </p>

      </div>

    </div>
  );
}