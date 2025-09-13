import type { Service } from "@/types/serviceTypes";
import { Badge, Box, Button, Card, Flex, Heading, Inset, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const AdminServices = () => {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/service`);
      return res.data;
    },
  });

  if (isLoading) return <Heading className="text-center py-10">Loading...</Heading>;
  if (isError) return <Heading className="text-center py-10">Error: {(error as Error).message}</Heading>
  if (!data || data.length === 0) return <Heading className="text-center py-10">No Services available</Heading>;

  return (
    <div className="pl-4 w-full">
      <h2 className="text-xl lg:text-2xl xl:w-3xl pt-5 font-medium">
        Services
      </h2>

      <Flex wrap="wrap" gap="6" my="2">
        {data.map((service: Service, index: number) => (
          <Box key={service.id || index} maxWidth="280px">
            <Card size="2">
              <Inset clip="padding-box" side="top" pb="current">
                <img
                  src={service.image}
                  alt={service.title}
                  style={{
                    display: "block",
                    objectFit: "cover",
                    width: "100%",
                    height: 140,
                    backgroundColor: "var(--gray-5)",
                  }}
                />
              </Inset>
              <Text as="p" size="4" className="text-center pb-2" weight="bold">
                {service.title}
              </Text>

              <Flex align="center" justify="center" gap="2" className="pb-2">
                <Badge color="crimson" size="3">
                  Duration: {service.duration === 1 ? `${service.duration} day` : `${service.duration} hours`}
                </Badge>
                <Badge color="cyan" size="3">Price: ${service.price}</Badge>
              </Flex>

              <Text as="p" size="2" className="text-center text-gray-600">
                {service.description}
              </Text>

              <Flex align="center" justify="between" gap="4" pt="4">
                <Button>Delete</Button>
                <Button>Update</Button>
              </Flex>
            </Card>
          </Box>
        ))}
      </Flex>
    </div>
  );
};

export default AdminServices;
