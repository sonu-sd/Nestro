import React from "react";
import { ProductsData } from "./ProductsData";
import ProductMiniCard from "./Productminicard";

export default function Landedsection({products}) {
  
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">

      {/* Heading */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[4px] text-[#8b5e3c]">
            New arrivals
          </p>

          <h2 className="mt-2 text-xl font-medium text-[#1e1e1e]">
            Just Landed
          </h2>
        </div>

        <button className="text-sm text-[#8B5E3C] hover:underline">
          View all
        </button>
      </div>

      {/* Main Content */}
      <div className="mt-4 grid w-full grid-cols-1 gap-3 xl:grid-cols-12">

        {/* ================= LEFT FEATURED BOX ================= */}
        <div className="grid rounded-2xl bg-[#2c2016] p-5 xl:col-span-7">

          <p className="text-[10px] uppercase text-[#c6a27e]">
            Featured
          </p>

          <h2 className="mt-3 text-xl font-medium leading-tight text-[#faf7fa]">
            Scandinavian <br />
            Dining Set
          </h2>

          <p className="mt-3 text-[12px] text-white/70">
            Ash wood + linen chairs. Set of 4.
          </p>

          <h3 className="mt-3 text-lg font-semibold text-[#d6bfa7]">
            ₹1,24,000
          </h3>

          <div>
            <button className="mt-3 min-h-11 rounded-md bg-[#9D6C41] px-4 py-2 text-[12px] text-white">
              View in Store
            </button>
          </div>

          <img
            src="https://images.unsplash.com/photo-1519643381401-22c77e60520e?auto=format&fit=crop&w=700&q=80"
            alt="Scandinavian dining set"
            className="mb-2 mt-4 h-40 w-full rounded-2xl object-cover sm:h-52 xl:h-24"
          />
        </div>

        {/* ================= RIGHT PRODUCT CARDS ================= */}
        <div className="grid grid-cols-2 gap-3 xl:col-span-5">

          {products?.map((item) => {
            return(
              <ProductMiniCard
                key={item._id}
                {...item}/>
            )
            
})}

        </div>

      </div>
    </section>
  );
}
