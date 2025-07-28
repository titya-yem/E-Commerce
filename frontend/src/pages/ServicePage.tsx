import serviceImage from "@/assets/image/service-image.png";
import LinkButton from "@/components/shared/LinkButton";
import { Box, Container, Text } from "@radix-ui/themes";
import { FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router";

const ServicesPage = () => {
  return (
    <Container className="px-4 bg-[#DEFBFF]">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6">
        {/* left box */}
        <Box className="lg:mb-12  space-y-4">
          <h1
            className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 
              md:w-2/3 text-[#2F398B] font-bold uppercase 
              text-center md:text-left
              leading-tight md:leading-snug lg:leading-relaxed xl:leading-tight"
          >
            Love is a for- <span className="text-[#029FE3]">legs</span> words
          </h1>

          <Text
            as="p"
            className="md:text-lg text-center md:text-start lg:w-1/2 font-medium text-[#029FE3]"
          >
            Affordable pet services that you cannot find anywhere{" "}
            <span className="text-[#2F398B]">but here</span>
          </Text>

          <Box className="w-[90%] mx-auto md:mx-0 md:py-6 rounded-lg md:bg-white">
            <div className=" flex flex-wrap items-center justify-center gap-4">
              <FaCalendarAlt className="text-[#2F398B]" />
              <Link to="/appointment">
                <Text as="p" className="text-sm md:text-base text-[#029FE3]">
                  Schedule your appointment Today
                </Text>
              </Link>
              <LinkButton name="Book Appointment" link="appointment" />
            </div>
          </Box>
        </Box>

        {/* right box */}
        <Box>
          <img src={serviceImage} alt="Smiling dog and cat sitting together" />
        </Box>
      </div>
    </Container>
  );
};

export default ServicesPage;