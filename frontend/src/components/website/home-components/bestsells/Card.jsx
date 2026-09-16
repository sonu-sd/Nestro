import React from 'react'

export default function Card({thumbnail
,title,category,price}) {
    const badge = null;
    return (
        <div className="group cursor-pointer border rounded-2xl border-[#C6A27E] hover:border-[#8B5E3C]">
           
            <div className="relative h-[200px] overflow-hidden rounded-t-2xl bg-[#f5f5f5]">
                <img
                    src={thumbnail}
                    alt={title}
                    className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
                />

                {badge && (
                    <span className="absolute left-4 top-4 rounded-full bg-[#8b5e3c] px-3 py-1 text-[10px] font-semibold tracking-wider text-white">
                        {badge}
                    </span>
                )}
            </div>

            <div className="py-3 px-4 bg-white rounded-b-2xl">
               
                <p className=" uppercase text-[10px] text-gray-500 text-[#6b7280]]">
                    {category?.name}
                </p>

                <h3 className="mt-1 text-[12px] font-semibold text-[#444444]">
                    {title}
                </h3>

                <div className='flex justify-between'>

                  {/* jab bakend se data aaega tab rating implement karni h  */}

                {/* <div className="mt-1 flex text-[#c98d42] text-[10px] items-center">
                    {Array.from({ length: rating }).map((_, index) => (
                        <span key={index}>★</span>
                    ))}
                </div> */}

                {/* Price */}
                <p className="mt-3 text-[13px] font-semibold text-[#1f1f1f]">
                    {price}
                </p>
                 </div>
            </div>
        </div>
    );
}
