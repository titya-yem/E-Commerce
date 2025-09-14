/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, Grid, Text, TextField } from "@radix-ui/themes";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import type { ServiceFormData } from "@/types/serviceTypes";

interface AdminAddServicesProps {
  onSuccess?: () => void; // ✅ optional callback prop
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
      await axios.post(`${import.meta.env.VITE_API_URL}/api/service/create`, data);
      toast.success("Service added successfully!");
      reset();
      if (onSuccess) onSuccess(); // ✅ call callback after success
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add service");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid columns="2" gap="4">
        {/* Left Column */}
        <Grid columns="1" gap="4">
          {/* Title */}
          <label>
            <Text as="p" size="2" mb="1" weight="bold">Title</Text>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField.Root {...field} placeholder="Enter service title" />
              )}
            />
          </label>

          {/* Price + Duration */}
          <Flex gap="4" mt="9" align="center" justify="between">
            <label className="flex-1">
              <Text as="p" size="2" mb="1" weight="bold">Price</Text>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField.Root {...field} type="number" placeholder="Enter price" />
                )}
              />
            </label>

            <label className="flex-1">
              <Text as="p" size="2" mb="1" weight="bold">Duration</Text>
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

          {/* Alt Text */}
          <label>
            <Text as="p" size="2" mb="1" weight="bold">Alt Text</Text>
            <Controller
              name="alt"
              control={control}
              render={({ field }) => (
                <TextField.Root {...field} placeholder="Enter alt text (for accessibility)" />
              )}
            />
          </label>
        </Grid>

        {/* Right Column */}
        <Grid columns="1" gap="4">
          {/* Description */}
          <label>
            <Text as="p" size="2" mb="1" weight="bold">Description</Text>
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

          {/* Image URL */}
          <label>
            <Text as="p" size="2" mb="1" weight="bold">Image (Link)</Text>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Enter image URL"
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
        </Grid>
      </Grid>

      {/* Submit button */}
      <Flex gap="2" mt="4" justify="end">
        <Button type="submit">Add Service</Button>
      </Flex>
    </form>
  );
};

export default AdminAddServices;
