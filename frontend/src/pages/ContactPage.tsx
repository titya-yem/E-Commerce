import contactImage from "@/assets/image/contact-iamge.png";
import ContactForm from "@/components/ContactForm";
import { Box } from "@radix-ui/themes";
import { Toaster } from "react-hot-toast";

const ContactPage = () => {
  return (
    <Box>
      <Toaster />
      <div className="flex py-10 justify-center items-center bg-[#D3FAFF]">
        {/* Image */}
        <Box>
          <img
            src={contactImage}
            alt="cute cat and dog sitting on a chair"
            className="hidden lg:block w-[433px] shadow-lg mx-auto md:mx-0"
          />
        </Box>

        {/* Form */}
        <Box>
          <ContactForm />
        </Box>
      </div>
    </Box>
  );
};

export default ContactPage;