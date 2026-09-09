import React from 'react'
import { ProductsData } from './ProductsData'
import ProductMiniCard from './Productminicard'

export default function Landedsection() {
  return (
    // heading 
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className='flex items-end justify-between gap-4'>
        <div>
          <p className="text-[11px] uppercase tracking-[4px] text-[#8b5e3c]">
            New arrivals
          </p>
          <h2 className="mt-2 text-xl font-medium text-[#1e1e1e]">
            Just Landed
          </h2>
        </div>
        <button className="text-[#8B5E3C] text-sm hover:underline">
          View all
        </button>
      </div>

      <div className='mt-4 grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-19' >
        {/* left box  */}
        <div className='grid rounded-2xl bg-[#2c2016] p-5 md:col-span-2 xl:col-span-9'>

          <p className="uppercase  text-[10px] text-[#c6a27e]">
            Featured
          </p>

          <h2 className="mt-3 text-xl font-medium leading-tight text-[#faf7fa]">
            Scandinavian <br /> Dining Set
          </h2>

          <p className="mt-3 text-white/70 text-[12px] text-[#ffffff73]">
            Ash wood + linen chairs. Set of 4.
          </p>

          <h3 className="mt-3 text-l font-semibold text-[#d6bFA7]">
            ₹1,24,000
          </h3>

          <div>
            <button className="mt-3 min-h-11 rounded-md bg-[#9D6C41] px-4 py-2 text-[12px]">
              View in Store
            </button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1519643381401-22c77e60520e?auto=format&fit=crop&w=700&q=80"
            alt="Scandinavian dining set"
            className="mb-2 mt-4 h-40 w-full rounded-2xl object-cover sm:h-52 xl:h-24"
          />
        </div>
        {/* midle cards*/}
        <div className='grid gap-3 xl:col-span-5'>
          {
            ProductsData.map((item) => (
              <ProductMiniCard key={item.id}
                {...item} />

            ))}
        </div>
        {/* right cards */}

        <div className='grid gap-3 sm:grid-cols-2 md:grid-cols-1 xl:col-span-5 xl:grid-rows-5'>
          <div className="rounded-2xl border bg-[#F5ede4] p-6 border border-[#e7ddd1] row-span-2">
            <p className="uppercase tracking-[3px] text-[10px] text-[#8b5e3c]">
              Offer
            </p>

            <h3 className="mt-1 text-[15px] font-semibold text-[#1e1e1e]">
              First order 15% off
            </h3>

            <p className="mt-1 text-[#6b7280] text-[10px]">
              Use code Nestro15 at checkout
            </p>

            <button className="mt-2 rounded-md bg-[#8b5e3c] px-3 py-1 text-white text-[12px]">
              Shop Now
            </button>
          </div>

          {/* Delivery */}
          <div className="flex-1 rounded-2xl border bg-[#FFFFFF] p-6 row-span-3">
            <p className="uppercase tracking-[2px] text-[10px] text-[#6b7280]">
              Free Delivery
            </p>

            <h3 className="mt-1 text-[15px] font-semibold text-[#1e1e1e]">
              On orders above ₹50,000
            </h3>

            <p className="mt-2 text-[#6b7280] text-[11px]">
              White glove service. Assembly included.
            </p>

            <div className="mt-1 text-3xl">
              🚚
            </div>
          </div>
        </div>
      </div>



    </section >
  )
}
