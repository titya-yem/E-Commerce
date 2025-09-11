import type { Product } from "@/types/productTypes";
import { Button, Flex, Grid, Select, Text, TextField } from "@radix-ui/themes";
import { Controller, useForm } from "react-hook-form";

type ProductEditFormProps = {
  product: Product;
  onCancel: () => void;
  onSave: (updated: Partial<Product> & { _id: string }) => void;
  onDelete: () => void;
};

const ProductEditForm = ({ product, onCancel, onSave, onDelete }: ProductEditFormProps) => {
  const categories = ["cat", "dog", "bird", "rabbit", "goldfish"];

  const { handleSubmit, control } = useForm<Partial<Product>>({
    defaultValues: product,
  });

  const onSubmit = (data: Partial<Product>) => {
    const updatedProduct: Partial<Product> & { _id: string } = {
      _id: product._id,
      name: data.name?.trim() || product.name,
      price: Number(data.price) > 0 ? Number(data.price) : product.price,
      stock: Number(data.stock) >= 0 ? Number(data.stock) : product.stock,
      rating: Number(data.rating) >= 0 ? Number(data.rating) : product.rating,
      reviews: Number(data.reviews) >= 0 ? Number(data.reviews) : product.reviews || 0,
      category: data.category && categories.includes(data.category) ? data.category : product.category,
      description: data.description?.trim() || product.description,
      image: data.image?.trim() || product.image,
    };
    onSave(updatedProduct);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid columns="2" gap="4">
        {/* Left Column */}
        <Grid columns="1" gap="4">
          {/* Name */}
          <label>
            <Text as="p" size="2" mb="1" weight="bold">Name</Text>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <TextField.Root {...field} placeholder="Enter product name" />}
            />
          </label>

          {/* Stock + Category + Price */}
          <Flex gap="4" align="center" justify="between">
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
                  <Select.Root value={field.value || "cat"} onValueChange={field.onChange}>
                    <Select.Trigger color="crimson" variant="soft">{field.value || "Select category"}</Select.Trigger>
                    <Select.Content color="crimson">
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
          <Flex gap="4">
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
        </Grid>

        {/* Right Column */}
        <Grid columns="1" gap="4">
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

          <label>
            <Text as="p" size="2" mb="1" weight="bold">Image (Link)</Text>
            <Controller
              name="image"
              control={control}
              render={({ field }) => <TextField.Root {...field} placeholder="Enter image URL" />}
            />
          </label>
        </Grid>
      </Grid>

      <Flex gap="2" mt="4" justify="between">
        <Button color="red" variant="soft" onClick={onDelete}>Delete</Button>
        <Flex gap="2">
          <Button variant="soft" color="gray" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save</Button>
        </Flex>
      </Flex>
    </form>
  );
};

export default ProductEditForm;
