
"use client";

import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Download,
  Plus,
  CreditCard,
  Truck,
  Star,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "$48,295",
    icon: DollarSign,
    color: "bg-green-100 text-green-600",
    growth: "+12.5%",
    growthColor: "text-green-500",
  },
  {
    title: "Total Orders",
    value: "1,284",
    icon: ShoppingBag,
    color: "bg-blue-100 text-blue-600",
    growth: "+8.2%",
    growthColor: "text-green-500",
  },
  {
    title: "Total Customers",
    value: "5,643",
    icon: Users,
    color: "bg-purple-100 text-purple-600",
    growth: "+23.1%",
    growthColor: "text-green-500",
  },
  {
    title: "Products",
    value: "847",
    icon: Package,
    color: "bg-orange-100 text-orange-600",
    growth: "-2.4%",
    growthColor: "text-red-500",
  },
];

const products = [
  {
    name: "Wireless Headphones",
    sales: 342,
    amount: "$10,260",
    emoji: "🎧",
  },
  {
    name: "Smart Watch Pro",
    sales: 289,
    amount: "$11,560",
    emoji: "⌚",
  },
  {
    name: "Laptop Backpack",
    sales: 245,
    amount: "$7,350",
    emoji: "🎒",
  },
  {
    name: "USB-C Hub",
    sales: 198,
    amount: "$3,960",
    emoji: "🔌",
  },
];

const orders = [
  {
    id: "#ORD-001",
    customer: "Sarah Johnson",
    items: 3,
    amount: "$245.00",
    status: "Delivered",
    color: "bg-green-100 text-green-700",
    time: "2 hours ago",
  },
  {
    id: "#ORD-002",
    customer: "Michael Chen",
    items: 2,
    amount: "$189.50",
    status: "Processing",
    color: "bg-blue-100 text-blue-700",
    time: "4 hours ago",
  },
  {
    id: "#ORD-003",
    customer: "Emily Davis",
    items: 5,
    amount: "$432.00",
    status: "Shipped",
    color: "bg-purple-100 text-purple-700",
    time: "6 hours ago",
  },
  {
    id: "#ORD-004",
    customer: "James Wilson",
    items: 1,
    amount: "$167.80",
    status: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    time: "8 hours ago",
  },
  {
    id: "#ORD-005",
    customer: "Maria Garcia",
    items: 4,
    amount: "$523.00",
    status: "Delivered",
    color: "bg-green-100 text-green-700",
    time: "12 hours ago",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">Dashboard</h1>
          <p className="text-gray-500 mt-2">
            Welcome back! Here&apos;s what&apos;s happening with your store.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <div className="grid grid-cols-3 overflow-hidden rounded-lg border bg-white">
            <button className="bg-teal-600 px-5 py-2 text-white">
              Today
            </button>
            <button className="px-5 py-2">Week</button>
            <button className="px-5 py-2">Month</button>
          </div>

          <button className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 text-white">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-5 mt-8 lg:grid-cols-4 md:grid-cols-2">
        {stats.map((item, index) => (
          <div
            key={index}
            className="rounded-xl bg-white p-6 shadow-sm border"
          >
            <div className="flex justify-between">
              <div
                className={`h-12 w-12 rounded-lg flex items-center justify-center ${item.color}`}
              >
                <item.icon size={22} />
              </div>

              <span className={`font-semibold ${item.growthColor}`}>
                {item.growth}
              </span>
            </div>

            <h2 className="text-4xl font-bold mt-6">{item.value}</h2>
            <p className="text-gray-500">{item.title}</p>
          </div>
        ))}
      </div>

      {/* Main */}
      <div className="grid lg:grid-cols-3 gap-6 mt-8">

        {/* Left */}
        <div className="lg:col-span-2 space-y-6">

          {/* Chart */}
          <div className="rounded-xl bg-white p-6 shadow-sm border">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold sm:text-2xl">
                Sales Overview
              </h2>

              <button className="text-teal-600">
                View All →
              </button>
            </div>

            <div className="h-72 mt-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
              Chart Here
            </div>

            <div className="mt-6 grid grid-cols-6 gap-y-2 text-center text-xs text-gray-500 sm:grid-cols-12 sm:text-base">
              {[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>

          {/* Orders */}
          <div className="overflow-hidden rounded-xl bg-white p-4 shadow-sm border sm:p-6">

            <div className="flex items-center justify-between gap-3 mb-6">
              <h2 className="text-xl font-bold sm:text-2xl">
                Recent Orders
              </h2>

              <button className="text-teal-600">
                View All
              </button>
            </div>

            <div className="space-y-5">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-semibold">{order.id}</h3>

                    <p className="text-gray-500">
                      {order.customer} • {order.items} items
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:justify-end sm:gap-5">
                    <span className="font-semibold">
                      {order.amount}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-sm ${order.color}`}
                    >
                      {order.status}
                    </span>

                    <span className="text-gray-400">
                      {order.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Right */}
        <div className="space-y-6">

          {/* Products */}
          <div className="rounded-xl bg-white p-6 shadow-sm border">

            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Top Products
              </h2>

              <button className="text-teal-600">
                View All
              </button>
            </div>

            <div className="space-y-5">
              {products.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex gap-4 items-center">
                    <div className="text-3xl">
                      {item.emoji}
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        {item.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                         {item.sales} sales {item.amount}
                        {item.amount}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star fill="currentColor" size={16} />
                    4.8
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl bg-teal-600 text-white p-6">

            <h2 className="text-2xl font-bold">
              Quick Actions
            </h2>

            <p className="opacity-80 mb-6">
              Manage your store efficiently
            </p>

            <div className="space-y-4">
              <button className="w-full bg-white/20 rounded-lg p-4 flex gap-3">
                <Plus />
                Add New Product
              </button>

              <button className="w-full bg-white/20 rounded-lg p-4 flex gap-3">
                <Truck />
                Process Orders
              </button>

              <button className="w-full bg-white/20 rounded-lg p-4 flex gap-3">
                <CreditCard />
                Manage Payments
              </button>
            </div>

          </div>

          {/* Store Performance */}
          <div className="rounded-xl bg-white p-6 shadow-sm border">

            <h2 className="text-2xl font-bold mb-6">
              Store Performance
            </h2>

            <div className="flex justify-between mb-2">
              <span>Conversion Rate</span>
              <span>3.8%</span>
            </div>

            <div className="h-2 bg-gray-200 rounded-full">
              <div className="w-1/3 h-full rounded-full bg-teal-500"></div>
            </div>

            <div className="flex justify-between mt-6">
              <span>Customer Satisfaction</span>
              <span>4.7/5</span>
            </div>

            <div className="flex mt-3 text-yellow-400">
              ⭐⭐⭐⭐☆
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
