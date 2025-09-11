export type Product = {
  _id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
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

export type categoryProps = {
  startIndex: number;
  itemsToShow: number;
};