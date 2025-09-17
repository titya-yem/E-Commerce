import { Box, Text } from '@radix-ui/themes'
import DashboardImage from '@/assets/image/Dashboard-Image.png'
import DashboardBackgroundImage from '@/assets/image/Dashboard-Background-Image.jpg'

const WelcomeDashboard = () => {
  return (
    <div className="h-44 relative flex justify-between items-center space-y-8 p-4 shadow-md rounded-lg bg-[#2954e4]">
      <Box className='w-3/5'>
        <Text as="p" className="text-lg lg:text-2xl font-medium text-white"> 
          Welcome to Your Dashboard!
        </Text>
        <Text as="p" className="text-sm text-gray-200 mt-2">
          Here you can manage your projects, view analytics, and customize your settings.
        </Text>
      </Box>
      <Box>
        <img src={DashboardBackgroundImage} alt="Dashboard Background" 
          className="absolute right-0 bottom-0 w-full h-full rounded-lg opacity-20"
        />
        <img src={DashboardImage} alt="Dashboard Image" 
          className="absolute left-48 md:left-0 md:right-0 bottom-0 w-56 md:w-60"
        />
      </Box>
    </div>
  )
}

export default WelcomeDashboard