import Joi from "joi";

class UserSchema {
  // Used in both userSignup and userLogin
  baseSchema = {
    email: Joi.string().email().trim().required().messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(8).max(30).trim().messages({
      "string.base": "Password should be text",
      "string.empty": "Password cannot be empty",
      "string.min": "Password must be at least {#limit} characters",
      "string.max": "Password cannot exceed {#limit} characters",
    }),
  };

  userSignup = Joi.object({
    name: Joi.string().min(3).max(100).trim().required().messages({
      "string.base": "Name should be text",
      "string.empty": "Name cannot be empty",
      "string.min": "Name must be at least {#limit} characters",
      "string.max": "Name cannot exceed {#limit} characters",
      "any.required": "Name is required",
    }),
    ...this.baseSchema,
  });

  userLogin = Joi.object({
    ...this.baseSchema,
    rememberMe: Joi.boolean().optional(),
  });
}

export default new UserSchema();
