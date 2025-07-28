import star from "@/assets/svg/Star.svg";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/store/slices/Cart-Slice";
import type { AppDispatch } from "@/store/store";
import type { Product } from "@/types/productTypes";
import { Box, Container, Flex } from "@radix-ui/themes";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { Link } from "react-router";

// Helper function to slugify product names
const slugify = (name: string) => {
  return name
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");
};

const ProductsComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { isLoading, isError, data, error } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/product`);
      return res.data; // return product array directly
    },
  });

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Error: {(error as Error).message}</h1>;

  return (
    <Container>
      <h4 className="text-xl text-center lg:text-start font-semibold py-16">
        Food <span className="text-[#43606D]">& Supplies</span>
      </h4> 
      {/* will at filter */}
      <Box className="p-10 px-4 md:px-20 mb-14 rounded-md bg-[#DEFBFF]">
        {data?.length === 0 ? (
          <p>Sorry, No products available.</p>
        ) : (
          <div className="flex flex-wrap justify-center items-stretch gap-6">
            {data?.map((item) => (
              <Flex
                key={item._id}
                direction="column"
                align="center"
                className="w-[210px] bg-white rounded-md shadow-xl overflow-hidden flex-grow"
              >
                <Link to={`/shop/${slugify(item.name)}-${item._id}`}>
                {/* Image Box */}
                  <Box className="h-[160px] py-1 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={`Product image of ${item.name}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </Box>
                </Link>
                {/* Info Box */}
                <Box className="bg-[#253239] w-full p-4 text-white flex-grow rounded-b-md">
                  <h4 className="text-base font-medium mb-2">{item.name}</h4>
                  <Flex justify="between" align="center" className="mb-3">
                    <p className="font-semibold">${item.price}</p>
                    <Flex gapX="2" align="center">
                      <img src={star} alt={`Rating ${item.rating}`} />
                      <span>{item.rating}</span>
                    </Flex>
                  </Flex>
                  <Button
                    className="w-full py-2 cursor-pointer !text-black bg-[#FAD046] hover:bg-[#ffca1e]"
                    onClick={() =>
                      dispatch(
                        addToCart({
                          id: item._id,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                          quantity: 1,
                          category: item.category,
                        })
                      )
                    }
                  >
                    Add To Cart
                  </Button>
                </Box>
              </Flex>
            ))}
          </div>
        )}
      </Box>
    </Container>
  );
};

export default ProductsComponent;
