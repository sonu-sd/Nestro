import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Category
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    roomType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rooms",
      required: true,
    },
   
    // Pricing
    price: {
      type: Number,
      required: true,
      min: 200,
    },

    salePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    // Inventory
    stock: {
      type: Boolean,
      default:true,
      required: true
    
    },

    sold: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Images
    thumbnail: {
      type: String,
      required: true,
    },
    thumbnailPublicId: {
      type: String,
      default: "",
      select: false,
    },
    images: [
      {
        type: String,
      },
    ],
    imagePublicIds: {
      type: [String],
      default: [],
      select: false,
    },

    // Furniture Details
    material: {
      type: String,
      enum: [
        "Wood",
        "Sheesham",
        "Engineered Wood",
        "Metal",
        "Steel",
        "Plastic",
        "Glass",
        "Marble",
        "Fabric",
        "Leather",
      ],
      required:true
      
    },

    color:{
        type: String,
      },
    colors: [{ type: mongoose.Schema.Types.ObjectId, ref: "colors" }],
    
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        default: "cm",
      },
    },

    weight: {
      value: Number,
      unit: {
        type: String,
        default: "kg",
      },
    },

    // Flags
    featured: {
      type: Boolean,
      default: false,
    },

    bestSeller: {
      type: Boolean,
      default: false,
    },

    newArrival: {
      type: Boolean,
      default: false,
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const productModel= mongoose.model("Product", productSchema);
export default productModel
