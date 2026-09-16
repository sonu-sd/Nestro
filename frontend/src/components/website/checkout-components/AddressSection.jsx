"use client";

import { useEffect, useState } from "react";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";
import { client } from "@/utils/helper";



export default function AddressSection() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Select address
  const handleSelect = (id) => {
    setSelectedAddress(id);
  };

  // Delete address
  const handleDelete = async (id) => {
  const confirmDelete = window.confirm( "Are you sure you want to delete this address?");

  if (!confirmDelete) return;

  try {
    const response = await client.delete(`/user/addresses/${id}`);
    const addressList = response.data.addresses || [];

    setAddresses(addressList);

    if (selectedAddress === id) {
      const defaultAddress = addressList.find(
        (address) => address.isDefault
      );

      setSelectedAddress(defaultAddress?._id || null);
    }
  } catch (error) {
    console.error("DELETE ADDRESS ERROR:", error);
    console.log("BACKEND ERROR:", error.response?.data);

    alert(
      error.response?.data?.message || "Failed to delete address"
    );
  }
};

  // Edit address
  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  // Save / Update address
const handleSave = async (formData) => {
  try {
    if (editingAddress) {
      const response = await client.put(`/user/addresses/${editingAddress._id}`, formData);
      setAddresses(response.data.addresses || []);
    } else {
      const response = await client.post( "/user/addresses", formData);

      const addressList = response.data.addresses || [];
      setAddresses(addressList);

      const newAddress = addressList[addressList.length - 1];

      if (newAddress) {
        setSelectedAddress(newAddress._id);
      }
    }

    setShowForm(false);
    setEditingAddress(null);

  } catch (error) {
    console.error("SAVE ADDRESS ERROR:", error);
    console.log("BACKEND ERROR:", error.response?.data);

    alert(
      error.response?.data?.message || "Failed to save address"
    );
  }
};

  useEffect(() => {
    let isActive = true;

    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await client.get("/user/addresses");
        const addressList = response.data.addresses || [];

        if (!isActive) return;

        setAddresses(addressList);
        const defaultAddress = addressList.find((address) => address.isDefault);
        setSelectedAddress(defaultAddress?._id || null);
      } catch (error) {
        console.error(
          "Address fetch error:",
          error.response?.data || error.message
        );
      }
    }, 0);

    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Delivery Address
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Select an address for delivery
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingAddress(null);
            setShowForm(true);
          }}
          className="rounded-lg border border-green-700 px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-50"
        >
          + Add New Address
        </button>
      </div>

      {/* Address List */}
      <div className="mt-5 space-y-4">
        {addresses.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 py-10 text-center">
            <p className="text-sm text-gray-500">
              No saved addresses
            </p>

            <button
              onClick={() => setShowForm(true)}
              className="mt-3 text-sm font-semibold text-green-700"
            >
              Add an address
            </button>
          </div>
        ) : (
          addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              selected={selectedAddress === address._id}
              onSelect={handleSelect}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <AddressForm
          key={editingAddress?._id || "new-address"}
          editingAddress={editingAddress}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingAddress(null);
          }}
        />
      )}
    </section>
  );
}
