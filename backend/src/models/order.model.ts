import mongoose from "mongoose";

export enum orderStatus {
  Cancelled = "Cancelled",
  Pending = "Pending",
  Shipped = "Shipped",
  Paid = "Paid",
}

interface OrderItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderProps extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  items: OrderItem[];
  totalAmount: number;
  totalQuantity: number;
  status: orderStatus;
  isPaid: boolean;
  paidAt?: Date;
  paymentIntentId?: string;
  receiptUrl?: string;
}

const orderSchema = new mongoose.Schema<OrderProps>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    totalQuantity: { type: Number, required: true },
    status: { type: String, enum: Object.values(orderStatus), required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    paymentIntentId: { type: String },
    receiptUrl: { type: String },
  },
  { timestamps: true }
);

const Order = mongoose.model<OrderProps>("Order", orderSchema);
export default Order;
