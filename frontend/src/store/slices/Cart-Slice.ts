import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Define the cart item type
interface CartItem {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    image: string;
    description?: string;
    priceId?: string; // if Stripe Products API is used
}

// Define the initial state type
interface CartState {
    items: CartItem[];
    totalPrice: number;
    totalQuantity: number;
}

// Initial state
const initialState: CartState = {
    items: [],
    totalPrice: 0,
    totalQuantity: 0,
}

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            // Check if the item already exists in the cart
            const existingItem = state.items.find(item => item.id === action.payload.id)

            // If the item exists, increment its quantity 
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                // If the item doesn't exist, add it to the cart
                state.items.push({ ...action.payload, quantity: 1 });
            }

            // Update the total price and total quantity
            state.totalQuantity += 1;
            state.totalPrice += action.payload.price;
        },

        removeFromCart: (state, action: PayloadAction<string>) => {
            const itemToRemove = state.items.find(item => item.id === action.payload);

            // If the item exists, decrement its quantity and remove it from the cart
            if (itemToRemove) {
                state.items = state.items.filter(item => item.id !== action.payload);
                state.totalPrice -= itemToRemove.price * itemToRemove.quantity;
                state.totalQuantity -= itemToRemove.quantity;
            }
        },

        decreaseQuantity: (state, action: PayloadAction<string>) => {
            const item = state.items.find(item => item.id === action.payload)
        
            if(item) {
                if(item.quantity > 1) {
                    item.quantity -= 1
                    state.totalQuantity -= 1
                    state.totalPrice -= item.price
                } else {
                    state.items = state.items.filter(item => item.id !== action.payload)
                }
                state.totalQuantity -= 1
                state.totalPrice -= item.price
            }
        },

        clearCart : (state) => {
            state.items = []
            state.totalPrice = 0
            state.totalQuantity = 0
        }
    },
}) 

export const { addToCart, removeFromCart, decreaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;