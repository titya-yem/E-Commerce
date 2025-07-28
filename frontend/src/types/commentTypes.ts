export const petType = {
  DogsLover: "Dogs Lover",
  CatsLover: "Cats Lover",
  RabbitLover: "Rabbit Lover",
  BirdsLover: "Birds Lover",
  FishesLover: "Fishes Lover",
} as const;

export type petType = typeof petType[keyof typeof petType];

export interface Comment {
  _id: string;
  title: string;
  text: string;
  userName: {
    userName: string;
  };
  type: petType;
  createdAt?: string;
  updatedAt?: string;
}