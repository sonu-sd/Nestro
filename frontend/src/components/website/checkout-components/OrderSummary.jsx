"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { client } from "@/utils/helper";

const SHIPPING = 49;

const loadRazorpayCheckout = () => new Promise((resolve) => {
  if (window.Razorpay) return resolve(true);
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

export default function OrderSummary({ selectedAddressId, paymentMethod }) {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await client.get("/cart");
        setItems(response.data.data?.items || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load your cart.");
      } finally { setLoading(false); }
    };
    void loadCart();
  }, []);

  const products = items.map((item) => ({ ...item.productId, qty: item.qty })).filter((item) => item._id);
  const subtotal = products.reduce((total, item) => total + item.salePrice * item.qty, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + SHIPPING + tax;

  const completeOrder = (orderId) => {
    router.push(`/profile?order=${orderId}`);
    router.refresh();
  };

  const placeOrder = async () => {
    if (!selectedAddressId) return setError("Please select a delivery address.");
    if (!products.length) return setError("Your cart is empty.");
    try {
      setError("");
      setPlacing(true);
      if (paymentMethod === "COD") {
        const response = await client.post("/order", { addressId: selectedAddressId, paymentMethod: "COD" });
        completeOrder(response.data.data._id);
        return;
      }

      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) throw new Error("Online payments are not configured yet.");
      const response = await client.post("/order/online", { addressId: selectedAddressId });
      if (!(await loadRazorpayCheckout())) throw new Error("Unable to load secure payment checkout.");
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
            const verified = await client.post("/order/online/verify", { orderId: payment.orderId, razorpayOrderId: result.razorpay_order_id, razorpayPaymentId: result.razorpay_payment_id, razorpaySignature: result.razorpay_signature });
            completeOrder(verified.data.data._id);
          } catch (verificationError) {
            setError(verificationError.response?.data?.message || "Payment received but verification failed. Please contact support.");
          } finally { setPlacing(false); }
        },
        modal: { ondismiss: () => setPlacing(false) },
        theme: { color: "#15803d" },
      });
      checkout.open();
      return;
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to place your order.");
      setPlacing(false);
    } finally {
      if (paymentMethod === "COD") setPlacing(false);
    }
  };

  return <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
    {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
    <div className="mt-6 space-y-5">{loading ? <p className="text-sm text-gray-500">Loading cart...</p> : products.length === 0 ? <p className="text-sm text-gray-500">Your cart is empty.</p> : products.map((item) => <div key={item._id} className="flex gap-3"><img src={item.thumbnail} alt={item.title} className="h-16 w-16 rounded-lg object-cover" /><div className="flex-1"><h3 className="text-sm font-medium text-gray-900">{item.title}</h3><p className="mt-1 text-xs text-gray-500">Qty: {item.qty}</p></div><span className="text-sm font-semibold">₹{item.salePrice * item.qty}</span></div>)}</div>
    <div className="my-6 border-t" />
    <div className="space-y-3 text-sm text-gray-600"><div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div><div className="flex justify-between"><span>Shipping</span><span>₹{products.length ? SHIPPING : 0}</span></div><div className="flex justify-between"><span>Tax</span><span>₹{tax}</span></div></div>
    <div className="my-5 border-t" /><div className="flex justify-between"><span className="text-lg font-bold">Total</span><span className="text-2xl font-bold text-green-700">₹{products.length ? total : 0}</span></div>
    <button onClick={placeOrder} disabled={placing || loading || !products.length} className="mt-6 w-full rounded-lg bg-green-700 px-5 py-3.5 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60">{placing ? "Processing..." : `${paymentMethod === "COD" ? "Place COD Order" : "Pay Online"} · ₹${products.length ? total : 0}`}</button>
    <p className="mt-4 text-center text-xs text-gray-500">Final amount is verified securely by the server.</p>
  </div>;
}
