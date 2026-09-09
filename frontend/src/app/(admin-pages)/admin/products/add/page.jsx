"use client";

import React, { useEffect, useState } from "react";
import { generateSlug, client } from "@/utils/helper";
import { fetchCategory, fetchRoom } from "@/api/api";
import { toast } from 'sonner';
import { useRouter } from "next/navigation";

export default function AddProduct() {
    const router = useRouter();
    const initialState = {
        title: "",
        slug: "",
        shortDescription: "",
        description: "",
 
        category: "",
        roomType: "",

        price: "",
        salePrice: "",
        discount: "",

        stock: true,

        material: "Wood",
        color: "",

        length: "",
        width: "",
        height: "",

        weight: "",

        featured: false,
        bestSeller: false,
        newArrival: false,
        status: true,

        thumbnail: null,
    };

    const [data, setData] = useState(initialState);
    const [preview, setPreview] = useState("");
    const [category, setCategory] = useState([]);
    const [room, setRooms] = useState([]);

    useEffect(
        () => {
            const fetchAPI = async () => {
                try {

                    const [category_response, room_response] = await Promise.all([
                        await fetchCategory(),
                        await fetchRoom()
                    ])
                    if (category_response.success) {
                        setCategory(category_response.data)
                    }
                    console.log(room_response)
                    if (room_response.success) {
                        setRooms(room_response.data)
                    }


                } catch (error) {

                }
            }

            fetchAPI()
        },
        []
    )



    // Text / Number / Select
    const handleChange = (e) => {

        const { name, value } = e.target;

        setData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "title" && {
                slug: generateSlug(value),
            }),
        }));
    };

    // Thumbnail
    const handleThumbnail = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setData((prev) => ({
            ...prev,
            thumbnail: file,
        }));

        setPreview(URL.createObjectURL(file));
    };

    // Switch
    const toggleSwitch = (field) => {
        setData((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = new FormData();


        Object.keys(data).forEach((key) => {
            payload.append(key, data[key])
        })
        try {
            const response = await client.post("product/create", payload);
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


    useEffect(() => {
        const price = Number(data.price);
        const salePrice = Number(data.salePrice);

        if (!price || !salePrice || price <= 0) {
            setData((prev) => ({
                ...prev,
                discount: ""
            }));
            return;
        }

        const discount = Math.round(
            ((price - salePrice) / price) * 100
        );

        setData((prev) => ({
            ...prev,
            discount
        }));
    }, [data.price, data.salePrice]);

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
                                    value={data.title}
                                    onChange={handleChange}
                                    className={inputClass}
                                />

                            </div>

                            <div>

                                <label className="text-sm font-medium block mb-2 text-gray-300">
                                    Slug
                                </label>

                                <input
                                    type="text"
                                    name="slug"
                                    value={data.slug}
                                    onChange={handleChange}
                                    className={inputClass}
                                />

                            </div>

                        </div>

                        <div className="mt-5">

                            <label className="text-sm font-medium block mb-2 text-gray-300">
                                Short Description
                            </label>

                            <textarea
                                rows={3}
                                name="shortDescription"
                                value={data.shortDescription}
                                onChange={handleChange}
                                className={`${inputClass} resize-none`}
                            />

                        </div>

                        <div className="mt-5">

                            <label className="text-sm font-medium block mb-2 text-gray-300">
                                Description
                            </label>

                            <textarea
                                rows={6}
                                name="description"
                                value={data.description}
                                onChange={handleChange}
                                className={`${inputClass} resize-none`}
                            />

                        </div>

                    </section>

                    {/* Category */}

                    <section>

                        <h2 className="text-lg font-semibold mb-5 text-white">
                            Category Information
                        </h2>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            <div>

                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={data.category}
                                    onChange={handleChange}
                                    className={inputClass}
                                >
                                    <option value="" className="bg-[#132437]">Select Category</option>

                                    {
                                        category.map(category => (
                                            <option
                                                key={category._id}
                                                value={category._id}
                                            >
                                                {category.name}
                                            </option>
                                        ))
                                    }



                                </select>

                            </div>

                            <div>

                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Room Type
                                </label>

                                <select
                                    name="roomType"
                                    value={data.roomType}
                                    onChange={handleChange}
                                    className={inputClass}
                                >
                                    {
                                        room.map(room => (
                                            <option
                                                key={room._id}
                                                value={room._id}
                                            >
                                                {room.name}
                                            </option>
                                        ))
                                    }

                                </select>

                            </div>

                        </div>

                    </section>





                    {/* Pricing */}

                    <section>

                        <h2 className="text-lg font-semibold mb-5 text-white">
                            Pricing
                        </h2>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

                            <div>

                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Price
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    value={data.price}
                                    onChange={handleChange}
                                    className={inputClass}
                                />

                            </div>

                            <div>

                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Sale Price
                                </label>

                                <input
                                    type="number"
                                    name="salePrice"
                                    value={data.salePrice}
                                    onChange={handleChange}
                                    className={inputClass}
                                />

                            </div>

                            <div>

                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Discount %
                                </label>

                                <input
                                    type="number"
                                    name="discount"
                                    value={data.discount}
                                    onChange={handleChange}
                                    className={inputClass}
                                />

                            </div>

                        </div>

                    </section>





                    {/* Furniture Details */}

                    <section>

                        <h2 className="text-lg font-semibold mb-5 text-white">
                            Furniture Details
                        </h2>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            <div>

                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Material
                                </label>

                                <select
                                    name="material"
                                    value={data.material}
                                    onChange={handleChange}
                                    className={inputClass}
                                >
                                    <option className="bg-[#132437]">Wood</option>
                                    <option className="bg-[#132437]">Sheesham</option>
                                    <option className="bg-[#132437]">Engineered Wood</option>
                                    <option className="bg-[#132437]">Metal</option>
                                    <option className="bg-[#132437]">Steel</option>
                                    <option className="bg-[#132437]">Plastic</option>
                                    <option className="bg-[#132437]">Glass</option>
                                    <option className="bg-[#132437]">Marble</option>
                                    <option className="bg-[#132437]">Fabric</option>
                                    <option className="bg-[#132437]">Leather</option>
                                </select>

                            </div>

                            <div>

                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Color
                                </label>

                                <input
                                    type="text"
                                    name="color"
                                    value={data.color}
                                    onChange={handleChange}
                                    placeholder="Walnut"
                                    className={inputClass}
                                />

                            </div>

                        </div>





                        <div className="mt-5 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4 xl:gap-5">

                            <div>

                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Length (cm)
                                </label>

                                <input
                                    type="number"
                                    name="length"
                                    value={data.length}
                                    onChange={handleChange}
                                    className={inputClass}
                                />

                            </div>

                            <div>

                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Width (cm)
                                </label>

                                <input
                                    type="number"
                                    name="width"
                                    value={data.width}
                                    onChange={handleChange}
                                    className={inputClass}
                                />

                            </div>

                            <div>

                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Height (cm)
                                </label>

                                <input
                                    type="number"
                                    name="height"
                                    value={data.height}
                                    onChange={handleChange}
                                    className={inputClass}
                                />

                            </div>

                            <div>

                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Weight (Kg)
                                </label>

                                <input
                                    type="number"
                                    name="weight"
                                    value={data.weight}
                                    onChange={handleChange}
                                    className={inputClass}
                                />

                            </div>

                        </div>

                    </section>
                    {/* Thumbnail */}

                    <section>

                        <h2 className="text-lg font-semibold mb-5 text-white">
                            Product Thumbnail
                        </h2>

                        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">

                            <div>

                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Thumbnail Image
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnail}
                                    className="w-full border border-white/10 bg-[#132437] text-gray-300 rounded-lg px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-sky-600 file:text-white hover:file:bg-sky-500 file:cursor-pointer cursor-pointer"
                                />

                            </div>

                            <div>

                                <label className="block text-sm font-medium mb-2 text-gray-300">
                                    Preview
                                </label>

                                <div className="w-52 h-52 border border-white/10 rounded-lg overflow-hidden bg-[#132437] flex items-center justify-center">

                                    {
                                        preview ? (

                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />

                                        ) : (

                                            <span className="text-gray-500 text-sm">
                                                No Image Selected
                                            </span>

                                        )
                                    }

                                </div>

                            </div>

                        </div>

                    </section>



                    {/* Product Flags */}

                    <section>

                        <h2 className="text-lg font-semibold mb-5 text-white">
                            Product Settings
                        </h2>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            <label className="flex items-center justify-between border border-white/10 bg-[#132437] rounded-lg px-5 py-4 cursor-pointer text-gray-200">

                                <span>In Stock</span>

                                <input
                                    type="checkbox"
                                    checked={data.stock}
                                    onChange={() => toggleSwitch("stock")}
                                    className="h-5 w-5 accent-sky-500"
                                />

                            </label>



                            <label className="flex items-center justify-between border border-white/10 bg-[#132437] rounded-lg px-5 py-4 cursor-pointer text-gray-200">

                                <span>Featured Product</span>

                                <input
                                    type="checkbox"
                                    checked={data.featured}
                                    onChange={() => toggleSwitch("featured")}
                                    className="h-5 w-5 accent-sky-500"
                                />

                            </label>



                            <label className="flex items-center justify-between border border-white/10 bg-[#132437] rounded-lg px-5 py-4 cursor-pointer text-gray-200">

                                <span>Best Seller</span>

                                <input
                                    type="checkbox"
                                    checked={data.bestSeller}
                                    onChange={() => toggleSwitch("bestSeller")}
                                    className="h-5 w-5 accent-sky-500"
                                />

                            </label>



                            <label className="flex items-center justify-between border border-white/10 bg-[#132437] rounded-lg px-5 py-4 cursor-pointer text-gray-200">

                                <span>New Arrival</span>

                                <input
                                    type="checkbox"
                                    checked={data.newArrival}
                                    onChange={() => toggleSwitch("newArrival")}
                                    className="h-5 w-5 accent-sky-500"
                                />

                            </label>



                            <label className="flex items-center justify-between border border-white/10 bg-[#132437] rounded-lg px-5 py-4 cursor-pointer text-gray-200">

                                <span>Active Status</span>

                                <input
                                    type="checkbox"
                                    checked={data.status}
                                    onChange={() => toggleSwitch("status")}
                                    className="h-5 w-5 accent-sky-500"
                                />

                            </label>

                        </div>

                    </section>



                    {/* Submit */}

                    <section className="border-t border-white/10 pt-6">

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-sky-600 px-8 py-3 text-white transition hover:bg-sky-500 sm:w-auto"
                        >
                            Create Product
                        </button>

                    </section>

                </form>

            </div>

        </div>

    );

}
