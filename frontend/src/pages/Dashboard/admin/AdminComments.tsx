import { useState } from "react";
import { Box, Button, Dialog, Flex, Heading, Text, Select, AlertDialog } from "@radix-ui/themes";
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
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/comment/admin/all`);
      return res.data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/api/comment/${id}/status`,{ status });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["Comments"] }),
  });

  const deleteComment = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/comment/${id}`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["Comments"] }),
  });

  if (isLoading) return <Heading className="text-center py-10">Loading...</Heading>;
  if (isError) return <Heading className="text-center py-10">Error: {(error as Error).message}</Heading>
  if (!data || data.length === 0) return <Heading className="text-center py-10">No comments available</Heading> 

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="px-6 lg:px-4 w-full 2xl:w-[1600px] 2xl:mx-auto">
      <h2 className="text-xl lg:text-2xl xl:w-3xl text-center lg:text-left py-5 font-medium">
        Comments
      </h2>

      <Box className="p-2 rounded-md bg-white h-[590px] max-h-[600px]">
        <Box>
          {/* Header for large screens */}
          <div className="hidden lg:grid grid-cols-6 gap-4 p-4 text-center border-b border-gray-300">
            <Text>User Name</Text>
            <Text>Title</Text>
            <Text>Comments</Text>
            <Text>Type</Text>
            <Text>Approval</Text>
            <Text>Actions</Text>
          </div>

          {/* Rows */}
          {paginatedData.map((comment: Comment) => (
            <div
              key={comment._id}
              className="
                grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6
                md:grid-rows-3 lg:grid-rows-1
                gap-3 md:gap-4 p-3 text-sm border-b border-gray-200 lg:border-gray-100 text-center
              "
            >

              <Text className="font-medium text-blue-500">
                <Text as="span" className="lg:hidden">Name: </Text>{comment.userName?.userName || "N/A"}
              </Text>

              <Text className="font-medium text-cyan-500">
                <Text as="span" className="lg:hidden">Title: </Text>{comment.title}
              </Text>

              <Dialog.Root>
                <Dialog.Trigger>
                  <Button color="teal" variant="soft" size="2">
                    View
                  </Button>
                </Dialog.Trigger>
                <Dialog.Content size="1" maxWidth="400px">
                  <Text size="3">{comment.text}</Text>
                </Dialog.Content>
              </Dialog.Root>

              <Text className="font-medium text-amber-500">
                <Text as="span" className="lg:hidden">Type: </Text>{comment.type}
              </Text>

              {/* Approval */}
              <Flex justify="center" align="center">
                <Select.Root
                  size="2"
                  defaultValue={comment.status || "Cancelled"}
                  onValueChange={(value) =>
                    updateStatus.mutate({ id: comment._id, status: value })
                  }
                >
                  <Select.Trigger color="orange" variant="soft" />
                  <Select.Content color="orange" position="popper">
                    <Select.Item value="Cancelled">Not Approved</Select.Item>
                    <Select.Item value="Approved">Approved</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>

              {/* Delete */}
              <Flex justify="center" align="center">
                <AlertDialog.Root>
                  <AlertDialog.Trigger>
                    <Button color="red" size="2" variant="soft">
                      Delete
                    </Button>
                  </AlertDialog.Trigger>
                  <AlertDialog.Content maxWidth="400px">
                    <AlertDialog.Title>Confirm Deletion</AlertDialog.Title>
                    <AlertDialog.Description>
                      Are you sure you want to delete this comment? 
                      <Text as="span" color="red" weight="medium">it will permenantly deleted</Text>
                    </AlertDialog.Description>
                    <Flex justify="end" gap="3" mt="4">
                      <AlertDialog.Cancel>
                        <Button variant="soft" color="gray">
                          Cancel
                        </Button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action>
                        <Button
                          color="red"
                          variant="solid"
                          onClick={() => deleteComment.mutate(comment._id)}
                        >
                          Delete
                        </Button>
                      </AlertDialog.Action>
                    </Flex>
                  </AlertDialog.Content>
                </AlertDialog.Root>
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
