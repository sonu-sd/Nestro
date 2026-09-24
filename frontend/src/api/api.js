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
    const response = await client.get(`category/${id}`);
    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    return {
      data: [],
      success: false,
    };
  }
};

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
    const response = await client.get(`room-type/${id}`);
    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    return {
      data: [],
      success: false,
    };
  }
};

export const fetchProduct = async ({
  category,
  room,
  stock,
  minPrice,
  maxPrice,
  page,
  sort,
  material,
  color,
  limit,
  bestseller,
  newarrival,
  search,
} = {}) => {
  try {
    const params = new URLSearchParams();
    if (category != null) params.append("category", category);
    if (room != null) params.append("room", room);
    if (material != null) params.append("material", material);
    if (color != null) params.append("color", color);
    if (stock != null) params.append("stock", stock);
    if (minPrice != null) params.append("minprice", minPrice);
    if (maxPrice != null) params.append("maxprice", maxPrice);
    if (page != null) params.append("page", page);
    if (sort) params.append("sort", sort);
    if (limit != null) params.append("limit", limit);
    if (bestseller != null) params.append("bestseller", bestseller);
    if (newarrival != null) params.append("newarrival", newarrival);
    if (search) params.append("search", search);
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

export const fetchReviews = async ({ limit = 3 } = {}) => {
  try {
    const response = await client.get(`/review?limit=${limit}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || error.message,
    };
  }
};

export const fetchColor = async () => {
  try {
    const response = await client.get("/color");
    return response.data;
  } catch (error) {
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || error.message,
    };
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await client.get(`product/${id}`);
    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    return {
      data: {},
      success: false,
    };
  }
};

export const fetchProductBySlug = async (slug) => {
  try {
    const response = await client.get(
      `/product/slug/${encodeURIComponent(slug)}`,
    );
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw error;
  }
};

export const fetchProductReviews = async (productId, limit = 6) => {
  const response = await client.get("/review", {
    params: { product: productId, limit },
  });
  return response.data;
};

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
