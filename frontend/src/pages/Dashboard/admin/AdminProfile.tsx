import type { getMe } from "@/types/userTypes"
import { Badge, Box, Code, DataList, Flex, Heading, IconButton, Link } from "@radix-ui/themes"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { CopyIcon } from "lucide-react"

const AdminProfile = () => {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["Profile"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, { withCredentials: true })
      return res.data.user
    }
  })

  if (isLoading) return <Heading as="h1" className="text-center">Loading...</Heading>
  if (isError) return <Heading as="h1" className="text-center">Error: {(error as Error).message}</Heading>
  if (!data) return <Heading as="h1" className="text-center">No profile available.</Heading>

  const profile: getMe = data

  return (
    <div className="px-4 md:pr-0 mx-auto md:mx-0 w-full">
      <h2 className="text-xl lg:text-2xl xl:w-3xl text-center md:text-left py-5 font-medium">Profile</h2>

      <Box className="md:w-fit p-4 rounded-md bg-white overflow-x-auto">
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
            <DataList.Value>
              <Flex align="center" gap="2">
                <Code variant="ghost"></Code>
                <IconButton size="1" aria-label="Copy value" color="gray" variant="ghost">
                  <CopyIcon />
                </IconButton>
              </Flex>
            </DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label minWidth="88px">Name</DataList.Label>
            <DataList.Value>{profile.userName}</DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label minWidth="88px">Email</DataList.Label>
            <DataList.Value>
              <Link href={`mailto:${profile.email}`}>{profile.email}</Link>
            </DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label minWidth="88px">Status</DataList.Label>
            <DataList.Value>{profile.isActive ? "Authorized" : "Inactive"}</DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </Box>
    </div>
  )
}

export default AdminProfile
