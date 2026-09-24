import AppImage from "@/components/ui/AppImage";
import Cartbtn from "@/components/website/store-components/Cartbtn";
import Link from "next/link";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function HomeProductCard({ product }) {
  const {
    thumbnail,
    title,
    category,
    price,
    salePrice,
    stock,
    bestSeller,
    newArrival,
    reviewCount,
    ratingAverage,
    colors,
    color,
  } = product;
  const discounted =
    Number(salePrice) < Number(price) && Number(salePrice) >= 0;
  const finalPrice = discounted ? salePrice : price;
  const savings = discounted ? Math.round((1 - salePrice / price) * 100) : 0;
  const badge = !stock
    ? "Sold out"
    : bestSeller
      ? "Bestseller"
      : newArrival
        ? "New arrival"
        : savings
          ? `${savings}% off`
          : null;
  const visibleColors = colors?.filter((item) => item.status) || [];

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#E5D5C3] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#B88D65] hover:shadow-lg sm:rounded-2xl">
      <Link
        href={`/products/${product.slug}`}
        aria-label={`View ${title} details`}
        className="relative block overflow-hidden bg-[#F4EEE7]"
      >
        <AppImage
          src={thumbnail}
          alt={title}
          className="aspect-[5/4] w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {badge && (
          <span className="absolute left-2 top-2 rounded-full bg-[#493329] px-2 py-1 text-[9px] font-semibold text-white sm:left-3 sm:top-3 sm:px-3 sm:text-[11px]">
            {badge}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="truncate text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8B5E3C] sm:text-[11px]">
          {category?.name || "Furniture"}
        </p>
        <h3
          className="mt-1 line-clamp-2 min-h-9 text-xs font-semibold leading-[18px] text-[#29211B] sm:min-h-10 sm:text-sm sm:leading-5"
          title={title}
        >
          <Link
            href={`/products/${product.slug}`}
            className="hover:text-[#8B5E3C] hover:underline"
          >
            {title}
          </Link>
        </h3>
        <p
          className="mt-1.5 truncate text-[10px] text-[#76685C] sm:text-xs"
          aria-label={
            reviewCount
              ? `Rated ${ratingAverage} out of 5 from ${reviewCount} reviews`
              : "Not yet rated"
          }
        >
          {reviewCount ? (
            <>
              <span className="text-[#B17B38]">★</span>{" "}
              {Number(ratingAverage).toFixed(1)} <span>({reviewCount})</span>
            </>
          ) : (
            "No reviews yet"
          )}
        </p>
        {(visibleColors.length > 0 || color) && (
          <div
            className="mt-1.5 flex min-h-5 items-center gap-1.5"
            aria-label="Available colors"
          >
            {visibleColors.length ? (
              visibleColors
                .slice(0, 5)
                .map((item) => (
                  <span
                    key={item._id}
                    title={item.name}
                    className="h-4 w-4 rounded-full border border-[#C8BBAE]"
                    style={{ backgroundColor: item.hex }}
                  />
                ))
            ) : (
              <span className="text-xs text-[#76685C]">{color}</span>
            )}
            {visibleColors.length > 5 && (
              <span className="text-xs text-[#76685C]">
                +{visibleColors.length - 5}
              </span>
            )}
          </div>
        )}
        <div className="mt-auto flex items-end justify-between gap-1 pt-2 sm:gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-[#29211B] sm:text-base">
              {money(finalPrice)}
            </p>
            {discounted && (
              <p className="text-[9px] text-[#827467] sm:text-xs">
                <span className="line-through">{money(price)}</span>{" "}
                <span className="hidden font-medium text-[#61804D] sm:inline">
                  {savings}% off
                </span>
              </p>
            )}
          </div>
          <Cartbtn product={product} />
        </div>
        <div className="mt-2 hidden flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-[#8B5E3C] sm:flex">
          <Link
            href={`/products/${product.slug}`}
            className="underline-offset-2 hover:underline"
          >
            View details
          </Link>
          <Link
            href={`/reviews/write?product=${product._id}`}
            className="underline-offset-2 hover:underline"
          >
            Write a review
          </Link>
        </div>
      </div>
    </article>
  );
}
