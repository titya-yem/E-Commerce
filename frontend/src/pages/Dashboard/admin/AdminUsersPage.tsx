import type { User } from "@/types/userTypes";
import { Box, Heading, Text, Flex, Button } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const AdminUsersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["Users"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`);
      return res.data as User[];
    },
  });

  if (isLoading) return <Heading className="text-center py-10">Loading...</Heading>;
  if (isError) return <Heading className="text-center py-10">Error: {(error as Error).message}</Heading>;
  if (!data || data.length === 0) return <Heading className="text-center py-10">No users available</Heading>;

  const sortedData = data.slice().sort(
    (a, b) => new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime()
  );

  const totalPages = Math.max(1, Math.ceil(sortedData.length / usersPerPage));
  const currentUsers = sortedData.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div className="pl-4 w-full">
      <h2 className="text-xl lg:text-2xl xl:w-3xl py-5 font-medium">
        Users
      </h2>

      <Box className="w-[99%] p-2 rounded-md bg-white overflow-x-auto min-h-[580px]">
        <Box className="overflow-x-auto">
          {/* Header */}
          <div className="p-4 text-center grid grid-cols-[200px_300px_200px_200px_200px] border-b border-gray-300">
            <Text as="p">User Name</Text>
            <Text as="p">Email</Text>
            <Text as="p">Role</Text>
            <Text as="p">Is Active</Text>
            <Text as="p">Created Date</Text>
          </div>

          {/* Rows */}
          {currentUsers.map((user: User) => (
            <div
              key={user._id}
              className="p-3 *:text-sm pl-4 text-center grid grid-cols-[200px_300px_200px_200px_200px]"
            >
              <Text as="p" className="font-medium rounded-md text-blue-500">{user.userName || 'N/A'}</Text>
              <Text as="p" className="font-medium rounded-md text-cyan-500">{user.email}</Text>
              <Text as="p" className="font-medium rounded-md text-teal-500">{user.role || 'User'}</Text>
              <Text as="p" className="font-medium rounded-md text-amber-500">{user.isActive ? 'Active' : 'Inactive'}</Text>
              <Text as="p" className="font-medium rounded-md text-violet-500">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </Text>
            </div>
          ))}
        </Box>
      </Box>

      {/* Pagination */}
      <Flex justify="end" gap="2" className="mr-4 my-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            size="2"
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

export default AdminUsersPage;
