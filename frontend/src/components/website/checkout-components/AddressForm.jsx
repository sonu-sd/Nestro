"use client";

import { useEffect, useState } from "react";

const initialForm = {
  fullName: "",
  mobile: "",
  adressLine: "",
  city: "",
  state: "",
  pincode: "",
  type: "Home",
  isDefault: false,
};

export default function AddressForm({
  editingAddress,
  onSave,
  onCancel,
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (editingAddress) {
      setForm({
        fullName: editingAddress.fullName || "",
        mobile: editingAddress.mobile || "",
        adressLine: editingAddress.adressLine || "",
        city: editingAddress.city || "",
        state: editingAddress.state || "",
        pincode: editingAddress.pincode || "",
        type: editingAddress.type || "Home",
        isDefault: editingAddress.isDefault || false,
      });
    } else {
      setForm(initialForm);
    }
  }, [editingAddress]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "pincode"
            ? value.replace(/\D/g, "").slice(0, 6)
            : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("FORM SUBMIT DATA:", form);

    if (
      !form.fullName.trim() ||
      !form.mobile.trim() ||
      !form.adressLine.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pincode.trim()
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (form.pincode.length !== 6) {
      alert("Please enter a valid 6 digit PIN code");
      return;
    }

    console.log("SENDING TO BACKEND:", form);

    onSave(form);
  };

  return (
    <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-5">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {editingAddress ? "Edit Address" : "Add New Address"}
        </h3>

        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">

          {/* Full Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className="address-input text-gray-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Phone Number
            </label>

            <input
              type="text"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="address-input text-gray-500"
            />
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Address
            </label>

            <textarea
              name="adressLine"
              value={form.adressLine}
              onChange={handleChange}
              rows={3}
              placeholder="House no., street, area"
              className="address-input resize-none p-2 text-gray-500 outline"
            />
          </div>

          {/* City */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              City
            </label>

            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Jaipur"
              className="address-input text-gray-500"
            />
          </div>

          {/* State */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              State
            </label>

            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              className="address-input"
            >
              <option value="">Select State</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Delhi">Delhi</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
            </select>
          </div>

          {/* Pincode */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              PIN Code
            </label>

            <input
              type="text"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              placeholder="302001"
              maxLength={6}
              inputMode="numeric"
              autoComplete="postal-code"
              className="address-input text-gray-500"
            />
          </div>

          {/* Address Type */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Address Type
            </label>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="address-input"
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Default */}
        <label className="mt-4 flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            name="isDefault"
            checked={form.isDefault}
            onChange={handleChange}
            className="h-4 w-4 accent-green-700"
          />

          <span className="text-sm text-gray-700">
            Set as default address
          </span>
        </label>

        {/* Buttons */}
        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
          >
            {editingAddress ? "Update Address" : "Save Address"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}