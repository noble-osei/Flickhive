import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
  refreshToken: String,
}, { timestamps: true });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre("save", async function () {
  if (!this.isModified("refreshToken")) return;
  this.refreshToken = await bcrypt.hash(this.refreshToken, 12);
});

userSchema.methods.compareRefreshToken = async function (candidateRefreshToken) {
  return await bcrypt.compare(candidateRefreshToken, this.refreshToken);
};

export default mongoose.model("User", userSchema);
