import mongoose from "mongoose";

const clothSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minLength: [1, "Title must not be empty"],
      maxLength: [100, "Title must be under 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock can't be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Stock must be an integer",
      },
    },
    description: {
      type: String,
      maxLength: [1000, "Description too long"],
    },
    image: {
      type: String,
      validate: {
        validator: (v) =>
          !v ||
          /^(\/img\/uploads\/clothes\/[\w-]+\.(jpg|gif|png|jpeg)$)|(^https?:\/\/.+\.(jpg|gif|png|jpeg)$)/.test(
            v
          ),
        message:
          "Image must be a valid path or URL ending in .jpg, .png, .gif, or .jpeg",
      },
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "Shirts",
          "Pants",
          "Dresses",
          "Outerwear",
          "Underwear",
          "Socks",
          "Accessories",
          "Shoes",
        ],
        message:
          "Category must be one of: Shirts, Pants, Dresses, Outerwear, Underwear, Socks, Accessories, Shoes",
      },
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cloth", clothSchema);
