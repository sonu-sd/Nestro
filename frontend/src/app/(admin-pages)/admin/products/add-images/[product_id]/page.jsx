"use client";

import React, { useEffect, useState } from "react";
import { client } from "@/utils/helper";
import { fetchProductById } from "@/api/api";
import { toast } from 'sonner';

// import { Target } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function AddProduct() {
    const router = useRouter();
    const [product, setproduct] = useState({});
    const { product_id } = useParams()

    useEffect(
        () => {
            const fetchAPI = async () => {
                try {
                    const product_response = await fetchProductById(product_id)
                    if (product_response.success) {
                        setproduct(product_response.data)
                    }

                } catch (error) {
                    console.log(error);


                }
            }

            fetchAPI()
        },
        [product_id]
    )



    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = new FormData();
        for (const img of e.target.images.files) {
            payload.append("images", img);
        }

        try {
            const response = await client.post(`product/add_images/${product_id}`, payload);
            if (response.data.success) {
                toast.success(response.data.message);
                router.push("/admin/products")
            }

        }
        catch (error) {
            console.log("ERROR:", error);
            console.log("ERROR RESPONSE:", error.response?.data);

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Internal server error"
            );
        }

    };


    const inputClass =
        "w-full border border-white/10 bg-white text-black placeholder-gray-500 rounded-lg px-4 py-3 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition";

    return (

        <div className="mx-auto min-h-screen max-w-7xl p-4 text-black sm:p-6 lg:p-8">

            <div className="bg-[#1a2e43] shadow border border-white/10 rounded-xl">

                <div className="border-b border-white/10 p-6">

                    <h1 className="text-2xl font-bold text-white">
                        Add Product
                    </h1>

                    <p className="text-sm text-gray-400 mt-1">
                        Fill all product information.
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-10"
                >

                    {/* Basic Information */}

                    <section>

                        <h2 className="font-semibold text-lg mb-5 text-white">
                            Basic Information
                        </h2>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            <div>

                                <label className="text-sm font-medium block mb-2 text-gray-300">
                                    Product Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={product?.title || ""}
                                    readOnly
                                    className={inputClass}

                                />

                            </div>

                        </div>

                        {/* Thumbnail */}

                        <section>

                            <h2 className="text-lg font-semibold mb-5 text-white">
                                Product Image
                            </h2>

                            <div className="mb-3 grid grid-cols-1 items-start gap-6 md:grid-cols-2">

                                <div>

                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        Thumbnail Image
                                    </label>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        name="images"
                                        className="w-full border border-white/10 bg-[#132437] text-gray-300 rounded-lg px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-sky-600 file:text-white hover:file:bg-sky-500 file:cursor-pointer cursor-pointer"
                                    />

                                </div>
                                <div>

                                    <label className="block text-sm font-medium mb-2 text-gray-300">
                                        Uploaded Images
                                    </label>

                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">

                                        {[0, 1, 2, 3, 4, 5].map((index) => (

                                            <div
                                                key={index}
                                                className="w-20 h-20 border border-white/10 rounded-lg overflow-hidden bg-[#132437] flex items-center justify-center"
                                            >

                                                {product?.images?.[index] ? (

                                                    <img
                                                        src={product.images[index]}
                                                        alt={`Product image ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />

                                                ) : (

                                                    <span className="text-gray-500 text-sm">
                                                        Image {index + 1}
                                                    </span>

                                                )}

                                            </div>

                                        ))}

                                    </div>

                                </div>

                            </div>

                        </section>

                        {/* Submit */}

                        <section className="border-t border-white/10 pt-6">

                            <button
                                type="submit"
                                className="w-full rounded-lg bg-sky-600 px-8 py-3 text-white transition hover:bg-sky-500 sm:w-auto"
                            >
                                Create images
                            </button>

                        </section>
                    </section>

                </form>

            </div>

        </div>


    );

}
