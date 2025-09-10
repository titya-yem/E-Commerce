import Joi from "joi";

const status = ["Cancelled", "Pending", "Shipped", "Paid"];

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
  user: Joi.string().required(),
  items: Joi.array().items(orderItemSchema).min(1).required(),
  totalAmount: Joi.number().positive().required(),
  totalQuantity: Joi.number().positive().required(),
  status: Joi.string().valid(...status).required(),
  date: Joi.date(),
  isPaid: Joi.boolean().optional(),
  paidAt: Joi.date().optional(),
  paymentIntentId: Joi.string().optional(),
  receiptUrl: Joi.string().uri().optional(),
});

export default orderValidation;
