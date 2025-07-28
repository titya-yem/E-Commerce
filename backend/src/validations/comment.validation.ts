import Joi from "joi";

const commentValidation = Joi.object({
    title: Joi.string().min(5).max(255).trim().required(),
    text: Joi.string().min(5).max(400).trim().required(),
    userName: Joi.string().required(),
    type: Joi.string().valid(
      "Dogs Lover",
      "Cats Lover",
      "Rabbit Lover",
      "Birds Lover",
      "Fishes Lover"
    ).required(),
})

export default commentValidation;