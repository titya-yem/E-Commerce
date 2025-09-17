/* eslint-disable @typescript-eslint/no-explicit-any */
import { clearCart, removeFromCart } from "@/store/slices/Cart-Slice";
import { Box, Container, Text } from "@radix-ui/themes";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import type { CartItem, RootState } from "../types/cartTypes";
import { Button } from "./ui/button";

const Cart = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const totalPrice = cart.items.reduce(
    (total: number, item: CartItem) => total + item.price * item.quantity,
    0
  );

  const handleRemoveItem = (itemId: number) => {
    dispatch(removeFromCart(itemId.toString()));
  };

  const handleCheckout = async () => {
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
      }

    } catch (error: any) {
      console.error("Stripe checkout failed:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Stripe checkout failed. Please try again.";

      toast.error(message);
    }
  };

  return (
    <Box className="bg-[#1F272B] ">
      <Toaster position="top-center" reverseOrder={false} />
      <Container className="bg-white p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1F272B]">Your Cart</h1>
          <Text as="p" className="text-gray-600">
            Total Items: {cart.totalQuantity}
          </Text>
        </div>

        {cart.items.length === 0 ? (
          <Text as="p" className="text-center text-gray-500">
            Your cart is empty.
          </Text>
        ) : (
          <div className="space-y-4">
            {cart.items.map((item: CartItem) => (
              <div
                key={item.id}
                className="grid grid-cols-3 bg-gray-50 p-4 rounded-lg items-center"
              >
                {/* Product info */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <Text as="p" className="font-medium text-[#1F272B]">
                      {item.name}
                    </Text>
                    <Text as="p" className="text-gray-600">
                      ${item.price.toFixed(2)}
                    </Text>
                  </div>
                </div>

                {/* Quantity & subtotal */}
                <div className="flex justify-center">
                  <Text as="p" className="pr-2 text-gray-600">
                    Qty: {item.quantity}
                  </Text>
                  <Text as="p" className="text-[#FF6135] font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </div>

                {/* Remove button */}
                <div className="flex justify-end">
                  <Button
                    className="cursor-pointer bg-red-500 hover:bg-red-400 text-white"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 border-t pt-6 flex justify-between items-center">
          <Text as="p" className="text-xl font-bold text-[#1F272B]">
            Total:
          </Text>
          <Text as="p" className="text-xl font-bold text-[#FF6135]">
            ${totalPrice.toFixed(2)}
          </Text>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            className="px-8 py-5 bg-[#FF6135] text-white hover:bg-[#e55831] cursor-pointer"
            disabled={cart.items.length === 0}
            onClick={handleCheckout}
          >
            Checkout
          </Button>
        </div>
      </Container>
    </Box>
  );
};

export default Cart;
