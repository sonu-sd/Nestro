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

  const finalPrice = salePrice && salePrice < price ? salePrice : price;

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#e7d7c8] bg-white transition duration-300 hover:shadow-lg sm:rounded-2xl">
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        aria-label={`View ${title} details`}
        className="relative group block overflow-hidden"
      >
        <AppImage
          src={thumbnail}
          alt={title}
          className="aspect-[5/4] w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Badge */}
        {badge && (
          <span className="absolute left-2 top-2 rounded bg-[#8B5E3C] px-2 py-1 text-[9px] font-medium text-white sm:left-4 sm:top-4 sm:px-3 sm:text-[11px]">
            {badge}
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {/* Category */}
        <p className="truncate text-[9px] font-semibold uppercase tracking-[1.5px] text-[#8B5E3C] sm:text-[11px] sm:tracking-[2px]">
          {category?.name || "Furniture"}
        </p>

        {/* Title */}
        <h2 className="mt-1 line-clamp-2 text-xs font-semibold leading-[18px] text-[#1e1e1e] sm:min-h-6 sm:text-[14px]">
          <Link
            href={`/products/${product.slug}`}
            className="hover:text-[#8B5E3C] hover:underline"
          >
            {title}
          </Link>
        </h2>

        {(colors?.some((item) => item.status) ||
          (!colors?.length && color)) && (
          <div
            className="mt-1.5 flex min-h-4 items-center gap-1.5 overflow-hidden"
            aria-label="Available colors"
          >
            {colors?.length ? (
              colors
                .filter((item) => item.status)
                .slice(0, 4)
                .map((item) => (
                  <span
                    key={item._id}
                    title={item.name}
                    className="h-3.5 w-3.5 shrink-0 rounded-full border border-[#D7C8B8] sm:h-4 sm:w-4"
                    style={{ backgroundColor: item.hex }}
                  />
                ))
            ) : (
              <span className="truncate text-[10px] text-[#6b7280] sm:text-xs">
                {color}
              </span>
            )}
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 pt-1 text-[10px] sm:gap-2 sm:text-xs">
          {reviewCount ? (
            <>
              <span className="text-[#C58A42]">
                ★ {Number(ratingAverage).toFixed(1)}
              </span>
              <span className="truncate text-[#6b7280]">({reviewCount})</span>
            </>
          ) : (
            <span className="truncate text-[#6b7280]">No reviews</span>
          )}
        </div>

        {/* Price */}
        <div className="mt-auto flex min-w-0 items-end justify-between pt-1 gap-1 sm:gap-2">
          <div className="min-w-0 sm:flex sm:items-center sm:gap-2">
            <span className="block truncate text-xs font-bold text-[#1e1e1e] sm:text-[14px]">
              ₹{finalPrice?.toLocaleString("en-IN")}
            </span>

            {salePrice && salePrice < price && (
              <span className="block text-[9px] text-[#6b7280] line-through sm:inline sm:text-[11px]">
                ₹{price?.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <Link
            href={`/products/${product.slug}`}
            className="mt-2 hidden text-xs font-semibold text-[#8B5E3C] underline-offset-2 hover:underline sm:inline-block mt-3"
          >
            View full details →
          </Link>

          <Cartbtn product={product} />
        </div>
      </div>
    </article>
  );
}
