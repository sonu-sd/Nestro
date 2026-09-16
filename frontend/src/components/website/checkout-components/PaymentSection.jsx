"use client";

export default function PaymentSection() {

  const payments = [
    {
      id: "COD",
      title: "Cash on Delivery",
      description: "Pay when your order arrives",
      icon: "💵",
    },
  ];

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">
        Payment Method
      </h2>

      <div className="mt-5 space-y-3">
        {payments.map((payment) => {
          const selected = true;

          return (
            <label
              key={payment.id}
              className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition ${
                selected
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200 hover:border-green-400"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={payment.id}
                checked={selected}
                readOnly
                className="h-4 w-4 accent-green-700"
              />

              <span className="text-xl">{payment.icon}</span>

              <span>
                <span className="block text-sm font-semibold text-gray-900">
                  {payment.title}
                </span>

                <span className="mt-1 block text-xs text-gray-500">
                  {payment.description}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-gray-500">Online payments will be available in a future update.</p>
    </section>
  );
}
