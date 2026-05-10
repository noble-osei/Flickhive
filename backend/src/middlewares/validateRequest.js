import AppError from "../utils/appError.js";

export const validateBody = (schema) => (req, res, next) => {
  const { value, error } = schema.validate(req.body, {
    stripUnknown: true,
    abortEarly: false,
  });

  if (error) {
    let message = error.details.map((i) => i.message).join(", ");
    return next(new AppError(message, 400));
  }

  req.body = value;
  next();
};

export const validateParams = (schema) => (req, res, next) => {
  const { value, error } = schema.validate(req.params, {
    stripUnknown: true,
    abortEarly: false,
  });

  if (error) {
    let message = error.details.map((i) => i.message).join(", ");
    return next(new AppError(message, 400));
  }

  req.params = value;
  next();
};
