"use client";

import { useState } from "react";
import { FiUser, FiEdit2 } from "react-icons/fi";
import { client } from "@/utils/helper";

export default function PersonalInfo({ user, onUserUpdated }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: user?.name || "",
    mobile: user?.mobile || "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!form.name.trim()) return setError("Please enter your full name.");
    try {
      setSaving(true);
      const response = await client.put("/user/update-profile", {
        name: form.name.trim(),
        mobile: form.mobile.trim(),
      });
      setForm({
        name: response.data.user?.name || "",
        mobile: response.data.user?.mobile || "",
      });
      onUserUpdated?.(response.data.user);
      setMessage("Personal information updated successfully.");
      setEditing(false);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to update your profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  const cancelEditing = () => {
    setForm({ name: user?.name || "", mobile: user?.mobile || "" });
    setError("");
    setEditing(false);
  };

  return (
    <div className="rounded-2xl border border-[#e8e1d9] bg-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f4eadf] text-[#996b3f]">
            <FiUser size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#222]">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage your personal details
            </p>
          </div>
        </div>

        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 rounded-lg border border-[#ded6ce] px-4 py-2 text-sm hover:bg-[#faf7f4]"
          >
            <FiEdit2 size={14} />
            Edit
          </button>
        )}
      </div>

      <div className="my-6 border-t border-[#eee8e2]" />

      {message && (
        <p
          role="status"
          className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {message}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={!editing}
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={user?.email || ""}
            onChange={() => {}}
            disabled
          />

          <Input
            label="Phone Number"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>

        {editing && (
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#222] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#333]"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={cancelEditing}
              className="rounded-lg border border-[#ded6ce] px-5 py-2.5 text-sm hover:bg-[#faf7f4]"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

function Input({ label, name, type = "text", value, onChange, disabled }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#333]">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
          disabled
            ? "border-[#eee8e2] bg-[#faf9f7] text-gray-500"
            : "border-[#ded6ce] bg-white focus:border-[#996b3f]"
        }`}
      />
    </div>
  );
}
