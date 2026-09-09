"use client";

import { useState } from "react";
import { FiUser, FiEdit2 } from "react-icons/fi";

export default function PersonalInfo() {
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+91 98765 43210",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Updated profile:", form);

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

      <form onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            disabled={!editing}
          />

          <Input
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            disabled={!editing}
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            disabled={!editing}
          />

          <Input
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>

        {editing && (
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="rounded-lg bg-[#222] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#333]"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => setEditing(false)}
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

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  disabled,
}) {
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