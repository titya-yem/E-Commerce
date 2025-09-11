import type { Product } from "@/types/productTypes"
import { Box, Button, Dialog, Flex, Heading, Text, TextField } from "@radix-ui/themes"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"


const AdminProducts = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["Products"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/product`)
      return res
    }
  })

  console.log(data)
  if (isLoading) <Heading as="h1" className="text-center">Loading...</Heading>
  if (isError) <Heading as="h1" className="text-center">Error: {(error as Error).message}</Heading>

  return (
    <div className="pl-4 w-full">
      <Flex justify="between" align="center">
        <h2 className="text-xl lg:text-2xl xl:w-3xl py-5 font-medium">Products</h2>
        <button className="mr-4 cursor-pointer hover:bg-[#3860e1] bg-[#2954e4] ">
         + Add Product
        </button>
      </Flex>

      <Box className="w-[99%] p-2 rounded-md bg-white overflow-x-auto">
        {!data ? (
          <Heading as="h1" className="text-center py-10">
            No products available
          </Heading>
        ) : (
          <Box className="overflow-x-auto">
            {/* Header */}
            <div className="p-4 text-center grid grid-cols-[150px_300px_200px_150px_150px_150px] border-b border-gray-300">
              <Text as="p">Images</Text>
              <Text as="p">Name of Products</Text>
              <Text as="p">Categories</Text>
              <Text as="p">Stocks</Text>
              <Text as="p">Prices</Text>
              <Text as="p">Update & Delete</Text>
            </div>

            {/* Rows */}
            {data.data.map((product: Product) => (
                <div
                  key={product._id}
                  className="p-3 *:text-sm  text-center grid grid-cols-[150px_300px_200px_150px_150px_150px]"
                >
                  <Text as="p" className="font-medium rounded-md text-cyan-500">{product.image}</Text>
                  <Text as="p" className="font-medium rounded-md text-teal-500">{product.name}</Text>
                  <Text as="p" className="font-medium rounded-md text-violet-500">{product.category}</Text>
                  {/* Add stock in backend */}
                  <Text as="p" className="font-medium rounded-md text-violet-500">{product.stock}</Text>
                  <Text as="p" className="font-medium rounded-md text-violet-500">{product.price}</Text>
                  {/* Add Edit button for editing product (delete, update) by ID */}

                  {/* combobox to change status */}
                  <Dialog.Root>
                    <Dialog.Trigger>
                      <Button>Edit profile</Button>
                    </Dialog.Trigger>

                    <Dialog.Content maxWidth="450px">
                      <Dialog.Title>Edit profile</Dialog.Title>
                      <Dialog.Description size="2" mb="4">
                        Make changes to your profile.
                      </Dialog.Description>

                      <Flex direction="column" gap="3">
                        <label>
                          <Text as="div" size="2" mb="1" weight="bold">
                            Name
                          </Text>
                          <TextField.Root
                            defaultValue="Freja Johnsen"
                            placeholder="Enter your full name"
                          />
                        </label>
                        <label>
                          <Text as="div" size="2" mb="1" weight="bold">
                            Email
                          </Text>
                          <TextField.Root
                            defaultValue="freja@example.com"
                            placeholder="Enter your email"
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
        )}
      </Box>
    </div>
  )
}

export default AdminProducts
