import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Box } from "@radix-ui/themes";
import axios from "axios";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaCalendarAlt, FaEnvelope, FaUser } from "react-icons/fa";

const AppointmentForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [appointmentType, setAppointmentType] = useState("Vacation");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSubmit = async (data: any) => {
  try {
    const payload = {
      name: data.name,
      email: data.email,
      time: data.time,
      message: data.message || "",
      type: appointmentType,
      date: selectedDate?.toISOString(),
    };

    console.log("Payload:", payload);

    await axios.post(`${import.meta.env.VITE_API_URL}/api/appointment/create`, payload);
    
    toast.success("Appointment booked successfully!");
    reset();
  } catch (error) {
    console.error("Error booking appointment:", error);
    toast.error("Failed to book appointment.");
  }
};

  const serviceCategories: string[] = [
    "Vacation",
    "Bathing",
    "Cut and Trim hair",
    "Food & Supplies",
    "Party",
  ];

  return (
    <div className="w-[340px] md:w-[450px] h-[590px] p-6 shadow-lg rounded-lg lg:rounded-l-none max-w-md bg-white">
      {/* Appointment Type Selection */}
      <h2 className="text-2xl font-bold text-center pb-[17px]">
        Schedule an Appointment
      </h2>

      <div className="flex flex-wrap justify-center items-center gap-3 mb-4">
        {serviceCategories.map((type) => (
          <button
            key={type}
            className={`px-4 py-2 border rounded-lg text-sm transition-all cursor-pointer ${
              appointmentType === type
                ? "bg-blue-500 text-white"
                : "bg-gray-100"
            }`}
            onClick={() => setAppointmentType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="space-y-4">
          <Box className="relative">
            <FaUser className="absolute left-3 top-4 text-gray-400" />
            <input
              {...register("name")}
              type="text"
              placeholder="Your name"
              className="w-full pl-10 p-3 text-sm md:text-base border rounded-lg"
              required
            />
          </Box>

          <Box className="relative">
            <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
            <input
              {...register("email")}
              type="email"
              placeholder="Email address"
              className="w-full pl-10 p-3 text-sm md:text-base border rounded-lg"
              required
            />
          </Box>
        </div>

        <div className="flex justify-center items-center gap-4">
          <Box className="relative">
            <input
              {...register("time")}
              type="time"
              placeholder="Select Time"
              className="w-[145px] md:w-[190px] pl-10 p-3 text-sm md:text-base border rounded-lg"
              required
            />
          </Box>

          {/* Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Box className="relative cursor-pointer">
                <FaCalendarAlt className="absolute left-3 top-4 text-gray-400" />
                <input
                  type="text"
                  readOnly
                  value={selectedDate ? selectedDate.toLocaleDateString() : ""}
                  className="w-full pl-10 last: p-3 text-sm md:text-base border rounded-lg cursor-pointer"
                />
              </Box>
            </PopoverTrigger>
            <PopoverContent className="p-2 shadow-md rounded-lg bg-white">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                inline
              />
            </PopoverContent>
          </Popover>
        </div>

        <textarea
          {...register("message")}
          placeholder="Additional message"
          className="w-full max-h-[140px] p-3 text-sm md:text-base border rounded-lg"
        />

        <Button
          type="submit"
          className="p-3 rounded-lg w-full cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
        >
          Book appointment
        </Button>
      </form>
    </div>
  );
};

export default AppointmentForm;