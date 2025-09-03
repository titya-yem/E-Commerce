import { Box, Text,  } from "@radix-ui/themes"

const CommentsApproval = () => {
  return (
    <Box className="w-[300px] space-y-8 p-4 shadow-md rounded-lg bg-white">
      <Text as="p" className="text-xl font-medium text-center"> 
          Comments Approval
      </Text>
    </Box>
  )
}

export default CommentsApproval