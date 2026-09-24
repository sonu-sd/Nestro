"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { client } from "@/utils/helper";

export default function ReviewForm({ initialProduct = "" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    product: initialProduct,
    rating: 5,
    title: "",
    comment: "",
  });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      client.get("/user/get-me"),
      client.get("/product?limit=100"),
      initialProduct
        ? client.get(`/product/${initialProduct}`)
        : Promise.resolve(null),
    ]).then(([account, catalog, selected]) => {
      if (!active) return;
      if (account.status === "fulfilled") setUser(account.value.data.user);
      const available = catalog.status === "fulfilled"
        ? catalog.value.data.data || [] : [];
      const chosen = selected.status === "fulfilled"
        ? selected.value?.data?.data : null;
      setProducts(chosen && !available.some((item) => item._id === chosen._id)
        ? [chosen, ...available] : available);
      if (catalog.status === "rejected" && !chosen)
        setError("Products could not be loaded. Try searching for a product.");
      if (initialProduct && selected.status === "rejected") {
        setForm((current) => ({ ...current, product: "" }));
        setError("This product is unavailable. Choose another product.");
      }
      setLoading(false);
    });
    return () => { active = false; };
  }, [initialProduct]);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!form.product || !products.some((item) => item._id === form.product)) {
      setError("Choose a product to review.");
      return;
    }
    if (form.title.trim().length < 3 || form.title.trim().length > 80 ||
        form.comment.trim().length < 20 || form.comment.trim().length > 1000) {
      setError("Use 3–80 characters for the title and 20–1000 for the review.");
      return;
    }
    setSaving(true);
    try {
      const response = await client.post("/review", {
        ...form, title: form.title.trim(), comment: form.comment.trim(),
      });
      setMessage(response.data.message);
      setForm({ product: "", rating: 5, title: "", comment: "" });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Could not submit your review. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function searchProducts() {
    const query = search.trim();
    if (!query) {
      setError("Enter a product name to search.");
      return;
    }
    setSearching(true);
    setError("");
    try {
      const response = await client.get(
        `/product?limit=30&search=${encodeURIComponent(query)}`,
      );
      const found = response.data.data || [];
      setProducts((current) => {
        const selected = current.find((item) => item._id === form.product);
        return selected && !found.some((item) => item._id === selected._id)
          ? [selected, ...found]
          : found;
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Products could not be searched.",
      );
    } finally {
      setSearching(false);
    }
  }

  if (loading)
    return (
      <div
        className="mt-8 space-y-4 rounded-2xl border border-[#E5D5C3] bg-white p-6"
        aria-label="Loading review form"
      >
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-12 animate-pulse rounded-lg bg-[#F2EAE2]"
          />
        ))}
      </div>
    );
  if (!user)
    return (
      <div className="mt-8 rounded-2xl border border-[#E5D5C3] bg-white p-6 text-sm text-[#594632]">
        Please{" "}
        <Link
          href={`/sign_in?next=${encodeURIComponent(`/reviews/write${initialProduct ? `?product=${initialProduct}` : ""}`)}`}
          className="font-semibold text-[#8B5E3C] underline"
        >
          sign in
        </Link>{" "}
        to write a review.
      </div>
    );

  return (
    <form
      onSubmit={submit}
      className="mt-8 space-y-5 rounded-2xl border border-[#E5D5C3] bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <label
          htmlFor="product-search"
          className="mb-2 block text-sm font-semibold text-[#392B22]"
        >
          Find a product
        </label>
        <div className="flex gap-2">
          <input
            id="product-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void searchProducts();
              }
            }}
            className="min-h-11 min-w-0 flex-1 rounded-lg border border-[#CDBBA9] px-3 text-sm"
            placeholder="Search by product name"
          />
          <button
            type="button"
            disabled={searching}
            onClick={searchProducts}
            className="rounded-lg border border-[#8B5E3C] px-4 text-sm font-semibold text-[#8B5E3C] disabled:opacity-50"
          >
            {searching ? "Searching…" : "Search"}
          </button>
        </div>
      </div>
      <div>
        <label
          htmlFor="review-product"
          className="mb-2 block text-sm font-semibold text-[#392B22]"
        >
          Product
        </label>
        <select
          id="review-product"
          required
          value={form.product}
          onChange={(event) =>
            setForm({ ...form, product: event.target.value })
          }
          className="min-h-11 w-full rounded-lg border border-[#CDBBA9] bg-white px-3 text-sm"
        >
          <option value="">Select a product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.title}
            </option>
          ))}
        </select>
        {!products.length && (
          <p className="mt-2 text-xs text-[#8B5E3C]">
            No products found. Try a different search.
          </p>
        )}
      </div>
      <div>
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-[#392B22]">Your rating</legend>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <label key={rating}
                className={`flex min-h-11 cursor-pointer items-center gap-1 rounded-lg border px-3 text-sm ${form.rating === rating
                  ? "border-[#8B5E3C] bg-[#F6EDE4] text-[#70482e]"
                  : "border-[#CDBBA9] text-[#594632]"}`}>
                <input type="radio" name="rating" value={rating}
                  checked={form.rating === rating}
                  onChange={() => setForm((current) => ({ ...current, rating }))}
                  className="accent-[#8B5E3C]" />
                {rating} ★
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <div>
        <label
          htmlFor="review-title"
          className="mb-2 block text-sm font-semibold text-[#392B22]"
        >
          Review title
        </label>
        <input
          id="review-title"
          required
          minLength={3}
          maxLength={80}
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
          className="min-h-11 w-full rounded-lg border border-[#CDBBA9] px-3 text-sm"
          placeholder="What stood out?"
        />
      </div>
      <div>
        <label
          htmlFor="review-comment"
          className="mb-2 block text-sm font-semibold text-[#392B22]"
        >
          Your review
        </label>
        <textarea
          id="review-comment"
          required
          minLength={20}
          maxLength={1000}
          rows={5}
          value={form.comment}
          onChange={(event) =>
            setForm({ ...form, comment: event.target.value })
          }
          className="w-full rounded-lg border border-[#CDBBA9] p-3 text-sm"
          placeholder="Tell us about quality, comfort, delivery and your experience."
        />
        <p className="mt-1 text-right text-xs text-[#806F61]">
          {form.comment.length}/1000
        </p>
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      {message && (
        <p
          role="status"
          className="rounded-lg bg-green-50 p-3 text-sm text-green-800"
        >
          {message}. It will appear on the home page once approved.
        </p>
      )}
      {user.role !== "user" && (
        <p className="text-sm text-[#806F61]">Reviews can be submitted from a customer account.</p>
      )}
      <button
        type="submit"
        disabled={saving || !products.length || user.role !== "user"}
        className="min-h-11 rounded-lg bg-[#8B5E3C] px-6 text-sm font-semibold text-white hover:bg-[#70482e] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
