"use client";

import { useEffect, useState } from "react";
import { client } from "@/utils/helper";

const cancellable = new Set(["PENDING", "CONFIRMED"]);

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      const response = await client.get("/order/my");
      setOrders(response.data.data || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to load orders.",
      );
    }
  };
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadOrders();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const cancel = async (id) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await client.post(`/order/my/${id}/cancel`, {
        reason: "Cancelled by customer",
      });
      await loadOrders();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to cancel order.",
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#e8e1d9] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#222]">My Orders</h2>
        <p className="mt-1 text-sm text-gray-500">
          Track your purchases and delivery status.
        </p>
      </div>
      {error && (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>
      )}
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-[#e8e1d9] bg-white p-6 text-sm text-gray-500">
          No orders yet.
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="rounded-2xl border border-[#e8e1d9] bg-white p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-[#222]">{order.orderNumber}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(order.placedAt).toLocaleDateString("en-IN")} ·{" "}
                  {order.items.length} item(s)
                </p>
              </div>
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                {order.orderStatus}
              </span>
            </div>
            <div className="my-4 border-t border-[#eee8e2]" />
            <p className="text-sm text-gray-700">
              {order.items.map((item) => item.title).join(", ")}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="font-semibold">₹{order.totalAmount}</p>
              {order.trackingNumber && (
                <p className="text-sm text-gray-600">
                  {order.courierName}: {order.trackingNumber}
                </p>
              )}
              {cancellable.has(order.orderStatus) &&
                order.paymentStatus !== "PAID" && (
                  <button
                    onClick={() => cancel(order._id)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700"
                  >
                    Cancel order
                  </button>
                )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
