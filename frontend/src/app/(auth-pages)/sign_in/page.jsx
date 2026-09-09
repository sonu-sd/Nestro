"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { client } from "@/utils/helper";
import { useDispatch } from "react-redux";
import { dbToCart } from "@/redux/features/Cartslice";

export default function SignInPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const payload = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    if (!payload.email || !payload.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // LOGIN
      const response = await client.post("user/login", payload);

      if (!response.data.success) {
        setError(response.data.message || "Login failed");
        return;
      }

      // Read the guest cart safely before replacing it with the database cart.
      let localCart = null;
      try {
        localCart = JSON.parse(localStorage.getItem("cart"));
      } catch {
        localStorage.removeItem("cart");
      }
      const localItems = localCart?.items || [];

      let finalCart;

      if (localItems.length > 0) {
        const updateItems = localItems.map((item) => ({
          productId: item._id,
          qty: item.qty,
        }));

        const syncResponse = await client.post("/cart/sync", {
          items: updateItems,
        });
        finalCart = syncResponse.data.data;
      } else {
        const cartResponse = await client.get("/cart");
        finalCart = cartResponse.data.data;
      }

      // Remove stale guest data first. dbToCart then stores the final populated
      // MongoDB cart back into Redux and localStorage.
      localStorage.removeItem("cart");
      dispatch(dbToCart(finalCart?.items || []));

      setSuccess(response.data.message || "Login Successfully");

      router.push("/checkout");

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg sm:p-8">

        {/* Heading */}
        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-2">
            Sign in to your account
          </p>

        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>

            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* Password */}
          <div>

            <div className="flex items-center justify-between mb-2">

              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <Link
                href="/forgot_password"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>

            </div>

            <div className="relative">

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">

            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
            />

            <label
              htmlFor="remember"
              className="text-sm text-gray-600"
            >
              Remember me
            </label>

          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

        {/* Register */}
        <p className="mt-6 text-center text-sm text-gray-600">

          Don&apos;t have an account?{" "}

          <Link
            href="/register"
            className="font-semibold text-blue-600 hover:underline"
          >
            Create Account
          </Link>

        </p>

      </div>

    </main>
  );
}

