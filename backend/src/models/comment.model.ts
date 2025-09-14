import mongoose, { Document, Schema, model } from "mongoose";

enum petType {
  DogsLover = "Dogs Lover",
  CatsLover = "Cats Lover",
  RabbitLover = "Rabbit Lover",
  BirdsLover = "Birds Lover",
  FishesLover = "Fishes Lover",
}

enum commentStatus {
  Cancelled = "Cancelled",
  Approved = "Approved",
}

interface commentProps extends Document {
  title: string;
  text: string;
  userName: mongoose.Types.ObjectId;
  type: petType;
  status: commentStatus;
}

const commentSchema = new Schema<commentProps>(
  {
    title: { type: String, trim: true, required: true },
    text: { type: String, trim: true, required: true },
    userName: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: Object.values(petType), required: true },
    status: { type: String, enum: Object.values(commentStatus), default: commentStatus.Cancelled }, // default value
  },
  { timestamps: true }
);

const comment = model<commentProps>("Comment", commentSchema);

export default comment;
