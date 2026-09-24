"use client";
import AppImage from "@/components/ui/AppImage";

import { useEffect, useState } from "react";
import Link from "next/link";
import { client } from "@/utils/helper";
import { toast } from "sonner";
import AdminSkeleton from "@/components/admin/AdminSkeleton";

export default function TaxonomyList({ type, title }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [total, setTotal] = useState(0);
  const base = type === "category" ? "category" : "room-type";

  async function load() {
    try {
      const { data } = await client.get(`/${base}/admin`, {
        params: { page, limit: 20 },
      });
      setItems(data.data || []);
      setPages(data.pages || 0);
      setTotal(data.total || 0);
      setError("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          `Unable to load ${title.toLowerCase()}.`,
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    client
      .get(`/${base}/admin`, { params: { page, limit: 20 } })
      .then(({ data }) => {
        if (active) {
          setItems(data.data || []);
          setPages(data.pages || 0);
          setTotal(data.total || 0);
        }
      })
      .catch((requestError) => {
        if (active)
          setError(
            requestError.response?.data?.message ||
              `Unable to load ${title.toLowerCase()}.`,
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [base, title, page]);

  async function toggle(item) {
    if (!window.confirm(`${item.status ? "Archive" : "Restore"} ${item.name}?`))
      return;
    try {
      await client.patch(`/${base}/status-update/${item._id}`);
      toast.success(item.status ? "Archived" : "Restored");
      await load();
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || "Update failed");
    }
  }

  if (loading && items.length === 0) return <AdminSkeleton variant="table" />;

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
              Catalog
            </p>
            <h1 className="mt-1 text-3xl font-bold">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage active and archived {title.toLowerCase()}.
            </p>
          </div>
          <Link
            href={`/admin/${base}/add`}
            className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white"
          >
            + Add {type === "category" ? "category" : "room type"}
          </Link>
        </div>
        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Slug</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    Loading…
                  </td>
                </tr>
              ) : !items.length ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    No entries yet.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id} className="border-t border-slate-100">
                    <td className="flex items-center gap-3 px-5 py-4 font-semibold">
                      <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100">
                        {item.image && (
                          <AppImage
                            src={item.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      {item.name}
                    </td>
                    <td className="px-5 py-4 text-slate-500">{item.slug}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
                      >
                        {item.status ? "Active" : "Archived"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/${base}/edit/${item._id}`}
                          className="rounded-lg border px-3 py-1.5"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => void toggle(item)}
                          className="rounded-lg border px-3 py-1.5"
                        >
                          {item.status ? "Archive" : "Restore"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex justify-between border-t p-4 text-sm text-slate-500">
            <span>
              {total} records · Page {page} of {Math.max(pages, 1)}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="rounded-lg border px-3 py-1 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page >= pages}
                onClick={() => setPage(page + 1)}
                className="rounded-lg border px-3 py-1 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
