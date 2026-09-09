import { categoryData } from "./Categorydata";
import CategoryCard from "./CategoryCard";

export default function CategorySection() {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-[11px] uppercase tracking-[4px] text-[#8b5e3c]">
        Browse
      </p>

      <h2 className="mt-2 text-xl font-medium text-[#1e1e1e]">
        Shop by Category
      </h2>

      <div className="-mx-4 mt-5 flex gap-5 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0 md:grid-cols-7 lg:gap-6">
        {categoryData.map((item) => (
          <CategoryCard key={item.id} 
          {...item} />
        ))}
      </div>
    </section>
  );
}
