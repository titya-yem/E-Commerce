import Joi from "joi";

const serviceValidation = Joi.object({
    title: Joi.string().min(3).max(255).required().trim(),
    description: Joi.string().min(3).max(550).required().trim(),
    image: Joi.string().optional(),
    alt: Joi.string().min(3).max(255).required().trim(),
    price: Joi.alternatives().try(Joi.number(), Joi.string()).required().default(0),
    duration: Joi.alternatives().try(Joi.number(), Joi.string()),
})

export default serviceValidation