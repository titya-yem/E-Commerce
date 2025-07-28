import logo from "@/assets/image/Logo.png";
import addressIcon from "@/assets/svg/Address.svg";
import emailIcon from "@/assets/svg/Email.svg";
import phoneIcon from "@/assets/svg/footer-phone.svg";
import line from "@/assets/svg/Line.svg";
import { NavbarLists } from "@/constants/Navbar";
import { Box, Container, Flex, Text } from "@radix-ui/themes";
import { Link } from "react-router";

const Footer: React.FC = () => {
  return (
    <Container className="pt-10 px-4 pb-6 *:text-white bg-[#253239]">
      <div className="flex flex-col md:flex-row justify-center xl:justify-between items-center gap-x-10 gap-y-4">
        {/* Left side */}
        <Box className="text-center md:text-left w-full md:w-auto lg:pl-12">
          <img
            src={logo}
            alt="Pet Shop Logo"
            width="100px"
            className="mx-auto md:mx-0"
          />
          <Text
            as="p"
            className="w-full md:w-2/3 max-w-md mx-auto md:mx-0 text-sm md:text-base mt-4 pb-6"
          >
            Send us your email to receive 5% off your first order!
          </Text>
          <a
            href="mailto:thitya.yem.photo@gmail.com"
            className="py-3 px-10 inline-block mx-auto md:mx-0 rounded-md cursor-pointer bg-[#E3462C] hover:bg-[#c23e26]"
          >
            Send Email
          </a>
        </Box>

        {/* Middle side */}
        <Box className="text-center mt-6 mb-4">
          <h1 className="mb-3 text-xl md:text-2xl lg:text-3xl font-semibold">
            Menu
          </h1>
          <Flex gapX="4">
            <Box>
              {NavbarLists.slice(0,4).map((list) => (
                <ul key={list.link}>
                  <li className="underline underline-offset-4 pb-3 hover:font-medium duration-200">
                    <Link to={list.link}>{list.label}</Link>
                  </li>
                </ul>
              ))}
            </Box>
            <Box>  
              {NavbarLists.slice(4,8).map((list) => (
                <ul key={list.link}>
                  <li className="underline underline-offset-4 pb-3 hover:font-medium duration-200">
                    <Link to={list.link}>{list.label}</Link>
                  </li>
                </ul>
              ))}
            </Box>
          </Flex>
        </Box>

        {/* Right side */}
        <Box className="text-center">
          <h1 className="mb-3 text-xl md:text-2xl lg:text-3xl font-semibold">
            Contact Us
          </h1>
          <Box className="mt-4 space-y-2">
            <div className="flex items-center justify-center gap-x-4">
              <img src={addressIcon} alt="Our Location" />
              <Text as="p" className="w-[62%] md:w-1/2 text-left">
                9400 S Normandie Ave #14 Los Angeles(CA), 90044
              </Text>
            </div>
            <div className="flex items-center justify-center gap-x-4">
              <img src={emailIcon} alt="Contact us via our Email" />
              <Text as="p">
                <a href="mailto:thitya.yem.photo@gmail.com" className="underline">
                  thitya.yem.photo@gmail.com
                </a>
              </Text>
            </div>
            <div className="flex items-center justify-center gap-x-4">
              <img src={phoneIcon} alt="Our phone number" />
              <Text as="p">(323) 238-0696</Text>
            </div>
          </Box>
        </Box>
      </div>
      <img src={line} alt="footer-line" className="mt-8 mb-6" />
      <Text as="p" className="text-sm text-center md:text-start md:pl-3 text-amber-50">
        Copyright by Pet Shop. (Titya Yem)
      </Text>
    </Container>
  );
};

export default Footer;