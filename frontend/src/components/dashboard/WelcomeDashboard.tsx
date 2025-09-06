import { Box, Text } from '@radix-ui/themes'

const WelcomeDashboard = () => {
  return (
    <Box className="space-y-8 p-4 shadow-md rounded-lg bg-white">
      <Text as="p" className="text-xl font-medium text-center"> 
          Welcome to Your Dashboard!
      </Text>
    </Box>
  )
}

export default WelcomeDashboard