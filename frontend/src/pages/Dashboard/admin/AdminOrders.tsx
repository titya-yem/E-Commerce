/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RootState } from "@/store/store";
import type { Order } from "@/types/orderTypes";
import { Box, Button, Dialog, Flex, Select, Table, Text } from "@radix-ui/themes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import { useState } from "react";

const AdminOrders: React.FC = () => {
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.auth.user);

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

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/api/order/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  if (isLoading) return <h1 className="text-xl text-center">Loading...</h1>;
  if (isError) return <h1 className="text-xl text-center">Error: {error?.message}</h1>;
  if (!data || data.length === 0) return <h1 className="text-xl mt-10 mx-auto">No Orders Available</h1>;

  const sortedData = data.slice().sort(
    (a, b) => new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime()
  );

  const totalPages = Math.ceil(sortedData.length / ordersPerPage);
  const currentOrders = sortedData.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  return (
    <div className="flex flex-col min-h-screen pl-4 w-full">
      <h2 className="text-xl lg:text-2xl xl:w-3xl py-5 font-medium">Orders</h2>

      {/* Table container */}
      <Box className="w-[99%] p-2 rounded-md bg-white flex-1 overflow-x-auto">
        {/* Table Header */}
        <div className="p-4 text-center grid grid-cols-[150px_300px_200px_180px_150px_150px] border-b border-gray-300">
          <Text as="p">Names</Text>
          <Text as="p">Emails</Text>
          <Text as="p">Products</Text>
          <Text as="p">Date</Text>
          <Text as="p">Amount</Text>
          <Text as="p">Status</Text>
        </div>

        {/* Table Rows */}
        {currentOrders.map((order: Order) => (
          <div
            key={order._id}
            className="p-4 *:text-sm text-center grid grid-cols-[150px_300px_200px_180px_150px_150px]"
          >
            <Text className="font-medium rounded-md text-blue-500">
              {user?.userName ?? "N/A"}
            </Text>
            <Text className="font-medium rounded-md text-cyan-500">
              {order.user?.email ?? "N/A"}
            </Text>

            {/* Order Details Dialog */}
            <Dialog.Root>
              <Dialog.Trigger>
                <Button>View orders</Button>
              </Dialog.Trigger>
              <Dialog.Content>
                <Dialog.Title>Orders</Dialog.Title>
                <Dialog.Description mb="2">
                  The following orders of the user.
                </Dialog.Description>

                <div className="max-h-[60vh] overflow-y-auto rounded-md border">
                  <Table.Root>
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeaderCell>Image</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Product's names</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      {order.items?.map((item) => (
                        <Table.Row key={item.id}>
                          <Table.RowHeaderCell>
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-12 mx-auto object-cover rounded-md"
                            />
                          </Table.RowHeaderCell>
                          <Table.Cell className="font-medium">{item.name ?? "N/A"}</Table.Cell>
                          <Table.Cell className="pl-6">{item.category ?? "N/A"}</Table.Cell>
                          <Table.Cell>{item.quantity ?? 0}</Table.Cell>
                          <Table.Cell>${item.price?.toFixed(2) ?? "0.00"}</Table.Cell>
                        </Table.Row>
                      )) ?? (
                        <Table.Row>
                          <Table.Cell colSpan={5}>No items</Table.Cell>
                        </Table.Row>
                      )}
                    </Table.Body>
                  </Table.Root>
                </div>

                <Flex gap="3" justify="end" className="pt-4">
                  <Dialog.Close>
                    <Button variant="soft" color="gray">
                      Close
                    </Button>
                  </Dialog.Close>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>

            <Text className="font-medium rounded-md text-purple-500">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "N/A"}
            </Text>
            <Text className="font-medium rounded-md text-amber-500">
              ${order.totalAmount?.toFixed(2) ?? "0.00"}
            </Text>

            {/* Status Select */}
            <Flex className="pl-7">
              <Select.Root
                size="2"
                defaultValue={order.status ?? "Pending"}
                onValueChange={(value) => {
                  updateStatus.mutate({ id: order._id, status: value });
                }}
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

      {/* Pagination always at bottom */}
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
