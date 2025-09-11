import type { RootState } from "@/store/store"
import type { AppointmentTypes } from "@/types/AppointmentTypes"
import { Box, Flex, Heading, Select, Text } from "@radix-ui/themes"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useSelector } from "react-redux"

const AdminAppointments = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/appointment`
      )
      return res.data
    },
  })

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/api/appointment/${id}/status`,
        { status }
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    }
  })

  const user = useSelector((state: RootState) => state.auth.user)

  if (isLoading) <Heading as="h1" className="text-center">Loading...</Heading>
  if (isError) <Heading as="h1" className="text-center">Error: {(error as Error).message}</Heading>

  return (
    <div className="pl-4 w-full">
      <h2 className="text-xl lg:text-2xl xl:w-3xl py-5 font-medium">
        Appointments
      </h2>

      <Box className="w-[99%] p-2 rounded-md bg-white overflow-x-auto">
        {!data ? (
          <Heading as="h1" className="text-center py-10">
            No appointments available
          </Heading>
        ) : (
          <Box className="overflow-x-auto">
            {/* Header */}
            <div className="p-4 text-center grid grid-cols-[150px_300px_200px_150px_150px_150px] border-b border-gray-300">
              <Text as="p">Names</Text>
              <Text as="p">Emails</Text>
              <Text as="p">Types of Services</Text>
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
                  className="p-3 *:text-sm  text-center grid grid-cols-[150px_300px_200px_150px_150px_150px]"
                >
                  <Text as="p" className="font-medium rounded-md text-blue-500">{user?.userName}</Text>
                  <Text as="p" className="font-medium rounded-md text-cyan-500">{appointment.email}</Text>
                  <Text as="p" className="font-medium rounded-md text-teal-500">{appointment.type}</Text>
                  <Text as="p" className="font-medium rounded-md text-rose-500">{formattedTime}</Text>
                  <Text as="p" className="font-medium rounded-md text-violet-500">{appointment.date}</Text>

                  {/* combobox to change status */}
                  <Flex className="pl-7">
                    <Select.Root
                      size="2"
                      defaultValue={appointment.status}
                      onValueChange={(value) => {
                        updateStatus.mutate({ id: appointment._id, status: value });
                      }}
                    >
                      <Select.Trigger color="orange" variant="soft" />
                      <Select.Content color="orange" position="popper">
                        <Select.Item value="Cancelled">Cancelled</Select.Item>
                        <Select.Item value="Incomplete">Incomplete</Select.Item>
                        <Select.Item value="Completed">Completed</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Flex>
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
