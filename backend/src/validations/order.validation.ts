import Joi from "joi";

export const orderItemSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  category: Joi.string().required(),
  price: Joi.number().positive().required(),
  quantity: Joi.number().positive().required(),
  image: Joi.string().uri().required().messages({
    "string.uri": "Image must be a valid URL",
    "any.required": "Image is required",
  }),
});

const orderValidation = Joi.object({
  cart: Joi.array().items(orderItemSchema).required(),
  totalAmount: Joi.number().positive().required(),
  totalQuantity: Joi.number().positive().required(),
});

export default orderValidation;
