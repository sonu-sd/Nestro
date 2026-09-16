"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { client } from "@/utils/helper";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const name = form.get("name")?.trim();
    const email = form.get("email")?.trim();
    const password = form.get("password");
    const confirmPassword = form.get("confirmPassword");

    if (!name || !email || !password || !confirmPassword) return setError("Please fill all fields.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    try {
      setLoading(true);
      await client.post("/user/register", { name, email, password });
      router.push(`/otp_verify?email=${encodeURIComponent(email)}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg sm:p-8">
        <div className="mb-8 text-center"><h1 className="text-3xl font-bold text-gray-900">Create Account</h1><p className="mt-2 text-gray-500">Create your account to get started</p></div>
        {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Full Name" name="name" type="text" autoComplete="name" placeholder="Enter your full name" />
          <Input label="Email Address" name="email" type="email" autoComplete="email" placeholder="Enter your email" />
          <PasswordInput label="Password" name="password" placeholder="Create a password" show={showPassword} toggle={() => setShowPassword((current) => !current)} />
          <p className="-mt-3 text-xs text-gray-500">Use at least 8 characters.</p>
          <PasswordInput label="Confirm Password" name="confirmPassword" placeholder="Confirm your password" show={showConfirmPassword} toggle={() => setShowConfirmPassword((current) => !current)} />
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Creating Account..." : "Create Account"}</button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">Already have an account? <Link href="/sign_in" className="font-semibold text-blue-600 hover:underline">Sign in</Link></p>
      </div>
    </main>
  );
}

function Input({ label, ...props }) {
  return <div><label htmlFor={props.name} className="mb-2 block text-sm font-medium text-gray-700">{label}</label><input {...props} id={props.name} required className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div>;
}

function PasswordInput({ label, show, toggle, ...props }) {
  return <div><label htmlFor={props.name} className="mb-2 block text-sm font-medium text-gray-700">{label}</label><div className="relative"><input {...props} id={props.name} required type={show ? "text" : "password"} autoComplete="new-password" className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /><button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600">{show ? "Hide" : "Show"}</button></div></div>;
}
