import { Box, Flex, Text } from "@radix-ui/themes";

export interface TotalProps {
  title: string;
  value: number;
  percentage: number;
  isCurrency?: boolean; // optional prop to format as $
}

const Total = ({
  title,
  value,
  percentage,
  isCurrency = false,
}: TotalProps) => {
  return (
    <Box className="w-full xs:w-48 space-y-2 p-4 shadow-md rounded-lg bg-white">
      <Flex gap="2" align="start" justify="start" direction="column">
        <Text as="p" className="text-sm">
          {title}
        </Text>
        <h2 className="text-xl lg:text-2xl font-medium">
          {isCurrency ? `$${value.toLocaleString()}` : value.toLocaleString()}
        </h2>
      </Flex>

      <Flex direction="column" className="text-right">
        <Text
          as="span"
          className={`text-[12px] font-medium ${
            percentage >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {percentage.toFixed(2)}%
        </Text>
        <Text as="span" className="text-[12px]">
          vs last month
        </Text>
      </Flex>
    </Box>
  );
};

export default Total;
