import Joi from "joi";
import mongoose from "mongoose";

const petTypes = ["Dogs Lover", "Cats Lover", "Rabbit Lover", "Birds Lover", "Fishes Lover"];

const isObjectId = (value: string, helpers: any) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const commentValidation = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  text: Joi.string().min(5).max(500).required(),
  userName: Joi.string().custom(isObjectId).required(),
  type: Joi.string().valid(...petTypes).required(),
  status: Joi.string().valid("Cancelled", "Approved").optional(),
});

export default commentValidation;
