import { Box } from "@radix-ui/themes";

type PetFoodCategoriesProps = {
  image: string;
  name: string;
};

const PetFoodCategories = ({ image, name }: PetFoodCategoriesProps) => {
  return (
    <div>
      <Box className="w-[80px] text-center space-y-3 mx-auto">
        <img src={image} alt="Pet food categories" />
        <h4 className="text-lg font-semibold">{name}</h4>
      </Box>
    </div>
  );
};

export default PetFoodCategories;