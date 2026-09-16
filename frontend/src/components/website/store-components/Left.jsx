
import React from 'react'
import {
    materialData,
    availabilityData,
} from "./leftdata";
import { fetchCategory, fetchRoom, fetchProduct } from '@/api/api';
import Stockfilter from './Stockfilter';
import Filtersection from './Filtersection';
import Pricefilter from './Pricefilter';


export default async function Left() {

    const category_response = await fetchCategory();
    const room_response = await fetchRoom();

    const categoriesWithCount = await Promise.all(
        category_response.data.map(async (item) => {
            const response = await fetchProduct({
                category: item.slug,
                page: 1
            });

            return {
                ...item,
                count: response?.total || 0
            };
        })
    );

    const oomsWithCountr = await Promise.all(
        room_response.data.map(async (item) => {
            const response = await fetchProduct({
                room: item.slug,
                page: 1
            });

            return {
                ...item,
                count: response?.total || 0
            };
        })
    );

    return (
        <div className="w-full rounded-2xl border bg-white p-5 sm:p-6 lg:w-[280px] lg:sticky lg:top-20">

            <h2 className="text-[13px] mb-4 text-[#6b7280] tracking-[2px]">Filters</h2>

            {/* Category */}
            <Filtersection
                title="category"
                queryKey="category"
                readOnly
                data={categoriesWithCount}
            />

            {/* Room */}

            <Filtersection
                title="Room-type"
                queryKey="room"
                readOnly
                data={oomsWithCountr}
            />

            {/* price */}
            <Pricefilter />


            {/* Material */}
            <Filtersection
                title="Material"
                queryKey="material"
                data={materialData}
            />
            {/* color */}
            <div className="py-6 border-b border-[#E7DDD1] ">
                <h3 className=" font-semibold text-[#1e1e1e] text-[13px]">Color</h3>

                <div className="mt-4 flex flex-wrap gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#8B5E3C] border"></div>
                    <div className="w-7 h-7 rounded-full bg-[#E7DDD1] border"></div>
                    <div className="w-7 h-7 rounded-full bg-[#444] border"></div>
                    <div className="w-7 h-7 rounded-full bg-[#F5F5F5] border"></div>
                    <div className="w-7 h-7 rounded-full bg-[#9C6A42] border"></div>
                    <div className="w-7 h-7 rounded-full bg-[#925727] border"></div>
                </div>
            </div>


            {/* Availability */}
            <Stockfilter />

            <div className="mt-5 mb-5">
                <h2 className="text-[13px] font-semibold text-[#1e1e1e]">
                    Rating
                </h2>

                <div className="mt-3 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <div className="text-[#C58A42] text-sm tracking-[2px]">
                            ★★★★★
                        </div>

                        <span className="text-[12px] text-[#666]">
                            & up
                        </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <div className="text-[#C58A42] text-sm tracking-[2px]">
                            ★★★★☆
                        </div>
                        <span className="text-[12px] text-[#666]">
                            & up
                        </span>
                    </label>

                </div>
            </div>

        </div>
    );
}

