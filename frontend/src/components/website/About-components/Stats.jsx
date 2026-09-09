import React from 'react'

export default function Stats() {

 const statsData = [
  {
    id: 1,
    value: "12K+",
    label: "Homes transformed",
  },
  {
    id: 2,
    value: "280+",
    label: "Curated products",
  },
  {
    id: 3,
    value: "8",
    label: "Showrooms across India",
  },
  {
    id: 4,
    value: "4.9★",
    label: "Average rating",
  },
];

  return (
    <div className="mx-4 my-8 grid grid-cols-2 rounded-2xl bg-white sm:mx-6 sm:my-12 lg:grid-cols-4">
      {statsData.map((item) => (
        <div
          key={item.id}
          className="border border-[#f0e8df] p-4 text-center"
        >

          <h3 className="mt-2 text-2xl font-semibold text-[#8b5e3c] sm:text-[28px]">
            {item.value}
          </h3>

          <p className="mt-1 text-[11px] text-[#6b7280]">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  )
}
