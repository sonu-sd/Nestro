import Link from "next/link";
import { FiClock, FiMail, FiMapPin, FiPhone } from "react-icons/fi";

const contacts = [
  {
    icon: FiMail,
    title: "Email support",
    value: "support@nestro.example",
    note: "Replies within one business day",
  },
  {
    icon: FiPhone,
    title: "Call us",
    value: "+91 98765 43210",
    note: "Monday–Saturday, 10 AM–7 PM",
  },
  {
    icon: FiMapPin,
    title: "Showrooms",
    value: "Jaipur & Bengaluru",
    note: "Contact us before visiting",
  },
];

export const metadata = { title: "Contact Nestro | Furniture Support" };

export default function ContactPage() {
  return (
    <main className="bg-[#f4f0eb] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <section className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#2c1a10] px-6 py-10 text-white sm:px-10 lg:grid lg:grid-cols-[1.15fr_.85fr] lg:gap-10 lg:px-14 lg:py-14">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#D2A779]">
            We are here to help
          </p>
          <h1 className="mt-4 text-3xl font-light leading-tight sm:text-4xl lg:text-5xl">
            Let&apos;s make your home feel{" "}
            <span className="italic text-[#E8A46C]">just right.</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/65">
            Questions about a product, delivery, assembly, or an existing order?
            Choose the support option that works for you.
          </p>
        </div>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 lg:mt-0">
          <FiClock className="text-2xl text-[#E8A46C]" />
          <h2 className="mt-4 font-semibold">Customer care hours</h2>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Monday to Saturday
            <br />
            10:00 AM – 7:00 PM IST
          </p>
          <Link
            href="/profile"
            className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-[#A46D40] px-5 text-sm font-semibold text-white"
          >
            View your orders
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-6 grid max-w-6xl gap-3 sm:grid-cols-3 sm:gap-5">
        {contacts.map(({ icon: Icon, title, value, note }) => (
          <article
            key={title}
            className="rounded-2xl border border-[#e5d8ca] bg-white p-5 sm:p-6"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f4eadf] text-[#996b3f]">
              <Icon size={20} />
            </span>
            <h2 className="mt-4 font-semibold text-[#29211B]">{title}</h2>
            <p className="mt-2 text-sm font-medium text-[#8B5E3C]">{value}</p>
            <p className="mt-1 text-xs leading-5 text-[#76685C]">{note}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-8 max-w-6xl rounded-2xl border border-[#e5d8ca] bg-white p-5 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8B5E3C]">
          Quick answers
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-[#29211B]">
          Before you contact us
        </h2>
        <div className="mt-5 divide-y divide-[#eee5dc]">
          {[
            [
              "Where can I track my order?",
              "Sign in and open My Orders from your profile.",
            ],
            [
              "Can I update my delivery address?",
              "Saved addresses can be managed from your profile before placing an order.",
            ],
            [
              "How do returns work?",
              "Contact support with your order number and the item details.",
            ],
          ].map(([question, answer]) => (
            <details key={question} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-[#35261E]">
                {question}
                <span className="text-[#8B5E3C] group-open:rotate-45">+</span>
              </summary>
              <p className="pt-3 text-sm leading-6 text-[#76685C]">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
