"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { client } from "@/utils/helper";

export default function ReviewForm({ initialProduct = "" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ product: initialProduct, rating: 5, title: "", comment: "" });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.allSettled([client.get("/user/get-me"), client.get("/product?limit=100"), initialProduct ? client.get(`/product/${initialProduct}`) : Promise.resolve(null)]).then(([account, catalog, selected]) => {
      if (account.status === "fulfilled") setUser(account.value.data.user);
      if (catalog.status === "fulfilled") {
        const available = catalog.value.data.data || [];
        const chosen = selected.status === "fulfilled" ? selected.value?.data?.data : null;
        setProducts(chosen && !available.some((item) => item._id === chosen._id) ? [chosen, ...available] : available);
      }
      setLoading(false);
    });
  }, [initialProduct]);

  async function submit(event) {
    event.preventDefault();
    setSaving(true); setError(""); setMessage("");
    try {
      const response = await client.post("/review", form);
      setMessage(response.data.message);
      setForm({ product: "", rating: 5, title: "", comment: "" });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not submit your review. Please try again.");
    } finally { setSaving(false); }
  }

  async function searchProducts() {
    setSearching(true); setError("");
    try {
      const response = await client.get(`/product?limit=30&search=${encodeURIComponent(search.trim())}`);
      const found = response.data.data || [];
      setProducts((current) => {
        const selected = current.find((item) => item._id === form.product);
        return selected && !found.some((item) => item._id === selected._id) ? [selected, ...found] : found;
      });
    } catch (requestError) { setError(requestError.response?.data?.message || "Products could not be searched."); }
    finally { setSearching(false); }
  }

  if (loading) return <div className="mt-8 space-y-4 rounded-2xl border border-[#E5D5C3] bg-white p-6" aria-label="Loading review form">{[1, 2, 3, 4].map((item) => <div key={item} className="h-12 animate-pulse rounded-lg bg-[#F2EAE2]" />)}</div>;
  if (!user) return <div className="mt-8 rounded-2xl border border-[#E5D5C3] bg-white p-6 text-sm text-[#594632]">Please <Link href="/sign_in" className="font-semibold text-[#8B5E3C] underline">sign in</Link> to write a review.</div>;

  return <form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl border border-[#E5D5C3] bg-white p-6 shadow-sm sm:p-8">
    <div><label htmlFor="product-search" className="mb-2 block text-sm font-semibold text-[#392B22]">Find a product</label><div className="flex gap-2"><input id="product-search" value={search} onChange={(event) => setSearch(event.target.value)} className="min-h-11 min-w-0 flex-1 rounded-lg border border-[#CDBBA9] px-3 text-sm" placeholder="Search by product name" /><button type="button" disabled={searching} onClick={searchProducts} className="rounded-lg border border-[#8B5E3C] px-4 text-sm font-semibold text-[#8B5E3C] disabled:opacity-50">{searching ? "Searching…" : "Search"}</button></div></div>
    <div><label htmlFor="review-product" className="mb-2 block text-sm font-semibold text-[#392B22]">Product</label><select id="review-product" required value={form.product} onChange={(event) => setForm({ ...form, product: event.target.value })} className="min-h-11 w-full rounded-lg border border-[#CDBBA9] bg-white px-3 text-sm"><option value="">Select a product</option>{products.map((product) => <option key={product._id} value={product._id}>{product.title}</option>)}</select>{!products.length && <p className="mt-2 text-xs text-[#8B5E3C]">No products are currently available. Please try again later.</p>}</div>
    <div><label htmlFor="review-rating" className="mb-2 block text-sm font-semibold text-[#392B22]">Rating</label><select id="review-rating" value={form.rating} onChange={(event) => setForm({ ...form, rating: Number(event.target.value) })} className="min-h-11 w-full rounded-lg border border-[#CDBBA9] bg-white px-3 text-sm">{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} {rating === 1 ? "star" : "stars"}</option>)}</select></div>
    <div><label htmlFor="review-title" className="mb-2 block text-sm font-semibold text-[#392B22]">Review title</label><input id="review-title" required minLength={3} maxLength={80} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="min-h-11 w-full rounded-lg border border-[#CDBBA9] px-3 text-sm" placeholder="What stood out?" /></div>
    <div><label htmlFor="review-comment" className="mb-2 block text-sm font-semibold text-[#392B22]">Your review</label><textarea id="review-comment" required minLength={20} maxLength={1000} rows={5} value={form.comment} onChange={(event) => setForm({ ...form, comment: event.target.value })} className="w-full rounded-lg border border-[#CDBBA9] p-3 text-sm" placeholder="Tell us about quality, comfort, delivery and your experience." /><p className="mt-1 text-right text-xs text-[#806F61]">{form.comment.length}/1000</p></div>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {message && <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{message}. It will appear on the home page once approved.</p>}
    <button type="submit" disabled={saving || !products.length || user.role !== "user"} className="min-h-11 rounded-lg bg-[#8B5E3C] px-6 text-sm font-semibold text-white hover:bg-[#70482e] disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Submitting…" : "Submit review"}</button>
  </form>;
}
