import AppError from "../utils/appError.js";
import { createAccessToken, createRefreshToken } from "../config/jwt.js";
import userRepository from "../repositories/user.js";

class AuthService {
  signup = async (signupData) => {
    const { email, password } = signupData;

    const userExists = !!(await userRepository.findOneUser({ email: email }));
    if (userExists) {
      throw new AppError("Email has already been registered", 400);
    }

    return await userRepository.createUser(signupData);
  };

  login = async (loginData) => {
    const { email, password, rememberMe } = loginData;

    const user = await userRepository.findOneUser(
      { email },
      { select: "+password" },
    );
    if (!user) {
      throw new AppError("Invalid credentials", 400);
    }
    await this.validatePassword(user, password);

    const accessToken = createAccessToken(user._id);
    const refreshToken = await this.handleRememberMe(user, rememberMe);

    return {
      accessToken,
      refreshToken,
    };
  };

  logout = async (userId) => {
    return await userRepository.findUserByIdAndUpdate(userId, {
      refreshToken: null,
    });
  };

  refresh = async (token, decoded) => {
    const user = await userRepository.findOneUser({ _id: decoded.id });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    await this.validateRefreshToken(user, token);

    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    await this.storeRefreshToken(user, refreshToken);
    return { accessToken, refreshToken };
  };

  validatePassword = async (user, password) => {
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 400);
    }
  };

  validateRefreshToken = async (user, token) => {
    const isMatch = await user.compareRefreshToken(token);
    if (!isMatch) {
      throw new AppError("Invalid token", 401);
    }
  };

  handleRememberMe = async (user, rememberMe) => {
    if (!rememberMe) {
      return null;
    }

    const refreshToken = createRefreshToken(user._id);
    await this.storeRefreshToken(user, refreshToken);
    return refreshToken;
  };

  storeRefreshToken = async (user, refreshToken) => {
    user.refreshToken = refreshToken;
    await userRepository.saveUser(user);
  };
}

export default new AuthService();
