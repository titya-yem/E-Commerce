import Joi from "joi";

const categoryType = ['cat', 'dog', 'bird', 'rabbit', 'goldfish']

const productValidation = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    category: Joi.string().valid(...categoryType).required(),
    price: Joi.number().positive().required(),
    rating: Joi.number().required(),
    reviews: Joi.number().positive(),
    description: Joi.string().min(5).max(450).required(),
    image: Joi.string().pattern(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/).required()
})

export default productValidation;