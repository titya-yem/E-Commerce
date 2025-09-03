import { Box, Flex, Text } from "@radix-ui/themes";

interface TotalProps {
  title: string;
  img: string;
  value: number;
  percentage: number;
  isCurrency?: boolean; // optional prop to format as $
}

const Total = ({ title, img, value, percentage, isCurrency = false }: TotalProps) => {
  return (
    <Box className="w-72 space-y-8 p-4 shadow-md rounded-lg bg-white">
      <Flex gap="2" align="center" justify="between">
        <Text as="p" className="text-sm">
          {title}
        </Text>
        <img src={img} alt={`${title} icon`} className="w-6 h-6" />
      </Flex>

      <Flex gap="2" align="center" justify="between">
        <h2 className="text-xl lg:text-2xl font-medium">
          {isCurrency ? `$${value.toLocaleString()}` : value.toLocaleString()}
        </h2>
        <Flex direction="column" className="text-right">
          <Text
            as="span"
            className={`text-[12px] font-medium ${
              percentage > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {percentage.toFixed(2)}%
          </Text>
          <Text as="span" className="text-[12px]">
            vs last week
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Total;
