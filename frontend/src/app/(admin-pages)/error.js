"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error(error);
    // Sentry.captureException(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 px-6 dark:from-slate-950 dark:to-black">
      <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Error Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
          <svg
            className="h-10 w-10 text-red-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3Z"
            />
          </svg>
        </div>

        <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-red-600">
          Error
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
          Something went wrong
        </h1>

        <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
          We&apos;re sorry, an unexpected error occurred while loading this
          page. Please try again. If the issue persists, contact support.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:scale-105 hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-black"
          >
            Try Again
          </button>

          <Link
            href="/admin"
            className="rounded-xl border border-gray-300 px-6 py-3 font-medium transition hover:bg-gray-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Back to Home
          </Link>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-8 rounded-xl bg-slate-100 p-4 text-left text-xs dark:bg-slate-800">
            <summary className="cursor-pointer font-medium">
              Error Details
            </summary>

            <pre className="mt-3 whitespace-pre-wrap break-all text-red-500">
              {error?.message}
            </pre>
          </details>
        )}
      </div>
    </main>
  );
}
