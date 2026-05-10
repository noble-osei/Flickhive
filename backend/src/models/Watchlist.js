import mongoose, { Schema } from "mongoose";

const watchlistSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mediaData: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Watchlist", watchlistSchema);
