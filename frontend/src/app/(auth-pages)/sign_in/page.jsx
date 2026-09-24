"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import AuthShell, { AuthInput } from "@/components/auth/AuthShell";
import { dbToCart } from "@/redux/features/Cartslice";
import { client } from "@/utils/helper";

export default function SignInPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

  const continueVerification = async () => {
    if (!pendingEmail) return;
    setLoading(true);
    try {
      await client.post("/user/resend-otp", { email: pendingEmail });
    } catch (requestError) {
      if (requestError.response?.status !== 429) {
        setError(
          requestError.response?.data?.message ||
            "Unable to send a verification code.",
        );
        setLoading(false);
        return;
      }
    }
    const nextPath =
      new URLSearchParams(window.location.search).get("next") || "/profile";
    router.push(
      `/otp_verify?email=${encodeURIComponent(pendingEmail)}&next=${encodeURIComponent(nextPath)}`,
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setPendingEmail("");
    const form = new FormData(event.currentTarget);
    const payload = {
      email: form.get("email")?.trim(),
      password: form.get("password"),
    };
    if (!payload.email || !payload.password)
      return setError("Please enter your email and password.");

    try {
      setLoading(true);
      await client.post("/user/login", payload);
      let localCart = null;
      try {
        localCart = JSON.parse(localStorage.getItem("cart"));
      } catch {
        localStorage.removeItem("cart");
        localStorage.removeItem("nestro_cart_owner");
      }
      const localItems = Array.isArray(localCart?.items)
        ? localCart.items.filter(
            (item) =>
              /^[a-f\d]{24}$/i.test(String(item?._id || "")) &&
              Number.isInteger(Number(item.qty)) &&
              Number(item.qty) >= 1 &&
              Number(item.qty) <= 5,
          )
        : [];
      let finalCart;
      if (localItems.length && !localStorage.getItem("nestro_cart_owner")) {
        const merge = await client.post("/cart/merge", {
          items: localItems.map((item) => ({
            productId: item._id,
            qty: Number(item.qty || 1),
          })),
        });
        finalCart = merge.data.data;
      } else {
        finalCart = (await client.get("/cart")).data.data;
      }
      localStorage.removeItem("cart");
      localStorage.setItem("nestro_cart_owner", "signed-in");
      dispatch(dbToCart(finalCart?.items || []));
      const nextPath = new URLSearchParams(window.location.search).get("next");
      router.replace(
        nextPath?.startsWith("/") && !nextPath.startsWith("//")
          ? nextPath
          : "/profile",
      );
    } catch (requestError) {
      const data = requestError.response?.data;
      if (data?.code === "EMAIL_NOT_VERIFIED")
        setPendingEmail(data.email || payload.email);
      setError(data?.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell active="signin">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#17120E] sm:text-4xl">
          Welcome back
        </h1>
        <p className="mt-3 text-base text-[#667085]">
          Sign in to your Nestro account to continue.
        </p>
      </div>
      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <p>{error}</p>
          {pendingEmail && (
            <button
              type="button"
              disabled={loading}
              onClick={continueVerification}
              className="mt-3 font-bold text-[#8B5E3C] underline underline-offset-2 disabled:opacity-60"
            >
              Verify account now
            </button>
          )}
        </div>
      )}
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <AuthInput
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
        />
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-[#57473B]"
            >
              Password
            </label>
            <Link
              href="/contact"
              className="text-xs font-semibold text-[#8B5E3C] hover:underline"
            >
              Need help signing in?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              required
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="min-h-14 w-full rounded-xl border border-[#DCCCBD] bg-white px-4 pr-14 text-sm outline-none transition focus:border-[#9C6439] focus:ring-4 focus:ring-[#9C6439]/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-1 top-1 flex h-12 w-12 items-center justify-center text-[#667085] hover:text-[#8B5E3C]"
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="min-h-14 w-full rounded-xl bg-[#A46D40] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#875733] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-7 text-center text-sm text-[#667085]">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => router.push(`/register${window.location.search}`)}
          className="font-semibold text-[#8B5E3C] hover:underline"
        >
          Create one free
        </button>
      </p>
    </AuthShell>
  );
}
