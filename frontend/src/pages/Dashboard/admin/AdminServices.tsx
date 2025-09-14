/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Service } from "@/types/serviceTypes";
import { Badge, Box, Button, Card, Dialog, Flex, Heading, Inset, Text } from "@radix-ui/themes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import ServiceEditForm from "@/components/dashboard/AdminServiceUpdate";
import AdminAddServices from "@/components/dashboard/AdminAddServices";

const AdminServices = () => {
  const queryClient = useQueryClient();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [addingProduct, setAddingProduct] = useState(false);

  const { data, error, isError, isLoading } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/service`);
      return res.data.map((s: any) => ({ ...s, id: s._id }));
    },
  });

  const updateService = useMutation({
    mutationFn: async (updatedService: Partial<Service> & { id: string }) => {
      const { id, ...data } = updatedService;
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/service/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service updated successfully");
      setEditingService(null);
    },
    onError: () => toast.error("Failed to update service"),
  });

  const deleteService = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/service/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service deleted successfully");
      setEditingService(null);
    },
    onError: () => toast.error("Failed to delete service"),
  });

  if (isLoading) return <Heading className="text-center py-10">Loading...</Heading>;
  if (isError) return <Heading className="text-center py-10">Error: {(error as Error).message}</Heading>;
  if (!data || data.length === 0) return <Heading className="text-center py-10">No Services available</Heading>;

  return (
    <div className="pl-4 w-full">
      <Flex justify="between" align="center">
        <h2 className="text-xl lg:text-2xl xl:w-3xl py-5 font-medium">Services</h2>
        <Button 
          mr="4"
          size="2"
          onClick={() => setAddingProduct(true)}>
          + Add Service
        </Button>
      </Flex>

      <Flex wrap="wrap" gap="6" my="2">
        {data.map((service: Service, index: number) => (
          <Box key={service.id || index} maxWidth="280px">
            <Card size="2">
              <Inset clip="padding-box" side="top" pb="current">
                <img
                  src={service.image}
                  alt={service.title}
                  style={{
                    display: "block",
                    objectFit: "cover",
                    width: "100%",
                    height: 140,
                    backgroundColor: "var(--gray-5)",
                  }}
                />
              </Inset>

              <Text as="p" size="4" className="text-center pb-2" weight="bold">
                {service.title}
              </Text>

              <Flex align="center" justify="center" gap="2" className="pb-2">
                <Badge color="crimson" size="3">
                  Duration: {`${service.duration === 1 ? `${service.duration} day` : `${service.duration} hours`}`}
                </Badge>
                <Badge color="cyan" size="3">Price: ${service.price}</Badge>
              </Flex>

              <Text as="p" size="2" className="text-center text-gray-600">{service.description}</Text>

              <Flex align="center" justify="between" gap="4" pt="4">
                <Button color="red" onClick={() => deleteService.mutate(service.id)}>Delete</Button>
                <Button onClick={() => setEditingService(service)}>Update</Button>
              </Flex>
            </Card>
          </Box>
        ))}

        {/* Add Service Dialog */}
        <Box>
          {addingProduct && (
            <Dialog.Root open={true} onOpenChange={(open) => !open && setAddingProduct(false)}>
              <Dialog.Content maxWidth="800px">
                <Dialog.Title>Add Service</Dialog.Title>
                <Dialog.Description size="2" mb="2">Fill in the service details below.</Dialog.Description>
                
                <AdminAddServices
                  onSuccess={() => {
                    setAddingProduct(false); // ✅ close dialog
                    queryClient.invalidateQueries({ queryKey: ["services"] }); // ✅ refresh data
                  }}
                />

                <Flex justify="end" mt="4">
                  <Button variant="soft" color="gray" onClick={() => setAddingProduct(false)}>Cancel</Button>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>
          )}
        </Box>

        {/* Update Service Dialog */}
        {editingService && (
          <Dialog.Root open={true} onOpenChange={(open) => !open && setEditingService(null)}>
            <Dialog.Content maxWidth="600px">
              <Dialog.Title>Update Service</Dialog.Title>
              <Dialog.Description size="2" mb="2">
                Edit service details below.
              </Dialog.Description>

              <ServiceEditForm
                service={editingService}
                onCancel={() => setEditingService(null)}
                onSave={(updated) => updateService.mutate(updated)}
                onDelete={() => deleteService.mutate(editingService.id!)}
              />
            </Dialog.Content>
          </Dialog.Root>
        )}
      </Flex>
    </div>
  );
};

export default AdminServices;
