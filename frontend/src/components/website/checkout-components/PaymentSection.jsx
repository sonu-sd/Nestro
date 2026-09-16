"use client";

import { useState } from "react";

export default function PaymentSection() {
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const payments = [
    {
      id: "Online",
      title: "UPI",
      description: "Google Pay, PhonePe, Paytm and more",
      icon: "📱",
    },
    {
      id: "cod",
      title: "Cash on Delivery",
      description: "Pay when your order arrives",
      icon: "💵",
    },
  ];

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">
        Payment Method
      </h2>

      <div className="mt-5 space-y-3">
        {payments.map((payment) => {
          const selected = paymentMethod === payment.id;

          return (
            <label
              key={payment.id}
              className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition ${
                selected
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200 hover:border-green-400"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={payment.id}
                checked={selected}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
                className="h-4 w-4 accent-green-700"
              />

              <span className="text-xl">{payment.icon}</span>

              <span>
                <span className="block text-sm font-semibold text-gray-900">
                  {payment.title}
                </span>

                <span className="mt-1 block text-xs text-gray-500">
                  {payment.description}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      {paymentMethod === "card" && (
        <div className="mt-5 rounded-lg bg-gray-50 p-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Card Number
            </label>

            <input
              placeholder="1234 5678 9012 3456"
              className="address-input bg-white"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Expiry
              </label>

              <input
                placeholder="MM / YY"
                className="address-input bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                CVV
              </label>

              <input
                type="password"
                placeholder="•••"
                className="address-input bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}