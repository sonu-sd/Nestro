"use client";

import React from "react";
import OrderItem from "./OrderItem";

export default function RecentOrders() {

  const orders = [
    {
      id: "#MN-2847",
      name: "Ember Velvet 3-Seater",
      date: "May 3, 2026",
      price: "₹89,000",
      status: "Delivered",
    },
    {
      id: "#MN-2641",
      name: "Travertine Side Table",
      date: "Apr 18, 2026",
      price: "₹28,000",
      status: "In Transit",
    },
    {
      id: "#MN-2519",
      name: "Aura Bouclé Armchair",
      date: "Mar 29, 2026",
      price: "₹54,000",
      status: "Delivered",
    },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-[#e8e1d9] bg-white">

      {/* TITLE */}
      <div className="border-b border-[#e8e1d9] px-6 py-5">

        <h2 className="text-[15px] font-medium text-[#171717]">
          Recent Orders
        </h2>

      </div>

      {/* ORDERS */}
      <div className="px-5 md:px-6">

        {orders.map((order, index) => (
          <OrderItem
            key={order.id}
            order={order}
            last={index === orders.length - 1}
          />
        ))}

      </div>

    </section>
  );
}