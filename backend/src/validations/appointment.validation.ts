import Joi from "joi";
import mongoose from "mongoose";

const appointmentType = ["Vacation", "Bathing", "Cut & Trim hair", "Food & Supplies", "Party"]

const isObjectId = (value: string, helpers: any) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const appointmentValidation = Joi.object({
    type: Joi.string().valid(...appointmentType).required(),
    name: Joi.string().custom(isObjectId).required(),
    email: Joi.string().email().required(),
    time: Joi.string().required(),
    date: Joi.string().required(),
    message: Joi.string().min(5).max(400).optional(),
    status: Joi.string().valid("Incomplete", "Completed", "Cancelled").optional(),
})

export default appointmentValidation;