import React from "react";
import ReviewCards from "./ReviewCards";
import SubscribeCard from "./SubscribeCard";

export default function Bottomsection({ reviews }) {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-[11px] uppercase tracking-[4px] text-[#8b5e3c]">
        What our customers say
      </p>

      <h2 className="mt-2 text-xl font-medium text-[#1e1e1e]">
        Real stories from our customers
      </h2>

      <ReviewCards reviews={reviews} />
      <SubscribeCard />
    </section>
  );
}
