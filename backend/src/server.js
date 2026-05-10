import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import watchlistRoutes from "./routes/watchlist.js";
import errorHandler, { notFound } from "./middlewares/errorHandler.js";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 5004;

app.use(express.json());
app.use(cookieParser())

app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
