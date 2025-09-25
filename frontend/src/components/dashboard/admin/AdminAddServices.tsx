/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, Grid, Text, TextField } from "@radix-ui/themes";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import type { ServiceFormData } from "@/types/serviceTypes";

interface AdminAddServicesProps {
  onSuccess?: () => void;
}

const AdminAddServices = ({ onSuccess }: AdminAddServicesProps) => {
  const { handleSubmit, control, reset } = useForm<ServiceFormData>({
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      duration: "",
      image: "",
      alt: "",
    },
  });

  const onSubmit = async (data: ServiceFormData) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/service/create`,
        data
      );
      toast.success("Service added successfully!");
      reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add service");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        gap="4"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "16px",
        }}
        className="sm:grid-cols-2"
      >
        {/* Left Column */}
        <Flex
          gap="4"
          mt="2"
          align="center"
          justify="between"
          className="flex-col sm:flex-row"
        >
          <label className="flex-1">
            <Text as="p" size="2" mb="1" weight="bold">
              Title
            </Text>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField.Root {...field} placeholder="Enter service title" />
              )}
            />
          </label>

          <label className="flex-1">
            <Text as="p" size="2" mb="1" weight="bold">
              Picture name
            </Text>
            <Controller
              name="alt"
              control={control}
              render={({ field }) => (
                <TextField.Root
                  {...field}
                  placeholder="Enter alt text (for accessibility)"
                />
              )}
            />
          </label>
        </Flex>

        <Flex
          gap="4"
          mt="2"
          align="center"
          justify="between"
          className="flex-col sm:flex-row"
        >
          <label className="flex-1">
            <Text as="p" size="2" mb="1" weight="bold">
              Price
            </Text>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField.Root
                  {...field}
                  type="number"
                  placeholder="Enter price"
                />
              )}
            />
          </label>

          <label className="flex-1 mt-2 sm:mt-0">
            <Text as="p" size="2" mb="1" weight="bold">
              Duration
            </Text>
            <Controller
              name="duration"
              control={control}
              render={({ field }) => (
                <TextField.Root
                  {...field}
                  placeholder="Duration (e.g. 2 or 2-3 hours)"
                />
              )}
            />
          </label>
        </Flex>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          <label>
            <Text as="p" size="2" mb="1" weight="bold">
              Description
            </Text>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Enter description"
                  style={{
                    width: "100%",
                    height: "100px",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    resize: "none",
                    overflowY: "auto",
                    fontSize: "14px",
                  }}
                />
              )}
            />
          </label>

          <label>
            <Text as="p" size="2" mb="1" weight="bold">
              Image (Link)
            </Text>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Enter image URL"
                  style={{
                    width: "100%",
                    height: "40px",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    resize: "none",
                    overflowY: "auto",
                    fontSize: "14px",
                  }}
                />
              )}
            />
          </label>
        </div>
      </Grid>

      {/* Submit button */}
      <Flex gap="2" mt="4" justify="end">
        <Button type="submit">Add Service</Button>
      </Flex>
    </form>
  );
};

export default AdminAddServices;
