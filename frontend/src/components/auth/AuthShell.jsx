"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Armchair, BadgePercent, PackageCheck, Truck } from "lucide-react";

const benefits = [
  { icon: Truck, text: "Delivery options available at checkout" },
  { icon: PackageCheck, text: "Track your orders from your account" },
  { icon: BadgePercent, text: "Keep your cart synced across devices" },
];

export default function AuthShell({ active, children }) {
  const router = useRouter();
  const goTo = (path) => {
    const query = window.location.search;
    router.push(`${path}${query}`);
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] lg:grid lg:grid-cols-[minmax(380px,0.86fr)_minmax(520px,1.14fr)]">
      <aside className="relative flex min-h-[620px] flex-col overflow-hidden bg-[#2A180D] px-6 py-8 text-white sm:px-10 lg:min-h-screen xl:px-20 xl:py-14">
        <div className="absolute -left-32 bottom-12 h-80 w-80 rounded-full bg-[#A66D3D]/10 blur-3xl" />
        <div className="absolute -right-28 top-28 h-72 w-72 rounded-full bg-[#D7A06E]/10 blur-3xl" />
        <Link
          href="/"
          className="relative z-10 mx-auto w-fit text-lg font-bold uppercase tracking-[0.42em] text-white lg:mx-0 lg:text-xl"
        >
          Nestro<span className="text-[#C98A55]">.</span>
        </Link>
        <div className="relative z-10 my-auto max-w-xl py-8 lg:py-10">
          <div className="mx-auto mb-8 flex h-24 w-36 items-end justify-center rounded-[2rem] bg-[#8B5E3C]/18 text-[#D6A273] shadow-[inset_0_-18px_40px_rgba(0,0,0,0.18)] lg:mx-0 lg:mb-10 lg:h-28 lg:w-40">
            <Armchair size={82} strokeWidth={1.15} />
          </div>
          <h1 className="mx-auto max-w-lg text-center text-3xl font-light leading-[1.12] tracking-tight sm:text-4xl lg:mx-0 lg:text-left lg:text-5xl xl:text-6xl">
            Your <span className="italic text-[#E8A46C]">Dream Home</span>
            <br />
            Starts Here
          </h1>
          <p className="mt-5 text-center text-sm leading-7 text-[#D7C8BC] lg:mt-7 lg:text-left lg:text-base">
            Find furniture for a home that feels like you.
          </p>
          <div className="mt-7 space-y-3 lg:mt-10 lg:space-y-4">
            {benefits.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-4 text-xs text-[#E8DDD4] sm:text-sm"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6F4328] text-[#E3AA76] lg:h-11 lg:w-11">
                  <Icon size={18} />
                </span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 hidden text-xs text-[#A99587] lg:block">
          Secure account access · Nestro Furniture
        </p>
      </aside>

      <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 lg:px-12">
        <div className="w-full max-w-xl">
          <div className="mb-8 hidden items-center justify-between">
            <Link
              href="/"
              className="text-lg font-bold uppercase tracking-[0.35em] text-[#2A180D]"
            >
              Nestro<span className="text-[#A86B3B]">.</span>
            </Link>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEE2D7] text-[#8B5E3C]">
              <Armchair size={25} />
            </span>
          </div>
          <div
            className="mb-10 flex border-b border-[#E0D3C7]"
            role="tablist"
            aria-label="Account access"
          >
            <button
              type="button"
              role="tab"
              aria-selected={active === "signin"}
              onClick={() => goTo("/sign_in")}
              className={`min-h-12 px-1 text-sm font-semibold ${active === "signin" ? "border-b-2 border-[#A66B3D] text-[#8B5E3C]" : "text-[#667085]"}`}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={active === "register"}
              onClick={() => goTo("/register")}
              className={`ml-9 min-h-12 px-1 text-sm font-semibold ${active === "register" ? "border-b-2 border-[#A66B3D] text-[#8B5E3C]" : "text-[#667085]"}`}
            >
              Create account
            </button>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}

export function AuthInput({ label, hint, ...props }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label
          htmlFor={props.name}
          className="text-sm font-medium text-[#57473B]"
        >
          {label}
        </label>
        {hint}
      </div>
      <input
        {...props}
        id={props.name}
        required
        className="min-h-14 w-full rounded-xl border border-[#DCCCBD] bg-white px-4 text-sm text-[#2B211A] outline-none transition placeholder:text-[#AAA097] focus:border-[#9C6439] focus:ring-4 focus:ring-[#9C6439]/10"
      />
    </div>
  );
}
