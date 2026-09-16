"use client";

import AddressSection from "@/components/website/checkout-components/AddressSection"
import PaymentSection from "@/components/website/checkout-components/PaymentSection"
import OrderSummary from "@/components/website/checkout-components/OrderSummary"
import { useState, useEffect } from "react";
import { client } from "@/utils/helper";

export default function CheckoutPage() {

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await client.get("/user/get-me");
        console.log(response)

        setUser(response.data.user);
      } catch (error) {
        console.log("User not logged in");
        setUser(null);
      }
    };

    getUser();
  }, []);


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
            <AddressSection />

            <PaymentSection />
          </div>

          {/* Right */}
          <div>
            <OrderSummary />
          </div>
        </div>
      </main>
    </div>
  );
}