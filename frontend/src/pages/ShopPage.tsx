import dogContact from "@/assets/image/shop-contact.png";
import shopImage from "@/assets/image/shop-image.png";
import catAppointment from "@/assets/image/shop-party.png";
import LinkButton from "@/components/shared/LinkButton";
import { Box, Container, Text } from "@radix-ui/themes";

const ShopPage = () => {
  return (
    <Box>
      <Container>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-10">
          {/* main box */}
          <Box className="md:h-[555px] lg:h-[500px] px-4 pt-6 space-y- *:text-center md:*:text-start rounded-lg bg-[#A2C8DD]">
            <Box className="space-y-2">
              <h3 className="text-lg md:text-2xl font-medium text-[#00424F]">
                Up to
              </h3>
              <h1 className="text-3xl md:text-4xl font-bold text-[#00424F]">
                45% Off
              </h1>
              <Box className="mx-auto md:mx-0 md:w-1/2">
                <Box className="w-full h-[5px] mb-1 mx-auto rounded-sm bg-[#E6C570]"></Box>
                <Text as="p" className="md:text-lg font-medium text-[#00424F]">
                  Explore our discount services at the end of the month
                </Text>
              </Box>
              <LinkButton
                link="services"
                name="Services"
                className="py-5 px-8 bg-[#054053] hover:border hover:bg-transparent hover:text-[#054053] duration-200"
              />
            </Box>
            <img
              src={shopImage}
              alt="dog steals food"
              className="relative md:top-16 md:left-10 lg:top-0 lg:left-16 w-[400px] lg:w-[420px]"
            />
          </Box>

          {/* side Boxes */}
          <div className="hidden md:flex flex-col items-center justify-center gap-4">
            {/* Top Box */}
            <div className="lg:flex justify-center items-center md:w-[300px] lg:w-[400px] lg:h-[242px] px-4 *:text-center lg:*:text-start rounded-lg bg-[#017496]">
              <Box>
                <h2 className="text-sm md:text-base lg:text-lg py-4 text-white">
                  Looking for the party event for your pets ?
                </h2>
                <LinkButton
                  link="appointment"
                  name="Party"
                  className="py-5 px-8 font-normal bg-transparent border hover:bg-white hover:text-[#017496] hover:font-medium duration-200"
                />
              </Box>
              <img
                src={catAppointment}
                alt="Cat wearing sunglasses"
                className="hidden md:block w-1/2 pt-7 relative left-14 lg:left-0 lg:top-[23px]"
              />
            </div>

            {/* Bottom Box */}
            <div className="lg:flex flex-row-reverse justify-center items-center md:w-[300px] lg:w-[400px] lg:h-[242px] px-4 *:text-center lg:*:text-start rounded-lg bg-[#017496]">
              <Box>
                <h2 className="text-sm md:text-base lg:text-lg lg:w-[80%] py-4 text-white">
                  Any questions ? Contact us Anytime
                </h2>
                <LinkButton
                  link="contact"
                  name="Contact"
                  className="py-5 px-8 font-normal bg-transparent border hover:bg-white hover:text-[#017496] hover:font-medium duration-200"
                />
              </Box>
              <img
                src={dogContact}
                alt="cute little sitting puppy"
                className="hidden md:block w-1/2 pt-7 relative left-14 lg:left-0"
              />
            </div>
          </div>
        </div>
      </Container>
    </Box>
  );
};

export default ShopPage;