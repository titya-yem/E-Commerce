import { Badge, Box, Heading, Text } from "@radix-ui/themes"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import type { RootState } from "@/store/store"
import { useSelector } from "react-redux"
import type { AppointmentTypes } from "@/types/AppointmentTypes"


const TotalAppointments = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['total-appointments'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/appointment/monthly`)
      return res.data
    }
  })
  
  if (isLoading) return <Heading as="h1" className="text-center">Loading...</Heading>
  if (isError) return <Heading as="h1" className="text-center">Error: {(error as Error).message}</Heading>
  if (!data || data.length === 0) return <Heading className="text-center py-10">No appointment available, this month</Heading>;

  return (
    <Box className="space-y-8 p-4 shadow-md rounded-lg bg-white">
      <h3 className="font-medium">
        Total Appointments (monthly):
        <Text as="span" className={`pl-2 ${data.length === 0 ? 'text-gray-500' : 'text-green-500'}` }>
          {`${data.length} appointment${data.length !== 1 ? 's' : ''}`}
        </Text>
      </h3>
      
      <Box>
        {data.length === 0 ? (
          <div className="p-4 border rounded-lg bg-white h-[280px] max-h-full">
            <p className="text-gray-500">No appointments this month</p>
          </div>
        ) : (
          <div className="p-4 border rounded-lg bg-white h-[280px] max-h-full overflow-y-auto">
            {/* Header */}
            <div className="grid grid-cols-5 gap-2 *:text-center font-medium border-b pb-2 mb-2">
              <h5>Name</h5>
              <h5>Time</h5>
              <h5>Type</h5>
              <h5>Date</h5>
              <h5>Status</h5>
            </div>

            {/* Rows */}
            {data.map((appointment: AppointmentTypes) => {
              const formattedTime = new Date(`1970-01-01T${appointment.time}`)
                .toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })

              return (
                <div
                  key={appointment._id}
                  className="grid grid-cols-5 *:text-center gap-2 text-sm py-1"
                >
                  <Badge color="indigo" size="2" radius="large" className="flex items-center justify-center">
                    {user?.userName}
                  </Badge>

                  <Badge color="crimson" size="2" radius="large" className="flex items-center justify-center">
                    {formattedTime}
                  </Badge>

                  <Badge color="cyan" size="2" radius="large" className="flex items-center justify-center">
                    {appointment.type}
                  </Badge>
                  
                  <Badge color="violet" size="2" radius="large" className="flex items-center justify-center">
                    {appointment.date}
                  </Badge>

                  <Badge color="orange" size="2" radius="large" className="flex items-center justify-center">
                    {appointment.status}
                  </Badge>
                </div>
              )
            })}
          </div>
        )}
      </Box>
    </Box>
  )
}

export default TotalAppointments