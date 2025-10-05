export type Product = {
  id?: string;
  _id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  rating: number;
  reviews: number;
  category: string;
  description?: string;
  createdAt: number
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