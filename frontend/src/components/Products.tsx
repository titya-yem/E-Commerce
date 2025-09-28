import star from "@/assets/svg/Star.svg";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/store/slices/Cart-Slice";
import type { AppDispatch } from "@/store/store";
import type { Product } from "@/types/productTypes";
import { Box, Container, Flex, Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

// Helper function to slugify product names
const slugify = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const ProductsComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState<number>(10);

  const { isLoading, isError, data, error } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/product`
      );
      return res.data;
    },
  });

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Error: {(error as Error).message}</h1>;
  if (!data || data.length === 0) return <h1>No product available</h1>;

  const categories = Array.from(new Set(data.map((item) => item.category)));

  // Filter products
  const filteredProducts =
    categoryFilter === "all"
      ? data
      : data.filter((item) => item.category === categoryFilter);

  // Slice for pagination
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <Container>
      <Flex justify="between" align="center">
        <h4 className="text-xl md:text-2xl text-center font-semibold py-10 md:py-14">
          Food <span className="text-[#43606D]">& Supplies</span>
        </h4>

        <Select.Root
          size="3"
          value={categoryFilter}
          onValueChange={(val) => {
            setCategoryFilter(val);
            setVisibleCount(10);
          }}
        >
          <Select.Trigger color="blue" variant="soft" />
          <Select.Content position="popper" side="bottom">
            <Select.Item value="all">All Categories</Select.Item>
            {categories.map((category) => (
              <Select.Item key={category} value={category}>
                {category}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>

      {/* Product List */}
      <Box className="p-10 px-4 md:px-20 mb-14 rounded-md bg-[#DEFBFF]">
        {filteredProducts.length === 0 ? (
          <p>Sorry, no products available.</p>
        ) : (
          <div className="flex flex-wrap justify-center items-stretch gap-6">
            {visibleProducts.map((item) => (
              <Flex
                key={item._id}
                direction="column"
                align="center"
                className="w-[210px] bg-white rounded-md shadow-xl overflow-hidden flex-grow"
              >
                <Link
                  to={`/shop/${slugify(item.name)}-${item._id}`}
                  className="flex-grow"
                >
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
                <Box className="bg-[#253239] w-full p-4 text-white flex flex-col flex-grow rounded-b-md">
                  <h4 className="text-base font-medium mb-2 line-clamp-2 h-[48px]">
                    {item.name}
                  </h4>

                  <Flex justify="between" align="center" className="mb-3">
                    <p className="font-semibold">${item.price}</p>
                    <Flex gapX="2" align="center">
                      <img src={star} alt={`Rating ${item.rating}`} />
                      <span>{item.rating}</span>
                    </Flex>
                  </Flex>

                  {/* Spacer pushes button to bottom */}
                  <div className="flex-grow" />

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

        {/* Show More / Show Less Controls */}
        {filteredProducts.length > 10 && (
          <div className="flex justify-center gap-4 mt-8">
            {visibleCount > 10 && (
              <Button
                className="px-6 py-2 cursor-pointer bg-gray-500 text-white hover:bg-gray-600 rounded-lg"
                onClick={() =>
                  setVisibleCount((prev) => Math.max(prev - 10, 10))
                }
              >
                Show Less
              </Button>
            )}

            {visibleCount < filteredProducts.length && (
              <Button
                className="px-6 py-2 cursor-pointer bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
                onClick={() => setVisibleCount((prev) => prev + 10)}
              >
                Show More
              </Button>
            )}
          </div>
        )}
      </Box>
    </Container>
  );
};

export default ProductsComponent;
