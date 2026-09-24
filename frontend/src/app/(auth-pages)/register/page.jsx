"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import AuthShell, { AuthInput } from "@/components/auth/AuthShell";
import { client } from "@/utils/helper";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    const name = form.get("name")?.trim();
    const email = form.get("email")?.trim();
    const password = form.get("password");
    const confirmPassword = form.get("confirmPassword");
    if (!name || !email || !password || !confirmPassword)
      return setError("Please fill all fields.");
    if (password.length < 8)
      return setError("Password must be at least 8 characters.");
    if (password !== confirmPassword)
      return setError("Passwords do not match.");
    try {
      setLoading(true);
      await client.post("/user/register", { name, email, password });
      const nextPath = new URLSearchParams(window.location.search).get("next");
      const nextQuery =
        nextPath?.startsWith("/") && !nextPath.startsWith("//")
          ? `&next=${encodeURIComponent(nextPath)}`
          : "";
      router.push(`/otp_verify?email=${encodeURIComponent(email)}${nextQuery}`);
    } catch (requestError) {
      const data = requestError.response?.data;
      if (data?.code === "ACCOUNT_PENDING_VERIFICATION")
        setPendingEmail(data.email || email);
      setError(
        data?.message || "Unable to create your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell active="register">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#17120E] sm:text-4xl">
          Create your account
        </h1>
        <p className="mt-3 text-base text-[#667085]">
          Save your cart, track orders and manage delivery details.
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
              Continue verification
            </button>
          )}
        </div>
      )}
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <AuthInput
          label="Full name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Your full name"
        />
        <AuthInput
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
        />
        <PasswordField
          label="Password"
          name="password"
          show={showPassword}
          toggle={() => setShowPassword((value) => !value)}
          placeholder="At least 8 characters"
        />
        <PasswordField
          label="Confirm password"
          name="confirmPassword"
          show={showConfirmPassword}
          toggle={() => setShowConfirmPassword((value) => !value)}
          placeholder="Enter the same password again"
        />
        <p className="text-xs leading-5 text-[#806F61]">
          By creating an account, you agree to use accurate information for
          orders and delivery.
        </p>
        <button
          type="submit"
          disabled={loading}
          className="min-h-14 w-full rounded-xl bg-[#A46D40] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#875733] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-7 text-center text-sm text-[#667085]">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => router.push(`/sign_in${window.location.search}`)}
          className="font-semibold text-[#8B5E3C] hover:underline"
        >
          Sign in
        </button>
      </p>
    </AuthShell>
  );
}

function PasswordField({ label, name, show, toggle, placeholder }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-[#57473B]"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          required
          type={show ? "text" : "password"}
          autoComplete="new-password"
          placeholder={placeholder}
          className="min-h-14 w-full rounded-xl border border-[#DCCCBD] bg-white px-4 pr-14 text-sm outline-none transition focus:border-[#9C6439] focus:ring-4 focus:ring-[#9C6439]/10"
        />
        <button
          type="button"
          onClick={toggle}
          aria-label={
            show ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`
          }
          className="absolute right-1 top-1 flex h-12 w-12 items-center justify-center text-[#667085] hover:text-[#8B5E3C]"
        >
          {show ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </div>
  );
}
