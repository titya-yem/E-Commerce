import Joi from "joi";
import mongoose from "mongoose";

// Custom validator for MongoDB ObjectId
const isObjectId = (value: string, helpers: any) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const petTypes = [
  "Dogs Lover",
  "Cats Lover",
  "Rabbit Lover",
  "Birds Lover",
  "Fishes Lover",
];

const commentValidation = Joi.object({
  title: Joi.string().min(5).max(255).trim().required(),
  text: Joi.string().min(5).max(400).trim().required(),
  type: Joi.string().valid(...petTypes).required(),
  userName: Joi.string().custom(isObjectId).optional(),
  status: Joi.string().valid("Pending", "Approved", "Cancelled").optional(),
});

export default commentValidation;
