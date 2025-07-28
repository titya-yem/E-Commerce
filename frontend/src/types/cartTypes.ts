  export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }

  interface CartState {
    items: CartItem[];
    totalQuantity: number;
  }

  export interface RootState {
    cart: CartState;
  }