import star from "@/assets/svg/Star.svg";
import { addToCart } from "@/store/slices/Cart-Slice";
import type { Product } from "@/types/productTypes";
import { Box, Container, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import LinkButton from "./shared/LinkButton";
import { Button } from "./ui/button";

const ProductDetailPage = () => {
  const [mainImage, setMainImage] = useState("");
  const { slug } = useParams(); 
  const dispatch = useDispatch();

  const id = slug?.split("-").pop();

  const { data: product, isLoading, isError, error } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/product/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div>Loading product...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!product) return <div>Product not found.</div>;

  // Update image state only after data is fetched
  if (!mainImage) setMainImage(product.image);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: 1,
      })
    );
  };

  return (
    <Box className="h-auto bg-[#FFFAF5]">
      <Container className="p-8">
        <div className="flex items-start px-4 py-6 rounded-md shadow-lg bg-white">
          {/* Small Images Section */}
          <Box className="!hidden md:!block w-full md:w-[200px] space-y-2">
            {[product.image].map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} - ${index}`}
                className={`w-full h-20 object-cover cursor-pointer border-2 ${
                  mainImage === image ? "border-blue-500" : "border-transparent"
                }`}
                onClick={() => setMainImage(image)}
              />
            ))}
          </Box>

          {/* Main Image and Details */}
          <div className="h-auto md:h-[500px] flex flex-col md:flex-row justify-between items-center gap-4 lg:gap-20">
            <Box className="rounded-lg mx-auto md:w-[300px]">
              <img
                src={mainImage}
                alt={product.name}
                className="w-[180px] md:w-[200px] lg:w-[240px] mx-auto object-contain"
              />
            </Box>

            {/* Product Details */}
            <Box className="w-full md:w-2/3 lg:w-[45%] lg:mr-8">
              <h1 className="text-2xl lg:text-4xl text-center md:text-start font-bold text-[#1F276C]">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 pt-4">
                <img src={star} alt="star" className="lg:w-5 lg:h-5" />
                <Text as="p" className="text-sm lg:text-base text-gray-500">
                  {product.rating}{" "}
                  {product.reviews && `(${product.reviews} reviews)`}
                </Text>
              </div>
              <Text as="p" className="text-2xl text-[#FF6135] font-semibold">
                ${product.price.toFixed(2)}
              </Text>
              {product.description && (
                <Text as="p" className="pt-2 mx-auto text-center md:text-start text-sm lg:text-base text-gray-700">
                  {product.description}
                </Text>
              )}
              <Button
                onClick={handleAddToCart}
                className="w-full py-6 mt-6 cursor-pointer bg-[#FF6135] text-white hover:bg-[#e55831]"
              >
                Add to Cart
              </Button>
              <LinkButton name="Back To Shop" link="shop" className="mt-4 w-full" />
            </Box>
          </div>
        </div>
      </Container>
    </Box>
  );
};

export default ProductDetailPage;
