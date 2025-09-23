export interface Order {
  _id: string;
  user?: {
    email?: string;
    userName?: string
  };
  items?: Array<{
    id: string;
    name?: string;
    image?: string;
    category?: string;
    quantity?: number;
    price?: number;
  }>;
  totalAmount?: number;
  status?: string;
  createdAt?: string; // Added createdAt property
  // other order fields
}