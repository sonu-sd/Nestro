import React from 'react'
import { FaRegHeart } from "react-icons/fa";
import { RiVipDiamondLine } from "react-icons/ri";
import { IoLeafOutline } from "react-icons/io5";

export default function Value() {

    const featuresData = [
        {
            id: 1,
            icon: <IoLeafOutline />,
            title: "Sustainable Craft",
            description:
                "We source responsibly — FSC-certified woods, natural fibres, and local artisans. Furniture that's good for your home and the planet.",
        },
        {
            id: 2,
            icon: <RiVipDiamondLine />,
            title: "Uncompromising Quality",
            description:
                "Every piece passes a 23-point quality check before it reaches your home. We back it with a 5-year warranty.",
        },
        {
            id: 3,
            icon: <FaRegHeart />,
            title: "Design with Soul",
            description:
                "We don't chase trends. We design furniture that ages gracefully and belongs in every chapter of your life.",
        },
    ];

    return (
        <div className="px-4 py-8 sm:px-6 lg:px-8">
            <p className="text-[11px] uppercase tracking-[2px] text-[#8b5e3c]">
                What drives us
            </p>

            <h2 className="mt-2 text-2xl font-medium text-[#1e1e1e]">
                Our Values
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                {featuresData.map((item) => (
                    <div
                        key={item.id}
                        className="rounded-2xl border border-[#E5D5C3] bg-white p-6">

                        <p className="mt-2 text-[21px]  text-[#8b5e3c] italic">
                            {item.icon}
                        </p>

                        <div>
                            <h3 className="text-[13px] mt-3 font-semibold text-[#1E1E1E]">
                                {item.title}
                            </h3>
                            <p className="text-[11px] mt-2 text-[#6b7280]">
                                {item.description}
                            </p>
                        </div>
                    </div>

                ))}
            </div>
        </div >
    )
}
