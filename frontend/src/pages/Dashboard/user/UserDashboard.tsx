import WelcomeDashboard from "@/components/dashboard/WelcomeDashboard"
import { Box, Text } from "@radix-ui/themes"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useParams } from "react-router"

const UserDashboard = () => {
    const { appointmentId } = useParams<{ appointmentId: string }>();

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['Appointments', appointmentId],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/appointment/my-appointments`)
      return res.data
    }
  })

  console.log(data)

  if (isLoading) return <Text as="p" className="text-xl text-center mt-10">Loading...</Text>;
  if (isError) return <Text as="p" className="text-xl text-center mt-10">Error: {error?.message}</Text>;
  if (!data) return <Text as="p" className="text-xl mt-10 text-center">No Orders Available</Text>;

  return (
    <div className="md:px-4 xl:pr-0 w-full 2xl:w-[1600px] 2xl:mx-auto">
      <h2 className="hidden md:block md:text-2xl py-5 font-medium">Dashboard</h2>
      
      <div className="flex flex-col xl:flex-row gap-6">
          <Box className="pt-6 pb-4 md:py-0">
            <WelcomeDashboard />
          </Box>

          <Box className="pb-6 xl:pb-0">

          </Box>
      </div>

    </div>
  )
}

export default UserDashboard
