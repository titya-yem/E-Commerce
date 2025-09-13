import type { Service } from "@/types/serviceTypes";
import { Button, Grid, Text, TextField } from "@radix-ui/themes";
import { Controller, useForm } from "react-hook-form";

type ServiceEditFormProps = {
  service: Service;
  onCancel: () => void;
  onSave: (updated: Partial<Service> & { id: string }) => void;
  onDelete: () => void;
};

const ServiceEditForm = ({ service, onCancel, onSave }: ServiceEditFormProps) => {
  const { handleSubmit, control } = useForm<Partial<Service>>({
    defaultValues: service,
  });

  const onSubmit = (data: Partial<Service>) => {
    const updatedService: Partial<Service> & { id: string } = {
      id: service.id!,
      title: data.title?.trim() || service.title,
      price: Number(data.price) > 0 ? Number(data.price) : service.price,
      duration: Number(data.duration) > 0 ? Number(data.duration) : service.duration,
      description: data.description?.trim() || service.description,
      image: data.image?.trim() || service.image,
      alt: data.alt?.trim() || service.alt,
    };
    onSave(updatedService);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid columns="2" gap="4">
        <label>
          <Text as="p" size="2" mb="1" weight="bold">Title</Text>
          <Controller
            name="title"
            control={control}
            render={({ field }) => <TextField.Root {...field} placeholder="Enter service title" />}
          />
        </label>

        <label>
          <Text as="p" size="2" mb="1" weight="bold">Price</Text>
          <Controller
            name="price"
            control={control}
            render={({ field }) => <TextField.Root {...field} type="number" placeholder="Enter price" />}
          />
        </label>

        <label>
          <Text as="p" size="2" mb="1" weight="bold">Duration (hours)</Text>
          <Controller
            name="duration"
            control={control}
            render={({ field }) => <TextField.Root {...field} type="number" placeholder="Enter duration" />}
          />
        </label>

        <label>
          <Text as="p" size="2" mb="1" weight="bold">Image (URL)</Text>
          <Controller
            name="image"
            control={control}
            render={({ field }) => <TextField.Root {...field} placeholder="Enter image URL" />}
          />
        </label>

        {/* Description takes full row */}
        <label style={{ gridColumn: "span 2" }}>
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
      </Grid>

      <Grid columns="2" gap="2" mt="4">        <Button variant="soft" color="gray" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </Grid>
    </form>
  );
};

export default ServiceEditForm;
