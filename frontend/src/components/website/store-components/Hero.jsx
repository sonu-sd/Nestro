import React from 'react'

export default function Hero() {
    return (

        <div className="m-0 bg-gradient-to-r from-[#2c2016] to-[#4a311d] p-6 sm:m-6 sm:rounded-3xl sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 lg:gap-12">

                {/* Left Content */}
                <div>
                    <p className="uppercase tracking-[3px] text-[11px] text-[#C6A27E]">
                        New Collection — SS 2026
                    </p>

                    <h2 className="mt-2 text-3xl font-light leading-none text-white sm:text-[34px]">
                        Modern Living
                    </h2>

                    <h2 className="text-3xl italic font-light text-[#D6BFA7] leading-none sm:text-[34px]">
                        Collection
                    </h2>

                    <p className="mt-4 text-[13px] text-[#ffffff80] max-w-md">
                        Timeless furniture crafted for elegant spaces.
                        <br />
                        Designed with intention, built to endure.
                    </p>

                    <button className="mt-6 flex min-h-11 items-center gap-3 rounded-lg bg-[#9D6C41] px-7 py-2 text-[14px] font-medium text-white transition hover:bg-[#8B5E3C]">
                        Explore Collection
                        <span>→</span>
                    </button>
                </div>

                <div>
                    <img
                        src="https://images.unsplash.com/photo-1758448511322-8bfc73daf606?auto=format&fit=crop&w=900&q=80"
                        alt="Modern Living"
                        className="h-52 w-full rounded-2xl object-cover sm:h-[220px] sm:rounded-3xl"
                    />
                </div>

            </div>
        </div>
    )
}
