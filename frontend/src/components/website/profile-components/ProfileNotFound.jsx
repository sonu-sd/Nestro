import Link from "next/link";
import { FiUser } from "react-icons/fi";

export default function ProfileNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf9f7] px-5 pt-28">

      <div className="text-center">

        <FiUser className="mx-auto mb-4 text-5xl text-[#8b5e3c]" />

        <h1 className="text-2xl font-semibold text-[#292524]">
          Please sign in
        </h1>

        <p className="mb-6 mt-2 text-sm text-gray-500">
          Sign in to access your profile.
        </p>

        <Link
          href="/sign_in"
          className="inline-block rounded-lg bg-[#8b5e3c] px-6 py-3 text-sm text-white transition hover:bg-[#70482e]"
        >
          Sign In
        </Link>

      </div>

    </main>
  );
}