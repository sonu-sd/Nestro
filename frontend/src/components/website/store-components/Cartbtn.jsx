"use client";

import {
  addToCart,
  increaseQty,
  decreaseQty,
} from "@/redux/features/Cartslice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiMinus, FiPlus } from "react-icons/fi";

export default function Cartbtn({ product }) {
  const dispatcher = useDispatch();

  // reduc cart se items lena
  const { items, hydrated } = useSelector((state) => state.cart);

  // check krna product already cart me h ya nhi
  const cartItem = items.find((item) => item._id === product._id);

  function carthundle() {
    // 1. Redux + localStorage
    dispatcher(
      addToCart({
        _id: product._id,
        title: product.title,
        slug: product.slug,
        price: product.price,
        salePrice: product.salePrice,
        thumbnail: product.thumbnail,
        category: product.category,
        qty: 1,
      }),
    );
  }

  if (!hydrated) {
    return (
      <div>
        <button
          type="button"
          disabled
          className="min-h-9 cursor-not-allowed rounded-md bg-gray-200 px-2 py-1 text-[9px] font-semibold text-gray-400 sm:h-11 sm:px-3 sm:text-[12px]"
        >
          LOADING…
        </button>
      </div>
    );
  }

  if (!cartItem) {
    return (
      <div>
        <button
          disabled={!product.stock}
          onClick={carthundle}
          className={`min-h-9 rounded-md px-2 py-1 text-[9px] font-semibold transition sm:h-11 sm:px-3 sm:text-[12px] ${
            product.stock
              ? "bg-[#8B5E3C] text-white hover:bg-[#70482e]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {product.stock ? "ADD TO CART" : "OUT OF STOCK"}
        </button>
      </div>
    );
  }

  // agar product already cart me h
  return (
    <div className="inline-flex h-9 items-center rounded-md border border-[#ddd2c7] bg-white sm:h-11">
      <button
        onClick={() => {
          dispatcher(decreaseQty(product._id));
        }}
        className="flex h-9 w-7 items-center justify-center text-[#666] transition hover:bg-[#f6f1ec] hover:text-[#8b5e3c] sm:h-11 sm:w-10"
      >
        <FiMinus size={14} />
      </button>

      <span className="w-6 text-center text-xs font-medium text-[#222] sm:w-10 sm:text-sm">
        {cartItem.qty || 1}
      </span>

      <button
        onClick={() => {
          dispatcher(increaseQty(product._id));
        }}
        className="flex h-9 w-7 items-center justify-center text-[#666] transition hover:bg-[#f6f1ec] hover:text-[#8b5e3c] sm:h-11 sm:w-10"
      >
        <FiPlus size={14} />
      </button>
    </div>
  );
}
