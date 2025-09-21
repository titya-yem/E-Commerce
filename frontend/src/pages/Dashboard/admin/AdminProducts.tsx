import type { Product } from "@/types/productTypes";
import { Box, Button, Dialog, Flex, Heading, Text } from "@radix-ui/themes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import AdminProductForm from "@/components/dashboard/admin/AdminProductForm";
import AdminAddProduct from "@/components/dashboard/admin/AdminAddProduct";

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
    <div className="px-6 lg:px-4 w-full">
      <Flex justify="between" align="center" className="gap-4 sm:gap-0">
        <h2 className="text-lg sm:text-xl md:text-2xl font-medium py-6">Products</h2>
        <Button 
          mr="4"
          size="2"
          onClick={() => setAddingProduct(true)}>
          + Add Product
        </Button>
      </Flex>

      <Box className="p-2 sm:p-4 rounded-md bg-white overflow-x-auto h-[590px] max-h-[600px]">
        <Box className="overflow-x-auto">

          {/* ===== TABLE HEADER (XL ONLY) ===== */}
          <div className="hidden xl:grid xl:grid-cols-[100px_230px_140px_150px_150px_120px] 2xl:grid-cols-[150px_300px_200px_180px_150px_150px] p-3 text-center gap-2 border-b border-gray-300">
            <Text>Images</Text>
            <Text>Name of Products</Text>
            <Text>Categories</Text>
            <Text>Stocks</Text>
            <Text>Prices</Text>
            <Text>Actions</Text>
          </div>

          {/* ===== PRODUCT ROWS ===== */}
          {currentProducts.map((product: Product) => (
            <div key={product._id} className="border-b border-gray-100 last:border-0">

              {/* ===== XL: TABLE ROW ===== */}
              <div className="hidden xl:grid xl:grid-cols-[100px_230px_140px_150px_150px_120px] 2xl:grid-cols-[150px_300px_200px_180px_150px_150px] p-3 text-sm text-center gap-2 items-center">
                <img src={product.image} alt={product.name} className="w-12 h-12 object-contain rounded-md mx-auto" />
                <Text className="pt-1 font-medium text-gray-500">{product.name}</Text>
                <Text className="pt-1 font-medium text-gray-500">{product.category}</Text>
                <Text className="pt-1 font-medium text-gray-500">
                  {product.stock <= 50 ? (
                    <>
                      <span>{product.stock}</span> <span className="text-red-500 font-medium">Low stocks</span>
                    </>
                  ) : product.stock}
                </Text>
                <Text className="pt-1 font-medium text-gray-500">${product.price}</Text>
                <Flex align="center" justify="center" className="min-w-0">
                  <Button size="2" className="whitespace-nowrap" onClick={() => setEditingProduct(product)}>
                    Edit Product
                  </Button>
                </Flex>
              </div>

              {/* ===== MD-LG: 2x3 GRID LAYOUT ===== */}
              <div className="hidden md:grid md:grid-cols-2 md:grid-rows-1 p-4 gap-4 xl:hidden">
                {/* Left Column: Image, Name, Price */}
                <div className="md:col-span-1 flex flex-col items-start">
                  <img src={product.image} alt={product.name} className="w-12 h-12 object-contain rounded-md mb-2" />
                  <Text className="font-medium text-gray-700 text-sm">{product.name}</Text>
                  <Text className="text-gray-500 text-sm">${product.price}</Text>
                </div>

                {/* Right Column: Category, Stock, Edit Button */}
                <div className="md:col-span-1 flex flex-col justify-between">
                  <Text className="text-gray-600 text-sm font-medium">Category: {product.category}</Text>
                  <Text className="text-gray-500 text-sm">
                    {product.stock <= 50 ? (
                      <>
                        <span>{product.stock}</span> <span className="text-red-500 font-medium">Low stocks</span>
                      </>
                    ) : (
                      product.stock
                    )}
                  </Text>
                  <Button
                    size="2"
                    variant="solid"
                    color="blue"
                    className="w-1/2 mt-2"
                    onClick={() => setEditingProduct(product)}
                  >
                    Edit Product
                  </Button>
                </div>
              </div>

              {/* ===== INITIAL (MOBILE): CARD ===== */}
              <div className="p-4 md:hidden">
                <div className="flex flex-col items-center text-center">
                  <img src={product.image} alt={product.name} className="w-12 h-12 object-contain rounded-md mb-3" />
                  <Text className="font-medium text-gray-700 text-sm mb-1">{product.name}</Text>
                  <Text className="text-gray-500 text-sm mb-3">${product.price}</Text>
                  <Text className="text-gray-600 text-sm font-medium mb-1">Category: {product.category}</Text>
                  <Text className="text-gray-500 text-sm mb-4">
                    {product.stock <= 50 ? (
                      <>
                        <span>{product.stock}</span> <span className="text-red-500 font-medium">Low stocks</span>
                      </>
                    ) : (
                      product.stock
                    )}
                  </Text>
                  <Button
                    size="2"
                    variant="solid"
                    color="blue"
                    onClick={() => setEditingProduct(product)}
                  >
                    Edit Product
                  </Button>
                </div>
              </div>

            </div>
          ))}

          {/* ===== DIALOGS — OUTSIDE SCROLL CONTAINER ===== */}
          {editingProduct && (
            <Dialog.Root open={true} onOpenChange={(open) => !open && setEditingProduct(null)}>
              <Dialog.Content className="w-full max-w-lg sm:max-w-2xl md:max-w-4xl lg:max-w-5xl max-h-screen p-4 sm:p-6 mx-auto overflow-y-auto">
                <Dialog.Title>Edit Product</Dialog.Title>
                <Dialog.Description size="2" mb="2">Update product details below.</Dialog.Description>
                <AdminProductForm
                  product={editingProduct}
                  onCancel={() => setEditingProduct(null)}
                  onSave={(updated) => updateProduct.mutate({ ...updated, _id: editingProduct!._id })}
                  onDelete={() => deleteProduct.mutate(editingProduct._id)}
                />
              </Dialog.Content>
            </Dialog.Root>
          )}

          {addingProduct && (
            <Dialog.Root open={true} onOpenChange={(open) => !open && setAddingProduct(false)}>
              <Dialog.Content className="w-full max-w-lg sm:max-w-2xl md:max-w-4xl lg:max-w-5xl max-h-screen p-4 sm:p-6 mx-auto overflow-y-auto">
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
      <Flex justify={{ initial: "center", sm: "end" }} gap="2" className="my-4 flex-wrap">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            size={{ initial: '1', sm: '2' }}
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