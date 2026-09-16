import React from "react";

export default function ReviewCards() {
  const ReviewData = [
    {
      id: 1,
      rating: 5,
      review:
        "The Ember Velvet sofa is absolutely stunning. Delivery was flawless and the quality is beyond what I expected.",
      initials: "PR",
      name: "Priya Rao",
      city: "Mumbai",
    },
    {
      id: 2,
      rating: 5,
      review:
        "Nestro transformed our living room. Every piece feels like it belongs — timeless and beautifully crafted.",
      initials: "AS",
      name: "Arjun Sharma",
      city: "Bangalore",
    },
    {
      id: 3,
      rating: 5,
      review:
        "Premium quality at a fair price. The travertine side table is a conversation starter every time.",
      initials: "NK",
      name: "Neha Kapoor",
      city: "Delhi",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-3 md:gap-6">
      {ReviewData.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-[#E5D5C3] bg-white p-6">

          <div className="text-[#C58A42] text-lg">
            {"★".repeat(item.rating)}
          </div>
          
          <p className="mt-2 text-[11px] text-[#444444] italic">
            &ldquo;{item.review}&rdquo;
          </p>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8B5E3C] text-[12px] font-semibold text-white">
              {item.initials}
            </div>

            <div>
              <h3 className="text-[13px] font-semibold text-[#1E1E1E]">
                {item.name}
              </h3>
              <p className="text-[11px] text-gray-500">
                {item.city}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
