import { useState } from "react";
import { Box, Button, Dialog, Flex, Heading, Text, Select } from "@radix-ui/themes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Comment } from "@/types/commentTypes";

const AdminComments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const queryClient = useQueryClient();

  const { data, isError, error, isLoading } = useQuery<Comment[]>({
    queryKey: ["Comments"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/comment`);
      return res.data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/comment/${id}/status`,
        { status }
      );
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["Comments"] }),
  });

  if (isLoading) return <Heading className="text-center py-10">Loading...</Heading>;
  if (isError) return <Heading className="text-center py-10">Error: {(error as Error).message}</Heading>;
  if (!data || data.length === 0) return <Heading className="text-center py-10">No comments available</Heading>;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="pl-4 w-full">
      <h2 className="text-xl lg:text-2xl xl:w-3xl py-5 font-medium">Comments</h2>

      <Box className="w-[99%] p-2 rounded-md bg-white overflow-x-auto min-h-[580px]">
        <Box className="overflow-x-auto">
          {/* Header */}
          <div className="p-4 text-center grid grid-cols-[200px_300px_200px_250px_200px] border-b border-gray-300">
            <Text as="p">User Name</Text>
            <Text as="p">Title</Text>
            <Text as="p">Text</Text>
            <Text as="p">Type</Text>
            <Text as="p">Approval</Text>
          </div>

          {/* Rows */}
          {paginatedData.map((comment: Comment) => (
            <div
              key={comment._id}
              className="p-3 text-sm pl-4 text-center grid grid-cols-[200px_300px_200px_250px_200px]"
            >
              <Text as="p" className="font-medium rounded-md text-blue-500">
                {comment.userName?.userName || "N/A"}
              </Text>
              <Text as="p" className="font-medium rounded-md text-cyan-500">{comment.title}</Text>

              <Dialog.Root>
                <Dialog.Trigger>
                  <Button color="teal" variant="soft">Text</Button>
                </Dialog.Trigger>
                <Dialog.Content size="1" maxWidth="400px">
                  <Text as="p" trim="both" size="3">{comment.text}</Text>
                </Dialog.Content>
              </Dialog.Root>

              <Text as="p" className="font-medium rounded-md text-amber-500">{comment.type}</Text>

              {/* Combobox for approval */}
              <Flex className="pl-10">
                <Select.Root
                  size="2"
                  defaultValue={comment.status || "Cancelled"}
                  onValueChange={(value) => updateStatus.mutate({ id: comment._id, status: value })}
                >
                  <Select.Trigger color="orange" variant="soft" />
                  <Select.Content color="orange" position="popper">
                    <Select.Item value="Cancelled">Not Approve</Select.Item>
                    <Select.Item value="Approved">Approved</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>
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

export default AdminComments;
