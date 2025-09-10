import type { RootState } from "@/store/store";
import type { Order } from "@/types/orderTypes";
import { Box, Button, Dialog, Flex, Heading, Select, Table, Text } from "@radix-ui/themes";
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
      queryClient.invalidateQueries({ queryKey: ["orders"] });
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
                  <Text as="p" className="font-medium rounded-md text-cyan-500">{order.user?.email}</Text>
                  
                  {/* View each orders details */}
                 <Dialog.Root>
                    <Dialog.Trigger>
                      <Button>View orders</Button>
                    </Dialog.Trigger>
                    <Dialog.Content>
                      <Dialog.Title>Orders</Dialog.Title>
                      <Dialog.Description mb="2">
                        The following orders of the user.
                      </Dialog.Description>

                      {/* scrollable area inside */}
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
                            {order.items.map((item) => (
                              <Table.Row key={item.id}>
                                <Table.RowHeaderCell>
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-12 mx-auto object-cover rounded-md"
                                  />
                                </Table.RowHeaderCell>
                                <Table.Cell className="font-medium">{item.name}</Table.Cell>
                                <Table.Cell className="pl-6">{item.category}</Table.Cell>
                                <Table.Cell>{item.quantity}</Table.Cell>
                                <Table.Cell>${item.price.toFixed(2)}</Table.Cell>
                              </Table.Row>
                            ))}
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

                  <Text as="p" className="font-medium rounded-md text-rose-500">{order.totalQuantity} products</Text>
                  <Text as="p" className="font-medium rounded-md text-amber-500">${order.totalAmount.toFixed(2)}</Text>
                  
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
