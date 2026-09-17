import AppImage from "@/components/ui/AppImage";

export default function CraftCard() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-8 rounded-3xl bg-[#2B1F16] p-6 text-white sm:p-8 lg:mt-12 lg:grid-cols-6 lg:p-10">
      <div className="lg:col-span-3 xl:col-span-2">
        <p className="text-[11px] uppercase tracking-[3px] text-[#C6A27E] ">
          Our Craft
        </p>

        <h2 className="text-2xl font-medium leading-tight text-[#faf7f4] sm:text-3xl">
          Built by artisans who
          <br />
          <span className="italic font-light text-[#D6BFA7]">
            still use their hands
          </span>
        </h2>

        <p className="text-[13px] leading-7 text-[#ffffff8c]">
          Every Nestro piece passes through a small workshop in Jodhpur before it
          reaches your home — solid joinery, hand-finished grains, and fabrics
          tested for years of daily life, not just a showroom photo.
        </p>


        <div className="mt-6 grid grid-cols-1 gap-5 min-[420px]:grid-cols-3">
          <div>
            <h3 className="text-2xl font-semibold text-[#D6BFA7]">
              12,000+
            </h3>
            <p className="mt-1 text-[11px] text-[#ffffff8c]">
              Homes furnished
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-[#D6BFA7]">
              18 yrs
            </h3>
            <p className="mt-1 text-[11px] text-[#ffffff8c]">
              Of craftsmanship
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-[#D6BFA7]">
              4.8/5
            </h3>
            <p className="mt-1 text-[11px] text-[#ffffff8c]">
              Average rating
            </p>
          </div>
        </div>
      </div>
      <div className="hidden xl:block"></div>


      <div className="overflow-hidden rounded-2xl lg:col-span-3">
        <AppImage
          src="https://images.unsplash.com/photo-1593071045469-a45708d54b3d?auto=format&fit=crop&w=800&q=80"
          alt="Nestro craftsmanship"
          className="h-64 w-full object-cover transition duration-500 hover:scale-105 sm:h-[320px]"
        />
      </div>

      
    </div>
  );
}
