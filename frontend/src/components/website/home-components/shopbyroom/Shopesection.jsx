import { roomData } from "./RoomData";
import RoomCard from "./RoomCard";
import Craftcard from "./CraftCard";
import ServiceCards from "./ServiceCards";
import Link from "next/link";

import { fetchProduct, fetchRoom } from "@/api/api";

export default async function ShopSection() {
  const rooms = await fetchRoom();

  const roomsWithCount = await Promise.all(
    rooms.data.map(async (room) => {
      const res = await fetchProduct({
        room: room.slug,
        page: 1,
      });

      return {
        ...room,
        count: res?.total || 0,
      };
    }),
  );

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
            <RoomCard {...roomsWithCount[0]} large />
          </div>

          <div className="flex flex-col gap-4 lg:col-span-3">
            <RoomCard {...roomsWithCount[1]} />
            <RoomCard {...rooms.data[3]} />
          </div>

          <div className="flex flex-col gap-4 lg:col-span-3">
            <RoomCard {...roomsWithCount[2]} />
            <RoomCard {...roomsWithCount[4]} />
          </div>
        </div>

        <Craftcard />
        <ServiceCards />
      </section>
    </>
  );
}
