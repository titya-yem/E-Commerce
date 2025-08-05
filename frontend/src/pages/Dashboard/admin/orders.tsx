import { Box, Flex } from "@radix-ui/themes"

const orders = () => {
  return (
    <div className="pl-4 w-full">
      <h2 className="text-xl lg:text-2xl xl:w-3xl py-5 font-medium">
        Orders
      </h2>
    
      <div className="flex flex-col lg:flex-row items-center justify-between bg-white">
        <Box className="w-full lg:w-1/2 bg-white p-2 rounded-lg">
          <h4 className="text-base text-right font-medium">
            Order of each users
          </h4>

          <Flex align="center" justify="center" className="mt-2">
            
          </Flex>
        </Box>

        <div></div>
      </div>
    </div>
  )
}

export default orders
