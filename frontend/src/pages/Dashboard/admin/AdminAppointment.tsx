import type { RootState } from "@/store/store"
import type { AppointmentTypes } from "@/types/AppointmentTypes"
import { Box, Heading, Text } from "@radix-ui/themes"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useSelector } from "react-redux"

const AdminAppointments = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/appointment`
      )
      return res.data
    },
  })

  const user = useSelector((state: RootState) => state.auth.user)

  if (isLoading)
    return <Heading as="h1" className="text-center">Loading...</Heading>
  if (isError)
    return (
      <Heading as="h1" className="text-center">
        Error: {(error as Error).message}
      </Heading>
    )

  return (
    <div className="pl-4 w-full">
      <h2 className="text-xl lg:text-2xl xl:w-3xl py-5 font-medium">
        Appointments
      </h2>

      <Box className="w-[99%] p-2 rounded-md bg-white overflow-x-auto">
        {data.length === 0 ? (
          <Heading as="h1" className="text-center py-10">
            No appointments
          </Heading>
        ) : (
          <Box className="overflow-x-auto">
            {/* Header */}
            <div className="p-4 text-center grid grid-cols-[150px_300px_200px_150px_150px_150px] border-b border-gray-300">
              <Text as="p">Names</Text>
              <Text as="p">Emails</Text>
              <Text as="p">Types of Service</Text>
              <Text as="p">Times</Text>
              <Text as="p">Dates</Text>
              <Text as="p">Status</Text>
            </div>

            {/* Rows */}
            {data.map((appointment: AppointmentTypes) => {
              const formattedTime = new Date(`1970-01-01T${appointment.time}`)
                .toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });

              return (  
                <div
                  key={appointment._id}
                  className="p-4 *:text-sm text-center grid grid-cols-[100px_240px_150px_100px_120px_150px]"
                >
                  <Text as="p" className="font-medium rounded-md py-1 bg-blue-100 text-blue-500">{user?.userName}</Text>
                  <Text as="p" className="font-medium rounded-md py-1 bg-sky-100 text-sky-500">{appointment.email}</Text>
                  <Text as="p" className="font-medium rounded-md py-1 bg-cyan-100 text-cyan-500">{appointment.type}</Text>
                  <Text as="p" className="font-medium rounded-md py-1 bg-rose-100 text-rose-500">{formattedTime}</Text>
                  <Text as="p" className="font-medium rounded-md py-1 bg-violet-100 text-violet-500">{appointment.date}</Text>
                  {/* make status is combobox to change status */}
                  <Text as="p" className="font-medium rounded-md py-1 bg-orange-100 text-orange-500">{appointment.status}</Text>
                </div>
              )
            })}
          </Box>
        )}
      </Box>
    </div>
  )
}

export default AdminAppointments
