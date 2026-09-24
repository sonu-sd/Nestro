"use client";

import { useCallback, useEffect, useState } from "react";
import { FiEdit2, FiMapPin, FiPlus, FiTrash2 } from "react-icons/fi";
import AddressForm from "@/components/website/checkout-components/AddressForm";
import { client } from "@/utils/helper";


export default function Addresses() {

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const loadAddresses = useCallback(async () => {
    try {
      setError("");
      const response = await client.get("/user/addresses");
      setAddresses(response.data.addresses || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load your addresses.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadAddresses();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadAddresses]);

  const saveAddress = async (formData) => {
    try {
      setError("");
      const response = editingAddress
        ? await client.put(`/user/addresses/${editingAddress._id}`, formData)
        : await client.post("/user/addresses", formData);
      setAddresses(response.data.addresses || []);
      setEditingAddress(null);
      setShowForm(false);
    } catch (requestError) {
      const message =
        requestError.response?.data?.message || "Unable to save this address.";
      setError(message);
      throw new Error(message);
    }
  };

  const deleteAddress = async (id) => {
    if (!window.confirm("Delete this saved address?")) return;
    try {
      setError("");
      const response = await client.delete(`/user/addresses/${id}`);
      setAddresses(response.data.addresses || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to delete this address.",
      );
    }
  };

  const makeDefault = async (id) => {
    try {
      setError("");
      const response = await client.patch(`/user/addresses/${id}/default`);
      setAddresses(response.data.addresses || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to update the default address.",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#e8e1d9] bg-white p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f4eadf] text-[#996b3f]">
              <FiMapPin size={22} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#222]">
                My Addresses
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage the delivery addresses saved to your account
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingAddress(null);
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#222] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#333]"
          >
            <FiPlus />
            Add Address
          </button>
        </div>
        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        {showForm && (
          <AddressForm
            key={editingAddress?._id || "new-address"}
            editingAddress={editingAddress}
            onSave={saveAddress}
            onCancel={() => {
              setShowForm(false);
              setEditingAddress(null);
            }}
          />
        )}
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-48 animate-pulse rounded-2xl bg-white" />
          <div className="h-48 animate-pulse rounded-2xl bg-white" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#d8cabc] bg-white p-10 text-center text-sm text-gray-500">
          No saved addresses yet. Add one now and it will also be available at
          checkout.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <article
              key={address._id}
              className="rounded-2xl border border-[#e8e1d9] bg-white p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-[#222]">
                      {address.fullName}
                    </h3>
                    {address.isDefault && (
                      <span className="rounded-full bg-[#f4eadf] px-2.5 py-1 text-[10px] font-medium text-[#996b3f]">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="mt-4 space-y-1.5 text-sm text-gray-600">
                    <p>{address.adressLine}</p>
                    <p>
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p>{address.country || "India"}</p>
                    <p className="font-medium text-[#333]">{address.mobile}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    aria-label="Edit address"
                    onClick={() => {
                      setEditingAddress(address);
                      setShowForm(true);
                    }}
                    className="rounded-lg p-2 text-gray-500 hover:bg-[#faf7f4]"
                  >
                    <FiEdit2 size={15} />
                  </button>
                  <button
                    type="button"
                    aria-label="Delete address"
                    onClick={() => deleteAddress(address._id)}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
              {!address.isDefault && (
                <button
                  type="button"
                  onClick={() => makeDefault(address._id)}
                  className="mt-5 text-xs font-semibold text-[#8b5e3c] hover:underline"
                >
                  Set as default
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
