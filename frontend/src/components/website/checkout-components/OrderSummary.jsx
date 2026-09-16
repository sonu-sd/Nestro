"use client";

import { useEffect, useState } from "react";
import { client } from "@/utils/helper";

export default function OrderSummary() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCart = async () => {
    try {
      const response = await client.get("/cart");

      console.log("CART RESPONSE:", response.data);

      const cartItems = response.data.cart?.items || [];
      setItems(cartItems);

    } catch (error) {
      console.log( "GET CART ERROR:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const subtotal = items.reduce( (total, item) => total + (item.salePrice || item.price || 0) * item.qty,0);

  const shipping = 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  return (
    <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">
        Order Summary
      </h2>

      {/* Items */}
      <div className="mt-6 space-y-5">
        {loading ? (
          <p className="text-sm text-gray-500">
            Loading cart...
          </p>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-500">
            Your cart is empty.
          </p>
        ) : (
          items.map((item) => {
            const itemPrice =
              item.salePrice || item.price || 0;

            return (
              <div
                key={item._id || item.productId}
                className="flex gap-3"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />

                  <span className="absolute right-0 top-0 rounded-bl-md bg-green-700 px-1.5 py-0.5 text-xs text-white">
                    {item.qty}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Qty: {item.qty}
                  </p>
                </div>

                <span className="text-sm font-semibold text-gray-900">
                  ₹{itemPrice * item.qty}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Coupon */}
      <div className="mt-6 flex gap-2">
        <input
          placeholder="Coupon code"
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
        />

        <button className="rounded-lg border border-green-700 px-4 text-sm font-semibold text-green-700 hover:bg-green-50">
          Apply
        </button>
      </div>

      <div className="my-6 border-t" />

      {/* Price Details */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>₹{shipping}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Tax</span>
          <span>₹{tax}</span>
        </div>
      </div>

      <div className="my-5 border-t" />

      {/* Total */}
      <div className="flex justify-between">
        <span className="text-lg font-bold">Total</span>

        <span className="text-2xl font-bold text-green-700">
          ₹{total}
        </span>
      </div>

      <button
        onClick={() => alert("Order placed successfully!")}
        className="mt-6 w-full rounded-lg bg-green-700 px-5 py-3.5 text-sm font-semibold text-white hover:bg-green-800"
      >
        Place Order · ₹{total}
      </button>

      <p className="mt-4 text-center text-xs text-gray-500">
        🔒 Secure and encrypted checkout
      </p>
    </div>
  );
}