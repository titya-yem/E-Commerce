import birds from "@/assets/image/Category-birds.png";
import leftArrow from "@/assets/svg/BackwardArrow.svg";
import birdImage from "@/assets/svg/CircleBird.svg";
import catImage from "@/assets/svg/CircleCat.svg";
import dogImage from "@/assets/svg/CircleDog.svg";
import fishImage from "@/assets/svg/CircleFish.svg";
import rabbitImage from "@/assets/svg/CircleRabbit.svg";
import rightArrow from "@/assets/svg/ForwardArrow.svg";
import type { Product } from "@/types/productTypes";
import { Box, Container } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import LinkButton from "../shared/LinkButton";
import { Button } from "../ui/button";
import CategoryFood from "./CategoryFood";
import PetFoodCategories from "./PetFoodCategory";

const TopCategories: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);

  const { isLoading, isError, data, error } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/product`);
      return res.data;
    },
  })

  const handleForward = () => {
    setStartIndex((prevIndex) =>
      Math.min(prevIndex + itemsToShow, (data?.length ?? 0) - 1)
    );
  };

  const handleBackward = () => {
    setStartIndex((prevIndex) => Math.max(prevIndex - itemsToShow, 0));
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsToShow(4); // Show 4 products for screens wider than 1024px
      } else {
        setItemsToShow(3); // Show 3 products for smaller screens
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Error: {(error as Error).message}</h1>;
  if (!data) return <h1>No Products Available</h1>;

  return (
    <Container className="py-10 bg-[#FAD046]">
      <Box className="relative">
        <h1 className="uppercase text-2xl lg:text-4xl text-center font-bold">
          Top Categories
        </h1>
        <img
          src={birds}
          alt="category birds"
          className="hidden md:inline absolute top-1 w-[150px] xl:w-[180px]"
        />
      </Box>
      <div className="flex flex-wrap gap-2 justify-between items-center w-2/3 mx-auto mt-10">
        <PetFoodCategories name="Rabbit" image={rabbitImage} />
        <PetFoodCategories name="Cat" image={catImage} />
        <PetFoodCategories name="Dog" image={dogImage} />
        <PetFoodCategories name="Bird" image={birdImage} />
        <PetFoodCategories name="Fish" image={fishImage} />
      </div>
      <Box>
        <div className="w-[189px] h-[20px] bg-[#302B2B] rounded-xl my-8 mx-auto"></div>
        <LinkButton
          link="shop"
          name="Check Our Shop"
          classname="block md:hidden mx-auto text-center"
        />
        <Box className="!hidden md:!flex justify-between items-center px-2 h-[310px] bg-[#E3462C] rounded-lg">
          {/* Backward Button */}
          <Button
            onClick={handleBackward}
            disabled={startIndex === 0} // Disable if at the start
            className="border shadow-md bg-transparent px-2 py-2 cursor-pointer hover:bg-transparent rounded-sm border-gray-300"
          >
            <img
              src={leftArrow}
              alt="Backward Arrow"
              width={25}
              className="invert"
            />
          </Button>

          {/* Display Current Products */}
          <CategoryFood startIndex={startIndex} itemsToShow={itemsToShow} />

          {/* Forward Button */}
          <Button
            onClick={handleForward}
            disabled={startIndex + itemsToShow >= data.length} // Disable if at the end
            className="border shadow-md bg-transparent px-2 py-2 cursor-pointer hover:bg-transparent rounded-sm border-gray-300"
          >
            <img
              src={rightArrow}
              alt="Forward Arrow"
              width={25}
              className="invert"
            />
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TopCategories;