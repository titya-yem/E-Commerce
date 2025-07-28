import aboutHeroImage from "@/assets/image/About-hero.png";
import aboutFormImage from "@/assets/image/appointmnet-image.png";
import AppointmentForm from "@/components/AppointmentForm";
import { Box, Container } from "@radix-ui/themes";
import { Toaster } from "react-hot-toast";

const AppointmentPage = () => {
  return (
    <Box className=" bg-[#e3462c]">
      <Container className="px-4">
        <Toaster />
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-center relative top-12 lg:top-16">
          <Box className="px-4 md:w-[56%]">
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl lg:mb-20 text-white font-bold uppercase text-center md:text-left">
              Book an Appointment with us today for your pets
            </h1> 
          </Box>
          <Box>
            <img
              src={aboutHeroImage}
              alt="cute innocent dog"
              className="w-[300px] lg:w-[400px] relative z-[2]"
            />
          </Box>
        </div>
      </Container>

      {/* Appointment Booking Form Section */}
      <div className="flex py-16 justify-center items-center bg-[#1F272B]">
        {/* Image */}
        <Box>
          <img
            src={aboutFormImage}
            alt="cute cat and dog sitting on a chair"
            className="hidden lg:block w-[433px] mx-auto md:mx-0"
          />
        </Box>

        {/* Form */}
        <Box>
          <AppointmentForm />
        </Box>
      </div>
    </Box>
  );
};

export default AppointmentPage;