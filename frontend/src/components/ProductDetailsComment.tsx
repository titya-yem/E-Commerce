import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { Flex, Text, TextField } from "@radix-ui/themes";

const ProductDetailsComment = () => {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
            <Button className="py-6 px-10 font-semibold bg-cyan-500 hover:bg-cyan-600 cursor-pointer">Comment Form</Button>
            </Dialog.Trigger>

            <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 w-[450px] -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
                <Dialog.Title className="text-lg font-bold">Edit profile</Dialog.Title>
                <Dialog.Description className="text-sm text-gray-600 mb-4">
                Make changes to your profile.
                </Dialog.Description>

                <Flex direction="column" gap="3">
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                    Name
                    </Text>
                    <TextField.Root
                    defaultValue="Freja Johnsen"
                    placeholder="Enter your full name"
                    />
                </label>
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                    Email
                    </Text>
                    <TextField.Root
                    defaultValue="freja@example.com"
                    placeholder="Enter your email"
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
