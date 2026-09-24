import mongoose from "mongoose";

const cartschema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    items: [
      {
        _id: false,
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        qty: {
          type: Number,
          default: 1,
          min: 1,
          max: 5,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const cartModel = mongoose.model("cart", cartschema);

export default cartModel;
