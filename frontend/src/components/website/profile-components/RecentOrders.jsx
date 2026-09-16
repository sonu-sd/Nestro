"use client";

import { useEffect, useState } from "react";
import { client } from "@/utils/helper";

export default function RecentOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await client.get("/order/my?limit=3");
        setOrders(response.data.data || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load orders.");
      }
    };
    void loadOrders();
  }, []);

  return <section className="overflow-hidden rounded-2xl border border-[#e8e1d9] bg-white">
    <div className="border-b border-[#e8e1d9] px-6 py-5"><h2 className="text-[15px] font-medium text-[#171717]">Recent Orders</h2></div>
    <div className="px-5 md:px-6">{error ? <p className="py-6 text-sm text-red-600">{error}</p> : orders.length === 0 ? <p className="py-6 text-sm text-gray-500">No orders yet.</p> : orders.map((order) => <div key={order._id} className="flex items-center justify-between border-b border-[#e8e1d9] py-5 last:border-0"><div><p className="font-medium text-[#171717]">{order.orderNumber}</p><p className="mt-1 text-sm text-gray-500">{order.items.length} item{order.items.length !== 1 ? "s" : ""} · {new Date(order.placedAt).toLocaleDateString("en-IN")}</p></div><div className="text-right"><p className="font-semibold text-[#171717]">₹{order.totalAmount}</p><p className="mt-1 text-xs font-medium text-green-700">{order.orderStatus}</p></div></div>)}</div>
  </section>;
}
