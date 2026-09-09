"use client";

import { client } from "@/utils/helper";
import { useState } from "react";
import { FiLogOut, FiAlertTriangle } from "react-icons/fi";

export default function SignOut() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);

     const response = await client.post("/user/logout")
      console.log("Logout", response.data);

      window.location.href = "/sign_in"

      // Example:
      // router.push("/login");
    } catch (error) {
      console.log("Logout error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#e8e1d9] bg-white p-6">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
          <FiLogOut size={26} />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-[#222]">
          Sign Out
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
          Are you sure you want to sign out of your account?
          You will need to login again to access your profile.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            className="rounded-lg border border-[#ded6ce] px-5 py-2.5 text-sm font-medium text-[#333] hover:bg-[#faf7f4]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60"
          >
            <FiLogOut />

            {loading ? "Signing Out..." : "Sign Out"}
          </button>
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-xl bg-[#faf7f4] p-4 text-left">
          <FiAlertTriangle className="mt-0.5 shrink-0 text-[#996b3f]" />

          <p className="text-xs leading-5 text-gray-500">
            Signing out will end your current session on this
            device.
          </p>
        </div>
      </div>
    </div>
  );
}