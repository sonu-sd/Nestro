"use client";

import { useState } from "react";
import {
  FiMapPin,
  FiPlus,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

const initialAddresses = [
  {
    id: 1,
    title: "Home",
    name: "John Doe",
    address: "123 Main Street, New Delhi",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
    phone: "+91 98765 43210",
    default: true,
  },
  {
    id: 2,
    title: "Office",
    name: "John Doe",
    address: "45 Business Park, Gurugram",
    city: "Gurugram",
    state: "Haryana",
    pincode: "122001",
    phone: "+91 98765 43210",
    default: false,
  },
];

export default function Addresses() {
  const [addresses, setAddresses] = useState(initialAddresses);

  const deleteAddress = (id) => {
    setAddresses((prev) =>
      prev.filter((address) => address.id !== id)
    );
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
                Manage your delivery addresses
              </p>
            </div>
          </div>

          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg bg-[#222] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#333]"
          >
            <FiPlus />
            Add Address
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="rounded-2xl border border-[#e8e1d9] bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[#222]">
                  {address.title}
                </h3>

                {address.default && (
                  <span className="rounded-full bg-[#f4eadf] px-2.5 py-1 text-[10px] font-medium text-[#996b3f]">
                    Default
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-lg p-2 text-gray-500 hover:bg-[#faf7f4]"
                >
                  <FiEdit2 size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => deleteAddress(address.id)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-1.5 text-sm text-gray-600">
              <p className="font-medium text-[#333]">
                {address.name}
              </p>

              <p>{address.address}</p>
              <p>
                {address.city}, {address.state} - {address.pincode}
              </p>
              <p>{address.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}