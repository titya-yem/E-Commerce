import type { RootState } from "@/store/store";
import type { AppointmentTypes } from "@/types/AppointmentTypes";
import {
  Box,
  Flex,
  Heading,
  Select,
  Text,
  Button,
  TextField,
} from "@radix-ui/themes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useState } from "react";

const AdminAppointments = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const appointmentsPerPage = 7;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/appointment`
      );
      return res.data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/appointment/${id}/status`,
        { status }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const user = useSelector((state: RootState) => state.auth.user);
  const isMd = useMediaQuery("(min-width: 768px)");
  const isXl = useMediaQuery("(min-width: 1280px)");

  if (isLoading)
    return <Heading className="text-center py-10">Loading...</Heading>;
  if (isError)
    return (
      <Heading className="text-center py-10">
        Error: {(error as Error).message}
      </Heading>
    );
  if (!data || data.length === 0)
    return (
      <Heading className="text-center py-10">No Appointments available</Heading>
    );

  const filteredAppointments = data.filter(
    (appointment: AppointmentTypes) =>
      appointment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(
    filteredAppointments.length / appointmentsPerPage
  );
  const currentAppointments = filteredAppointments.slice(
    (currentPage - 1) * appointmentsPerPage,
    currentPage * appointmentsPerPage
  );

  return (
    <div className="px-6 lg:px-4 pb-6 lg:pb-0 w-full">
      {/* Search bar */}
      <div className="flex flex-col md:flex-row md:justify-between items-center mt-4 gap-4">
        <h2 className="text-xl lg:text-2xl xl:w-3xl text-center md:text-left font-medium">
          Appointments
        </h2>

        <TextField.Root
          size="2"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-[200px] mb-4"
        />
      </div>

      <Box className="p-2 rounded-md bg-white overflow-x-auto h-[590px] max-h-[600px]">
        <Box className="overflow-x-auto">
          {isXl && (
            <div
              className="p-4 text-center border-b border-gray-300 grid gap-2"
              style={{ gridTemplateColumns: "repeat(6, 1fr)" }}
            >
              <Text as="p">Name</Text>
              <Text as="p">Email</Text>
              <Text as="p">Service</Text>
              <Text as="p">Time</Text>
              <Text as="p">Date</Text>
              <Text as="p">Status</Text>
            </div>
          )}

          {currentAppointments.map((appointment: AppointmentTypes) => {
            const formattedTime = new Date(
              `1970-01-01T${appointment.time}`
            ).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });

            return (
              <div
                key={appointment._id}
                className="p-3 text-sm text-center grid gap-2 border-b border-gray-200 lg:border-none"
                style={{
                  gridTemplateColumns: isXl
                    ? "repeat(6, 1fr)"
                    : isMd
                    ? "repeat(2, 1fr)"
                    : "1fr",
                }}
              >
                <Text as="p" className="font-medium text-blue-500">
                  <Text as="span" className="lg:hidden">
                    Name:{" "}
                  </Text>
                  {user?.userName}
                </Text>

                <Text as="p" className="font-medium underline text-cyan-500">
                  <Text as="span" className="lg:hidden">
                    Email:{" "}
                  </Text>
                  <a href={`mailto:{appointment.email}`}>{appointment.email}</a>
                </Text>

                <Text as="p" className="font-medium text-teal-500">
                  <Text as="span" className="lg:hidden">
                    Type:{" "}
                  </Text>
                  {appointment.type}
                </Text>

                <Text as="p" className="font-medium text-rose-500">
                  <Text as="span" className="lg:hidden">
                    Time:{" "}
                  </Text>
                  {formattedTime}
                </Text>

                <Text as="p" className="font-medium text-violet-500">
                  <Text as="span" className="lg:hidden">
                    Date:{" "}
                  </Text>
                  {appointment.date}
                </Text>

                <Flex className="mx-auto justify-center">
                  <Select.Root
                    size="2"
                    defaultValue={appointment.status}
                    onValueChange={(value) =>
                      updateStatus.mutate({
                        id: appointment._id,
                        status: value,
                      })
                    }
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
            );
          })}
        </Box>
      </Box>

      <Flex justify="end" gap="2" className="my-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            size={{ initial: "1", sm: "2" }}
            variant={page === currentPage ? "solid" : "soft"}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}
      </Flex>
    </div>
  );
};

export default AdminAppointments;
