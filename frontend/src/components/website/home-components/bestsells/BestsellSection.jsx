import React from 'react'
import HomeProductCard from '../HomeProductCard'
import Link from "next/link"


export default async function BestsellSection({ products }) {

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-[11px] uppercase tracking-[4px] text-[#8b5e3c]">
        Handpicked for you
      </p>

      <h2 className="mt-2 text-xl font-medium text-[#1e1e1e]">
        Best Sellers
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {products?.length ? products.map((item) => <HomeProductCard key={item._id} product={item} />) : <p className="col-span-full rounded-2xl border border-[#E5D5C3] bg-white p-6 text-sm text-[#665548]">Best sellers will appear here soon.</p>}
      </div>
      <Link href="/store?sort=bestselling" className="mt-4 inline-block text-sm font-semibold text-[#8B5E3C] hover:underline">Explore all products →</Link>
    </section>
  )
}
