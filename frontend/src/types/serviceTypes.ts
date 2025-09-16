export interface Service {
  id: string;
  _id: string;
  alt: string;
  title: string;
  text: string;
  description: string;
  image?: string;
  price: number | string;
  duration?: number | string;
}

export type ServiceFormData = {
  title: string;
  description: string;
  price: number;
  duration?: number | string;
  image?: string;
  alt?: string;
};
