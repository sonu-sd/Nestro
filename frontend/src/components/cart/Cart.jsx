"use client";

import { decreaseQty, increaseQty, removeFromCrt } from "@/redux/features/Cartslice";import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiArrowRight,
  FiShoppingBag,
  FiShield,
  FiTruck,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import React from "react";

import Link from "next/link";



export default function Cart() {


  const dispatcher = useDispatch()
  const cart = useSelector((store) => store.cart);
  const items = cart?.items || [];

  // Price calculations
  const subtotal = Number(cart?.final_total || 0);

  const originalTotal = Number(cart?.original_total || 0);

  const savings = Math.max(originalTotal - subtotal, 0);

  // 5% tax
  const tax = Math.round(subtotal * 0.05);

  // Free shipping above ₹5,000
  const shipping = subtotal >= 5000 || subtotal === 0 ? 0 : 199;

  const grandTotal = subtotal + tax + shipping;

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
  };

  return (
    <main className="min-h-screen bg-[#faf9f7] px-4 pb-16 pt-10 sm:px-6 sm:pt-12">

      {/* HEADER */}
      <section className="max-w-7xl mx-auto mb-10">

        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[3px] text-[#9a6a45]">
          <FiShoppingBag size={14} />
          Shopping Bag
        </div>

        <div className="mt-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">

          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1e1e1e]">
              Your Cart
            </h1>

            <p className="text-sm text-[#737373] mt-2">
              {items.length}{" "}
              {items.length === 1 ? "item" : "items"} in your shopping bag
            </p>
          </div>

          {savings > 0 && (
            <div className="inline-flex w-fit items-center rounded-full bg-[#edf7ef] px-4 py-2 text-xs font-medium text-green-700">
              You save ₹{formatPrice(savings)}
            </div>
          )}

        </div>

        {/* Progress / trust bar */}
        <div className="mt-7 border-y border-[#eadfd5] py-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-[#f2e8df] flex items-center justify-center text-[#8b5e3c]">
                <FiTruck size={16} />
              </div>

              <div>
                <p className="text-xs font-medium text-[#292929]">
                  Fast Delivery
                </p>
                <p className="text-[11px] text-[#888]">
                  Safe & secure shipping
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-[#f2e8df] flex items-center justify-center text-[#8b5e3c]">
                <FiShield size={16} />
              </div>

              <div>
                <p className="text-xs font-medium text-[#292929]">
                  Secure Payment
                </p>
                <p className="text-[11px] text-[#888]">
                  100% secure checkout
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-[#f2e8df] flex items-center justify-center text-[#8b5e3c]">
                <FiShoppingBag size={16} />
              </div>

              <div>
                <p className="text-xs font-medium text-[#292929]">
                  Premium Furniture
                </p>
                <p className="text-[11px] text-[#888]">
                  Crafted for your home
                </p>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/*EMPTY CART */}

      {items.length === 0 ? (

        <section className="max-w-7xl mx-auto">

          <div className="min-h-[420px] bg-white border border-[#eadfd5] rounded-3xl flex flex-col items-center justify-center text-center px-6">

            <div className="h-20 w-20 rounded-full bg-[#f4eee8] flex items-center justify-center text-[#8b5e3c]">
              <FiShoppingBag size={30} />
            </div>

            <h2 className="mt-6 text-2xl font-semibold text-[#202020]">
              Your shopping bag is empty
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-[#777]">
              Looks like you haven&apos;t added anything yet.
              Discover our collection and find something beautiful
              for your space.
            </p>
            <Link href="/store">

              <button className="mt-7 inline-flex items-center gap-3 rounded-xl bg-[#8b5e3c] px-7 py-3.5 text-xs font-semibold tracking-[1.5px] text-white transition hover:bg-[#70482e] cursor-pointer">
                EXPLORE COLLECTION
                <FiArrowRight size={15} />
              </button>

            </Link>
          </div>

        </section>

      ) : (

        /* MAIN CART  */

        <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

          {/* PRODUCTS  */}

          <div className="space-y-4">

            {items.map((item) => {
              const qty = item.qty || 1;

              const salePrice = Number(item.salePrice || item.price || 0);
              const originalPrice = Number(item.price || 0) * qty;

              const itemTotal = salePrice * Number(item.qty || 1);

              return (

                <article
                  key={item._id}
                  className="group bg-white border border-[#eadfd5] rounded-2xl p-4 sm:p-5 transition hover:shadow-[0_12px_40px_rgba(75,55,40,0.07)]"
                >

                  <div className="flex flex-col gap-4 min-[460px]:flex-row sm:gap-6">

                    {/* Image */}

                    <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl bg-[#f3eee8] min-[460px]:h-32 min-[460px]:w-32 sm:h-36 sm:w-36">

                      <img
                        src={item.thumbnail}
                        alt={item.title || "Product"}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      {item.salePrice && item.salePrice < item.price && (
                        <span className="absolute left-2 top-2 rounded-md bg-[#8b5e3c] px-2 py-1 text-[9px] font-semibold tracking-wide text-white">
                          SALE
                        </span>
                      )}

                    </div>

                    {/* Product Details */}

                    <div className="flex-1 min-w-0">

                      <div className="flex justify-between gap-3">

                        <div className="min-w-0">

                          <p className="text-[10px] uppercase tracking-[2px] text-[#9a6a45]">
                            {item.category?.name || "Furniture"}
                          </p>

                          <h2 className="mt-1 text-base sm:text-lg font-medium text-[#202020] truncate">
                            {item.title}
                          </h2>

                          <p className="mt-1 text-xs text-[#888]">
                            Premium quality furniture
                          </p>

                        </div>

                        {/* Delete */}

                        <button
                          onClick={() => {
                            dispatcher(removeFromCrt(item._id))
                          }}
                          className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-[#aaa] transition hover:bg-red-50 hover:text-red-500"
                          aria-label="Remove item"
                        >
                          <FiTrash2 size={16} />
                        </button>

                      </div>

                      {/* Bottom */}

                      <div className="mt-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

                        {/* Quantity */}

                        <div>

                          <p className="mb-2 text-[10px] uppercase tracking-[1.5px] text-[#999]">
                            Quantity
                          </p>

                          <div className="inline-flex h-9 items-center rounded-lg border border-[#ddd2c7] bg-[#fff]">

                            <button
                              onClick={() => {
                                dispatcher(decreaseQty(item._id))
                              }}
                              className="h-9 w-9 flex items-center justify-center text-[#666] transition hover:bg-[#f6f1ec] hover:text-[#8b5e3c]"
                            >
                              <FiMinus size={13} />
                            </button>

                            <span className="w-9 text-center text-sm font-medium text-[#222]">
                              {item.qty || 1}
                            </span>

                            <button
                              onClick={() => {
                                dispatcher(increaseQty(item._id))
                              }}
                              className="h-9 w-9 flex items-center justify-center text-[#666] transition hover:bg-[#f6f1ec] hover:text-[#8b5e3c]"
                            >
                              <FiPlus size={13} />
                            </button>

                          </div>

                        </div>

                        {/* Price */}

                        <div className="text-left sm:text-right">

                          <p className="text-[10px] uppercase tracking-[1.5px] text-[#999] mb-1">
                            Price
                          </p>

                          <div className="flex sm:justify-end items-center gap-2">

                            {originalPrice > salePrice && (
                              <span className="text-xs text-[#999] line-through">
                                ₹{formatPrice(originalPrice)}
                              </span>
                            )}

                            <span className="text-lg font-semibold text-[#222]">
                              ₹{formatPrice(itemTotal)}
                            </span>

                          </div>

                          <p className="text-[10px] text-[#999] mt-1">
                            ₹{formatPrice(salePrice)} × {item.qty || 1}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </article>

              );
            })}

          </div>

          {/*  ORDER SUMMARY */}

          <aside className="lg:sticky lg:top-28 h-fit">

            <div className="rounded-2xl border border-[#eadfd5] bg-white p-4 shadow-[0_8px_30px_rgba(75,55,40,0.04)] sm:p-6">

              <div className="flex items-center justify-between">

                <h2 className="text-lg font-semibold text-[#202020]">
                  Order Summary
                </h2>

                <span className="text-xs text-[#999]">
                  {items.length} items
                </span>

              </div>

              <div className="my-5 border-t border-[#eee5dc]" />

              <div className="space-y-4 text-sm">

                {/* Original */}

                {savings > 0 && (
                  <div className="flex justify-between">

                    <span className="text-[#777]">
                      Original price
                    </span>

                    <span className="text-[#777] line-through">
                      ₹{formatPrice(originalTotal)}
                    </span>

                  </div>
                )}

                {/* Subtotal */}

                <div className="flex justify-between">

                  <span className="text-[#777]">
                    Subtotal
                  </span>

                  <span className="font-medium text-[#222]">
                    ₹{formatPrice(subtotal)}
                  </span>

                </div>

                {/* Shipping */}

                <div className="flex justify-between">

                  <span className="text-[#777]">
                    Shipping
                  </span>

                  {shipping === 0 ? (
                    <span className="font-medium text-green-600">
                      Free
                    </span>
                  ) : (
                    <span className="text-[#222]">
                      ₹{formatPrice(shipping)}
                    </span>
                  )}

                </div>

                {/* Tax */}

                <div className="flex justify-between">

                  <span className="text-[#777]">
                    Tax
                  </span>

                  <span className="text-[#222]">
                    ₹{formatPrice(tax)}
                  </span>

                </div>

              </div>

              {/* Savings */}

              {savings > 0 && (
                <div className="mt-5 rounded-xl bg-[#f1f8f2] px-4 py-3">

                  <div className="flex justify-between items-center">

                    <span className="text-xs text-green-700">
                      You save
                    </span>

                    <span className="text-sm font-semibold text-green-700">
                      ₹{formatPrice(savings)}
                    </span>

                  </div>

                </div>
              )}

              <div className="my-5 border-t border-[#eee5dc]" />

              {/* Total */}

              <div className="flex items-end justify-between">

                <div>

                  <p className="text-xs text-[#777]">
                    Total
                  </p>

                  <p className="mt-1 text-[11px] text-[#aaa]">
                    Inclusive of applicable taxes
                  </p>

                </div>

                <span className="text-2xl font-semibold tracking-tight text-[#8b5e3c]">
                  ₹{formatPrice(grandTotal)}
                </span>

              </div>

              {/* Checkout */}

              <Link href={"/checkout"}>
                <button className="group mt-6 w-full h-12 rounded-xl bg-[#8b5e3c] text-white text-xs font-semibold tracking-[1.5px] transition hover:bg-[#70482e]">

                  <span className="inline-flex items-center justify-center gap-3">
                    PROCEED TO CHECKOUT
                    <FiArrowRight
                      size={15}
                      className="transition group-hover:translate-x-1"
                    />
                  </span>

                </button>
              </Link>

              {/* Continue */}
              <Link href={"/store"}>

                <button className="mt-3 w-full h-11 rounded-xl border border-[#8b5e3c] text-[#8b5e3c] text-xs font-medium transition hover:bg-[#f8f2ed]">
                  CONTINUE SHOPPING
                </button>

              </Link>
              {/* Secure checkout */}

              <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-[#999]">
                <FiShield size={13} />
                Secure & encrypted checkout
              </div>

            </div>

            {/* Free shipping message */}

            {subtotal < 5000 && subtotal > 0 && (
              <div className="mt-4 rounded-2xl border border-[#eadfd5] bg-[#f8f3ee] p-4">

                <p className="text-xs font-medium text-[#654832]">
                  You&apos;re ₹{formatPrice(5000 - subtotal)} away from free shipping.
                </p>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e5d8cd]">
                  <div
                    className="h-full rounded-full bg-[#8b5e3c]"
                    style={{
                      width: `${Math.min((subtotal / 5000) * 100, 100)}%`,
                    }}
                  />
                </div>

              </div>
            )}

          </aside>

        </section>

      )}

    </main>
  );
}
