/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, Text, TextField } from "@radix-ui/themes";
import * as Select from "@radix-ui/react-select";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { petType, type PetType } from "@/types/commentTypes";

export interface UserCommentFormData {
  title: string;
  text: string;
  type: PetType;
}

interface UserCommentFormProps {
  onSuccess?: () => void;
}

const UserCommentForm = ({ onSuccess }: UserCommentFormProps) => {
  const { handleSubmit, control, reset } = useForm<UserCommentFormData>({
    defaultValues: {
      title: "",
      text: "",
      type: petType.DogsLover,
    },
  });

  const onSubmit = async (data: UserCommentFormData) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/comment/create`,
        data
      );
      toast.success("Comment added successfully!");
      reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex justify="between" align="center" gap="4">
        {/* Title */}
        <label className="flex-1">
          <Text as="p" size="2" mb="1" weight="bold">
            Title
          </Text>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField.Root {...field} placeholder="Enter comment title" />
            )}
          />
        </label>

        {/* Pet Type (Select) */}
        <label className="flex-1">
          <Text as="p" size="2" mb="1" weight="bold">
            Type
          </Text>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select.Root value={field.value} onValueChange={field.onChange}>
                <Select.Trigger className="inline-flex h-[35px] w-full items-center justify-between rounded-sm border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <Select.Value placeholder="Select your team" />
                </Select.Trigger>

                <Select.Content className="rounded-md bg-white shadow-md">
                  <Select.Viewport className="p-2">
                    {Object.values(petType).map((pt) => (
                      <Select.Item
                        key={pt}
                        value={pt}
                        className="cursor-pointer rounded px-2 py-1 text-sm hover:bg-indigo-100 focus:bg-indigo-100"
                      >
                        <Select.ItemText>{pt}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Root>
            )}
          />
        </label>
      </Flex>

      {/* Comment text */}
      <div className="mt-4">
        <label>
          <Text as="p" size="2" mb="1" weight="bold">
            Comment
          </Text>
          <Controller
            name="text"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                placeholder="Write your comment here..."
                style={{
                  width: "100%",
                  height: "120px",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  resize: "none",
                  fontSize: "14px",
                }}
              />
            )}
          />
        </label>
      </div>

      {/* Submit */}
      <Flex gap="2" mt="4" justify="end">
        <Button type="submit">Submit Comment</Button>
      </Flex>
    </form>
  );
};

export default UserCommentForm;
