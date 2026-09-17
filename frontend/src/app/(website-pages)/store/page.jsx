import { fetchProduct } from "@/api/api";
import ProductCard from "@/components/website/store-components/ProductCard";
import Pagenation from "@/components/website/store-components/Pagenation";
import Righttop from "@/components/website/store-components/Righttop";

import React from "react";

export default async function Page({ searchParams }) {
  const query = await searchParams;

  const category = query.category || null;
  const room = query.room || null;
  const material = query.material || null;
  const color = query.color || null;
  const stock = query.stock || null;
  const minPrice = query.minprice || null;
  const maxPrice = query.maxprice || null;

  const page = Number(query.page) || 1;
  const sort = query.sort || "featured";

  const response = await fetchProduct({
    category,
    room,
    stock,
    minPrice,
    maxPrice,
    page,
    sort,
    material,
    color
  });

  return (
    <>
      <Righttop total={response?.total || 0} />
      <div className="mt-4 grid grid-cols-1 gap-4 min-[540px]:grid-cols-2 xl:grid-cols-3">
        {response?.data?.map((product) => (
          
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>

      <Pagenation pages={response?.pages || 1} />
    </>
  );
}
