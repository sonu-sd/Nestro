"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppImage from "@/components/ui/AppImage";
import { emptyCart } from "@/redux/features/Cartslice";
import { client } from "@/utils/helper";

const money = (value) => Number(value || 0).toLocaleString("en-IN");
const loadRazorpayCheckout = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function OrderSummary({ selectedAddressId, paymentMethod }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { hydrated, syncStatus } = useSelector((state) => state.cart);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hydrated || syncStatus === "syncing") return;
    let active = true;
    client
      .get("/order/checkout-summary")
      .then((response) => {
        if (active) {
          setSummary(response.data.data);
          setError("");
        }
      })
      .catch((requestError) => {
        if (active) {
          setSummary(null);
          setError(
            requestError.response?.data?.message ||
              "Unable to load your secure checkout summary.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [hydrated, syncStatus]);

  const completeOrder = (orderId) => {
    dispatch(emptyCart());
    localStorage.removeItem("cart");
    router.push(`/profile?order=${orderId}`);
    router.refresh();
  };

  const placeOrder = async () => {
    if (!selectedAddressId)
      return setError("Please select a delivery address.");
    if (!summary?.items?.length) return setError("Your cart is empty.");
    try {
      setError("");
      setPlacing(true);
      if (paymentMethod === "COD") {
        const response = await client.post("/order", {
          addressId: selectedAddressId,
          paymentMethod: "COD",
        });
        completeOrder(response.data.data._id);
        return;
      }
      const response = await client.post("/order/online", {
        addressId: selectedAddressId,
      });
      if (!(await loadRazorpayCheckout()))
        throw new Error("Unable to load secure payment checkout.");
      const payment = response.data.data;
      const checkout = new window.Razorpay({
        key: payment.keyId,
        amount: payment.amount,
        currency: payment.currency,
        name: "Nestro",
        description: `Order ${payment.orderId}`,
        order_id: payment.razorpayOrderId,
        handler: async (result) => {
          try {
            const verified = await client.post("/order/online/verify", {
              orderId: payment.orderId,
              razorpayOrderId: result.razorpay_order_id,
              razorpayPaymentId: result.razorpay_payment_id,
              razorpaySignature: result.razorpay_signature,
            });
            completeOrder(verified.data.data._id);
          } catch (verificationError) {
            setError(
              verificationError.response?.data?.message ||
                "Payment received but verification failed. Please contact support.",
            );
          } finally {
            setPlacing(false);
          }
        },
        modal: { ondismiss: () => setPlacing(false) },
        theme: { color: "#8B5E3C" },
      });
      checkout.open();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to place your order.",
      );
      setPlacing(false);
    } finally {
      if (paymentMethod === "COD") setPlacing(false);
    }
  };

  const items = summary?.items || [];
  return (
    <div className="sticky top-24 rounded-xl border border-[#E4D7CA] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[#29211B]">Order Summary</h2>
        {syncStatus === "syncing" && (
          <span className="text-xs text-[#8B5E3C]">Saving cart…</span>
        )}
      </div>
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      <div className="mt-6 space-y-5">
        {loading || !hydrated ? (
          <>
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-lg bg-[#F1E9E1]"
              />
            ))}
          </>
        ) : items.length === 0 ? (
          <div>
            <p className="text-sm text-[#665548]">
              Your database cart is empty.
            </p>
            <Link
              href="/store"
              className="mt-3 inline-block text-sm font-semibold text-[#8B5E3C] underline"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.product_id} className="flex gap-3">
              <AppImage
                src={item.image}
                alt={item.title}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-medium text-[#29211B]">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-[#806F61]">
                  ₹{money(item.price)} × {item.qty}
                </p>
                {item.originalPrice > item.price && (
                  <p className="text-xs text-[#61804D]">
                    Latest sale price applied
                  </p>
                )}
              </div>
              <span className="text-sm font-semibold">
                ₹{money(item.total)}
              </span>
            </div>
          ))
        )}
      </div>
      <div className="my-6 border-t border-[#EEE4DA]" />
      <div className="space-y-3 text-sm text-[#665548]">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{money(summary?.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>₹{money(summary?.shippingCharge)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>₹{money(summary?.tax)}</span>
        </div>
      </div>
      <div className="my-5 border-t border-[#EEE4DA]" />
      <div className="flex justify-between">
        <span className="text-lg font-bold">Total</span>
        <span className="text-2xl font-bold text-[#8B5E3C]">
          ₹{money(summary?.totalAmount)}
        </span>
      </div>
      <button
        onClick={placeOrder}
        disabled={
          placing || loading || syncStatus === "syncing" || !items.length
        }
        className="mt-6 w-full rounded-lg bg-[#8B5E3C] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#70482E] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {placing
          ? "Processing…"
          : `${paymentMethod === "COD" ? "Place COD Order" : "Pay Online"} · ₹${money(summary?.totalAmount)}`}
      </button>
      <p className="mt-4 text-center text-xs text-[#806F61]">
        Prices, availability and final amount are verified by the server.
      </p>
    </div>
  );
}
