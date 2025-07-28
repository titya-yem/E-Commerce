import Joi from "joi";

const contactValidation = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.number().min(8).max(15).required(),
    message: Joi.string().min(5).max(450).optional(),
})

export default contactValidation;