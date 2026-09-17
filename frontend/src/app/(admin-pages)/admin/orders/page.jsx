"use client";

import { useEffect, useState } from "react";
import { client } from "@/utils/helper";
import AdminSkeleton from "@/components/admin/AdminSkeleton";

const NEXT_STATUS = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["OUT_FOR_DELIVERY"],
  OUT_FOR_DELIVERY: ["DELIVERED"],
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try { const response = await client.get("/order/admin"); setOrders(response.data.data || []); }
    catch (requestError) { setError(requestError.response?.data?.message || "Unable to load orders."); }
    finally { setLoading(false); }
  };
  useEffect(() => {
    const timer = window.setTimeout(() => { void loadOrders(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const updateOrder = async (order, status) => {
    const payload = { orderStatus: status };
    if (status === "SHIPPED") {
      payload.courierName = window.prompt("Courier name:") || "";
      payload.trackingNumber = window.prompt("Tracking number:") || "";
      if (!payload.courierName || !payload.trackingNumber) return;
    }
    if (status === "CANCELLED") payload.cancellationReason = window.prompt("Cancellation reason:") || "Cancelled by admin";
    try { await client.patch(`/order/admin/${order._id}`, payload); await loadOrders(); }
    catch (requestError) { setError(requestError.response?.data?.message || "Unable to update order."); }
  };

  if (loading) return <AdminSkeleton variant="table"/>;
  return <main className="min-h-screen bg-gray-50 p-4 sm:p-6"><div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Orders</h1><p className="mt-1 text-sm text-gray-500">Manage fulfilment and delivery status.</p></div>{error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="overflow-x-auto rounded-xl border border-gray-200 bg-white"><table className="min-w-[900px] w-full text-left text-sm"><thead className="bg-gray-50 text-gray-600"><tr><th className="p-4">Order</th><th className="p-4">Customer</th><th className="p-4">Amount</th><th className="p-4">Payment</th><th className="p-4">Status</th><th className="p-4">Action</th></tr></thead><tbody>{orders.length === 0 ? <tr><td colSpan="6" className="p-6 text-center text-gray-500">No orders yet.</td></tr> : orders.map((order) => <tr key={order._id} className="border-t border-gray-100"><td className="p-4 font-medium">{order.orderNumber}<span className="block text-xs text-gray-500">{order.items.length} item(s)</span></td><td className="p-4">{order.user?.name || "Customer"}<span className="block text-xs text-gray-500">{order.user?.email}</span></td><td className="p-4">₹{order.totalAmount}</td><td className="p-4">{order.paymentMethod}<span className="block text-xs text-gray-500">{order.paymentStatus}</span></td><td className="p-4"><span className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700">{order.orderStatus}</span>{order.trackingNumber && <span className="block mt-1 text-xs text-gray-500">{order.courierName}: {order.trackingNumber}</span>}</td><td className="p-4">{NEXT_STATUS[order.orderStatus]?.length ? <select defaultValue="" onChange={(event) => { if (event.target.value) void updateOrder(order, event.target.value); }} className="rounded border border-gray-300 px-2 py-1"><option value="">Update status</option>{NEXT_STATUS[order.orderStatus].map((status) => <option key={status} value={status}>{status}</option>)}</select> : <span className="text-xs text-gray-500">No actions</span>}</td></tr>)}</tbody></table></div></main>;
}
