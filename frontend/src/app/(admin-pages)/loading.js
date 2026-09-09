'use client';

export default function Loading() {
  return (
    <div className="p-6 animate-pulse">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="h-10 w-80 rounded bg-gray-200"></div>
          <div className="mt-3 h-5 w-60 rounded bg-gray-200"></div>
        </div>

        <div className="h-12 w-44 rounded-lg bg-gray-200"></div>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="border-b p-6">
          <div className="h-8 w-60 rounded bg-gray-200"></div>
          <div className="mt-3 h-5 w-72 rounded bg-gray-100"></div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-6 gap-6 border-b px-6 py-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-5 rounded bg-gray-200"></div>
          ))}
        </div>

        {/* Table Rows */}
        {Array.from({ length: 6 }).map((_, row) => (
          <div
            key={row}
            className="grid grid-cols-6 items-center gap-6 border-b px-6 py-5 last:border-none"
          >
            <div className="h-16 w-16 rounded-xl bg-gray-200"></div>

            <div className="h-6 w-40 rounded bg-gray-200"></div>

            <div className="h-6 w-28 rounded-full bg-gray-100"></div>

            <div className="h-8 w-20 rounded-full bg-green-100"></div>

            <div className="h-10 w-24 rounded-full bg-gray-200"></div>

            <div className="h-10 w-24 rounded-full bg-gray-200"></div>
          </div>
        ))}
      </div>
    </div>
  );
}