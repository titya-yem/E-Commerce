import { useFetch } from "@/hooks/useFetch";
import type { Service } from "@/types/serviceTypes";
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Inset,
  Text,
} from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Services = () => {
  const { data, isError, error, isLoading } = useFetch<Service[]>({
    url: "api/service",
    queryKey: ["Services"],
  });

  if (isLoading) <Heading className="text-center py-10">Loading...</Heading>;
  if (isError)
    <Heading className="text-center py-10">
      Error: {(error as Error).message}
    </Heading>;
  if (!data || data.length === 0)
    <Heading className="text-center py-10">No Services available</Heading>;

  return (
    <Container className="my-10 pb-10 px-2">
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.8 }}
        className="text-2xl lg:text-4xl mx-auto mb-6 md:mb-10 text-center font-bold uppercase"
      >
        Services
      </motion.h1>

      {/* Responsive Grid */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        viewport={{ once: true }}
        className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        {data?.map((service: Service) => (
          <Box key={service._id} className="md:col-span-1">
            <Card
              size="2"
              className="h-full flex flex-col shadow-sm border rounded-lg"
            >
              <Inset clip="padding-box" side="top" pb="current">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-40 object-cover bg-gray-200"
                />
              </Inset>

              <Text as="p" size="5" className="text-center pb-2 font-bold">
                {service.title}
              </Text>

              <Flex align="center" justify="center" gap="2" className="pb-2">
                <Badge color="crimson" size="3">
                  Duration:{" "}
                  {service.duration === 1
                    ? `${service.duration} day`
                    : `${service.duration} hours`}
                </Badge>
                <Badge color="cyan" size="3">
                  Price: ${service.price}
                </Badge>
              </Flex>

              <Text
                as="p"
                size="2"
                className="text-center text-gray-600 flex-1 min-h-[100px] leading-relaxed"
              >
                {service.description}
              </Text>

              <Flex
                align="center"
                justify="between"
                gap="4"
                pt="4"
                className="mt-auto"
              >
                <Button color="cyan" asChild>
                  <Link to="/contact" className="p-4">
                    ${service.price}
                  </Link>
                </Button>
                <Button color="ruby" asChild>
                  <Link to="/appointment" className="p-4">
                    {service.duration === 1
                      ? `${service.duration} day`
                      : `${service.duration} hours`}
                  </Link>
                </Button>
              </Flex>
            </Card>
          </Box>
        ))}
      </motion.div>
    </Container>
  );
};

export default Services;
