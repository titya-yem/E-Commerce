import { useState } from "react";
import type { RootState } from "@/store/store";
import type { Order } from "@/types/orderTypes";
import { Box, Heading, Text, Flex, Button } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import UserOrderDetails from "./userDetailOrder";

const UserOrders = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["Orders"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/order/me`
      );
      return res.data;
    },
  });

  if (isLoading)
    return <Heading className="text-center py-10">Loading...</Heading>;
  if (isError)
    return (
      <Heading className="text-center py-10">
        Error: {(error as Error).message}
      </Heading>
    );
  if (!data || data.length === 0)
    return <Heading className="text-center py-10">No Order available</Heading>;

  // Pagination calculations
  const totalPages = Math.ceil(data.length / ordersPerPage);
  const currentOrders = data.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  return (
    <div className="px-6 md:px-4 mx-auto md:mx-0 mb-4 md:mb-0 2xl:w-[1600px] 2xl:mx-auto">
      <h2 className="block text-xl md:text-2xl text-center md:text-left py-5 font-medium">
        Order
      </h2>

      <Box className="p-2 rounded-md bg-white flex-1 min-h-[580px] xl:max-h-[600px]">
        <div className="hidden xl:grid xl:grid-cols-[100px_250px_170px_140px_140px_140px] 2xl:grid-cols-[150px_300px_200px_180px_150px_150px] border-b border-gray-300 p-4 text-center">
          <Text as="p">Names</Text>
          <Text as="p">Emails</Text>
          <Text as="p">Products</Text>
          <Text as="p">Date</Text>
          <Text as="p">Amount</Text>
          <Text as="p">Payment</Text>
        </div>

        {currentOrders.map((order: Order) => (
          <div
            key={order._id}
            className="grid md:grid-cols-3 gap-2 p-4 border-b text-center xl:grid-cols-[100px_250px_170px_140px_140px_140px] 2xl:grid-cols-[150px_300px_200px_180px_150px_150px] *:text-sm *:font-medium xl:gap-0 xl:border-none"
          >
            <Text className="text-blue-500">
              <Text as="span" className="lg:hidden">
                Name:{" "}
              </Text>
              {user?.userName ?? "N/A"}
            </Text>

            <Text className="underline text-cyan-500">
              <Text as="span" className="lg:hidden">
                Email:{" "}
              </Text>
              <a href={`mailto:${order.user?.email}`}>
                {order.user?.email ?? "N/A"}
              </a>
            </Text>

            <Box>
              <UserOrderDetails order={order} />
            </Box>

            <Text className="font-medium rounded-md text-purple-500">
              <Text as="span" className="lg:hidden">
                Date:{" "}
              </Text>
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "N/A"}
            </Text>

            <Text className="font-medium rounded-md text-amber-500">
              <Text as="span" className="lg:hidden">
                Amount:{" "}
              </Text>
              ${order.totalAmount?.toFixed(2) ?? "0.00"}
            </Text>

            <Text className="font-medium rounded-md">
              <Text as="span" className="lg:hidden">
                Status:{" "}
              </Text>
              {order.status === "Pending" ? (
                <Text as="p" color="indigo">
                  Paid
                </Text>
              ) : (
                <Text as="p" color="green">
                  Shipped
                </Text>
              )}
            </Text>
          </div>
        ))}
      </Box>

      {/* Pagination */}
      <Flex justify="end" gap="2" className="my-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            size={{ initial: "1", sm: "2" }}
            variant={page === currentPage ? "solid" : "soft"}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}
      </Flex>
    </div>
  );
};

export default UserOrders;
