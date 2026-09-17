"use client";
import AppImage from "@/components/ui/AppImage";

import { useEffect, useState } from "react";
import Link from "next/link";
import { client } from "@/utils/helper";
import { toast } from "sonner";
import ActionDropdown from "@/components/admin/category/ActionDropdown";
import AdminSkeleton from "@/components/admin/AdminSkeleton";

const money = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState({ all: 0, active: 0, archived: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      const { data } = await client.get("/product/admin", { params: { page, search: query, status: filter } });
      setProducts(data.data || []);
      setPages(data.pages || 0); setTotal(data.total || 0); setSummary(data.summary || { all: 0, active: 0, archived: 0 });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load products.");
    } finally { setLoading(false); }
  }

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => client.get("/product/admin", { params: { page, search: query, status: filter } })
      .then(({ data }) => { if (active) { setProducts(data.data || []); setPages(data.pages || 0); setTotal(data.total || 0); setSummary(data.summary || { all: 0, active: 0, archived: 0 }); } })
      .catch((requestError) => { if (active) setError(requestError.response?.data?.message || "Unable to load products."); })
      .finally(() => { if (active) setLoading(false); }), 250);
    return () => { active = false; window.clearTimeout(timer); };
  }, [page, query, filter]);

  async function toggleStatus(product) {
    if (!window.confirm(`${product.status ? "Archive" : "Restore"} ${product.title}?`)) return;
    try {
      await client.patch(`/product/status-update/${product._id}`);
      toast.success(product.status ? "Product archived" : "Product restored");
      await load();
    } catch (requestError) { toast.error(requestError.response?.data?.message || "Update failed"); }
  }

  if (loading && products.length === 0) return <AdminSkeleton variant="table"/>;

  return <main className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-6 lg:p-8">
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-teal-700">Catalog</p><h1 className="mt-1 text-3xl font-bold">Products</h1><p className="mt-1 text-sm text-slate-500">Review, edit and publish your store catalog.</p></div><Link href="/admin/products/add" className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800">+ Add product</Link></div>
      <div className="grid gap-3 sm:grid-cols-3"><Stat label="Total products" value={summary.all}/><Stat label="Active" value={summary.active}/><Stat label="Archived" value={summary.archived}/></div>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-wrap gap-3 border-b border-slate-100 p-4"><input aria-label="Search products" placeholder="Search by name or slug" value={query} onChange={(event) => { setPage(1); setQuery(event.target.value); }} className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-600"/><select aria-label="Filter status" value={filter} onChange={(event) => { setPage(1); setFilter(event.target.value); }} className="rounded-lg border border-slate-200 px-3 py-2 text-sm"><option value="all">All statuses</option><option value="active">Active</option><option value="archived">Archived</option></select><button onClick={() => { setLoading(true); void load(); }} className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">Refresh</button></div>
        {error && <p role="alert" className="m-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="overflow-x-auto"><table className="w-full min-w-[780px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4">Product</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Price</th><th className="px-5 py-4">Inventory</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Actions</th></tr></thead><tbody>{loading ? <tr><td colSpan="6" className="p-8 text-center text-slate-500">Loading products…</td></tr> : products.length === 0 ? <tr><td colSpan="6" className="p-8 text-center text-slate-500">No products found.</td></tr> : products.map((item) => <tr key={item._id} className="border-t border-slate-100"><td className="flex items-center gap-3 px-5 py-4"><div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">{item.thumbnail && <AppImage src={item.thumbnail} alt="" className="h-full w-full object-cover"/>}</div><div><Link href={`/admin/products/${item._id}`} className="font-semibold hover:text-teal-700">{item.title}</Link><p className="mt-1 text-xs text-slate-500">{item.slug}</p></div></td><td className="px-5 py-4">{item.category?.name || "—"}</td><td className="px-5 py-4"><strong>{money(item.salePrice)}</strong><span className="block text-xs text-slate-400 line-through">{money(item.price)}</span></td><td className="px-5 py-4">{item.stock ? "In stock" : "Out of stock"}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{item.status ? "Active" : "Archived"}</span></td><td className="px-5 py-4"><div className="flex items-center justify-end gap-2"><Link className="rounded-lg border px-3 py-1.5 hover:bg-slate-50" href={`/admin/products/edit/${item._id}`}>Edit</Link><button onClick={() => void toggleStatus(item)} className="rounded-lg border px-3 py-1.5 hover:bg-slate-50">{item.status ? "Archive" : "Restore"}</button><ActionDropdown id={item._id} module="product" actions={["view", "images"]}/></div></td></tr>)}</tbody></table></div><div className="flex items-center justify-between border-t p-4 text-sm text-slate-500"><span>{total} matching products · Page {page} of {Math.max(pages, 1)}</span><div className="flex gap-2"><button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg border px-3 py-1.5 disabled:opacity-40">Previous</button><button disabled={page >= pages} onClick={() => setPage(page + 1)} className="rounded-lg border px-3 py-1.5 disabled:opacity-40">Next</button></div></div></section>
    </div>
  </main>;
}

function Stat({ label, value }) { return <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></div>; }
