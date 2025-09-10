import Joi from "joi";

export const checkoutValidation = Joi.object({
  cart: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        category: Joi.string().required(),
        price: Joi.number().positive().required(),
        quantity: Joi.number().positive().required(),
        image: Joi.string().uri().required(),
      })
    )
    .min(1)
    .required(),
  totalAmount: Joi.number().positive().required(),
  totalQuantity: Joi.number().positive().required(),
});
