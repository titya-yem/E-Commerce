import UserCommentForm from "@/components/dashboard/UserCommentForm";
import { useFetch } from "@/hooks/useFetch";
import type { Comment } from "@/types/commentTypes";
import { Box, Button, Dialog, Flex, Heading, Text } from "@radix-ui/themes";
import { AlertDialog } from "@radix-ui/themes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const UserComments = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [addingProduct, setAddingProduct] = useState(false);
  const commentsPerPage = 5;

  const { data, isError, error, isLoading } = useFetch<Comment[]>({
    url: "api/comment/me",
    queryKey: ["Comments"],
  });

  const deleteComment = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/comment/${id}`
      );
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["Comments"] }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => console.error("Delete failed:", err),
  });

  if (isLoading)
    return <Heading className="text-center py-10">Loading...</Heading>;
  if (isError)
    return (
      <Heading className="text-center py-10">
        Error: {(error as Error).message}
      </Heading>
    );

  // Pagination
  const totalPages = Math.ceil((data?.length || 0) / commentsPerPage);
  const currentComments = data?.slice(
    (currentPage - 1) * commentsPerPage,
    currentPage * commentsPerPage
  );

  return (
    <div className="px-6 md:px-4 mx-auto md:mx-0 mb-4 md:mb-0 2xl:w-[1600px] 2xl:mx-auto">
      <Flex justify="between" align="center">
        <h2 className="block text-xl md:text-2xl text-center md:text-left py-5 font-medium">
          Comments
        </h2>

        <Button mr="4" size="2" onClick={() => setAddingProduct(true)}>
          + Add Comment
        </Button>
      </Flex>

      {!data || data.length === 0 ? (
        <Heading className="text-center py-10">No comments available</Heading>
      ) : (
        <Box className="p-2 rounded-md bg-white flex-1 min-h-[580px] xl:max-h-[600px]">
          {/* Table Header */}
          <div className="hidden xl:grid xl:grid-cols-[100px_250px_170px_150px_150px_120px] 2xl:grid-cols-[300px_150px_200px_170px_170px_170px] border-b border-gray-300 p-4 text-center">
            <Text as="p">Title</Text>
            <Text as="p">Comment</Text>
            <Text as="p">Type</Text>
            <Text as="p">Date</Text>
            <Text as="p">Status</Text>
            <Text as="p">Action</Text>
          </div>

          {/* Table Rows */}
          {currentComments?.map((comment) => (
            <div
              key={comment._id}
              className="grid md:grid-cols-2 gap-2 p-4 border-b text-center xl:grid-cols-[100px_250px_170px_150px_150px_120px] 2xl:grid-cols-[300px_150px_200px_170px_170px_170px] *:text-sm *:font-medium xl:gap-0 xl:border-none"
            >
              {/* Title */}
              <Text className="text-blue-500">{comment.title}</Text>

              {/* Comment text */}
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

              {/* Pet type */}
              <Text className="text-indigo-500">{comment.type}</Text>

              {/* Date */}
              <Text className="font-medium rounded-md text-purple-500">
                {comment.createdAt
                  ? new Date(comment.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A"}
              </Text>

              {/* Status */}
              <Text
                className={`font-medium rounded-md ${
                  comment.status === "Approved"
                    ? "text-emerald-500"
                    : comment.status === "Pending"
                    ? "text-amber-500"
                    : "text-red-500"
                }`}
              >
                {comment.status}
              </Text>

              {/* Delete Action */}
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
                      Are you sure you want to delete this comment?{" "}
                      <Text as="span" color="red" weight="medium">
                        It will be permanently deleted.
                      </Text>
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
                          disabled={deleteComment.isPending}
                          onClick={() => deleteComment.mutate(comment._id)}
                        >
                          {deleteComment.isPending ? "Deleting..." : "Delete"}
                        </Button>
                      </AlertDialog.Action>
                    </Flex>
                  </AlertDialog.Content>
                </AlertDialog.Root>
              </Flex>
            </div>
          ))}
        </Box>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
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
      )}

      {/* Add Comment Dialog */}
      {addingProduct && (
        <Dialog.Root
          open={true}
          onOpenChange={(open) => !open && setAddingProduct(false)}
        >
          <Dialog.Content maxWidth="500px">
            <Dialog.Title>Add Comment</Dialog.Title>
            <Dialog.Description size="2" mb="2">
              Please fill your comment below.
            </Dialog.Description>

            <UserCommentForm
              onSuccess={() => {
                setAddingProduct(false);
                queryClient.invalidateQueries({ queryKey: ["Comments"] });
              }}
            />

            <Flex justify="end" mt="4">
              <Button
                variant="soft"
                color="gray"
                onClick={() => setAddingProduct(false)}
              >
                Cancel
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </div>
  );
};

export default UserComments;
