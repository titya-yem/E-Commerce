import type { Product } from "@/types/productTypes";
import { Box, Button, Dialog, Flex, Heading, Text } from "@radix-ui/themes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import ProductEditForm from "@/components/dashboard/AdminProductForm";
import AdminAddProduct from "@/components/dashboard/AdminAddProduct";

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const productsPerPage = 7;

  const { data, isLoading, isError, error } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/product`);
      return res.data;
    },
  });

  const updateProduct = useMutation({
    mutationFn: async (updatedProduct: Partial<Product> & { _id: string }) => {
      const { _id, ...data } = updatedProduct;
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/product/${_id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully");
      setEditingProduct(null);
    },
    onError: () => {
      toast.error("Failed to update product");
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/product/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
      setEditingProduct(null);
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });

  if (isLoading) return <Heading className="text-center py-10">Loading...</Heading>;
  if (isError) return <Heading className="text-center py-10">Error: {(error as Error).message}</Heading>;
  if (!data || data.length === 0) return <Heading className="text-center py-10">No products available</Heading>;

  const sortedData = data.slice().sort((a, b) =>
    new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
  );

  const totalPages = Math.ceil(sortedData.length / productsPerPage);
  const currentProducts = sortedData.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  return (
    <div className="pl-4 w-full">
      <Flex justify="between" align="center">
        <h2 className="text-xl lg:text-2xl xl:w-3xl py-5 font-medium">Products</h2>
        <Button 
        mr="4"
        size="2"
        onClick={() => setAddingProduct(true)}>
          + Add Product
        </Button>
      </Flex>

      <Box className="w-[99%] p-2 rounded-md bg-white overflow-x-auto min-h-[580px]">
        <Box className="overflow-x-auto">
          <div className="p-4 text-center grid grid-cols-[158px_260px_150px_220px_200px_150px] border-b border-gray-300">
            <Text>Images</Text>
            <Text>Name of Products</Text>
            <Text>Categories</Text>
            <Text>Stocks</Text>
            <Text>Prices</Text>
            <Text>Actions</Text>
          </div>

          {currentProducts.map((product: Product) => (
            <div key={product._id} className="p-3 text-sm text-center grid grid-cols-[160px_260px_150px_220px_200px_150px] border-b border-gray-200">
              <img src={product.image} alt={product.name} className="w-12 h-12 object-contain rounded-md mx-auto" />
              <Text className="pt-1 font-medium text-gray-500">{product.name}</Text>
              <Text className="pt-1 font-medium text-gray-500">{product.category}</Text>
              <Text className="pt-1 font-medium text-gray-500">
                {product.stock <= 50 ? <><span>{product.stock}</span> <span className="text-red-500 font-medium">Low stocks</span></> : product.stock}
              </Text>
              <Text className="pt-1 font-medium text-gray-500">${product.price}</Text>
              <Button onClick={() => setEditingProduct(product)}>Edit Product</Button>
            </div>
          ))}

          {/* Edit Product Dialog */}
          {editingProduct && (
            <Dialog.Root open={true} onOpenChange={(open) => !open && setEditingProduct(null)}>
              <Dialog.Content maxWidth="800px">
                <Dialog.Title>Edit Product</Dialog.Title>
                <Dialog.Description size="2" mb="2">Update product details below.</Dialog.Description>
                <ProductEditForm
                  product={editingProduct}
                  onCancel={() => setEditingProduct(null)}
                  onSave={(updated) => updateProduct.mutate({ ...updated, _id: editingProduct!._id })}
                  onDelete={() => deleteProduct.mutate(editingProduct._id)}
                />
              </Dialog.Content>
            </Dialog.Root>
          )}

          {/* Add Product Dialog */}
          {addingProduct && (
            <Dialog.Root open={true} onOpenChange={(open) => !open && setAddingProduct(false)}>
              <Dialog.Content maxWidth="800px">
                <Dialog.Title>Add Product</Dialog.Title>
                <Dialog.Description size="2" mb="2">Fill in the product details below.</Dialog.Description>
                <AdminAddProduct />
                <Flex justify="end" mt="4">
                  <Button variant="soft" color="gray" onClick={() => setAddingProduct(false)}>Cancel</Button>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>
          )}
        </Box>
      </Box>

      {/* Pagination */}
      <Flex justify="end" gap="2" className="mr-4 my-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            size="2"
            variant={page === currentPage ? "solid" : "soft"}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}
      </Flex>
    </div>
  );
};

export default AdminProducts;
