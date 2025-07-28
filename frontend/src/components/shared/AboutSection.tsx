import aboutImage from "@/assets/image/About-image.png";
import circle from "@/assets/svg/PositiveCircle.svg";
import { Box, Container, Flex } from "@radix-ui/themes";
import LinkButton from "./LinkButton";

const AboutSection = () => {
  return (
    <Container className="bg-[#FBF3DF] px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 lg:gap-12 py-8">
        <Box className="w-full md:w-1/2">
          <img src={aboutImage} alt="about image" />
        </Box>

        <Box className="md:w-1/2 space-y-6 *:text-center *:md:text-left">
          <h1 className="uppercase text-2xl lg:text-4xl font-bold">About Us</h1>
          <p className="text-sm lg:text-base">
            Until one has loved an animal, a part of one’s soul remain
            unawakened. We believe in it and we believe in easy access to things
            that are good for our mind, body and spirit, with a clever
            offerings, superb support and a secure checkout you’re in good
            hands.
          </p>
          <Box className="space-y-4 ml-7 md:ml-0">
            <Box>
              <Flex gap="4" align="center">
                <img src={circle} alt="positive circle" width={25} />
                <p>Over 10 years of experience</p>
              </Flex>
            </Box>
            <Box>
              <Flex gap="4" align="center">
                <img src={circle} alt="positive circle" width={25} />
                <p>20 talented vets ready to help you</p>
              </Flex>
            </Box>
            <Box>
              <Flex gap="4" align="center">
                <img src={circle} alt="positive circle" width={25} />
                <p>High-quality product only</p>
              </Flex>
            </Box>
          </Box>

          <LinkButton
            link="services"
            name="Explore Our Services"
            className="mx-auto"
          />
        </Box>
      </div>
    </Container>
  );
};

export default AboutSection;