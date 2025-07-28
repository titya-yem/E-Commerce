import { setAuth } from "@/store/slices/Auth-Slice";
import { Box, Text } from "@radix-ui/themes";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FaEnvelope, FaUserLock } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const SignInForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signin`, data);
      const { user, token } = res.data;

      // Save for 1 hours
      const expireTime = Date.now() + 2 * 60 * 60 * 1000;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("expire", expireTime.toString());

      dispatch(setAuth(user))

      toast.success("Sign in successful!", {
        position: "top-center",
      });
      reset();
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const message = err.response?.data?.message || "Error signing in";
      console.error(error);
      toast.error(message);
    }
  };

  return (
    <div className="w-[340px] md:w-[450px] h-[565px] py-6 shadow-lg rounded-lg lg:rounded-l-none max-w-md bg-white">
      <h2 className="text-2xl font-bold text-center text-[#2F398B]">
        Sign in to your account
      </h2>
      <Text as="p" className="text-sm pt-2 pb-4 text-center font-medium text-[#029FE3]">
        Sign in to your account to access your pets
      </Text>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex ">
        <div className="w-2/3 space-y-2 mx-auto text-end">
          <Box className="space-y-4">
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

          <Link
            to="/signup"
            className="text-sm font-medium hover:font-semibold underline text-blue-600"
          >
            Don't have an account? Sign Up
          </Link>

          <Button
            type="submit"
            className="text-base p-6 mt-4 rounded-lg w-full cursor-pointer bg-[#e3462c] hover:bg-[#e32c2c] text-white"
          >
            Sign In
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;