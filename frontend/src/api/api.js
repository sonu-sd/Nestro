import { client } from "@/utils/helper";


export const fetchCategory = async () => {
    try {
        // console.log("ID:", id);
        const response = await client.get("/category");
        return response.data;

    } catch (error) {

        console.log("Message:", error.message);
        return {
            success: false,
            data: [],
            message: error.response?.data?.message || error.message,
        };
    }
};


export const fetchCategoryById = async (id) => {
    try {
        const response = await client.get(`category/${id}`)
        if (response.data.success) {
            return response.data

        }

    } catch (error) {
        return {
            data: [],
            success: false
        }

    }

}


export const fetchRoom = async () => {
    try {

        // console.log("ID:", id);

        const response = await client.get("/room-type");

        return response.data;

    } catch (error) {
        console.log("Status:", error.response?.status);
        console.log("Response:", error.response?.data);
        console.log("Message:", error.message);

        return {
            success: false,
            data: [],
            message: error.response?.data?.message || error.message,
        };
    }
};


export const fetchRoomById = async (id) => {
    try {
        const response = await client.get(`room-type/${id}`)
        if (response.data.success) {
            return response.data

        }

    } catch (error) {
        return {
            data: [],
            success: false
        }

    }

}


export const fetchProduct = async ({ category, room, stock, minPrice, maxPrice, page, sort, material } = {}) => {
    try {
        const params = new URLSearchParams();
        if (category != null) params.append("category", category);
        if (room != null) params.append("room", room);
        if (material != null) params.append("material", material);
        if (stock != null) params.append("stock", stock);
        if (minPrice != null) params.append("minprice", minPrice);
        if (maxPrice != null) params.append("maxprice", maxPrice);
        if (page != null) params.append("page", page)
        if (sort) params.append("sort", sort);
        // console.log("ID:", id);

        const response = await client.get(`/product?${params.toString()}`);

        return response.data;

    } catch (error) {
        console.log("Status:", error.response?.status);
        console.log("Response:", error.response?.data);
        console.log("Message:", error.message);

        return {
            success: false,
            data: [],
            message: error.response?.data?.message || error.message,
        };
    }
};

export const fetchProductById = async (id) => {
    try {
        const response = await client.get(`product/${id}`)
        if (response.data.success) {
            return response.data

        }

    } catch (error) {
        return {
            data: {},
            success: false
        }

    }

}


// export const getMe = async () => {
//     try {

//         // const cookie = await cookies();
        
//         const token = cookie.get("token")?.value || null;
//         console.log(token,"token")

//         const response = await client.get("user/get-me", {
//             headers: {
//                 Authorization: token
//             }
//         })

//         return response.data
//         // console.log(cookie.get("tokan"))
//     } catch (error) {
// console.log(error)

// return {
//     message:"not found",
//     success:false,
//     user:null
// }
//     }

// }