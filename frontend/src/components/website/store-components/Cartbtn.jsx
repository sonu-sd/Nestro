'use client'

import { addToCart, increaseQty, decreaseQty } from '@/redux/features/Cartslice'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiMinus, FiPlus } from 'react-icons/fi'

export default function Cartbtn({ product }) {

  const dispatcher = useDispatch()

  // reduc cart se items lena 
  const items = useSelector((state) => state.cart.items)

  // check krna product already cart me h ya nhi
  const cartItem = items.find((item) => item._id === product._id)

async function carthundle() {

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
      qty: 1
    })
  );

}

  if (!cartItem) {
    return (
      <div>
        <button
          disabled={!product.stock}
          onClick={carthundle}
          className={`h-11 p-1 rounded-md text-[12px] font-medium transition ${product.stock
            ? "bg-[#8B5E3C] text-white hover:bg-[#70482e]"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          {product.stock ? "ADD TO CART" : "OUT OF STOCK"}
        </button>
      </div>
    )
  }

  // agar product already cart me h 
  return (

    <div className="inline-flex h-11 items-center rounded-md border border-[#ddd2c7] bg-white">
      <button
        onClick={() => {
          dispatcher(decreaseQty(product._id))
        }}
        className="h-11 w-10 flex items-center justify-center text-[#666] transition hover:bg-[#f6f1ec] hover:text-[#8b5e3c]"
      >
        <FiMinus size={14} />
      </button>


      <span className="w-10 text-center text-sm font-medium text-[#222]">
        {cartItem.qty || 1}
      </span>


      <button
        onClick={() => {
          dispatcher(increaseQty(product._id))
        }}
        className="h-11 w-10 flex items-center justify-center text-[#666] transition hover:bg-[#f6f1ec] hover:text-[#8b5e3c]"
      >
        <FiPlus size={14} />
      </button>

    </div>

  )
}