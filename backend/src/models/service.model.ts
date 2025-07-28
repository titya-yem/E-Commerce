import { Document, Schema, model, models } from "mongoose";

interface serviceTypes extends Document {
  alt: string;
  title: string;
  description: string;
  image: string;
  price: number | string;
  duration?: number | string;
};

const serviceSchema = new Schema<serviceTypes>({
  title: { type: String, required: true, trim: true, unique: true },
  description: { type: String, required: true, trim: true },
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
  alt: { type: String, required: true, trim: true },
  price: { type: Schema.Types.Mixed, required: true, default: 0 },
  duration: { type: Schema.Types.Mixed },
}, { timestamps: true });

const Service = models.Service || model<serviceTypes>("Service", serviceSchema);

export default Service;