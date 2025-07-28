import sittingDog from "@/assets/image/client-dog.png";
import whiteDog from "@/assets/image/client-image.png";
import leftArrow from "@/assets/svg/BackwardArrow.svg";
import rightArrow from "@/assets/svg/ForwardArrow.svg";
import { Box, Container, Flex, Text } from "@radix-ui/themes";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from "react";
import type { Comment } from "../types/commentTypes";
import { Button } from "./ui/button";

const Recommendation: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { isLoading, isError, data, error } = useQuery<Comment[]>({
    queryKey: ["comments"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/comment`);
      return res.data;
    },
  });

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Error: {(error as Error).message}</h1>;
  if (!data || data.length === 0) return <h1>No comments found</h1>;

  const totalComments = data.length;

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalComments - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalComments - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="mt-8 pt-10 bg-[#FBF3DF]">
      <Container>
        <Box className="space-y-6">
          <Box>
            <h1 className="text-2xl lg:text-4xl mx-auto md:my-4 lg:mb-14 text-center font-bold uppercase">
              What our clients say about us
            </h1>
          </Box>
          <Box>
            {/* Display the current comment */}
            <Flex
              align="center"
              justify="center"
              className="w-full lg:px-3 rounded-lg h-[280px] gap-2 md:gap-10 lg:gap-3 mb-10 bg-[#FAD046]"
            >
              {/* Left Arrow Button */}
              <Button
                className="p-0 cursor-pointer hover:bg-[#E3462C] bg-[#E3462C]"
                onClick={handlePrevious}
              >
                <img src={leftArrow} alt="backward Arrow" className="invert w-10" />
              </Button>

              <Box className="!hidden lg:!inline-block">
                <img src={whiteDog} alt="White cute hairy dog" width="220px" />
              </Box>

              {/* Comment Content */}
              <Box className="w-2/3 lg:w-1/2 space-y-4">
                <h1 className="text-xl lg:text-3xl text-center font-semibold uppercase">
                  "{data[currentIndex]?.title}"
                </h1>
                <Text as="p" className="text-sm md:text-base lg:text-lg">
                  {data[currentIndex]?.text}
                </Text>
                <Box>
                  <Text as="p" className="font-medium">
                    {data[currentIndex]?.userName?.userName || 'Anonymous'}
                  </Text>
                  <Text as="p" className="text-sm lg:text-base">
                    {data[currentIndex]?.type}
                  </Text>
                </Box>
              </Box>

              <Box className="!hidden lg:!inline-block">
                <img src={sittingDog} alt="Cute innocent sitting dog" width="220px" />
              </Box>

              {/* Right Arrow Button */}
              <Button
                className="p-0 cursor-pointer hover:bg-[#E3462C] bg-[#E3462C]"
                onClick={handleNext}
              >
                <img src={rightArrow} alt="forward Arrow" className="invert w-10" />
              </Button>
            </Flex>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Recommendation;