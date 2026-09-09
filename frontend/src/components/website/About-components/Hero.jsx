import React from 'react'

export default function Hero() {
    return (
        <div className='m-0 grid grid-cols-1 gap-8 bg-[#2c2016] p-6 sm:m-5 sm:rounded-2xl sm:p-10 lg:grid-cols-2 lg:p-13'>
            <div className='items-center flex'>

                <div className='col-span-1 '>
                    <h2 className="text-3xl tracking-wide sm:text-[36px] sm:tracking-wider">
                        Furniture crafted with {""}
                        <span className="text-[#dcbfa7] italic">purpose</span>
                    </h2>

                    <p className='mt-3 text-[13px] leading-6 text-[#ffffff80]'>
                        Founded in 2018, Nestro was born from a belief that beautiful furniture shouldn't be a luxury. We work
                        directly with master craftsmen across India and Scandinavia to bring you pieces that are honest in material,
                        thoughtful in design, and built to outlast trends.
                    </p>

                </div>
            </div>
            <div className='lg:col-span-1'>
                <img src="https://images.unsplash.com/photo-1593071045469-a45708d54b3d?auto=format&fit=crop&w=700&q=80" alt=""
                    className='h-64 w-full rounded-2xl object-cover sm:h-80 lg:h-full' />

            </div>
        </div>
    )
}
