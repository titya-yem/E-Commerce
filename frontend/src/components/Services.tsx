import type { Service } from "@/types/serviceTypes";
import { Badge, Box, Button, Card, Container, Flex, Heading, Inset, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

const Services = () => {
  const { data, isError, error, isLoading } = useQuery<Service[]>({
    queryKey: ["Services page"],
    queryFn: async () => {
      const res = await axios.get<Service[]>(
        `${import.meta.env.VITE_API_URL}/api/service`
      );
      return res.data.map((s: Service) => ({ ...s, id: s._id }))
    },
  });

  if (isLoading) return <Heading className="text-center py-10">Loading...</Heading>;
  if (isError) return <Heading className="text-center py-10">Error: {(error as Error).message}</Heading>;
  if (!data || data.length === 0) return <Heading className="text-center py-10">No Services available</Heading>;

  return (
    <Container className="my-10 pb-10 px-4">
      <h1 className="text-2xl lg:text-4xl mx-auto md:mb-10 text-center font-bold uppercase">
        Services
      </h1>

      <div className="grid gap-6 md:grid-cols-6">
        {data.map((service: Service, index) => (
          <Box
            key={service._id}
            className={index < 3 ? "md:col-span-2" : "md:col-span-3"}
          >
            <Card size="2" className="h-full flex flex-col">
              <Inset clip="padding-box" side="top" pb="current">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-40 object-cover bg-gray-200"
                />
              </Inset>

              <Text as="p" size="5" className="text-center pb-2" weight="bold">
                {service.title}
              </Text>

              <Flex align="center" justify="center" gap="2" className="pb-2">
                <Badge color="crimson" size="3">
                  Duration:{" "}
                  {service.duration === 1
                    ? `${service.duration} day`
                    : `${service.duration} hours`}
                </Badge>
                <Badge color="cyan" size="3">Price: ${service.price}</Badge>
              </Flex>

              <Text as="p" size="2" className="text-center text-gray-600 flex-1 min-h-[80px]">
                {service.description}
              </Text>

              <Flex align="center" justify="between" gap="4" pt="4" className="mt-auto">
                <Button color="cyan">
                  <Link to="/contact" className="p-4">
                    ${service.price}
                  </Link>
                </Button>
                
                <Button color="ruby">
                  <Link to="/appointment" className="p-4">
                    {service.duration === 1 ? `${service.duration} day` : `${service.duration} hours`}
                  </Link>
                </Button>
              </Flex>
            </Card>
          </Box>
        ))}
      </div>
    </Container>
  );
};

export default Services;
