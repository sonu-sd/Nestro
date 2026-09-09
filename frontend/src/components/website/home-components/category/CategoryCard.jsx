import React from 'react'

export default function CategoryCard({Imgpath,title,pieces}) {
  return (
    <div className="group flex min-w-24 cursor-pointer flex-col items-center">
      {/* Image */}
      <div className="h-24 w-24 overflow-hidden rounded-full border border-[#e7ddd1]  hover:border-[#8B5E3C]">
        <img
          src={Imgpath}
          alt={title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
        />
      </div>

      {/* Title */}
      <h3 className="mt-4 text-[12px] font-semibold 
      
      text-[#444444]">
        {title}
      </h3>

      {/* Pieces */}
      <p className="mt-1 text-[10px] text-gray-500 ">
        {pieces}
      </p>
    </div>
  );
}
    
