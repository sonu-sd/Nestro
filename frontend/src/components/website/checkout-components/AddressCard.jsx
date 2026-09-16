"use client";

export default function AddressCard({
  address,
  selected,
  onSelect,
  onEdit,
  onDelete,
}) {
  return (
    <div
      className={`relative rounded-xl border p-4 transition ${
        selected
          ? "border-green-600 bg-green-50"
          : "border-gray-200 bg-white hover:border-green-400"
      }`}
    >

      {/* Select Address */}
      <div className="flex items-start gap-3 text-black">

        <input
          type="radio"
          name="selectedAddress"
          checked={selected}
          onChange={() => onSelect(address._id)}
          className="mt-1 h-4 w-4 accent-green-700"
        />

        <div className="flex-1">

          <div className="flex flex-wrap items-center gap-2">

            <h3 className="font-semibold text-gray-900">
              {address.fullName}
            </h3>

            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
              {address.type || "Home"}
            </span>

            {address.isDefault && (
              <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-medium text-green-700">
                Default
              </span>
            )}

          </div>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            {address.adressLine}
            <br />
            {address.city}, {address.state} - {address.pincode}
          </p>

          <p className="mt-2 text-sm font-medium text-gray-700">
            {address.mobile}
          </p>

        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-4 border-t pt-3 pl-7">

        <button
          type="button"
          onClick={() => onEdit(address)}
          className="text-sm font-semibold text-green-700 hover:text-green-800"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(address._id)}
          className="text-sm font-semibold text-red-600 hover:text-red-700"
        >
          Delete
        </button>

      </div>

    </div>
  );
}