import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProductBySlug, fetchProductReviews } from "@/api/api";
import ProductGallery from "@/components/website/product/ProductGallery";
import Cartbtn from "@/components/website/store-components/Cartbtn";

const getProduct = cache(fetchProductBySlug);
const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product)
    return { title: "Product not found | Nestro", robots: { index: false } };
  return {
    title: `${product.title} | Nestro`,
    description: product.shortDescription || product.description.slice(0, 155),
    openGraph: {
      title: product.title,
      description:
        product.shortDescription || product.description.slice(0, 155),
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const reviewResult = await fetchProductReviews(product._id).catch(() => null);
  const reviews = reviewResult?.data || [];
  const visibleColors = product.colors?.filter((item) => item.status) || [];
  const price = Number(product.price);
  const salePrice = Number(product.salePrice);
  const discounted = salePrice >= 0 && salePrice < price;
  const discountPercent = discounted
    ? Math.round((1 - salePrice / price) * 100)
    : 0;
  const specs = [
    ["Category", product.category?.name],
    ["Room", product.roomType?.name],
    ["Material", product.material],
    [
      "Dimensions",
      [
        product.dimensions?.length,
        product.dimensions?.width,
        product.dimensions?.height,
      ].every((value) => Number.isFinite(value))
        ? `${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} ${product.dimensions.unit || "cm"}`
        : null,
    ],
    [
      "Weight",
      Number.isFinite(product.weight?.value)
        ? `${product.weight.value} ${product.weight.unit || "kg"}`
        : null,
    ],
  ].filter(([, value]) => value);

  return (
    <main className="mx-auto max-w-[1440px] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[#76685C]"
      >
        <Link href="/" className="hover:text-[#8B5E3C]">
          Home
        </Link>
        <span>/</span>
        <Link href="/store" className="hover:text-[#8B5E3C]">
          Store
        </Link>
        <span>/</span>
        <span className="font-medium text-[#35261E]">{product.title}</span>
      </nav>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
        <ProductGallery product={product} />
        <div className="rounded-2xl border border-[#E6D8C9] bg-white p-5 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B5E3C]">
            {product.category?.name || "Furniture"}
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight text-[#29211B] sm:text-4xl">
            {product.title}
          </h1>
          {product.shortDescription && (
            <p className="mt-3 text-sm leading-6 text-[#665548]">
              {product.shortDescription}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            <span className="text-[#B17B38]">
              {product.reviewCount
                ? `★ ${Number(product.ratingAverage).toFixed(1)}`
                : "Not yet rated"}
            </span>
            <span className="text-[#76685C]">
              {product.reviewCount
                ? `${product.reviewCount} customer review${product.reviewCount === 1 ? "" : "s"}`
                : "Be the first to review"}
            </span>
            {product.bestSeller && (
              <span className="rounded-full bg-[#F7ECDD] px-2.5 py-1 text-xs font-semibold text-[#8B5E3C]">
                Bestseller
              </span>
            )}
            {product.newArrival && (
              <span className="rounded-full bg-[#E5EEDC] px-2.5 py-1 text-xs font-semibold text-[#567246]">
                New arrival
              </span>
            )}
          </div>
          <div className="mt-6 border-y border-[#F0E7DE] py-5">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold text-[#29211B]">
                {money(discounted ? salePrice : price)}
              </span>
              {discounted && (
                <>
                  <span className="text-base text-[#827467] line-through">
                    {money(price)}
                  </span>
                  <span className="rounded bg-[#E9F2E5] px-2 py-1 text-xs font-semibold text-[#567246]">
                    {discountPercent}% off
                  </span>
                </>
              )}
            </div>
            <p
              className={`mt-2 text-sm font-semibold ${product.stock ? "text-[#567246]" : "text-[#A14F3B]"}`}
            >
              {product.stock ? "In stock" : "Currently out of stock"}
            </p>
          </div>
          {(visibleColors.length > 0 || product.color) && (
            <div className="mt-5">
              <h2 className="text-sm font-semibold text-[#35261E]">
                Available colors
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {visibleColors.length ? (
                  visibleColors.map((item) => (
                    <span
                      key={item._id}
                      className="inline-flex items-center gap-2 rounded-full border border-[#E1D4C7] px-3 py-1.5 text-xs text-[#51463B]"
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-[#D7C8B8]"
                        style={{ backgroundColor: item.hex }}
                      />
                      {item.name}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-[#665548]">
                    {product.color}
                  </span>
                )}
              </div>
            </div>
          )}
          <div className="mt-6">
            <Cartbtn product={product} />
          </div>
          <p className="mt-3 text-xs text-[#806F61]">
            Color swatches show available finishes. Stock is currently tracked
            at product level.
          </p>
        </div>
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#E6D8C9] bg-white p-6">
          <h2 className="text-xl font-semibold text-[#29211B]">
            Product details
          </h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#5D534B]">
            {product.description}
          </p>
          {specs.length > 0 && (
            <dl className="mt-6 divide-y divide-[#F0E7DE] border-t border-[#F0E7DE]">
              {specs.map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[110px_1fr] gap-3 py-3 text-sm"
                >
                  <dt className="font-medium text-[#806F61]">{label}</dt>
                  <dd className="text-[#35261E]">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>
        <section className="rounded-2xl border border-[#E6D8C9] bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-[#29211B]">
                Customer reviews
              </h2>
              <p className="mt-1 text-sm text-[#806F61]">
                Only approved reviews are shown.
              </p>
            </div>
            <Link
              href={`/reviews/write?product=${product._id}`}
              className="rounded-lg border border-[#8B5E3C] px-4 py-2 text-sm font-semibold text-[#8B5E3C] hover:bg-[#F8F1E9]"
            >
              Write a review
            </Link>
          </div>
          {!reviewResult ? (
            <p className="mt-6 text-sm text-[#806F61]">
              Reviews are temporarily unavailable.
            </p>
          ) : reviews.length ? (
            <div className="mt-6 space-y-4">
              {reviews.map((review) => (
                <article
                  key={review._id}
                  className="border-t border-[#F0E7DE] pt-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold text-[#35261E]">
                      {review.title}
                    </h3>
                    <span
                      className="text-sm text-[#B17B38]"
                      aria-label={`${review.rating} out of 5 stars`}
                    >
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#5D534B]">
                    {review.comment}
                  </p>
                  <p className="mt-3 text-xs text-[#806F61]">
                    {review.user?.name || "Customer"}
                    {review.verifiedPurchase
                      ? " · Verified purchase"
                      : ""} ·{" "}
                    {new Date(review.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-[#806F61]">
              No reviews yet. Share the first one.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
