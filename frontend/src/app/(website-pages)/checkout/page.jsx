"use client";

import AddressSection from "@/components/website/checkout-components/AddressSection";
import PaymentSection from "@/components/website/checkout-components/PaymentSection";
import OrderSummary from "@/components/website/checkout-components/OrderSummary";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { client } from "@/utils/helper";

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [authState, setAuthState] = useState("checking");

  useEffect(() => {
    let active = true;
    client
      .get("/user/get-me")
      .then(() => {
        if (active) setAuthState("authenticated");
      })
      .catch((error) => {
        if (!active) return;
        if (error.response?.status === 401)
          router.replace("/sign_in?next=/checkout");
        else setAuthState("error");
      });
    return () => {
      active = false;
    };
  }, [router]);

  if (authState === "checking") {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-10 w-52 rounded bg-gray-200" />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="h-96 rounded-xl bg-white lg:col-span-2" />
            <div className="h-96 rounded-xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (authState === "error") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
        <div className="rounded-xl border bg-white p-8 text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Checkout is temporarily unavailable
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            We could not verify your account. Please try again.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-lg bg-[#8b5e3c] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Checkout</h2>

            <p className="mt-1 text-sm text-gray-500">
              Choose your delivery address and payment method.
            </p>
          </div>
          <span className="text-sm text-gray-500">🔒 Secure Checkout</span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-6 lg:col-span-2">
            <AddressSection onAddressSelect={setSelectedAddressId} />

            <PaymentSection
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
            />
          </div>

          {/* Right */}
          <div>
            <OrderSummary
              selectedAddressId={selectedAddressId}
              paymentMethod={paymentMethod}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
