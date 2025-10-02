import aboutImage from "@/assets/image/About-image.png";
import circle from "@/assets/svg/PositiveCircle.svg";
import { Box, Container, Flex, Text } from "@radix-ui/themes";
import LinkButton from "./LinkButton";
import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <Container className="bg-[#FBF3DF] px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 lg:gap-12 py-8">
        <Box className="w-full md:w-1/2">
          <motion.h1
            initial={{ opacity: 0, scale: 0.6, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
            className="md:hidden text-center uppercase text-2xl lg:text-4xl font-bold"
          >
            About Us
          </motion.h1>
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            viewport={{ once: true }}
            src={aboutImage}
            alt="about image"
          />
        </Box>

        <Box className="md:w-1/2 space-y-6 *:text-center *:md:text-left">
          <motion.h1
            initial={{ opacity: 0, scale: 0.6, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            viewport={{ once: true }}
            className="hidden md:block uppercase text-2xl lg:text-4xl font-bold"
          >
            About Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-sm md:text-base"
          >
            Until one has loved an animal, a part of one’s soul remain
            unawakened. We believe in it and we believe in easy access to things
            that are good for our mind, body and spirit, with a clever
            offerings, superb support and a secure checkout you’re in good
            hands.
          </motion.p>
          <Flex
            direction="column"
            justify="between"
            gap="4"
            className="mx-auto md:mx-0 w-fit"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Flex gap="4" align="center">
                <img src={circle} alt="positive circle" width={25} />
                <Text
                  as="p"
                  className="text-sm md:text-base font-medium lg:font-normal"
                >
                  Over 10 years of experience
                </Text>
              </Flex>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Flex gap="4" align="center">
                <img src={circle} alt="positive circle" width={25} />
                <Text
                  as="p"
                  className="text-sm md:text-base font-medium lg:font-normal"
                >
                  20 talented vets ready to help you
                </Text>
              </Flex>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Flex gap="4" align="center">
                <img src={circle} alt="positive circle" width={25} />
                <Text
                  as="p"
                  className="text-sm md:text-base font-medium lg:font-normal"
                >
                  High-quality product only
                </Text>
              </Flex>
            </motion.div>
          </Flex>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <LinkButton
              link="services"
              name="Explore Our Services"
              className="mx-auto"
            />
          </motion.div>
        </Box>
      </div>
    </Container>
  );
};

export default AboutSection;
