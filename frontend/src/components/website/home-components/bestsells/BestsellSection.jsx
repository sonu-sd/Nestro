import React from 'react'
import Card from './Card'
import { bestSellerData } from './BestSellerData'

export default function BestsellSection() {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-[11px] uppercase tracking-[4px] text-[#8b5e3c]">
            Handpicked for you
          </p>
    
          <h2 className="mt-2 text-xl font-medium text-[#1e1e1e]">
           Best Sellers
          </h2>
    
          <div className="grid grid-cols-1 gap-4 mt-5 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {bestSellerData.map((item) => (
              <Card key={item.id} 
              {...item} />
            ))}
          </div>
        </section>
  )
}
