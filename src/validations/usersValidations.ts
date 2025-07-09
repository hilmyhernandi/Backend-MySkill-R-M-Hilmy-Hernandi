import Joi from "joi";

const schemaCreateUsers = Joi.object({
  name: Joi.string()
    .min(5)
    .max(30)
    .pattern(/^[a-zA-Z\s]+$/)
    .message("Name can only contain letters and spaces")
    .required(),
  username: Joi.string()
    .min(5)
    .max(30)
    .pattern(/^[a-zA-Z\s]+$/)
    .message("Name can only contain letters and spaces")
    .required(),
  password: Joi.string().min(7).max(30).required(),
});

const schemaUpdate = Joi.object({
  name: Joi.string()
    .min(5)
    .max(30)
    .pattern(/^[a-zA-Z\s]+$/)
    .message("Name can only contain letters and spaces")
    .required(),
  username: Joi.string()
    .min(5)
    .max(30)
    .pattern(/^[a-zA-Z\s]+$/)
    .message("Name can only contain letters and spaces")
    .required(),
});

export default {
  schemaCreateUsers,
  schemaUpdate,
};
