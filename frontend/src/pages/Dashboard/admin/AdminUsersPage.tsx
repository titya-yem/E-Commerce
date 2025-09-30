import SearchText from "@/components/shared/SearchText";
import { useFetch } from "@/hooks/useFetch";
import type { User } from "@/types/userTypes";
import { Box, Heading, Text, Flex, Button } from "@radix-ui/themes";
import { useState } from "react";

const AdminUsersPage = () => {
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const { data, isError, error, isLoading } = useFetch<User[]>({
    url: "api/user",
    queryKey: ["users"],
  });

  if (isLoading)
    return <Heading className="text-center py-10">Loading...</Heading>;
  if (isError)
    return (
      <Heading className="text-center py-10">
        Error: {(error as Error).message}
      </Heading>
    );
  if (!data || data.length === 0)
    return <Heading className="text-center py-10">No users available</Heading>;

  const sortedData = data
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? "").getTime() -
        new Date(a.createdAt ?? "").getTime()
    );

  const filteredData = sortedData.filter((user) =>
    user.userName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(sortedData.length / usersPerPage));
  const currentUsers = filteredData.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div className="px-6 lg:px-4 w-full 2xl:w-[1600px] 2xl:mx-auto">
      <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center">
        <h2 className="text-xl lg:text-2xl xl:w-3xl text-center lg:text-left pt-5 font-medium">
          Users
        </h2>

        <SearchText
          value={search}
          onChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search Name"
        />
      </div>

      <Box className="p-2 rounded-md bg-white h-[590px] max-h-[600px]">
        <Box>
          {/* Header for large screens */}
          <div className="hidden lg:grid grid-cols-5 gap-4 p-4 text-center border-b border-gray-300">
            <Text>User Name</Text>
            <Text>Email</Text>
            <Text>Role</Text>
            <Text>Is Active</Text>
            <Text>Created Date</Text>
          </div>

          {/* Rows */}
          {currentUsers.map((user: User) => (
            <div
              key={user._id}
              className="
                grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5
                md:grid-rows-3 lg:grid-rows-1
                gap-4 p-3 text-sm border-b border-gray-200 md:border-gray-100 text-center
              "
            >
              <Text className="font-medium text-blue-500">
                <span className="lg:hidden">Name: </span>
                {user.userName || "N/A"}
              </Text>
              <Text className="font-medium underline text-cyan-500">
                <a href={`mailto:{user.email}`}>
                  <Text as="span" className="lg:hidden">
                    Email:{" "}
                  </Text>
                  {user.email}
                </a>
              </Text>
              <Text className="font-medium text-teal-500">
                <span className="lg:hidden">Role: </span>
                {user.role || "User"}
              </Text>
              <Text className="font-medium text-amber-500">
                <span className="lg:hidden">Status: </span>
                {user.isActive ? "Active" : "Inactive"}
              </Text>
              <Text className="font-medium text-violet-500">
                <span className="lg:hidden">Created at: </span>
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
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
