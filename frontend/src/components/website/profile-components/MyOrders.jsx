"use client";

import { FiPackage, FiEye, FiTruck } from "react-icons/fi";

const orders = [
  {
    id: "#ORD-10245",
    date: "12 Aug 2026",
    status: "Delivered",
    items: "Modern Wooden Chair",
    quantity: 2,
    price: "₹8,999",
  },
  {
    id: "#ORD-10231",
    date: "04 Aug 2026",
    status: "Shipped",
    items: "Minimal Coffee Table",
    quantity: 1,
    price: "₹6,499",
  },
  {
    id: "#ORD-10198",
    date: "25 Jul 2026",
    status: "Processing",
    items: "Luxury Sofa",
    quantity: 1,
    price: "₹24,999",
  },
];

export default function MyOrders() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-[#e8e1d9] bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f4eadf] text-[#996b3f]">
            <FiPackage size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#222]">
              My Orders
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View and track your recent orders
            </p>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl border border-[#e8e1d9] bg-white p-5"
          >
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-semibold text-[#222]">
                  {order.id}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Ordered on {order.date}
                </p>
              </div>

              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                  order.status === "Delivered"
                    ? "bg-green-50 text-green-600"
                    : order.status === "Shipped"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-yellow-50 text-yellow-600"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="my-5 border-t border-[#eee8e2]" />

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <p className="text-xs text-gray-400">Product</p>
                <p className="mt-1 text-sm font-medium text-[#333]">
                  {order.items}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Quantity</p>
                <p className="mt-1 text-sm font-medium text-[#333]">
                  {order.quantity}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Total</p>
                <p className="mt-1 text-sm font-semibold text-[#333]">
                  {order.price}
                </p>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-[#ded6ce] px-4 py-2 text-xs font-medium text-[#333] hover:bg-[#faf7f4]"
              >
                <FiEye />
                View Details
              </button>

              {order.status === "Shipped" && (
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg bg-[#222] px-4 py-2 text-xs font-medium text-white hover:bg-[#333]"
                >
                  <FiTruck />
                  Track Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}