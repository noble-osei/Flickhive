import User from "../models/User.js";
import { validateQueryOptions } from "./common.js";

class UserRepository {
  findOneUser = async (filters, options = {}) => {
    let query = User.findOne(filters);
    query = validateQueryOptions(query, options);
    return await query.exec();
  };

  findUserByIdAndUpdate = async (userId, query, newDoc = false) => {
    return await User.findByIdAndUpdate(
      userId,
      { $set: query },
      {
        returnDocument: newDoc ? "after" : "before",
        lean: true,
      },
    ).exec();
  };

  saveUser = async (user) => {
    return await user.save();
  };

  createUser = async (userDoc) => {
    return await User.create(userDoc);
  };
}

export default new UserRepository();
