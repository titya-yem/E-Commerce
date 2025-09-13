export interface Service   {
  id: string;
  alt: string;
  title: string;
  text: string;
  description: string;
  image?: string;
  price: number | string;
  duration?: number | string;
};