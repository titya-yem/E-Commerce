import type { ContactFormData } from "@/types/contactTypes";
import { Box } from "@radix-ui/themes";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaClock, FaEnvelope, FaPhoneAlt, FaUser } from "react-icons/fa";
import { Button } from "./ui/button";

const ContactForm: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact/create`, data);
      console.log({...data,});
      toast.success("Message sent", {
        position: "top-center",
      });
      reset(); // reset form as new afte subbmited
    } catch (error) {
      console.log(error);
      toast.error("Error to book an appointment please contact us");
    }
  };

  return (
    <div className="w-[340px] md:w-[450px] h-[589px] p-6 shadow-lg rounded-lg lg:rounded-l-none max-w-md bg-white">
      {/* Appointment Type Selection */}
      <h2 className="text-2xl font-bold text-center mb-4">Contact Us</h2>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex items-center justify-center gap-x-2 mt-12">
          <Box className="relative">
            <FaUser className="absolute left-3 top-4 text-gray-400" />
            <input
              {...register("firstName")}
              type="text"
              placeholder="First Name"
              className="w-full pl-10 p-3 text-sm md:text-base border rounded-lg"
              required
            />
          </Box>

          <Box className="relative">
            <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
            <input
              {...register("lastName")}
              type="text"
              placeholder="Last Name"
              className="w-full pl-10 p-3 text-sm md:text-base border rounded-lg"
              required
            />
          </Box>
        </div>

        <Box className="relative">
          <FaClock className="absolute left-3 top-4 text-gray-400" />
          <input
            {...register("email")}
            type="email"
            placeholder="Email Address"
            className="w-full pl-10 p-3 text-sm md:text-base border rounded-lg"
            required
          />
        </Box>

        <Box className="relative">
          <FaPhoneAlt className="absolute left-3 top-4 text-gray-400" />
          <input
            {...register("phoneNumber")}
            type="number"
            placeholder="Phone Number"
            className="w-full pl-10 p-3 text-sm md:text-base border rounded-lg"
            required
          />
        </Box>

        <textarea
          {...register("message")}
          placeholder="Additional message"
          className="w-full max-h-[200px] p-3 text-sm md:text-base border rounded-lg"
        />

        <Button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg w-full"
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;