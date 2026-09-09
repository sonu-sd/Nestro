"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { client } from "@/utils/helper";

export default function OtpVerifyPage() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  // OTP timer
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Handle OTP input
  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    // Only take the last entered number
    newOtp[index] = value.slice(-1);

    setOtp(newOtp);
    setError("");

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const newOtp = ["", "", "", "", "", ""];

    pastedData.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);
    setError("");

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  // Verify OTP
  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpValue = otp.join("");

    if (!email) {
      setError("Email not found. Please register again.");
      return;
    }

    if (otpValue.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await client.post("user/otp_verify", {
        email: email,
        otp: otpValue,
      });

      console.log("OTP VERIFY RESPONSE:", response.data);

      if (response.data.success) {
        setSuccess(
          response.data.message || "OTP verified successfully!"
        );

        // 2 second baad login page
        setTimeout(() => {
          router.push("/sign_in");
        }, 2000);

      } else {
        setError(
          response.data.message || "Invalid OTP"
        );
      }

    } catch (error) {
      console.error("OTP VERIFY ERROR:", error);

      setError(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (!canResend) return;

    try {
      setError("");
      setLoading(true);

      // Backend resend OTP API yahan connect hoga.
      //
      // await fetch(
      //   "http://localhost:5000/api/auth/resend-otp",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       email: "user@email.com",
      //     }),
      //   }
      // );

      setOtp(["", "", "", "", "", ""]);
      setTimer(60);
      setCanResend(false);

      inputRefs.current[0]?.focus();

    } catch (err) {
      setError("Unable to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-lg sm:p-8">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <span className="text-3xl">🔐</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Verify OTP
          </h1>

          <p className="text-gray-500 mt-2">
            Enter the 6-digit OTP sent to your email
          </p>

          <p className="mt-2 text-sm font-medium text-gray-700">
            {email || "Email not found"}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-center text-sm text-green-600">
            {success}
          </div>
        )}

        {/* OTP Form */}
        <form onSubmit={handleSubmit}>

          <div
            className="flex justify-center gap-2 sm:gap-3 mb-6"
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handleChange(index, e.target.value)
                }
                onKeyDown={(e) =>
                  handleKeyDown(index, e)
                }
                className="h-12 w-11 sm:h-14 sm:w-12 rounded-lg border border-gray-300 text-center text-xl font-bold outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Resend */}
        <div className="text-center mt-6">

          {!canResend ? (
            <p className="text-sm text-gray-500">
              Resend OTP in{" "}
              <span className="font-semibold text-blue-600">
                {timer}s
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="text-sm font-semibold text-blue-600 hover:underline disabled:opacity-50"
            >
              Resend OTP
            </button>
          )}

        </div>

        {/* Back to Sign In */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already verified?{" "}
          <Link
            href="/sign_in"
            className="font-semibold text-blue-600 hover:underline"
          >
            Sign In
          </Link>
        </p>

        {/* Back to Register */}
        <p className="text-center text-sm text-gray-500 mt-3">
          Wrong email?{" "}
          <Link
            href="/register"
            className="font-medium text-gray-700 hover:underline"
          >
            Go back
          </Link>
        </p>

      </div>
    </main>
  );
}
