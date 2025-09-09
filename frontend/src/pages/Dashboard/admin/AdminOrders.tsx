import type { RootState } from "@/store/store";
import type { Order } from "@/types/orderTypes";
import { Box, Flex, Heading, Select, Text } from "@radix-ui/themes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";

const AdminOrders: React.FC = () => {
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.auth.user)

  const { isLoading, isError, data, error } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/order`);
      return res.data;
    },
  })

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/api/order/${id}/status`,
        { status }
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    }
  })

  console.log(data)
  if (isLoading) return <h1 className="text-xl text-center">Loading...</h1>;
  if (isError) return <h1 className="text-xl text-center">Error: {(error as Error).message}</h1>;
  if (!data) return <h1 className="text-xl text-center">No Products Available</h1>;

  return (
    <div className="pl-4 w-full">
      <h2 className="text-xl lg:text-2xl xl:w-3xl py-5 font-medium">
        Orders
      </h2>

      <Box className="w-[99%] p-2 rounded-md bg-white max-overflow-y-auto">
        {data.length === 0 ? (
          <Heading as="h1" className="text-center py-10">
            No appointments
          </Heading>
        ) : (
          <Box className="overflow-x-auto">
            {/* Header */}
            <div className="p-4 text-center grid grid-cols-[150px_300px_200px_150px_150px_150px] border-b border-gray-300">
              <Text as="p">Names</Text>
              <Text as="p">Emails</Text>
              <Text as="p">Products</Text>
              <Text as="p">Quantity</Text>
              <Text as="p">Amount</Text>
              <Text as="p">Status</Text>
            </div>

            {/* Rows */}
            {data.map((order: Order ) => {
              return (  
                <div
                  key={order._id}
                  className="p-4 *:text-sm text-center grid grid-cols-[150px_300px_200px_150px_150px_150px]"
                >
                  <Text as="p" className="font-medium rounded-md text-blue-500">{user?.userName}</Text>
                  <Text as="p" className="font-medium rounded-md text-cyan-500">{order.user}</Text>
                  <Text as="p" className="font-medium rounded-md text-teal-500">
                    {order.items.map((item) => item.name).join(", ")}
                  </Text>
                  <Text as="p" className="font-medium rounded-md text-rose-500">{order.totalQuantity}</Text>
                  <Text as="p" className="font-medium rounded-md text-rose-500">${order.totalAmount.toFixed(2)}</Text>
                  {/* combobox to change status */}
                  <Flex className="pl-7">
                    <Select.Root
                      size="2"
                      defaultValue={order.status}
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
              )
            })}
          </Box>
        )}
      </Box>
    </div>
  )
}

export default AdminOrders
