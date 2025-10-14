import bearing from "@/assets/svg/products/bearing.svg";
import Kiki from "@/assets/svg/products/kiki.svg";
import Lara from "@/assets/svg/products/lara.svg";
import meO from "@/assets/svg/products/me-o.svg";
import moderna from "@/assets/svg/products/moderna.svg";
import smartHeart from "@/assets/svg/products/smart-heart.svg";
import whiskas from "@/assets/svg/products/whiskas.svg";
import { Box, Container, Flex } from "@radix-ui/themes";
import { motion } from "framer-motion";

const OurBrands: React.FC = () => {
  return (
    <Box className="h-[650px] md:h-[400px] lg:h-[440px] bg-[#E3462C]">
      <Container>
        <Box>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="w-full max-w-4xl px-4 text-2xl md:text-3xl lg:text-4xl mx-auto pt-6 md:pt-10 md:my-4 lg:mb-14 text-center font-bold uppercase text-white"
          >
            Our cooporate brands
          </motion.h1>
        </Box>
        <Box className="mt-6 md:mt-12">
          <Flex
            justify="between"
            align="center"
            className="flex-wrap h-[460px] md:h-[200px] lg:h-[200px] rounded-md px-4 bg-white"
          >
            <img src={moderna} alt="Moderna brand" width="100px" />
            <img src={meO} alt="Me-o brand" width="100px" />
            <img src={smartHeart} alt="Smart-heart brand" width="100px" />
            <img src={whiskas} alt="Whiskas brand" width="100px" />
            <img src={bearing} alt="Bearing brand" width="100px" />
            <img src={Kiki} alt="Kiki brand" width="100px" />
            <img src={Lara} alt="Lara brand" width="100px" />
          </Flex>
        </Box>
      </Container>
    </Box>
  );
};

export default OurBrands;
