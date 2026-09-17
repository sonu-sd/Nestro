"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { client } from "@/utils/helper";
import { toast } from "sonner";

const materials = ["Wood", "Sheesham", "Engineered Wood", "Metal", "Steel", "Plastic", "Glass", "Marble", "Fabric", "Leather"];
const flags = [["stock", "In stock"], ["featured", "Featured"], ["bestSeller", "Best seller"], ["newArrival", "New arrival"], ["status", "Active"]];

export default function EditProductPage() {
  const { product_id: id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([client.get(`/product/admin/${id}`), client.get("/category"), client.get("/room-type")])
      .then(([productResponse, categoryResponse, roomResponse]) => {
        if (!active) return;
        const item = productResponse.data.data;
        setForm({ title: item.title || "", slug: item.slug || "", shortDescription: item.shortDescription || "", description: item.description || "", category: item.category?._id || item.category || "", roomType: item.roomType?._id || item.roomType || "", price: item.price ?? "", salePrice: item.salePrice ?? "", discount: item.discount ?? "", material: item.material || "Wood", color: item.color || "", length: item.dimensions?.length ?? "", width: item.dimensions?.width ?? "", height: item.dimensions?.height ?? "", weight: item.weight?.value ?? "", stock: item.stock, featured: item.featured, bestSeller: item.bestSeller, newArrival: item.newArrival, status: item.status });
        setPreview(item.thumbnail || ""); setCategories(categoryResponse.data.data || []); setRooms(roomResponse.data.data || []);
      }).catch((requestError) => { if (active) setError(requestError.response?.data?.message || "Unable to load product."); });
    return () => { active = false; };
  }, [id]);

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => {
      const next = { ...current, [name]: value };
      if (name === "price" || name === "salePrice") {
        const price = Number(next.price), sale = Number(next.salePrice);
        next.discount = price > 0 && sale >= 0 ? Math.max(0, Math.round((1 - sale / price) * 100)) : "";
      }
      return next;
    });
  }

  async function submit(event) {
    event.preventDefault(); setError("");
    if (Number(form.salePrice) > Number(form.price)) { setError("Sale price cannot exceed regular price."); return; }
    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => { if (value !== "") body.append(key, value); });
    if (thumbnail) body.append("image", thumbnail);
    setSaving(true);
    try { await client.put(`/product/edit/${id}`, body); toast.success("Product updated"); router.push(`/admin/products/${id}`); router.refresh(); }
    catch (requestError) { setError(requestError.response?.data?.message || "Unable to save product."); }
    finally { setSaving(false); }
  }

  if (error && !form) return <main className="p-8 text-red-700" role="alert">{error} <Link className="underline" href="/admin/products">Back to products</Link></main>;
  if (!form) return <main className="p-8 text-slate-500">Loading product…</main>;
  return <main className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-6 lg:p-8"><div className="mx-auto max-w-5xl space-y-6">
    <div><Link href={`/admin/products/${id}`} className="text-sm font-semibold text-teal-700">← Product details</Link><h1 className="mt-2 text-3xl font-bold">Edit product</h1><p className="mt-1 text-sm text-slate-500">Update catalog information and merchandising settings.</p></div>
    <form onSubmit={submit} className="space-y-6">
      <Section title="Basic information"><div className="grid gap-4 sm:grid-cols-2"><Field label="Product title" name="title" value={form.title} onChange={update} required/><Field label="Slug" name="slug" value={form.slug} onChange={update} required/></div><Field label="Short description" name="shortDescription" value={form.shortDescription} onChange={update} multiline/><Field label="Description" name="description" value={form.description} onChange={update} multiline required/></Section>
      <Section title="Classification"><div className="grid gap-4 sm:grid-cols-2"><Select label="Category" name="category" value={form.category} onChange={update} options={categories}/><Select label="Room type" name="roomType" value={form.roomType} onChange={update} options={rooms}/></div></Section>
      <Section title="Pricing and specifications"><div className="grid gap-4 sm:grid-cols-3"><Field label="Regular price (₹)" name="price" type="number" min="200" value={form.price} onChange={update} required/><Field label="Sale price (₹)" name="salePrice" type="number" min="0" value={form.salePrice} onChange={update} required/><Field label="Discount (%)" name="discount" type="number" min="0" max="100" value={form.discount} onChange={update}/></div><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">Material<select name="material" value={form.material} onChange={update} className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-3">{materials.map((material) => <option key={material}>{material}</option>)}</select></label><Field label="Color" name="color" value={form.color} onChange={update}/></div><div className="grid gap-4 sm:grid-cols-4">{[["length", "Length (cm)"], ["width", "Width (cm)"], ["height", "Height (cm)"], ["weight", "Weight (kg)"]].map(([name, label]) => <Field key={name} label={label} name={name} type="number" min="0" value={form[name]} onChange={update}/>)}</div></Section>
      <Section title="Images"><div className="flex flex-wrap items-center gap-5">{preview && <img src={preview} alt="Current thumbnail" className="h-28 w-28 rounded-xl object-cover"/>}<label className="text-sm font-medium">Replace thumbnail<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) { setThumbnail(file); setPreview(URL.createObjectURL(file)); } }} className="mt-2 block text-sm"/></label><Link href={`/admin/products/add-images/${id}`} className="text-sm font-semibold text-teal-700 underline">Add gallery images</Link></div></Section>
      <Section title="Availability and merchandising"><div className="grid gap-3 sm:grid-cols-2">{flags.map(([name, label]) => <label key={name} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm font-medium">{label}<input type="checkbox" checked={Boolean(form[name])} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.checked }))} className="h-5 w-5 accent-teal-700"/></label>)}</div></Section>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="flex gap-3"><button disabled={saving} className="rounded-lg bg-teal-700 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : "Save changes"}</button><Link href={`/admin/products/${id}`} className="rounded-lg border border-slate-200 px-6 py-3 text-sm font-semibold">Cancel</Link></div>
    </form>
  </div></main>;
}

function Section({ title, children }) { return <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="text-lg font-bold">{title}</h2>{children}</section>; }
function Field({ label, multiline, ...props }) { const className = "mt-1 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-teal-600"; return <label className="block text-sm font-medium">{label}{multiline ? <textarea rows={4} className={className} {...props}/> : <input className={className} {...props}/>}</label>; }
function Select({ label, options, ...props }) { return <label className="block text-sm font-medium">{label}<select className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-3" required {...props}><option value="">Select {label.toLowerCase()}</option>{options.map((item) => <option key={item._id} value={item._id}>{item.name}{!item.status ? " (inactive)" : ""}</option>)}</select></label>; }
