import AppImage from "@/components/ui/AppImage";
import Cartbtn from "./Cartbtn";
import Link from "next/link";

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
    reviewCount,
    ratingAverage,
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
      <Link href={`/products/${product.slug}`} aria-label={`View ${title} details`} className="relative group block overflow-hidden">

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

      </Link>

      {/* Body */}
      <div className="p-5">

        {/* Category */}
        <p className="uppercase tracking-[2px] text-[11px] text-[#6b7280]">
          {category?.name || "Furniture"}
        </p>

        {/* Title */}
        <h2 className="mt-2 text-[14px] font-medium text-[#1e1e1e]"><Link href={`/products/${product.slug}`} className="hover:text-[#8B5E3C] hover:underline">{title}</Link></h2>

        {(colors?.some((item) => item.status) || (!colors?.length && color)) && <div className="mt-3 flex items-center gap-2" aria-label="Available colors">{colors?.length ? colors.filter((item) => item.status).map((item) => <span key={item._id} title={item.name} className="h-4 w-4 rounded-full border border-[#D7C8B8]" style={{ backgroundColor: item.hex }}/>) : <span className="text-xs text-[#6b7280]">{color}</span>}</div>}

        {/* Rating */}
        <div className="flex items-center gap-2 mt-3">

          {reviewCount ? <><span className="text-[#C58A42] text-sm">★ {Number(ratingAverage).toFixed(1)}</span><span className="text-xs text-[#6b7280]">({reviewCount} reviews)</span></> : <span className="text-xs text-[#6b7280]">No reviews yet</span>}

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
        <Link href={`/products/${product.slug}`} className="mt-3 inline-block text-xs font-semibold text-[#8B5E3C] underline-offset-2 hover:underline">View full details →</Link>



      </div>

    </div>
  );
}
