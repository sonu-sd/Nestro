import AppImage from "@/components/ui/AppImage";
import Cartbtn from "@/components/website/store-components/Cartbtn";
import Link from "next/link";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function HomeProductCard({ product }) {
  const { thumbnail, title, category, price, salePrice, stock, bestSeller, newArrival, reviewCount, ratingAverage, colors, color } = product;
  const discounted = Number(salePrice) < Number(price) && Number(salePrice) >= 0;
  const finalPrice = discounted ? salePrice : price;
  const savings = discounted ? Math.round((1 - salePrice / price) * 100) : 0;
  const badge = !stock ? "Sold out" : bestSeller ? "Bestseller" : newArrival ? "New arrival" : savings ? `${savings}% off` : null;
  const visibleColors = colors?.filter((item) => item.status) || [];

  return <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E5D5C3] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#B88D65] hover:shadow-lg">
    <Link href={`/products/${product.slug}`} aria-label={`View ${title} details`} className="relative block overflow-hidden bg-[#F4EEE7]">
      <AppImage src={thumbnail} alt={title} className="h-48 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-56" />
      {badge && <span className="absolute left-3 top-3 rounded-full bg-[#493329] px-3 py-1 text-[11px] font-semibold text-white">{badge}</span>}
    </Link>
    <div className="flex flex-1 flex-col p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8B5E3C]">{category?.name || "Furniture"}</p>
      <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-[#29211B]" title={title}><Link href={`/products/${product.slug}`} className="hover:text-[#8B5E3C] hover:underline">{title}</Link></h3>
      <p className="mt-2 text-xs text-[#76685C]" aria-label={reviewCount ? `Rated ${ratingAverage} out of 5 from ${reviewCount} reviews` : "Not yet rated"}>
        {reviewCount ? <><span className="text-[#B17B38]">★</span> {Number(ratingAverage).toFixed(1)} <span>({reviewCount})</span></> : "No reviews yet"}
      </p>
      {(visibleColors.length > 0 || color) && <div className="mt-2 flex min-h-5 items-center gap-1.5" aria-label="Available colors">
        {visibleColors.length ? visibleColors.slice(0, 5).map((item) => <span key={item._id} title={item.name} className="h-4 w-4 rounded-full border border-[#C8BBAE]" style={{ backgroundColor: item.hex }} />) : <span className="text-xs text-[#76685C]">{color}</span>}
        {visibleColors.length > 5 && <span className="text-xs text-[#76685C]">+{visibleColors.length - 5}</span>}
      </div>}
      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
        <div><p className="text-base font-bold text-[#29211B]">{money(finalPrice)}</p>{discounted && <p className="text-xs text-[#827467]"><span className="line-through">{money(price)}</span> <span className="font-medium text-[#61804D]">{savings}% off</span></p>}</div>
        <Cartbtn product={product} />
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-[#8B5E3C]"><Link href={`/products/${product.slug}`} className="underline-offset-2 hover:underline">View details</Link><Link href={`/reviews/write?product=${product._id}`} className="underline-offset-2 hover:underline">Write a review</Link></div>
    </div>
  </article>;
}
