import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { Flex, Text, TextField } from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import type { CommentForms } from "@/types/commentTypes";

const ProductDetailsComment = () => {
  const { register, handleSubmit, reset, formState } = useForm<CommentForms>();

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button className="py-6 px-8 font-semibold bg-cyan-500 hover:bg-cyan-600 cursor-pointer">
          Comment Form
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[450px] -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
          <Dialog.Title className="text-lg font-bold">
            Comment Product Form
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-600 mb-4">
            After submited your comment, it will be{" "}
            <Text as="span" color="amber" weight="medium">
              "Pending"
            </Text>{" "}
            until the admin aprrove your comment.
          </Dialog.Description>

          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Title
              </Text>
              <TextField.Root
                {...register("title", { required: true })}
                placeholder="Enter the Title"
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Email
              </Text>
              <TextField.Root
                {...register("type", { required: true })}
                placeholder="Please Select Type of Pet"
              />
            </label>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close asChild>
              <Button variant="secondary">Cancel</Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button>Save</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ProductDetailsComment;
