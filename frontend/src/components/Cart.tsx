import { removeFromCart } from "@/store/slices/Cart-Slice";
import { Box, Container, Text } from "@radix-ui/themes";
import { useDispatch, useSelector } from "react-redux";
import type { CartItem, RootState } from "../types/cartTypes";
import { Button } from "./ui/button";


const Cart = () => {

  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const totalPrice = cart.items.reduce(
    (total: number, item: CartItem) => total + item.price * item.quantity, 0);

  const handleRemoveItem = (itemId: number) => {
    dispatch(removeFromCart(itemId.toString()));
  };

  return (
    <Box className="bg-[#1F272B] min-h-screen">
      <Container className="bg-white p-8">
        {/* Cart Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1F272B]">Your Cart</h1>
          <Text as="p" className="text-gray-600">
            Total Items: {cart.totalQuantity}
          </Text>
        </div>
        {/* Cart Items List */}
        {cart.items.length === 0 ? (
          <Text as="p" className="text-center text-gray-500">
            Your cart is empty.
          </Text>
        ) : (
          <div className="space-y-4">
            {cart.items.map((item: CartItem) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
              >
                {/* Product Image and Details */}
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
                {/* Quantity and Subtotal */}
                <div className="flex justify-center items-center gap-4">
                  <Text as="p" className="text-gray-600">
                    Qty: {item.quantity}
                  </Text>
                  <Text as="p" className="text-[#FF6135] font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </div>
                {/* Remove Button */}
                <Button
                  className="hidden md:block px-4 py-2 cursor-pointer bg-red-500 text-white hover:bg-red-600"
                  onClick={() => handleRemoveItem(item.id)} // Call the remove function
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
        {/* Total Price Section */}
        <div className="mt-8 border-t border-gray-200 pt-6 flex justify-between items-center">
          <Text as="p" className="text-xl font-bold text-[#1F272B]">
            Total:
          </Text>
          <Text as="p" className="text-xl font-bold text-[#FF6135]">
            ${totalPrice.toFixed(2)}
          </Text>
        </div>
        {/* Checkout Button */}
        <div className="mt-6 flex justify-end">
          <Button
            className="px-8 py-5 cursor-pointer bg-[#FF6135] text-white hover:bg-[#e55831]"
            disabled={cart.items.length === 0}
          >
            Checkout
          </Button>
        </div>
      </Container>
    </Box>
  );
};

export default Cart;