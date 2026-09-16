import React from 'react'

export default function CategoryCard({image,name}) {
  return (
    <div className="group flex min-w-24 cursor-pointer flex-col items-center">
      {/* Image */}
      <div className="h-28 w-28 overflow-hidden rounded-full border border-[#e7ddd1]  hover:border-[#8B5E3C]">
        <img
          src={image|| null}
          alt={name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
        />
      </div>

      {/* Title */}
      <h3 className="mt-4 text-[12px] font-semibold 
      
      text-[#444444]">
        {name}
      </h3>

      {/* Pieces */}
      <p className="mt-1 text-[10px] text-gray-500 ">
        {8}
      </p>
    </div>
  );
}
    
