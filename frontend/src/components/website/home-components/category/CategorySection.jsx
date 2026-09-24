import CategoryCard from "./CategoryCard";
import Link from "next/link";
import { fetchCategory } from "@/api/api";

export default async function CategorySection() {
  const category = await fetchCategory();

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-[11px] uppercase tracking-[4px] text-[#8b5e3c]">
        Browse
      </p>

      <h2 className="mt-2 text-xl font-medium text-[#1e1e1e]">
        Shop by Category
      </h2>

      <div className="mt-5 flex gap-0 overflow-x-auto gap-2 pb-2 sm:flex-wrap sm:overflow-visible">
        {category.data?.map((item) => (
          <Link
            href={`/store?category=${encodeURIComponent(item.slug)}`}
            key={item._id}
            className="w-[100px] shrink-0 sm:w-[110px] md:w-[120px]"
          >
            <CategoryCard {...item} />
          </Link>
        ))}
      </div>
    </section>
  );
}
