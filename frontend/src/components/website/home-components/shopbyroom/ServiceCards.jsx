import React from "react";
import { FiTruck } from "react-icons/fi";
import { BiRefresh } from "react-icons/bi";
import { LuWrench } from "react-icons/lu";
import { HiOutlineShieldCheck } from "react-icons/hi2";

export default function ServiceCards() {
  const servicesData = [
    {
      id: 1,
      icon: <FiTruck />,
      title: "Free Delivery",
      description: "On all orders above ₹50,000",
    },
    {
      id: 2,
      icon: <BiRefresh />,
      title: "30-Day Returns",
      description: "Hassle-free return policy",
    },
    {
      id: 3,
      icon: <LuWrench />,
      title: "Expert Assembly",
      description: "Professional setup at home",
    },
    {
      id: 4,
      icon: <HiOutlineShieldCheck />,
      title: "5-Year Warranty",
      description: "On all furniture items",
    },
  ];

  return (
    <div className="mx-0 mt-8 grid grid-cols-1 overflow-hidden rounded-2xl bg-white sm:grid-cols-2 lg:mx-9 lg:mt-10 lg:grid-cols-4">
      {servicesData.map((item) => (
        <div key={item.id} className="border border-[#eee5dd] p-5 text-center">
          <div className="text-2xl text-[#8B5E3C] flex justify-center">
            {item.icon}
          </div>

          <h3 className="mt-2 font-semibold  text-[#1e1e1e] text-[13px]">
            {item.title}
          </h3>

          <p className="mt-1 text-[11px] text-[#6b7280]">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
