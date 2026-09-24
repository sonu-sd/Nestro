import { fetchProduct, fetchReviews } from "@/api/api";
import BestsellSection from "@/components/website/home-components/bestsells/BestsellSection";
import Bottomsection from "@/components/website/home-components/bottom/Bottomsection";
import CategorySection from "@/components/website/home-components/category/CategorySection";
import Hero from "@/components/website/home-components/hero/Hero";
import Landedsection from "@/components/website/home-components/justLanded/Landedsection";
import Shopsection from "@/components/website/home-components/shopbyroom/Shopesection";
import { connection } from "next/server";

export default async function Home() {
  await connection();
  const [bestSellers, newArrival, reviews] = await Promise.all([
    fetchProduct({ bestseller: true, limit: 4 }),
    fetchProduct({ newarrival: true, limit: 4 }),
    fetchReviews({ limit: 3 }),
  ]);

  return (
    <div>
      <Hero />
      <CategorySection />
      <BestsellSection products={bestSellers.data} />
      <Landedsection products={newArrival.data} />
      <Shopsection />
      <Bottomsection reviews={reviews.data} />
    </div>
  );
}
