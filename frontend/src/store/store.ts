import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/Auth-Slice";
import cartReducer from "./slices/Cart-Slice";

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        auth: authReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;