import React from "react";

export default function SubscribeCard() {
  return (
    <div className="my-8 flex flex-col gap-6 rounded-2xl bg-[#1a1208] p-6 text-white sm:p-8 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-[11px] uppercase tracking-[2px] text-[#C6A27E]">
          Stay in the loop
        </p>

        <h2 className=" text-[20px] font-medium">
          Design tips & {""}
          <span className="italic font-light text-[#D6BFA7]">new arrivals</span>
        </h2>

        <p className=" max-w-xl text-[12px] leading-7 text-[#ffffff8c]">
          Join 8,000 subscribers who get exclusive first looks.
        </p>
      </div>

      <div>
        <div className="mt-4 flex w-full max-w-xl flex-col overflow-hidden rounded-xl border border-[#4A382D] bg-[#3A2B20] sm:flex-row">
          <input
            type="email"
            placeholder="Your email address"
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-[11px] text-white placeholder:text-[#ffffff70] outline-none sm:px-6"
          />

          <button className="bg-[#9D6C41] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#8B5E3C]">
            Subscribe
          </button>
        </div>
        <p className="mt-1 text-[11px] text-[#ffffff70] flex justify-end">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
