import { Box, Flex, Text } from "@radix-ui/themes";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEnvelope, FaUser, FaUserLock } from "react-icons/fa";
import { Link } from "react-router";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const SignUpForm = () => {
    const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = async (data: any) => {
        try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/user/signup`, data);
        console.log({data});
        toast.success("Account created successfully!", {
            position: "top-center",
        });
        reset(); // reset form as new afte subbmited
        setTimeout(() => {
          navigate("/");
        }, 2000)
        } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        const message = err.response?.data?.message || "Error creating account";
        console.error(error);
        toast.error(message);
        }
  };

  return (
    <div className="w-[340px] md:w-[450px] h-[565px] py-6 shadow-lg rounded-lg lg:rounded-l-none max-w-md bg-white">
      <h2 className="text-2xl font-bold text-center text-[#2F398B]">
        Welcome to Pet Shop
      </h2>
      <Text as="p" className="text-sm pt-2 pb-4 text-center font-medium text-[#029FE3]">
        For better Experience with your pets!
      </Text>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex ">
        <div className="space-y-2 mx-auto text-end">
          <Box className="space-y-4">
                <Box className="relative">
                <FaUser className="absolute left-3 top-[18px] text-gray-400" />
                <input
                {...register("userName")}
                type="text"
                placeholder="User Name"
                className="w-[300px] md:w-[350px] pl-10 md:pl-10 p-4 md:p-3 text-sm md:text-base border rounded-lg"
                required
                />
            </Box>

            <Box className="relative">
                <FaEnvelope className="absolute left-3 top-[18px] text-gray-400" />
                <input
                {...register("email")}
                type="email"
                placeholder="Email address"
                className="w-full pl-10 md:pl-10 p-4 md:p-3 text-sm md:text-base border rounded-lg"
                required
                />
            </Box>

            <Box className="relative">
                <FaUserLock className="absolute left-3 top-[18px] text-gray-400" />
                <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="w-full pl-10 md:pl-10 p-4 md:p-3 text-sm md:text-base border rounded-lg"
                required
                />
            </Box>
          </Box>

          {/* Restore Password */}
          <Link to="/restorePassword" className="text-sm font-medium hover:font-semibold underline text-blue-600">
            Forget Password?
          </Link>

          <Button
          type="submit"
          className="text-base p-6 mt-4 rounded-lg w-full cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
          >
            Create Account
          </Button>
        </div>
      </form>

      {/* OR */}
      <Flex align="center" justify="center" gapX="2" className="mt-4">
        <Box className="w-[120px] h-[2px] rounded-md bg-gray-400"></Box>
        <Text as="span" className="text-sm text-gray-400">OR</Text>
        <Box className="w-[120px] h-[2px] rounded-md bg-gray-400"></Box>
      </Flex>

      {/* Login with Google or Facebook */}
      <Flex align="center" justify="center" direction="row" gapX="2" className="mt-4">
        
      </Flex>
    </div>
  )
}

export default SignUpForm
