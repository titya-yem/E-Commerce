export type Order = {
  _id: string;
  user: string;
  items: {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  totalAmount: number;
  totalQuantity: number;
  status: "Pending" | "Paid" | "Shipped" | "Delivered" | "Cancelled";
  isPaid: boolean;
  paidAt?: string;
  paymentIntentId?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
};
