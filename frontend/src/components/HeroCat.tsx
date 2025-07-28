import heroCat from "@/assets/image/hero-cat.png";
import catFoodProduct from "@/assets/image/hero-food.png";
import { Box, Container, Flex } from "@radix-ui/themes";

const HeroCat: React.FC = () => {
  return (
    <Container className="h-28 md:h-44 w-full bg-[#182317]">
      <Flex className="h-full items-center lg:items-start justify-center md:justify-between">
        <Flex className="gap-x-4 *:text-center *:space-y-2 text-white">
          <Box>
            <img
              src={heroCat}
              alt="hero-cat"
              className="relative bottom-16 left-16 w-[80px] lg:w-[100px] h-[130px] lg:h-[150px] hidden md:block"
            />
            <span className="relative bottom-14 left-10 hidden md:block text-white">
              Coupon #NewUSER
            </span>
          </Box>
          <img
            src={catFoodProduct}
            alt="cat food product iamge"
            className="relative bottom-20 lg:bottom-[100px] left-16 hidden lg:block w-[300px] lg:w-[340px]"
          />
        </Flex>

        <Flex className="gap-x-4 *:text-center *:space-y-2 mt-6 md:mt-0 lg:mt-9 text-white mx-auto">
          <Box>
            <h2 className="text-2xl lg:text-3xl font-semibold">200K+</h2>
            <p className="text-sm lg:text-base">Nutritional product</p>
          </Box>
          <Box>
            <h2 className="text-2xl lg:text-3xl font-semibold">#4</h2>
            <p className="text-sm lg:text-base">Product Sale</p>
          </Box>
          <Box>
            <h2 className="text-2xl lg:text-3xl font-semibold">97%</h2>
            <p className="text-sm lg:text-base">Client Satisfaction</p>
          </Box>
        </Flex>
      </Flex>
    </Container>
  );
};

export default HeroCat;