import { useNavigate } from "react-router";
import { Button } from "./ui/button";

export const AppointmentDirection = () => {
  const navigate = useNavigate();

  return (
    <div className="w-[300px] md:w-[450px] h-[300px] lg:h-[591px] flex flex-col justify-center items-center p-6 mx-auto shadow-lg lg:rounded-l-none rounded-lg max-w-md bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">
        You must log in to book an appointment
      </h2>
      <div className="flex gap-4">
        <Button
          onClick={() => navigate("/signin")}
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
        >
          Login
        </Button>
        <Button
          onClick={() => navigate("/signup")}
          variant="outline"
          className="cursor-pointer"
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
};
