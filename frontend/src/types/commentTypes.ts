export const petType = {
  DogsLover: "Dogs Lover",
  CatsLover: "Cats Lover",
  RabbitLover: "Rabbit Lover",
  BirdsLover: "Birds Lover",
  FishesLover: "Fishes Lover",
} as const;

export type PetType = typeof petType[keyof typeof petType];

export const commentStatus = {
  Pending: "Pending",
  Cancelled: "Cancelled",
  Approved: "Approved",
} as const;

export type CommentStatus = typeof commentStatus[keyof typeof commentStatus];

export interface Comment {
  _id: string;
  title: string;
  text: string;
  userName: { userName: string };
  type: PetType;
  status: CommentStatus;
  createdAt?: string;
  updatedAt?: string;
}
