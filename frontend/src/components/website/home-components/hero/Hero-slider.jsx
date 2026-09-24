"use client";

import { useState, useEffect } from "react";
import HeroCard from "./Hero-card";

export default function HeroSlider({ heroData }) {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % heroData.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? heroData.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroData.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [heroData.length]);

  return (
    <HeroCard
      slide={heroData[current]}
      heroData={heroData}
      current={current}
      setCurrent={setCurrent}
      nextSlide={nextSlide}
      prevSlide={prevSlide}
    />
  );
}
