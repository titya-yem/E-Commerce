import type { Product } from "@/types/productTypes"
import { Box, Button, Dialog, Flex, Heading, Text, TextField } from "@radix-ui/themes"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"

const AdminProducts = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 7

  const { data, isLoading, isError, error } = useQuery<Product[]>({
    queryKey: ["Products"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/product`)
      return res.data // only return product array
    },
  })

  if (isLoading) <Heading as="h1" className="text-center py-10">Loading...</Heading>

  if (isError) <Heading as="h1" className="text-center py-10">Error: {(error as Error).message}</Heading>

  if (!data || data.length === 0)
    return <Heading as="h1" className="text-center py-10">No products available</Heading>

  const sortedData = data.slice().sort((a, b) =>
      new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime()
    )

  const totalPages = Math.ceil(sortedData.length / productsPerPage)
  const currentProducts = sortedData.slice(
    (currentPage - 1) * productsPerPage, currentPage * productsPerPage
  )

  return (
    <div className="pl-4 w-full">
      {/* Header row */}
      <Flex justify="between" align="center">
        <h2 className="text-xl lg:text-2xl xl:w-3xl py-5 font-medium">Products</h2>
        <button className="p-2 mr-4 text-sm cursor-pointer rounded-sm text-white hover:bg-[#1a48de] bg-[#2954e4]">
          + Add Product
        </button>
      </Flex>

      {/* Table */}
      <Box className="w-[99%] p-2 rounded-md bg-white overflow-x-auto min-h-[580px]">
        <Box className="overflow-x-auto">
          {/* Table Header */}
          <div className="p-4 text-center grid grid-cols-[158px_260px_150px_220px_200px_150px] border-b border-gray-300">
            <Text as="p">Images</Text>
            <Text as="p">Name of Products</Text>
            <Text as="p">Categories</Text>
            <Text as="p">Stocks</Text>
            <Text as="p">Prices</Text>
            <Text as="p">Actions</Text>
          </div>

          {/* Table Rows */}
          {currentProducts.map((product: Product) => (
            <div
              key={product._id}
              className="p-3 *:text-sm text-center grid grid-cols-[160px_260px_150px_220px_200px_150px] border-b border-gray-200"
            >
              <img src={product.image} alt={product.name} className="w-12 h-12 object-contain rounded-md mx-auto" />
              <Text as="p" className="pt-1 font-medium rounded-md text-gray-500">{product.name}</Text>
              <Text as="p" className="pt-1 font-medium rounded-md text-gray-500">{product.category}</Text>
              <Text as="p" className="pt-1 font-medium rounded-md text-gray-500">
                {product.stock <= 50 ? (
                  <>
                    {product.stock}{" "}
                    <Text as="span" color="red" weight="medium">
                      Low stocks
                    </Text>
                  </>
                ) : (
                  product.stock
                )}
              </Text>
              <Text as="p" className="pt-1 font-medium rounded-md text-gray-500">${product.price}</Text>

              {/* Action Button for Updating & Deleting product */}
              <Dialog.Root>
                <Dialog.Trigger>
                  <Button>Edit Product</Button>
                </Dialog.Trigger>

                <Dialog.Content maxWidth="450px">
                  <Dialog.Title>Edit Product</Dialog.Title>
                  <Dialog.Description size="2" mb="4">
                    Update product details below.
                  </Dialog.Description>

                  <Flex direction="column" gap="3">
                    <label>
                      <Text as="div" size="2" mb="1" weight="bold">
                        Name
                      </Text>
                      <TextField.Root
                        defaultValue={product.name}
                        placeholder="Enter product name"
                      />
                    </label>
                    <label>
                      <Text as="div" size="2" mb="1" weight="bold">
                        Category
                      </Text>
                      <TextField.Root
                        defaultValue={product.category}
                        placeholder="Enter category"
                      />
                    </label>
                    <label>
                      <Text as="div" size="2" mb="1" weight="bold">
                        Price
                      </Text>
                      <TextField.Root
                        defaultValue={product.price.toString()}
                        placeholder="Enter price"
                      />
                    </label>
                  </Flex>

                  <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                      <Button variant="soft" color="gray">
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Dialog.Close>
                      <Button>Save</Button>
                    </Dialog.Close>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>
            </div>
          ))}
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
  )
}

export default AdminProducts
