import mongoose, { Document, Schema } from "mongoose";

type CategoryType = 'cat' | 'dog' | 'bird' | 'rabbit' | 'goldfish';

interface productTypes extends Document {
    name: string;
    category: CategoryType;
    price: number;
    rating: number;
    reviews?: number;
    description: string;
    image: string;
}

const productSchema = new Schema<productTypes>({
    name: { type: String, required: true, trim: true, unique: true },
    category: { type: String, required: true, enum: ['cat', 'dog', 'bird', 'rabbit', 'goldfish'] },
    price: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    reviews: { type: Number, default: 0 },
    description: { type: String, required: true, trim: true},
    image: { 
        type: String, 
        required: true,
        validate: {
          validator: (value: string) => {
            return /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(value);
          },
          message: 'Invalid image URL. Please provide a valid URL.'
        }
      },
}, { timestamps: true });

const Product = mongoose.model<productTypes>("Product", productSchema);

export default Product;