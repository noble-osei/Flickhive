import AppError from "../utils/appError.js";

export const notFound = (req, res, next) => {
  return next(
    new AppError(`Not found: ${req.method} - ${req.originalUrl}`, 404),
  );
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : null),
  });
};

export default errorHandler;
