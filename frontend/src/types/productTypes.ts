export type Product = {
  _id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
  description?: string;
};

export interface productProps {
  startIndex: number;
  itemsToShow: number;
  products: Product[];
}