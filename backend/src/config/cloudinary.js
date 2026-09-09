import{v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv"
dotenv.config()  // .env ko load karega


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

export default cloudinary


// image upload, usy in the product


// , place



// import { v2 as cloudinary } from "cloudinary";

// console.log("Cloud Name:", process.env.CLOUD_NAME);
// console.log("API Key:", process.env.CLOUDINARY_API_KEY);
// console.log("Secret:", process.env.CLOUDINARY_SECRET_KEY);

// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_SECRET_KEY
// });

// export default cloudinary;