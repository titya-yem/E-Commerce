import type { getMe } from "@/types/userTypes"
import { Badge, Box, Button, DataList, Dialog, Flex, Heading, Link, Text, TextField } from "@radix-ui/themes"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

interface UpdateProfileInput {
  userName: string
  email: string
  password?: string
}

const UserProfile = () => {
  const queryClient = useQueryClient()

  // Fetch profile
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["Profile"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        { withCredentials: true }
      )
      return res.data.user
    }
  })

  // Setup react-hook-form
  const { register, handleSubmit, reset } = useForm<UpdateProfileInput>({
    defaultValues: {
      userName: "",
      email: "",
      password: ""
    }
  })

  // Mutation with toast feedback
  const mutation = useMutation({
    mutationFn: async (updatedData: UpdateProfileInput) => {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        updatedData,
        { withCredentials: true }
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Profile"] })
      toast.success("Profile updated successfully 🎉")
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update profile ❌")
    }
  })

  // Reset form when profile data loads
  useEffect(() => {
    if (data) {
      reset({
        userName: data.userName,
        email: data.email,
        password: ""
      })
    }
  }, [data, reset])

  const onSubmit = (formData: UpdateProfileInput) => {
    mutation.mutate(formData)
    reset({ ...formData, password: "" })
  }

  if (isLoading) return <Heading as="h1" className="text-center">Loading...</Heading>
  if (isError) return <Heading as="h1" className="text-center">Error: {(error as Error).message}</Heading>
  if (!data) return <Heading as="h1" className="text-center">No profile available.</Heading>

  const profile: getMe = data

  return (
    <Box className="p-4 rounded-md bg-white overflow-x-auto shadow-md">
      <DataList.Root>
        <DataList.Item align="center">
          <DataList.Label minWidth="88px">Role</DataList.Label>
          <DataList.Value>
            <Badge color="jade" variant="soft" radius="full">
              {profile.role}
            </Badge>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label minWidth="88px">ID</DataList.Label>
          <DataList.Value><Badge size="2">{profile.id}</Badge></DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label minWidth="88px">Name</DataList.Label>
          <DataList.Value><Badge size="2" color="crimson">{profile.userName}</Badge></DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label minWidth="88px">Email</DataList.Label>
          <DataList.Value>
            <Link href={`mailto:${profile.email}`}>{profile.email}</Link>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label minWidth="88px">Status</DataList.Label>
          <DataList.Value>
            <Badge size="2">{profile.isActive ? "Active" : "Inactive"}</Badge>
          </DataList.Value>
        </DataList.Item>
      </DataList.Root>

      <Box className="pt-3">
        <Dialog.Root>
          <Dialog.Trigger>
            <Button>Edit profile</Button>
          </Dialog.Trigger>

          <Dialog.Content maxWidth="450px">
            <Dialog.Title>Edit profile</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Make changes to your profile.
            </Dialog.Description>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex direction="column" gap="3">
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Name
                  </Text>
                  <TextField.Root
                    {...register("userName")}
                    placeholder="Enter your full name"
                  />
                </label>
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Email
                  </Text>
                  <TextField.Root
                    type="email"
                    {...register("email")}
                    placeholder="Enter your email"
                  />
                </label>
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Password
                  </Text>
                  <TextField.Root
                    type="password"
                    {...register("password")}
                    placeholder="Enter your password"
                  />
                </label>
              </Flex>

              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft" color="gray">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Dialog.Close>
                  <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </Dialog.Close>
              </Flex>
            </form>
          </Dialog.Content>
        </Dialog.Root>
      </Box>
    </Box>
  )
}

export default UserProfile
