import { roomData } from "./RoomData";
import RoomCard from "./RoomCard";
import Craftcard from "./CraftCard";
import ServiceCards from "./ServiceCards";

export default function ShopSection() {
  return (
    <>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-[11px] uppercase tracking-[4px] text-[#8b5e3c]">
          Curated by Space
        </p>

        <h2 className="mt-2 text-xl font-medium text-[#1e1e1e]">
          Shop by Room
        </h2>

        <div className="grid grid-cols-1 gap-4 mt-5 md:grid-cols-2 lg:grid-cols-10">

          <div className="md:col-span-2 lg:col-span-4">
            <RoomCard {...roomData[0]} large />
          </div>

          <div className="flex flex-col gap-4 lg:col-span-3">
            <RoomCard {...roomData[1]} />
            <RoomCard {...roomData[3]} />
          </div>

          <div className="flex flex-col gap-4 lg:col-span-3">
            <RoomCard {...roomData[2]} />
            <RoomCard {...roomData[4]} />
          </div>
        </div>


        <Craftcard />
        <ServiceCards/>

      </section>

    </>
  );
}
