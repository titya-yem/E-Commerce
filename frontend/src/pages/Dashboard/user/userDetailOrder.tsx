import { Button, Dialog, Flex, Table, Text } from "@radix-ui/themes";
import type { Order } from "@/types/orderTypes";

interface UserOrderDetailsProps {
  order: Order;
}

const UserOrderDetails: React.FC<UserOrderDetailsProps> = ({ order }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="outline">View Details</Button>
      </Dialog.Trigger>

      <Dialog.Content className="w-full max-w-4xl p-4">
        <Dialog.Title className="text-xl font-semibold mb-2">Order Details</Dialog.Title>
        <Dialog.Description mb="4" className="text-sm text-gray-600">
          Products in this order.
        </Dialog.Description>

        <div className="max-h-[60vh] overflow-y-auto rounded-md border border-gray-200">
          {/* Mobile view */}
          <div className="md:hidden p-2 space-y-4">
            {order.items?.length ? (
              order.items.map((item) => (
                <div key={item.id} className="p-2 border rounded-md flex flex-col gap-1">
                  <img src={item.image} alt={item.name} className="h-20 w-full object-contain rounded-md mb-2" />
                  <Text className="font-medium">{item.name}</Text>
                  <Text className="text-gray-500">{item.category}</Text>
                  <Text>Quantity: {item.quantity}</Text>
                  <Text>Price: ${item.price?.toFixed(2) ?? "0.00"}</Text>
                </div>
              ))
            ) : (
              <Text className="text-center py-4">No items</Text>
            )}
          </div>

          {/* Desktop view */}
          <div className="hidden md:block">
            <Table.Root>
              <Table.Header>
                <Table.Row className="text-center">
                  <Table.ColumnHeaderCell>Image</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Quantity</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {order.items?.length ? (
                  order.items.map((item) => (
                    <Table.Row key={item.id}>
                      <Table.RowHeaderCell>
                        <img src={item.image} alt={item.name} className="h-12 object-cover mx-auto rounded-md" />
                      </Table.RowHeaderCell>
                      <Table.Cell className="text-center">{item.name ?? "N/A"}</Table.Cell>
                      <Table.Cell className="text-center">{item.category ?? "N/A"}</Table.Cell>
                      <Table.Cell className="text-center">{item.quantity ?? 0}</Table.Cell>
                      <Table.Cell className="text-center">${item.price?.toFixed(2) ?? "0.00"}</Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={5} className="text-center py-4">
                      No items
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>
          </div>
        </div>

        <Flex justify="end" className="pt-4">
          <Dialog.Close>
            <Button variant="soft" color="gray">Close</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default UserOrderDetails;
