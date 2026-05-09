import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "Flickhive" });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error: ", error);
    process.exit(1);
  }
};

export default connectDB;