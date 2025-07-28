import SigninBackground from "@/assets/image/signin-background.png";
import SignInForm from "@/components/SignInForm";
import { Box } from "@radix-ui/themes";
import { Toaster } from "react-hot-toast";

const SignInPage = () => {
  return (
    <Box>
        <Toaster />
      <div className="flex justify-center items-center py-8 bg-[#FFEBD8]">
        {/* Image */}
        <Box>
          <img
            src={SigninBackground}
            alt="cute cat and dog sitting on a chair"
            className="hidden shadow-lg rounded-l-lg lg:block w-[416px]"
          />
        </Box>

        {/* Form */}
        <Box>
          <SignInForm />
        </Box>
      </div>
    </Box>
  )
}

export default SignInPage
