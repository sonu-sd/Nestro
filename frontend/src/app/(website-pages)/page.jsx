import { fetchProduct } from "@/api/api";
import BestsellSection from "@/components/website/home-components/bestsells/BestsellSection";
import Bottomsection from "@/components/website/home-components/bottom/Bottomsection";
import CategorySection from "@/components/website/home-components/category/CategorySection";
import Hero from "@/components/website/home-components/hero/Hero";
import Landedsection from "@/components/website/home-components/justLanded/Landedsection";
import Shopsection from "@/components/website/home-components/shopbyroom/Shopesection";
import Image from "next/image";

export default async function Home() {
const products = await fetchProduct({})
const bestSellers = products.data.filter((item) => item.bestSeller).slice(0, 4);
const newArrival = products.data.filter((item)=>item.newArrival).slice(0,4)

  return (
    <div>
    <Hero/>
    <CategorySection />
    <BestsellSection 
    products={bestSellers}
     />
    <Landedsection
    products={newArrival}
    />
    <Shopsection/>
    <Bottomsection/>
    </div>
  );
}
