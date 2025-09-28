  export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    category?: string;
  }

  interface CartState {
    items: CartItem[];
    totalQuantity: number;
  }

  export interface RootState {
    cart: CartState;
  }