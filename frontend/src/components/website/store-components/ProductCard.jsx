import { FiHeart } from "react-icons/fi";
import AppImage from "@/components/ui/AppImage";
import Link from "next/link";
import AtcButton from "./Cartbtn";
import Cartbtn from "./Cartbtn";

export default function ProductCard({ product }) {

  const {
    thumbnail,
    title,
    price,
    salePrice,
    discount,
    bestSeller,
    newArrival,
    category,
    stock,
    colors,
    color,
  } = product;

  const badge = bestSeller
    ? "BESTSELLER"
    : newArrival
      ? "NEW"
      : discount > 0
        ? `-${discount}%`
        : "";

  const finalPrice =
    salePrice && salePrice < price
      ? salePrice
      : price;

  return (
    <div className="rounded-2xl overflow-hidden border border-[#e7d7c8] bg-white hover:shadow-lg transition duration-300">

      {/* Image */}
      <div className="relative group overflow-hidden">

        <AppImage
          src={thumbnail}
          alt={title}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[270px]"
        />

        {/* Badge */}
        {badge && (
          <span className="absolute top-4 left-4 bg-[#8B5E3C] text-white text-[11px] px-3 py-1 rounded font-medium">
            {badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          className="absolute top-4 right-4 h-10 w-10 text-amber-500 rounded-full bg-white flex items-center justify-center shadow hover:bg-[#f7f4f0]"
        >
          <FiHeart size={18} />
        </button>
        {/* VIEW */}
        {/* <Link
          to={`/products/${id}`}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-[#875633] px-6 py-2 rounded-md
          text-[12px] tracking-[1.5px] opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md"
        >
          VIEW
        </Link> */}

      </div>

      {/* Body */}
      <div className="p-5">

        {/* Category */}
        <p className="uppercase tracking-[2px] text-[11px] text-[#6b7280]">
          {category?.name || "Furniture"}
        </p>

        {/* Title */}
        <h2 className="mt-2 text-[14px] font-medium text-[#1e1e1e]">
          {title}
        </h2>

        {(colors?.some((item) => item.status) || (!colors?.length && color)) && <div className="mt-3 flex items-center gap-2" aria-label="Available colors">{colors?.length ? colors.filter((item) => item.status).map((item) => <span key={item._id} title={item.name} className="h-4 w-4 rounded-full border border-[#D7C8B8]" style={{ backgroundColor: item.hex }}/>) : <span className="text-xs text-[#6b7280]">{color}</span>}</div>}

        {/* Rating */}
        <div className="flex items-center gap-2 mt-3">

          <span className="text-[#C58A42] text-[10px]">
            ★★★★★
          </span>

          <span className="text-[10px] text-[#6b7280]">
            (0)
          </span>

        </div>

        {/* Price */}
        <div className="flex items-end gap-2 mt-1 justify-between">
          <div className="gap-2 flex items-center">

            <span className="text-[14px] font-semibold text-[#1e1e1e]">
              ₹{finalPrice?.toLocaleString("en-IN")}
            </span>

            {salePrice && salePrice < price && (
              <span className="text-[#6b7280] line-through text-[11px]">
                ₹{price?.toLocaleString("en-IN")}
              </span>
            )}
          </div> 

          <Cartbtn product={product}/>
        </div>



      </div>

    </div>
  );
}
