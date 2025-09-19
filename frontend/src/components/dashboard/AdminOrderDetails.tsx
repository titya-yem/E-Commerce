import { AlertDialog, Button, Dialog, Flex, Table, Text } from "@radix-ui/themes";
import type { Order } from "@/types/orderTypes";

interface AdminOrdertDetailsProps {
  order: Order;
  onDelete: (id: string) => void;
}

const AdminOrderDetails: React.FC<AdminOrdertDetailsProps> = ({ order, onDelete }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>View orders</Button>
      </Dialog.Trigger>

      <Dialog.Content className="w-full max-w-4xl p-4">
        <Dialog.Title className="text-xl font-semibold mb-2">Orders</Dialog.Title>
        <Dialog.Description mb="4" className="text-sm text-gray-600">
          The following orders of the user.
        </Dialog.Description>

        {/* Table container */}
        <div className="max-h-[60vh] overflow-y-auto rounded-md border border-gray-200">
          {/* Mobile view */}
          <div className="md:hidden p-2 space-y-4">
            {order.items?.length ? (
              order.items.map((item) => (
                <div
                  key={item.id}
                  className="p-2 border rounded-md flex flex-col gap-1"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-full object-contain rounded-md mb-2"
                  />
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
                <Table.Row>
                  <Table.ColumnHeaderCell>Image</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Product's names</Table.ColumnHeaderCell>
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
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 object-cover rounded-md"
                        />
                      </Table.RowHeaderCell>
                      <Table.Cell className="font-medium">{item.name ?? "N/A"}</Table.Cell>
                      <Table.Cell>{item.category ?? "N/A"}</Table.Cell>
                      <Table.Cell>{item.quantity ?? 0}</Table.Cell>
                      <Table.Cell>${item.price?.toFixed(2) ?? "0.00"}</Table.Cell>
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

        {/* Actions */}
        <Flex gap="3" justify="end" className="pt-4">
          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <Button color="red">Delete</Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content maxWidth="450px">
              <AlertDialog.Title>Delete orders</AlertDialog.Title>
              <AlertDialog.Description size="2">
                Are you sure? This order will be{" "}
                <Text as="span" color="red" weight="medium">
                  permanently deleted
                </Text>.
              </AlertDialog.Description>

              <Flex gap="3" mt="4" justify="end">
                <AlertDialog.Cancel>
                  <Button variant="soft" color="gray">
                    Cancel
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button
                    variant="solid"
                    color="red"
                    onClick={() => onDelete(order._id)}
                  >
                    Delete orders
                  </Button>
                </AlertDialog.Action>
              </Flex>
            </AlertDialog.Content>
          </AlertDialog.Root>

          <Dialog.Close>
            <Button variant="soft" color="gray">
              Close
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AdminOrderDetails;
