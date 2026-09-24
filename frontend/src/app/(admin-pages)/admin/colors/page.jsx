"use client";

import { useEffect, useState } from "react";
import { client, generateSlug } from "@/utils/helper";
import { toast } from "sonner";
import AdminSkeleton from "@/components/admin/AdminSkeleton";

const blank = { name: "", slug: "", hex: "#8B5E3C" };

export default function ColorsPage() {
  const [colors, setColors] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    try {
      const { data } = await client.get("/color/admin", {
        params: { page, limit: 20 },
      });
      setColors(data.data || []);
      setPages(data.pages || 0);
      setTotal(data.total || 0);
      setError("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to load colors.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    client
      .get("/color/admin", { params: { page, limit: 20 } })
      .then(({ data }) => {
        if (active) {
          setColors(data.data || []);
          setPages(data.pages || 0);
          setTotal(data.total || 0);
        }
      })
      .catch((requestError) => {
        if (active)
          setError(
            requestError.response?.data?.message || "Unable to load colors.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page]);

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    try {
      if (editing) await client.put(`/color/edit/${editing}`, form);
      else await client.post("/color/create", form);
      toast.success(editing ? "Color updated" : "Color added");
      setForm(blank);
      setEditing(null);
      await load();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message || "Unable to save color.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggle(color) {
    if (
      !window.confirm(`${color.status ? "Archive" : "Restore"} ${color.name}?`)
    )
      return;
    try {
      await client.patch(`/color/status-update/${color._id}`);
      toast.success(color.status ? "Color archived" : "Color restored");
      await load();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message || "Unable to update color.",
      );
    }
  }

  if (loading) return <AdminSkeleton variant="table" />;
  return (
    <main className="admin-page p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="admin-eyebrow">Catalog settings</p>
          <h1 className="mt-1 text-3xl font-bold">Product colors</h1>
          <p className="mt-1 text-sm opacity-70">
            Create reusable colors for products and store filters.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <form onSubmit={save} className="admin-card h-fit space-y-4 p-5">
            <h2 className="text-lg font-bold">
              {editing ? "Edit color" : "Add color"}
            </h2>
            <label className="block text-sm font-medium">
              Name
              <input
                required
                minLength={2}
                maxLength={50}
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                    slug: editing
                      ? current.slug
                      : generateSlug(event.target.value),
                  }))
                }
                className="admin-input mt-1"
                placeholder="e.g. Walnut Brown"
              />
            </label>
            <label className="block text-sm font-medium">
              Slug
              <input
                required
                value={form.slug}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    slug: generateSlug(event.target.value),
                  }))
                }
                className="admin-input mt-1"
                placeholder="walnut-brown"
              />
            </label>
            <label className="block text-sm font-medium">
              Hex code
              <div className="mt-1 flex gap-2">
                <input
                  type="color"
                  value={form.hex}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      hex: event.target.value.toUpperCase(),
                    }))
                  }
                  className="h-11 w-14 rounded-lg border border-[#DCCDBD] bg-white p-1"
                />
                <input
                  required
                  pattern="#[0-9a-fA-F]{6}"
                  value={form.hex}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      hex: event.target.value.toUpperCase(),
                    }))
                  }
                  className="admin-input"
                  placeholder="#8B5E3C"
                />
              </div>
            </label>
            <div className="flex gap-2">
              <button
                disabled={saving}
                className="admin-primary px-5 py-2.5 text-sm"
              >
                {saving ? "Saving…" : editing ? "Save changes" : "Add color"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm(blank);
                  }}
                  className="admin-secondary px-4 py-2.5 text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          <section className="admin-card overflow-hidden">
            <div className="border-b border-[#E8DDD3] p-5">
              <h2 className="text-lg font-bold">Color library</h2>
              <p className="text-sm opacity-60">{total} colors</p>
            </div>
            {error && (
              <p
                role="alert"
                className="m-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="bg-[#F4EEE7] text-xs uppercase tracking-wide text-[#806D5B]">
                  <tr>
                    <th className="p-4">Color</th>
                    <th className="p-4">Hex</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {colors.length ? (
                    colors.map((color) => (
                      <tr key={color._id} className="border-t border-[#E8DDD3]">
                        <td className="flex items-center gap-3 p-4">
                          <span
                            className="h-9 w-9 rounded-full border border-[#DCCDBD]"
                            style={{ backgroundColor: color.hex }}
                          />
                          <div>
                            <strong>{color.name}</strong>
                            <p className="text-xs opacity-60">{color.slug}</p>
                          </div>
                        </td>
                        <td className="p-4">{color.hex}</td>
                        <td className="p-4">
                          {color.status ? "Active" : "Archived"}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setEditing(color._id);
                              setForm({
                                name: color.name,
                                slug: color.slug,
                                hex: color.hex,
                              });
                            }}
                            className="admin-link mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => void toggle(color)}
                            className="admin-link"
                          >
                            {color.status ? "Archive" : "Restore"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center opacity-60">
                        No colors yet. Add the first color on the left.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between border-t border-[#E8DDD3] p-4 text-sm">
              <span>
                Page {page} of {Math.max(1, pages)}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="admin-secondary px-3 py-1 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={page >= pages}
                  onClick={() => setPage(page + 1)}
                  className="admin-secondary px-3 py-1 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
