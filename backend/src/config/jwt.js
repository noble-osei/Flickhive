import jwt from "jsonwebtoken";

export const createAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.SECRET_ACCESS_TOKEN, {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.SECRET_REFRESH_TOKEN, {
    expiresIn: "7d",
  });
};
