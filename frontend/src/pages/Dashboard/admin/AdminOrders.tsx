import type { Order } from "@/types/orderTypes";
import { Button, Flex } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import AdminOrderTable from "@/components/dashboard/admin/AdminOrderTable";
import SearchText from "@/components/shared/SearchText";

const AdminOrders: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;

  const { isLoading, isError, data, error } = useQuery<Order[], Error>({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/order/me`
      );
      return res.data;
    },
  });

  if (isLoading)
    return <h1 className="text-xl text-center mt-10">Loading...</h1>;
  if (isError)
    return (
      <h1 className="text-xl text-center mt-10">Error: {error?.message}</h1>
    );
  if (!data || data.length === 0)
    return <h1 className="text-xl mt-10 text-center">No Orders Available</h1>;

  // Sort by date
  const sortedData = data
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? "").getTime() -
        new Date(a.createdAt ?? "").getTime()
    );

  const filteredData = sortedData.filter((order) => {
    const name = order.user?.userName?.toLowerCase() || "";
    const email = order.user?.email?.toLowerCase() || "";
    return (
      name.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase())
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / ordersPerPage)
  );
  const currentOrders = filteredData.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  return (
    <div className="flex flex-col min-h-screen px-4 w-full 2xl:w-[1600px] 2xl:mx-auto">
      <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center">
        <h2 className="text-xl lg:text-2xl xl:w-3xl text-center lg:text-left pt-5 font-medium">
          Orders
        </h2>

        <SearchText
          value={search}
          onChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search by name or email"
        />
      </div>

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
