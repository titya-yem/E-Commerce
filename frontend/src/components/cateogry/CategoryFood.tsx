import star from "@/assets/svg/Star.svg";
import { addToCart } from "@/store/slices/Cart-Slice";
import type { AppDispatch } from "@/store/store";
import type { categoryProps, Product } from "@/types/productTypes";
import { Box, Flex, Heading } from "@radix-ui/themes";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useFetch } from "@/hooks/useFetch";

const slugify = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const CategoryFood: React.FC<categoryProps> = ({
  startIndex,
  itemsToShow,
}: categoryProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { isLoading, isError, data, error } = useFetch<Product[]>({
    url: "api/product",
    queryKey: ["products"],
  });

  if (isLoading)
    return <Heading className="text-xl text-center">Loading...</Heading>;

  if (isError)
    return (
      <Heading className="text-xl text-center">
        Error: {(error as Error).message}
      </Heading>
    );

  if (!data || data.length === 0)
    return (
      <Heading className="text-xl text-center">No Products Available</Heading>
    );

  return (
    <div className="flex justify-between items-center overflow-hidden gap-x-4 xl:gap-x-0 w-[85%]">
      {data.slice(startIndex, startIndex + itemsToShow).map((item) => (
        <div key={item._id || item.id} className="w-[220px]">
          {/* Image Box */}
          <Link to={`/shop/${slugify(item.name)}-${item._id || item.id}`}>
            <Box className="h-[140px] rounded-t-md flex items-center justify-center bg-white">
              <img
                src={item.image || "https://via.placeholder.com/150"}
                alt={`Image of ${item.name}`}
                className="mx-auto max-w-full max-h-full object-contain"
              />
            </Box>
          </Link>

          {/* Info Box */}
          <Box className="rounded-b-md h-[160px] p-4 text-white bg-[#253239]">
            <h4 className="text-base font-medium mb-2">{item.name}</h4>
            <Flex justify="between" align="center" className="mb-3">
              <p className="font-semibold">${item.price}</p>
              <Flex gapX="2" align="center">
                <img
                  src={star}
                  alt={`Rating ${item.rating || "N/A"}`}
                  className="w-4 h-4"
                />
                <span>{item.rating || "N/A"}</span>
              </Flex>
            </Flex>
            <Button
              className="w-full py-2 cursor-pointer !text-black bg-[#FAD046] hover:bg-[#ffca1e]"
              onClick={() =>
                dispatch(
                  addToCart({
                    id: item.id || item._id,
                    name: item.name,
                    price: item.price,
                    image: item.image || "https://via.placeholder.com/150",
                    quantity: 1,
                    category: item.category,
                    description: item.description,
                  })
                )
              }
            >
              Add To Cart
            </Button>
          </Box>
        </div>
      ))}
    </div>
  );
};

export default CategoryFood;
