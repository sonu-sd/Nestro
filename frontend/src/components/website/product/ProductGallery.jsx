"use client";

import { useState } from "react";
import AppImage from "@/components/ui/AppImage";

export default function ProductGallery({ product }) {
  const images = [
    ...new Set([product.thumbnail, ...(product.images || [])].filter(Boolean)),
  ];
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-[#E7D9C9] bg-[#F5EFE8]">
        <AppImage
          src={images[selected]}
          alt={`${product.title} — view ${selected + 1}`}
          width={600}
          height={600}
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="h-[600px] w-full object-cover"
          priority
        />
      </div>
      {images.length > 1 && (
        <div
          className="grid grid-cols-5 gap-2 sm:grid-cols-6"
          aria-label="Product images"
        >
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-pressed={selected === index}
              className={`overflow-hidden rounded-xl border-2 bg-[#F5EFE8] ${selected === index ? "border-[#8B5E3C]" : "border-transparent hover:border-[#C9AE94]"}`}
            >
              <AppImage
                src={image}
                alt=""
                width={180}
                height={180}
                sizes="120px"
                className="aspect-square w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
