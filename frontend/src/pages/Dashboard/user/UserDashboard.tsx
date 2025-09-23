import WelcomeDashboard from "@/components/dashboard/WelcomeDashboard";
import type { AppointmentTypes } from "@/types/AppointmentTypes";
import { Box, Flex, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router";
import UserProfile from "./UserProfile";

const UserDashboard = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['Appointments', appointmentId],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/appointment/my-appointments`);
      return res.data as AppointmentTypes[];
    },
  });

  if (isLoading)
    return <Text as="p" className="text-xl text-center mt-10">Loading...</Text>;
  if (isError)
    return <Text as="p" className="text-xl text-center mt-10">Error: {error?.message}</Text>;
  if (!data || data.length === 0)
    return <Text as="p" className="text-xl mt-10 text-center">No Appointments Available</Text>;

  return (
    <div className="sm:px-4 2xl:w-[1600px] mx-auto">
      <h2 className="text-xl md:text-2xl text-center lg:text-left py-5 font-medium">Dashboard</h2>

      <div className="flex flex-col xl:flex-row md:gap-4">
        {/* Left Panel */}
        <Flex direction="column" className="gap-4 xl:w-1/2">
          <WelcomeDashboard />
          <UserProfile />
        </Flex>

        {/* Right Panel */}
        <Box className="py-4 sm:py-0 mb-4 xl:pb-0 xl:w-2/3">
          <div className="space-y-8 p-4 shadow-md rounded-lg bg-white">
            <div className="p-4 border rounded-lg bg-white h-[404px] overflow-y-auto">
              <div className="hidden lg:grid lg:grid-cols-[110px_160px_150px_80px_80px] gap-2 *:text-center font-medium border-b pb-2 mb-2">
                <h5>Name</h5>
                <h5>Email</h5>
                <h5>Type</h5>
                <h5>Time</h5>
                <h5>Date</h5>
              </div>

              {/* Rows */}
              {data.map((appointment: AppointmentTypes) => {
                const formattedTime = new Date(`1970-01-01T${appointment.time}`)
                  .toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });

                return (
                  <div
                    key={appointment._id}
                    className="grid grid-cols-1 lg:grid-cols-[110px_160px_150px_80px_80px] *:text-center *:font-medium border-b border-gray-200 gap-2 pb-4 xl:pb-2 text-sm py-1"
                  >
                    <Text as="p" color="indigo" size="2" className="flex items-center justify-center xl:justify-center">
                      <Text as="span" className="lg:hidden">Name: </Text>
                      {appointment.user?.userName || "Unknown"}
                    </Text>

                    <Text as="p" color="crimson" size="2" className="flex items-center justify-center underline">
                      <a href={`mailto:${appointment.user?.email || appointment.email || "—"}`}>
                        <Text className="lg:hidden">Email: </Text>
                        {appointment.email || "—"}
                      </a>
                    </Text>

                    <Text as="p" color="cyan" size="2" className="flex items-center justify-center">
                      <Text as="span" className="lg:hidden">Type: </Text>
                      {appointment.type}
                    </Text>

                    <Text as="p" color="violet" size="2" className="flex items-center justify-center">
                      <Text as="span" className="lg:hidden">Time: </Text>
                      {formattedTime}
                    </Text>

                    <Text as="p" color="orange" size="2" className="flex items-center justify-center">
                      <Text as="span" className="lg:hidden">Date: </Text>
                      {appointment.date}
                    </Text>
                  </div>
                );
              })}
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default UserDashboard;
