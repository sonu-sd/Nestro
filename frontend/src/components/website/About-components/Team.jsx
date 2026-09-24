import React from "react";

export default function Team() {
  const teamData = [
    {
      id: 1,
      initials: "AK",
      name: "Aarav Kumar",
      role: "Founder & CEO",
    },
    {
      id: 2,
      initials: "SM",
      name: "Sanya Mehta",
      role: "Head of Design",
    },
    {
      id: 3,
      initials: "VR",
      name: "Vikram Rao",
      role: "Chief Craftsman",
    },
    {
      id: 4,
      initials: "PJ",
      name: "Preet Joshi",
      role: "Customer Experience",
    },
  ];

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <p className="text-[11px] uppercase tracking-[2px] text-[#8B5E3C]">
        The people behind Nestro
      </p>

      <h2 className="mt-2 text-2xl font-medium text-[#1e1e1e]">Our Team</h2>

      <div className="mt-5 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {teamData.map((item) => (
          <div
            key={item.id}
            className="group overflow-hidden rounded-2xl border border-[#E6D8C9] bg-white transition-all duration-300 hover:-translate-y-2 hover:border-[#8B5E3C] hover:shadow-xl"
          >
            <div className="flex h-[150px] items-center justify-center bg-[#F7F2EB]">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#C6A27E] bg-white text-4xl font-semibold text-[#8B5E3C] transition-all duration-300 group-hover:scale-103">
                {item.initials}
              </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-[#ECE2D7] px-6 py-2">
              <h3 className="text-[13px] font-semibold text-[#1E1E1E]">
                {item.name}
              </h3>

              <p className="mt-1 text-[11px] text-[#777]">{item.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
