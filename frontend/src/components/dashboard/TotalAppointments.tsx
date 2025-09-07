/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Heading, Text } from "@radix-ui/themes"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import type { RootState } from "@/store/store"
import { useSelector } from "react-redux"


const TotalAppointments = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['total-appointments'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/appointment/monthly`)
      return res.data
    }
  })
  console.log(data)
  if (isLoading) return <Heading as="h1" className="text-center">Loading...</Heading>
  if (isError) return <Heading as="h1" className="text-center">Error: {(error as Error).message}</Heading>

  return (
    <Box className="space-y-8 p-4 shadow-md rounded-lg bg-white">
      <h3 className="font-medium">
        Total Appointments (monthly): {data.length} appointment{data.length !== 1 ? 's' : ''}
      </h3>
      
      <Box>
        {data.length === 0 ? (
          <div className="p-4 border rounded-lg bg-white max-h-[300px]">
            <p className="text-gray-500">No appointments this month</p>
          </div>
        ) : (
          <div className="p-4 border rounded-lg bg-white max-h-[300px] overflow-y-auto">
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 font-medium border-b pb-2 mb-2">
              <h5>Name</h5>
              <h5>Time</h5>
              <h5>Type</h5>
              <h5>Date</h5>
            </div>

            {/* Rows */}
            {data.map((appointment: any) => {
              const formattedTime = new Date(`1970-01-01T${appointment.time}`)
                .toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })

              return (
                <div
                  key={appointment._id}
                  className="grid grid-cols-4 gap-4 text-sm py-1"
                >
                  <Text as="p">{user?.userName}</Text>
                  <Text as="p">{formattedTime}</Text>
                  <Text as="p">{appointment.type}</Text>
                  <Text as="p">{appointment.date}</Text>
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