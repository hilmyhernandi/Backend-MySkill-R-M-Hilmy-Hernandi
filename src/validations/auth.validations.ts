import Joi from "joi";

const schemaSignIn = Joi.object({
  username: Joi.string()
    .min(5)
    .max(30)
    .pattern(/^[a-zA-Z\s]+$/)
    .message("username can only contain letters and spaces")
    .required(),
  password: Joi.string().min(7).max(30).required(),
});

const schemaSignUp = Joi.object({
  name: Joi.string()
    .min(5)
    .max(30)
    .pattern(/^[a-zA-Z\s]+$/)
    .message("name can only contain letters and spaces")
    .required(),
  username: Joi.string()
    .min(5)
    .max(30)
    .pattern(/^[a-zA-Z\s]+$/)
    .message("username can only contain letters and spaces")
    .required(),
  password: Joi.string().min(7).max(30).required(),
});

export default { schemaSignIn, schemaSignUp };
