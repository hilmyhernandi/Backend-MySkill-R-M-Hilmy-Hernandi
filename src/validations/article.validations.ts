import Joi from "joi";

export const articleSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  content: Joi.string().required(),
  status: Joi.string().valid("draft", "published").required(),
});
