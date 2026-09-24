"use client";
import AppImage from "@/components/ui/AppImage";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { client } from "@/utils/helper";
import { toast } from "sonner";
import AdminSkeleton from "@/components/admin/AdminSkeleton";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const flags = [
  ["stock", "In stock"],
  ["featured", "Featured"],
  ["bestSeller", "Best seller"],
  ["newArrival", "New arrival"],
];

export default function ProductDetailsPage() {
  const { product_id: id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState("");

  async function load() {
    try {
      const { data } = await client.get(`/product/admin/${id}`);
      setProduct(data.data);
      setError("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to load product.",
      );
    }
  }
  useEffect(() => {
    let active = true;
    client
      .get(`/product/admin/${id}`)
      .then(({ data }) => {
        if (active) setProduct(data.data);
      })
      .catch((requestError) => {
        if (active)
          setError(
            requestError.response?.data?.message || "Unable to load product.",
          );
      });
    return () => {
      active = false;
    };
  }, [id]);

  async function toggle(field) {
    if (pending) return;
    if (
      field === "status" &&
      !window.confirm(`${product.status ? "Archive" : "Restore"} this product?`)
    )
      return;
    setPending(field);
    try {
      await client.patch(
        field === "status"
          ? `/product/status-update/${id}`
          : `/product/update-flag/${id}`,
        field === "status" ? undefined : { field },
      );
      toast.success("Product updated");
      await load();
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || "Update failed");
    } finally {
      setPending("");
    }
  }

  if (error && !product)
    return (
      <main className="p-8 text-red-700" role="alert">
        {error}{" "}
        <Link href="/admin/products" className="underline">
          Back to products
        </Link>
      </main>
    );
  if (!product) return <AdminSkeleton variant="detail" />;

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/admin/products"
              className="text-sm font-semibold text-teal-700"
            >
              ← All products
            </Link>
            <h1 className="mt-2 text-3xl font-bold">{product.title}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {product.slug} · ID {product._id}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/admin/products/edit/${id}`}
              className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Edit product
            </Link>
            <Link
              href={`/admin/products/add-images/${id}`}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold"
            >
              Add images
            </Link>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <Card title="Images">
              <div className="grid gap-3 sm:grid-cols-3">
                {[product.thumbnail, ...(product.images || [])]
                  .filter(Boolean)
                  .map((url, index) => (
                    <a
                      key={`${url}-${index}`}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="overflow-hidden rounded-xl bg-slate-100"
                    >
                      <AppImage
                        src={url}
                        alt={`${product.title} image ${index + 1}`}
                        className="aspect-square w-full object-cover"
                      />
                    </a>
                  ))}
                {!product.thumbnail && !product.images?.length && (
                  <p className="text-sm text-slate-500">No images available.</p>
                )}
              </div>
            </Card>
            <Card title="Description">
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {product.shortDescription || "No short description"}
              </p>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {product.description}
              </p>
            </Card>
            <Card title="Specifications">
              <dl className="grid gap-4 sm:grid-cols-2">
                <Detail label="Category" value={product.category?.name} />
                <Detail label="Room type" value={product.roomType?.name} />
                <Detail label="Material" value={product.material} />
                <Detail
                  label="Colors"
                  value={
                    product.colors?.length
                      ? product.colors.map((color) => color.name).join(", ")
                      : product.color
                  }
                />
                <Detail
                  label="Dimensions"
                  value={
                    [
                      product.dimensions?.length,
                      product.dimensions?.width,
                      product.dimensions?.height,
                    ].some((value) => value != null)
                      ? `${product.dimensions?.length ?? "—"} × ${product.dimensions?.width ?? "—"} × ${product.dimensions?.height ?? "—"} ${product.dimensions?.unit || "cm"}`
                      : "—"
                  }
                />
                <Detail
                  label="Weight"
                  value={
                    product.weight?.value != null
                      ? `${product.weight.value} ${product.weight.unit || "kg"}`
                      : "—"
                  }
                />
              </dl>
            </Card>
          </div>
          <div className="space-y-6">
            <Card title="Pricing">
              <dl className="space-y-3">
                <Detail label="Regular price" value={money(product.price)} />
                <Detail label="Sale price" value={money(product.salePrice)} />
                <Detail label="Discount" value={`${product.discount || 0}%`} />
                <Detail label="Units sold" value={product.sold ?? 0} />
              </dl>
            </Card>
            <Card title="Manage product">
              <div className="space-y-3">
                {[["status", "Published / active"], ...flags].map(
                  ([field, label]) => (
                    <label
                      key={field}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 p-3 text-sm"
                    >
                      <span>{label}</span>
                      <input
                        type="checkbox"
                        aria-label={label}
                        checked={Boolean(product[field])}
                        disabled={Boolean(pending)}
                        onChange={() => void toggle(field)}
                        className="h-5 w-5 accent-teal-700"
                      />
                    </label>
                  ),
                )}
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Changes save immediately. Archived products are hidden from the
                storefront.
              </p>
            </Card>
            <Card title="Record details">
              <dl className="space-y-3">
                <Detail
                  label="Created"
                  value={
                    product.createdAt
                      ? new Date(product.createdAt).toLocaleString("en-IN")
                      : "—"
                  }
                />
                <Detail
                  label="Last updated"
                  value={
                    product.updatedAt
                      ? new Date(product.updatedAt).toLocaleString("en-IN")
                      : "—"
                  }
                />
              </dl>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

function Card({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-4 text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}
function Detail({ label, value }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-slate-900">{value || "—"}</dd>
    </div>
  );
}
