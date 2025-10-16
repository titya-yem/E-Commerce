import birds from "@/assets/image/Category-birds.png";
import leftArrow from "@/assets/svg/BackwardArrow.svg";
import birdImage from "@/assets/svg/CircleBird.svg";
import catImage from "@/assets/svg/CircleCat.svg";
import dogImage from "@/assets/svg/CircleDog.svg";
import fishImage from "@/assets/svg/CircleFish.svg";
import rabbitImage from "@/assets/svg/CircleRabbit.svg";
import rightArrow from "@/assets/svg/ForwardArrow.svg";
import type { Product } from "@/types/productTypes";
import { Box, Container, Heading } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import LinkButton from "../shared/LinkButton";
import { Button } from "../ui/button";
import CategoryFood from "./CategoryFood";
import PetFoodCategories from "./PetFoodCategory";
import { useFetch } from "@/hooks/useFetch";
import { motion } from "framer-motion";

const TopCategories: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);

  const { isLoading, isError, data, error } = useFetch<Product[]>({
    url: "api/product",
    queryKey: ["products"],
  });

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
        setItemsToShow(4);
      } else {
        setItemsToShow(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) return <Heading>Loading...</Heading>;
  if (isError) return <Heading>Error: {(error as Error).message}</Heading>;
  if (!data || data.length === 0)
    return <Heading>No Products Available</Heading>;

  return (
    <Container className="py-10 bg-[#FAD046]">
      <Box className="relative">
        <motion.h1
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          viewport={{ once: true }}
          className="uppercase text-2xl lg:text-4xl text-center font-bold"
        >
          Top Categories
        </motion.h1>
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <LinkButton
            link="shop"
            name="Check Our Shop"
            classname="block md:hidden mx-auto text-center"
          />
        </motion.div>

        <Box className="!hidden md:!flex justify-between items-center px-2 h-[310px] bg-[#E3462C] rounded-lg">
          <Button
            onClick={handleBackward}
            disabled={startIndex === 0}
            className="border shadow-md bg-transparent px-2 py-2 cursor-pointer hover:bg-transparent rounded-sm border-gray-300"
          >
            <img
              src={leftArrow}
              alt="Backward Arrow"
              width={25}
              className="invert"
            />
          </Button>

          <CategoryFood startIndex={startIndex} itemsToShow={itemsToShow} />

          <Button
            onClick={handleForward}
            disabled={startIndex + itemsToShow >= data.length}
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
