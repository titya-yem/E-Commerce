/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, Grid, Select, Text, TextField } from "@radix-ui/themes";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import type { Product } from "@/types/productTypes";
import toast from "react-hot-toast";
import { useMediaQuery } from '@/hooks/useMediaQuery';

const AdminAddProduct = () => {
  const categories = ["cat", "dog", "bird", "rabbit", "goldfish"];

  const isMd = useMediaQuery('(min-width: 768px)');
  const isSm = useMediaQuery('(min-width: 640px)') && !isMd;

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: "",
      category: "cat",
      price: 0,
      stock: 0,
      rating: 0,
      reviews: 0,
      description: "",
      image: "",
    },
  });

  const onSubmit = async (data: Omit<Product, "_id" | "createdAt">) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/product/create`, data);
      toast.success("Product added successfully!");
      reset();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add product");
    }
  };

  const getGridColumn = (mobile: string, desktop: string) => isMd ? desktop : mobile;
  const getGridRow = (mobile: string, desktop: string) => isMd ? desktop : mobile;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        columns={isMd ? '2' : isSm ? '3' : '1'}
        gap="4"
        style={{ gridTemplateRows: 'auto auto auto auto auto' }}
      >
        {/* Name */}
        <label style={{ gridColumn: getGridColumn('1 / -1', '1'), gridRow: '1' }}>
          <Text as="p" size="2" mb="1" weight="bold">Name</Text>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <TextField.Root {...field} placeholder="Enter product name" />}
          />
        </label>

        {/* Stock + Category + Price */}
        <Flex
          gap="4"
          align="center"
          justify="between"
          style={{ gridColumn: getGridColumn('1 / -1', '1'), gridRow: '2' }}
        >
          <label className="flex-1">
            <Text as="p" size="2" mb="1" weight="bold">Stock</Text>
            <Controller
              name="stock"
              control={control}
              render={({ field }) => <TextField.Root {...field} type="number" placeholder="Enter stock" />}
            />
          </label>

          <label className="px-4">
            <Text as="p" size="2" mb="1" weight="bold">Category</Text>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select.Root value={field.value} onValueChange={field.onChange}>
                  <Select.Trigger />
                  <Select.Content position="popper">
                    {categories.map((c) => (
                      <Select.Item key={c} value={c}>{c}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              )}
            />
          </label>

          <label className="flex-1">
            <Text as="p" size="2" mb="1" weight="bold">Price</Text>
            <Controller
              name="price"
              control={control}
              render={({ field }) => <TextField.Root {...field} type="number" placeholder="Enter price" />}
            />
          </label>
        </Flex>

        {/* Rating + Reviews */}
        <Flex
          gap="4"
          style={{ gridColumn: getGridColumn('1 / -1', '1'), gridRow: '3' }}
        >
          <label className="flex-1">
            <Text as="p" size="2" mb="1" weight="bold">Rating</Text>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => <TextField.Root {...field} type="number" placeholder="Enter rating" />}
            />
          </label>

          <label className="flex-1">
            <Text as="p" size="2" mb="1" weight="bold">Reviews</Text>
            <Controller
              name="reviews"
              control={control}
              render={({ field }) => <TextField.Root {...field} type="number" placeholder="Enter reviews" />}
            />
          </label>
        </Flex>

        {/* Description — SPANS 2 ROWS on Desktop */}
        <label style={{ 
          gridColumn: getGridColumn('1 / -1', '2'), 
          gridRow: getGridRow('4', '1 / 3')
        }}>
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

        {/* Image — Starts at Row 3 on Desktop */}
        <label style={{ 
          gridColumn: getGridColumn('1 / -1', '2'), 
          gridRow: getGridRow('5', '3')
        }}>
          <Text as="p" size="2" mb="1" weight="bold">Image (Link)</Text>
          <Controller
            name="image"
            control={control}
            render={({ field }) => <TextField.Root {...field} placeholder="Enter image URL" />}
          />
        </label>
      </Grid>

      <Flex gap="2" mt="4" justify="end">
        <Button type="submit">Add Product</Button>
      </Flex>
    </form>
  );
};

export default AdminAddProduct;