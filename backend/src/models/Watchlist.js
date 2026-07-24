import mongoose, { Schema } from "mongoose";

const mediaDataSchema = new Schema(
  {
    title: { type: String },
    name: { type: String },
    poster_path: { type: String, default: null },
    release_date: { type: String },
    first_air_date: { type: String },
    vote_average: { type: Number },
  },
  { _id: false },
);

const watchlistSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tmdbId: {
      type: Number,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ["movie", "tv"],
      required: true,
    },
    mediaData: {
      type: mediaDataSchema,
      required: true,
    },
  },
  { timestamps: true },
);

watchlistSchema.index({ userId: 1, tmdbId: 1, mediaType: 1 }, { unique: true });

const Watchlist = mongoose.model("Watchlist", watchlistSchema);

Watchlist.on("index", (error) => {
  if (error) {
    console.error("Watchlist index build failed:", error.message);
  }
});

export default Watchlist;