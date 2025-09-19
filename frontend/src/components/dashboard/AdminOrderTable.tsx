import { Box, Flex, Select, Text } from "@radix-ui/themes";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Order } from "@/types/orderTypes";
import axios from "axios";
import toast from "react-hot-toast";
import AdminProductDetails from "./AdminOrderDetails";

interface AdminOrderTableProps {
  currentOrders: Order[];
}

const AdminOrderTable: React.FC<AdminOrderTableProps> = ({ currentOrders }) => {
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.auth.user);

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/api/order/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

  const deleteOrder = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/order/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order deleted successfully", { position: "top-center" });
    },
    onError: () => {
      toast.error("Failed to delete order", { position: "top-center" });
    },
  });

  return (
    <Box className="p-2 rounded-md bg-white flex-1">
      {/* Table Header */}
      <div className="hidden xl:grid xl:grid-cols-[100px_250px_150px_150px_150px_120px] 2xl:grid-cols-[150px_300px_200px_180px_150px_150px] border-b border-gray-300 p-4 text-center">
        <Text as="p">Names</Text>
        <Text as="p">Emails</Text>
        <Text as="p">Products</Text>
        <Text as="p">Date</Text>
        <Text as="p">Amount</Text>
        <Text as="p">Status</Text>
      </div>

      {/* Table Rows */}
      {currentOrders.map((order) => (
        <div
          key={order._id}
          className="grid md:grid-cols-3 gap-2 p-4 border-b text-center xl:grid-cols-[100px_250px_150px_150px_150px_120px] 2xl:grid-cols-[150px_300px_200px_180px_150px_150px] xl:gap-0 xl:border-none"
        >
          <Text className="rounded-md text-blue-500">{user?.userName ?? "N/A"}</Text>
          <Text className="rounded-md text-cyan-500">{order.user?.email ?? "N/A"}</Text>

          {/* View Order Details */}
          <Box className="w-2/3 xl:w-full mx-auto xl:mx-0">
            <AdminProductDetails order={order} onDelete={(id: string) => deleteOrder.mutate(id)} />
          </Box>

          <Text className="font-medium rounded-md text-purple-500">
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
              : "N/A"}
          </Text>

          <Text className="font-medium rounded-md text-amber-500">
            ${order.totalAmount?.toFixed(2) ?? "0.00"}
          </Text>

          {/* Status Select */}
          <Flex className="pl-0 xl:pl-7 mx-auto xl:mx-0 justify-center md:justify-start">
            <Select.Root
              size="2"
              defaultValue={order.status ?? "Pending"}
              onValueChange={(value) => updateStatus.mutate({ id: order._id, status: value })}
            >
              <Select.Trigger color="orange" variant="soft" />
              <Select.Content color="orange" position="popper">
                <Select.Item value="Paid">Paid</Select.Item>
                <Select.Item value="Cancelled">Cancelled</Select.Item>
                <Select.Item value="Pending">Pending</Select.Item>
                <Select.Item value="Shipped">Shipped</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>
        </div>
      ))}
    </Box>
  );
};

export default AdminOrderTable;
