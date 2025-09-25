/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Service } from "@/types/serviceTypes";
import {
  Badge,
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Heading,
  Inset,
  Text,
  AlertDialog,
} from "@radix-ui/themes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import ServiceEditForm from "@/components/dashboard/admin/AdminServiceUpdate";
import AdminAddServices from "@/components/dashboard/admin/AdminAddServices";

const AdminServices = () => {
  const queryClient = useQueryClient();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);

  const { data, error, isError, isLoading } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/service`
      );
      return res.data.map((s: Service) => ({ ...s, id: s._id }));
    },
  });

  const updateService = useMutation({
    mutationFn: async (updatedService: Partial<Service> & { id: string }) => {
      const { id, ...data } = updatedService;
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/service/${id}`,
        data
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service updated successfully");
      setEditingService(null);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update service");
    },
  });

  const deleteService = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/service/${id}`
      );
      return res.data;
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete service");
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
    return (
      <Heading className="text-center py-10">No Services available</Heading>
    );

  return (
    <div className="px-4 w-full 2xl:w-[1600px] 2xl:mx-auto">
      <Flex justify="between" align="center">
        <h2 className="text-xl lg:text-2xl xl:w-3xl py-5 font-medium">
          Services
        </h2>
        <Button mr="4" size="2" onClick={() => setAddingProduct(true)}>
          + Add Service
        </Button>
      </Flex>

      <div className="flex flex-wrap gap-4 my-2 items-center justify-center 2xl:justify-start">
        {data.map((service: Service, index: number) => (
          <Box
            key={service._id || index}
            maxWidth="295px"
            className="overflow-auto"
          >
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
                  Duration:{" "}
                  {service.duration === 1
                    ? `${service.duration} day`
                    : `${service.duration} hours`}
                </Badge>
                <Badge color="cyan" size="3">
                  Price: ${service.price}
                </Badge>
              </Flex>

              <Text as="p" size="2" className="text-center text-gray-600">
                {service.description}
              </Text>

              <Flex align="center" justify="between" gap="4" pt="4">
                <Button
                  color="red"
                  onClick={() => setDeleteServiceId(service._id)}
                >
                  Delete
                </Button>
                <Button onClick={() => setEditingService(service)}>
                  Update
                </Button>
              </Flex>
            </Card>
          </Box>
        ))}

        {/* Add Service Dialog */}
        {addingProduct && (
          <Dialog.Root
            open={true}
            onOpenChange={(open) => !open && setAddingProduct(false)}
          >
            <Dialog.Content maxWidth="600px">
              <Dialog.Title>Add Service</Dialog.Title>
              <Dialog.Description size="2" mb="2">
                Fill in the service details below.
              </Dialog.Description>

              <AdminAddServices
                onSuccess={() => {
                  setAddingProduct(false);
                  queryClient.invalidateQueries({ queryKey: ["services"] });
                }}
              />

              <Flex justify="end" mt="4">
                <Button
                  variant="soft"
                  color="gray"
                  onClick={() => setAddingProduct(false)}
                >
                  Cancel
                </Button>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        )}

        {/* Update Service Dialog */}
        {editingService && (
          <Dialog.Root
            open={true}
            onOpenChange={(open) => !open && setEditingService(null)}
          >
            <Dialog.Content maxWidth="600px">
              <Dialog.Title>Update Service</Dialog.Title>
              <Dialog.Description size="2" mb="2">
                Edit service details below.
              </Dialog.Description>

              <ServiceEditForm
                service={editingService}
                onCancel={() => setEditingService(null)}
                onSave={(updated) => updateService.mutate(updated)}
                onDelete={() => setDeleteServiceId(editingService._id!)}
              />
            </Dialog.Content>
          </Dialog.Root>
        )}

        {/* Delete Confirmation AlertDialog */}
        <AlertDialog.Root
          open={!!deleteServiceId}
          onOpenChange={(open) => !open && setDeleteServiceId(null)}
        >
          <AlertDialog.Content maxWidth="400px">
            <AlertDialog.Title>Delete Service</AlertDialog.Title>
            <AlertDialog.Description size="2" mb="4">
              Are you sure you want to delete this service?{" "}
              <Text as="span" color="red" weight="medium">
                It will be permanently deleted.
              </Text>
            </AlertDialog.Description>

            <Flex justify="end" gap="2">
              <AlertDialog.Cancel>
                <Button
                  variant="soft"
                  color="gray"
                  onClick={() => setDeleteServiceId(null)}
                >
                  Cancel
                </Button>
              </AlertDialog.Cancel>

              <AlertDialog.Action>
                <Button
                  color="red"
                  onClick={() => {
                    if (deleteServiceId) {
                      deleteService.mutate(deleteServiceId, {
                        onSuccess: () => {
                          setDeleteServiceId(null);
                          queryClient.invalidateQueries({
                            queryKey: ["services"],
                          });
                          toast.success("Service deleted successfully");
                        },
                        onError: (err: any) => {
                          toast.error(
                            err?.response?.data?.message ||
                              "Failed to delete service"
                          );
                        },
                      });
                    }
                  }}
                >
                  Delete
                </Button>
              </AlertDialog.Action>
            </Flex>
          </AlertDialog.Content>
        </AlertDialog.Root>
      </div>
    </div>
  );
};

export default AdminServices;
