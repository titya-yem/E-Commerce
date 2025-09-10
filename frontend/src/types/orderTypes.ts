export interface Order {
  _id: string;
  user: {
    _id: string;
    userName: string;
    email: string;
  };
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
  status: string;
}
