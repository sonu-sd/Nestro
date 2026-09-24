"use client";

import { useEffect, useState } from "react";
import { client } from "@/utils/helper";

export default function ReviewModeration() {
  const [filter, setFilter] = useState("pending");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ data: [], pages: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let cancelled = false;
    client
      .get(`/review/admin?status=${filter}&page=${page}`)
      .then((response) => {
        if (!cancelled) setResult(response.data);
      })
      .catch((requestError) => {
        if (!cancelled)
          setError(
            requestError.response?.data?.message ||
              "Reviews could not be loaded.",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filter, page, refresh]);

  async function moderate(id, status) {
    setBusy(id);
    setError("");
    try {
      await client.patch(`/review/admin/${id}`, { status });
      setLoading(true);
      setRefresh((value) => value + 1);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Review could not be updated.",
      );
    } finally {
      setBusy(null);
    }
  }

  return (
    <main className="space-y-6 p-4 sm:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#8B5E3C]">
          Community
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-[#35261E]">
          Customer reviews
        </h1>
        <p className="mt-2 text-sm text-[#6D5B4B]">
          Review customer feedback before it appears publicly. {result.pending}{" "}
          pending.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {["pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => {
              setLoading(true);
              setError("");
              setFilter(status);
              setPage(1);
            }}
            className={`min-h-10 rounded-lg px-4 text-sm font-semibold capitalize ${filter === status ? "bg-[#6C482F] text-white" : "border border-[#D8C5B1] bg-white text-[#6C482F]"}`}
          >
            {status}
          </button>
        ))}
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-xl bg-[#EFE4D8]"
            />
          ))}
        </div>
      ) : result.data.length ? (
        <div className="space-y-4">
          {result.data.map((review) => (
            <article
              key={review._id}
              className="rounded-xl border border-[#E2D1BD] bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#35261E]">
                    {review.title}{" "}
                    <span className="text-[#AC7938]">{review.rating}/5 ★</span>
                  </p>
                  <p className="mt-1 text-xs text-[#756555]">
                    {review.user?.name || "Deleted user"} ·{" "}
                    {review.user?.email || ""} ·{" "}
                    {review.product?.title || "Deleted product"} ·{" "}
                    {new Date(review.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <span className="rounded-full bg-[#F4EBE0] px-3 py-1 text-xs font-semibold capitalize text-[#6C482F]">
                  {review.status}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#51463B]">
                {review.comment}
              </p>
              <p className="mt-2 text-xs text-[#61804D]">
                {review.verifiedPurchase
                  ? "Verified purchase"
                  : "Purchase not verified"}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["approved", "rejected", "pending"]
                  .filter((status) => status !== review.status)
                  .map((status) => (
                    <button
                      key={status}
                      disabled={busy === review._id}
                      onClick={() => moderate(review._id, status)}
                      className="min-h-10 rounded-lg border border-[#CDBBA9] px-4 text-xs font-semibold capitalize text-[#6C482F] hover:bg-[#F4EBE0] disabled:opacity-50"
                    >
                      {status === "approved"
                        ? "Approve"
                        : status === "rejected"
                          ? "Reject"
                          : "Move to pending"}
                    </button>
                  ))}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-[#E2D1BD] bg-white p-6 text-sm text-[#6D5B4B]">
          No {filter} reviews.
        </p>
      )}
      {result.pages > 1 && (
        <div className="flex items-center gap-3">
          <button
            disabled={page <= 1}
            onClick={() => {
              setLoading(true);
              setPage(page - 1);
            }}
            className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm">
            {page} / {result.pages}
          </span>
          <button
            disabled={page >= result.pages}
            onClick={() => {
              setLoading(true);
              setPage(page + 1);
            }}
            className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
