/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Order } from "@/types/orderTypes";
import { Button, Flex } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import AdminOrderTable from "@/components/dashboard/adminOrderTable";

const AdminOrders: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;

  const { isLoading, isError, data, error } = useQuery<Order[], Error>({
    queryKey: ["orders"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/order`);
        return res.data as Order[];
      } catch (err: any) {
        if (err.response?.status === 404) return [];
        throw new Error(err.response?.data?.message || "Failed to fetch orders");
      }
    },
  });

  if (isLoading) return <h1 className="text-xl text-center mt-10">Loading...</h1>;
  if (isError) return <h1 className="text-xl text-center mt-10">Error: {error?.message}</h1>;
  if (!data || data.length === 0) return <h1 className="text-xl mt-10 text-center">No Orders Available</h1>;

  // Sort by date
  const sortedData = data.slice().sort(
    (a, b) => new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime()
  );

  // Pagination
  const totalPages = Math.ceil(sortedData.length / ordersPerPage);
  const currentOrders = sortedData.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  return (
    <div className="flex flex-col min-h-screen px-2 xl:px-4 w-full">
      <h2 className="text-xl lg:text-2xl text-center lg:text-left py-5 font-medium">Orders</h2>

      <AdminOrderTable currentOrders={currentOrders} />

      {/* Pagination */}
      <Flex justify="end" gap="2" className="mr-4 my-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            size="2"
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

export default AdminOrders;
