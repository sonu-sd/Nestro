import BestsellSection from "@/components/website/home-components/bestsells/BestsellSection";
import Bottomsection from "@/components/website/home-components/bottom/Bottomsection";
import CategorySection from "@/components/website/home-components/category/CategorySection";
import Hero from "@/components/website/home-components/hero/Hero";
import Landedsection from "@/components/website/home-components/justLanded/Landedsection";
import Shopsection from "@/components/website/home-components/shopbyroom/Shopesection";
import Image from "next/image";

export default function Home() {
  return (
    <div>
    <Hero/>
    <CategorySection/>
    <BestsellSection/>
    <Landedsection/>
    <Shopsection/>
    <Bottomsection/>
    </div>
  );
}
