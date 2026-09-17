import React from 'react'
import AppImage from "@/components/ui/AppImage";


export default function ProductMiniCard({thumbnail,category,title,price,}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#d8c2ac] bg-white hover: duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#8B5E3C]">
      <AppImage
        src={thumbnail}
        alt={title}
        className="h-26 w-full object-cover transition-transform duration-300 hover:scale-105"
      />

      <div className="p-3">
        <p className="text-[11px] uppercase tracking-[2px] text-gray-500">
          {category?.name}
        </p>

        <h3 className=" text-[12px] font-semibold text-[#444444]">
          {title}
        </h3>

        <div className=" flex items-center justify-between">
          {/* <div className="text-[#C58A42] text-sm">
            {"★".repeat(rating)}
          </div> */}

          <p className=" text-[14px]  text-[#1e1e1e]">
            {price}
          </p>
        </div>
      </div>
    </div>
  );
}
