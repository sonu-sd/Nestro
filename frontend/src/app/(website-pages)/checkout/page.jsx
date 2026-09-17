"use client";

import AddressSection from "@/components/website/checkout-components/AddressSection"
import PaymentSection from "@/components/website/checkout-components/PaymentSection"
import OrderSummary from "@/components/website/checkout-components/OrderSummary"
import { useState } from "react";

export default function CheckoutPage() {

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Checkout
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Choose your delivery address and payment method.
            </p>
          </div>
          <span className="text-sm text-gray-500">
            🔒 Secure Checkout
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-6 lg:col-span-2">
            <AddressSection onAddressSelect={setSelectedAddressId} />

            <PaymentSection paymentMethod={paymentMethod} onPaymentMethodChange={setPaymentMethod} />
          </div>

          {/* Right */}
          <div>
            <OrderSummary selectedAddressId={selectedAddressId} paymentMethod={paymentMethod} />
          </div>
        </div>
      </main>
    </div>
  );
}
