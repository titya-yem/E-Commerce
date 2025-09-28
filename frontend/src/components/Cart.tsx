import {
  clearCart,
  addToCart,
  decreaseQuantity,
} from "@/store/slices/Cart-Slice";
import { Box, Text } from "@radix-ui/themes";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import type { CartItem, RootState } from "../types/cartTypes";
import { Button } from "./ui/button";
import { useState } from "react";

const Cart = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const totalPrice = cart.items.reduce(
    (total: number, item: CartItem) => total + item.price * item.quantity,
    0
  );

  const handleDecrease = (itemId: string) => {
    dispatch(decreaseQuantity(itemId));
  };

  const handleIncrease = (item: CartItem) => {
    dispatch(addToCart({ ...item, category: item.category ?? "" }));
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-checkout-session`,
        {
          cart: cart.items,
          totalAmount: totalPrice,
          totalQuantity: cart.totalQuantity,
        },
        { withCredentials: true }
      );

      if (res.data.sessionUrl) {
        toast.success("Redirecting to checkout...");
        dispatch(clearCart());
        window.location.href = res.data.sessionUrl;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Stripe checkout failed:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Stripe checkout failed. Please try again.";
      toast.error(message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Box className="px-4 py-6 w-full">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white min-h-screen max-w-4xl mx-auto rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 px-2 sm:px-4 pt-4">
          <h1 className="text-2xl font-bold text-[#1F272B]">Your Cart</h1>
          <Text as="p" className="text-gray-600">
            Total Items:{" "}
            <Text as="span" weight="medium">
              {cart.totalQuantity}
            </Text>
          </Text>
        </div>

        {cart.items.length === 0 ? (
          <Text
            as="p"
            className="text-center border-b pb-4 text-gray-500 px-2 sm:px-4"
          >
            Your cart is empty.
          </Text>
        ) : (
          <div className="space-y-4 px-2 sm:px-4 pb-4">
            {cart.items.map((item: CartItem) => (
              <div
                key={item.id}
                className="grid grid-cols-[1fr] md:grid-cols-[2fr_1fr_1fr] gap-y-4 md:gap-y-0 md:gap-x-4 p-3 md:p-4 items-center border rounded-lg w-full"
              >
                {/* Product info */}
                <div className="flex justify-between md:justify-start items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain flex-shrink-0"
                  />
                  <div className="min-w-0 text-right md:text-left">
                    <Text as="p" className="font-medium text-[#1F272B]">
                      {item.name}
                    </Text>
                    <Text as="p" size="2" className="text-gray-600">
                      ${item.price.toFixed(2)}
                    </Text>
                  </div>
                </div>

                {/* Quantity */}
                <div className="w-2/3 md:w-4/5 mx-auto flex justify-between items-center border rounded-md">
                  <Button
                    variant="ghost"
                    className="px-2 h-8 cursor-pointer"
                    onClick={() => handleDecrease(item.id)}
                  >
                    -
                  </Button>
                  <Text as="p" weight="medium" className="text-gray-600 mx-1">
                    {item.quantity}
                  </Text>
                  <Button
                    variant="ghost"
                    className="px-2 h-8 cursor-pointer"
                    onClick={() => handleIncrease(item)}
                  >
                    +
                  </Button>
                </div>

                {/* Subtotal */}
                <div className="flex justify-center md:justify-end">
                  <Text
                    as="p"
                    className="text-gray-600 text-center md:text-right"
                  >
                    Qty: {item.quantity}{" "}
                    <Text as="span" weight="bold" className="text-[#FF6135]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </Text>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total & Checkout */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t">
          <Text as="p" className="text-xl font-bold text-[#1F272B]">
            Total:{" "}
            <Text as="span" className="text-xl font-bold text-[#FF6135]">
              ${totalPrice.toFixed(2)}
            </Text>
          </Text>
          <Button
            className="px-6 py-6 md:py-5 w-full sm:w-auto bg-[#FF6135] text-white hover:bg-[#e55831] disabled:opacity-50"
            disabled={cart.items.length === 0 || isCheckingOut}
            onClick={handleCheckout}
          >
            {isCheckingOut ? "Processing..." : "Checkout"}
          </Button>
        </div>
      </div>
    </Box>
  );
};

export default Cart;
