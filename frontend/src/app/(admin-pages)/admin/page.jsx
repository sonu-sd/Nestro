"use client";
import AppImage from "@/components/ui/AppImage";

import { useEffect, useState } from "react";
import Link from "next/link";
import { client } from "@/utils/helper";
import AdminSkeleton from "@/components/admin/AdminSkeleton";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({ all: 0, active: 0, outOfStock: 0 });
  const [orderSummary, setOrderSummary] = useState({
    all: 0,
    pending: 0,
    revenue: 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([client.get("/product/admin"), client.get("/order/admin")])
      .then(([productResponse, orderResponse]) => {
        setProducts(productResponse.data.data || []);
        setSummary(
          productResponse.data.summary || { all: 0, active: 0, outOfStock: 0 },
        );
        setOrders(orderResponse.data.data || []);
        setOrderSummary(
          orderResponse.data.summary || { all: 0, pending: 0, revenue: 0 },
        );
      })
      .catch((requestError) =>
        setError(
          requestError.response?.data?.message || "Unable to load dashboard.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminSkeleton variant="dashboard" />;

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
              Store overview
            </p>
            <h1 className="mt-1 text-3xl font-bold">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">
              Live catalog and order activity.
            </p>
          </div>
          <Link
            href="/admin/products/add"
            className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white"
          >
            + Add product
          </Link>
        </div>
        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat
            label="Recognized revenue"
            value={loading ? "…" : money(orderSummary.revenue)}
            note="Paid online or delivered COD"
          />
          <Stat
            label="Orders"
            value={loading ? "…" : orderSummary.all}
            note={`${orderSummary.pending} awaiting fulfilment`}
          />
          <Stat
            label="Products"
            value={loading ? "…" : summary.all}
            note={`${summary.active} active`}
          />
          <Stat
            label="Out of stock"
            value={loading ? "…" : summary.outOfStock}
            note="Check inventory"
          />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-lg font-bold">Recent orders</h2>
                <p className="text-sm text-slate-500">
                  Latest customer activity
                </p>
              </div>
              <Link
                href="/admin/orders"
                className="text-sm font-semibold text-teal-700"
              >
                View all →
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {orders.slice(0, 6).map((order) => (
                <div
                  key={order._id}
                  className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm"
                >
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-slate-500">
                      {order.user?.name || "Customer"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{money(order.totalAmount)}</p>
                    <p className="text-xs text-slate-500">
                      {order.orderStatus}
                    </p>
                  </div>
                </div>
              ))}
              {!loading && !orders.length && (
                <p className="p-6 text-sm text-slate-500">No orders yet.</p>
              )}
            </div>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Quick actions</h2>
            <div className="mt-4 grid gap-3">
              <Link
                className="rounded-lg border p-3 text-sm font-medium hover:bg-slate-50"
                href="/admin/products"
              >
                Manage products →
              </Link>
              <Link
                className="rounded-lg border p-3 text-sm font-medium hover:bg-slate-50"
                href="/admin/colors"
              >
                Manage colors →
              </Link>
              <Link
                className="rounded-lg border p-3 text-sm font-medium hover:bg-slate-50"
                href="/admin/orders"
              >
                Manage orders →
              </Link>
              <Link
                className="rounded-lg border p-3 text-sm font-medium hover:bg-slate-50"
                href="/admin/category"
              >
                Manage categories →
              </Link>
            </div>
          </section>
        </div>
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b p-5">
            <h2 className="text-lg font-bold">Recently added products</h2>
            <Link
              href="/admin/products"
              className="text-sm font-semibold text-teal-700"
            >
              View catalog →
            </Link>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((item) => (
              <Link
                key={item._id}
                href={`/admin/products/${item._id}`}
                className="flex items-center gap-3 rounded-xl border p-3 hover:border-teal-300"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {item.thumbnail && (
                    <AppImage
                      src={item.thumbnail}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-slate-500">
                    {money(item.salePrice)}
                  </p>
                </div>
              </Link>
            ))}
            {!loading && !products.length && (
              <p className="text-sm text-slate-500">No products yet.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value, note }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{note}</p>
    </div>
  );
}
