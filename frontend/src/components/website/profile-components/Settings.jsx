"use client";

import { useState } from "react";
import { FiLock, FiSettings } from "react-icons/fi";
import { client } from "@/utils/helper";

export default function Settings() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (form.newPassword.length < 8)
      return setError("New password must be at least 8 characters.");
    if (form.newPassword !== form.confirmPassword)
      return setError("New passwords do not match.");
    try {
      setSaving(true);
      const response = await client.put("/user/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setMessage(response.data.message || "Password changed successfully.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to change your password.",
      );
    } finally {
      setSaving(false);
    }
  };

  const updateField = (event) =>
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#e8e1d9] bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f4eadf] text-[#996b3f]">
            <FiSettings size={22} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#222]">
              Account Settings
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your account security
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#e8e1d9] bg-white p-6">
        <div className="flex items-center gap-3">
          <FiLock className="text-[#996b3f]" />
          <div>
            <h3 className="font-semibold text-[#222]">Change Password</h3>
            <p className="mt-1 text-xs text-gray-500">
              Use at least 8 characters for your new password
            </p>
          </div>
        </div>
        {message && (
          <p
            role="status"
            className="mt-5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {message}
          </p>
        )}
        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="mt-6 grid max-w-xl gap-4">
          <PasswordInput
            label="Current Password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={updateField}
            autoComplete="current-password"
          />
          <PasswordInput
            label="New Password"
            name="newPassword"
            value={form.newPassword}
            onChange={updateField}
            autoComplete="new-password"
          />
          <PasswordInput
            label="Confirm New Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={updateField}
            autoComplete="new-password"
          />
          <button
            type="submit"
            disabled={saving}
            className="mt-2 w-fit rounded-lg bg-[#222] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#333] disabled:opacity-60"
          >
            {saving ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

function PasswordInput({ label, ...props }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[#333]">
      {label}
      <input
        {...props}
        type="password"
        required
        className="min-h-12 rounded-xl border border-[#ded6ce] px-4 text-sm outline-none focus:border-[#996b3f] focus:ring-4 focus:ring-[#996b3f]/10"
      />
    </label>
  );
}
