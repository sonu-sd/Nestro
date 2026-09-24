"use client";

import { useState } from "react";
import { FiMapPin, FiX } from "react-icons/fi";
import { client } from "@/utils/helper";

const initialForm = (address) => ({
  fullName: address?.fullName || "",
  mobile: address?.mobile || "",
  adressLine: address?.adressLine || "",
  city: address?.city || "",
  state: address?.state || "",
  pincode: address?.pincode || "",
  type: address?.type || "Home",
  isDefault: address?.isDefault || false,
});

const fieldClass = "mt-1.5 w-full rounded-xl border border-[#ddd2c6] bg-white px-4 py-3 text-sm text-[#29241f] outline-none transition placeholder:text-gray-400 focus:border-[#8b5e3c] focus:ring-2 focus:ring-[#8b5e3c]/15";

export default function AddressForm({ editingAddress, onSave, onCancel }) {
  const [form, setForm] = useState(() => initialForm(editingAddress));
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [locationMessage, setLocationMessage] = useState("");

  const handleChange = ({ target }) => {
    const { name, value, type, checked } = target;
    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked :
        name === "pincode" ? value.replace(/\D/g, "").slice(0, 6) :
        name === "mobile" ? value.replace(/\D/g, "").slice(0, 10) : value,
    }));
  };

  const useCurrentLocation = () => {
    setError("");
    setLocationMessage("");
    if (!navigator.geolocation || !window.isSecureContext) {
      setError("Location needs HTTPS or localhost and a browser with location support. Enter your address manually.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await client.get("/user/addresses/reverse-geocode", {
            params: { lat: coords.latitude, lon: coords.longitude },
          });
          const found = response.data.address;
          setForm((previous) => ({
            ...previous,
            adressLine: found.adressLine || previous.adressLine,
            city: found.city || previous.city,
            state: found.state || previous.state,
            pincode: found.pincode || previous.pincode,
          }));
          setLocationMessage("Location added. Check the house number, street and PIN before saving.");
        } catch (requestError) {
          setError(requestError.response?.data?.message || "Location lookup failed. Enter your address manually.");
        } finally {
          setLocating(false);
        }
      },
      (locationError) => {
        setLocating(false);
        setError(locationError.code === 1
          ? "Location access was denied. Allow it in your browser or enter your address manually."
          : "We could not get your location. Enter your address manually or try again.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (["fullName", "mobile", "adressLine", "city", "state", "pincode"]
      .some((key) => !form[key].trim())) {
      setError("Fill in all required fields before saving.");
      return;
    }
    if (!/^\d{10}$/.test(form.mobile)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setError("Enter a valid 6-digit PIN code.");
      return;
    }
    try {
      setSubmitting(true);
      await onSave({
        ...form, fullName: form.fullName.trim(), adressLine: form.adressLine.trim(),
        city: form.city.trim(), state: form.state.trim(),
      });
    } catch (requestError) {
      setError(requestError.message || "Unable to save this address.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-5 rounded-2xl border border-[#e5d8ca] bg-[#fffdfa] p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[#29241f]">{editingAddress ? "Edit address" : "Add an address"}</h3>
          <p className="mt-1 text-sm text-gray-600">Use your location to fill details, or type them yourself.</p>
        </div>
        <button type="button" onClick={onCancel} aria-label="Close address form"
          className="rounded-lg p-2 text-gray-500 hover:bg-[#f4eadf] hover:text-[#29241f]">
          <FiX aria-hidden="true" />
        </button>
      </div>
      <button type="button" onClick={useCurrentLocation} disabled={locating || submitting}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#b78a66] bg-[#f8f0e9] px-4 py-3 text-sm font-semibold text-[#714929] transition hover:bg-[#f1e3d6] disabled:cursor-wait disabled:opacity-60 sm:w-auto">
        <FiMapPin aria-hidden="true" /> {locating ? "Finding your address…" : "Use my current location"}
      </button>
      <p className="mt-2 text-xs text-gray-500">Your browser will ask for location access. Please verify the address before saving.</p>

      <form onSubmit={handleSubmit} className="mt-5" noValidate>
        {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {locationMessage && <p role="status" className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">{locationMessage}</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="address-fullName" className="text-sm font-medium text-[#44372e]">Full name *</label>
            <input id="address-fullName" name="fullName" autoComplete="name" required value={form.fullName}
              onChange={handleChange} placeholder="Name of recipient" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="address-mobile" className="text-sm font-medium text-[#44372e]">Mobile number *</label>
            <input id="address-mobile" name="mobile" type="tel" inputMode="numeric" autoComplete="tel-national"
              required maxLength={10} value={form.mobile} onChange={handleChange}
              placeholder="10-digit mobile number" className={fieldClass} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="address-line" className="text-sm font-medium text-[#44372e]">House / flat, street and area *</label>
            <textarea id="address-line" name="adressLine" autoComplete="street-address" required rows={2}
              value={form.adressLine} onChange={handleChange} placeholder="Flat no., building, street, landmark"
              className={fieldClass + " resize-y"} />
            <p className="mt-1 text-xs text-gray-500">GPS may miss your house number. Add it here if needed.</p>
          </div>
          <div>
            <label htmlFor="address-city" className="text-sm font-medium text-[#44372e]">City / town *</label>
            <input id="address-city" name="city" autoComplete="address-level2" required value={form.city}
              onChange={handleChange} placeholder="City or town" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="address-state" className="text-sm font-medium text-[#44372e]">State *</label>
            <input id="address-state" name="state" autoComplete="address-level1" required value={form.state}
              onChange={handleChange} placeholder="State or union territory" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="address-pincode" className="text-sm font-medium text-[#44372e]">PIN code *</label>
            <input id="address-pincode" name="pincode" inputMode="numeric" autoComplete="postal-code"
              required maxLength={6} value={form.pincode} onChange={handleChange}
              placeholder="6-digit PIN code" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="address-type" className="text-sm font-medium text-[#44372e]">Save as</label>
            <select id="address-type" name="type" value={form.type} onChange={handleChange} className={fieldClass}>
              <option value="Home">Home</option><option value="Work">Work</option><option value="Other">Other</option>
            </select>
          </div>
        </div>
        <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-[#44372e]">
          <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange}
            className="h-4 w-4 accent-[#8b5e3c]" /> Set as my default delivery address
        </label>
        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#e8ddd3] pt-5 sm:flex-row">
          <button type="button" onClick={onCancel} disabled={submitting}
            className="rounded-xl border border-[#ddd2c6] bg-white px-5 py-3 text-sm font-semibold text-[#44372e] hover:bg-[#f8f0e9]">Cancel</button>
          <button type="submit" disabled={submitting || locating}
            className="rounded-xl bg-[#29241f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#44372e] disabled:cursor-wait disabled:opacity-60">
            {submitting ? "Saving…" : editingAddress ? "Update address" : "Save address"}
          </button>
        </div>
      </form>
    </section>
  );
}
