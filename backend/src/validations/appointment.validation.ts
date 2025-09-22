import Joi from "joi";
import mongoose from "mongoose";

const isObjectId = (value: string, helpers: any) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const appointmentTypes = ["Vacation", "Bathing", "Cut & Trim hair", "Food & Supplies", "Party"];

const appointmentValidation = Joi.object({
  type: Joi.string().valid(...appointmentTypes).required(),
  user: Joi.string().custom(isObjectId).optional(),
  email: Joi.string().email().required(),
  time: Joi.string().required(),
  date: Joi.string().required(),
  message: Joi.string().optional(),
  status: Joi.string().valid("Incomplete", "Completed", "Cancelled").optional(),
});

export default appointmentValidation;
