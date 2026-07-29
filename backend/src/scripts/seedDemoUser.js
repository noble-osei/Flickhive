import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import User from "../models/user.js";
import Watchlist from "../models/watchlist.js";

dotenv.config({ quiet: true });

const DEMO_NAME = "Demo Recruiter";
const DEMO_EMAIL = "demo@flickhive.dev";
const DEMO_PASSWORD = "FlickhiveDemo123!";

const DEMO_WATCHLIST_ITEMS = [
  {
    tmdbId: 27205,
    mediaType: "movie",
    mediaData: {
      title: "Inception",
      poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      release_date: "2010-07-15",
      vote_average: 8.4,
    },
  },
  {
    tmdbId: 155,
    mediaType: "movie",
    mediaData: {
      title: "The Dark Knight",
      poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      release_date: "2008-07-16",
      vote_average: 8.5,
    },
  },
  {
    tmdbId: 603692,
    mediaType: "movie",
    mediaData: {
      title: "John Wick: Chapter 4",
      poster_path: "/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
      release_date: "2023-03-22",
      vote_average: 7.8,
    },
  },
  {
    tmdbId: 1396,
    mediaType: "tv",
    mediaData: {
      name: "Breaking Bad",
      poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
      first_air_date: "2008-01-20",
      vote_average: 8.9,
    },
  },
  {
    tmdbId: 66732,
    mediaType: "tv",
    mediaData: {
      name: "Stranger Things",
      poster_path: "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
      first_air_date: "2016-07-15",
      vote_average: 8.6,
    },
  },
];

async function main() {
  try {
    await connectDB();

    let demoUser = await User.findOne({ email: DEMO_EMAIL });

    if (demoUser) {
      console.log(`Demo user already exists (${DEMO_EMAIL}), skipping creation.`);
    } else {
      demoUser = await new User({
        name: DEMO_NAME,
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      }).save();
      console.log(`Created demo user: ${DEMO_EMAIL}`);
    }

    for (const item of DEMO_WATCHLIST_ITEMS) {
      await Watchlist.findOneAndUpdate(
        { userId: demoUser._id, tmdbId: item.tmdbId, mediaType: item.mediaType },
        { $set: { mediaData: item.mediaData } },
        { upsert: true, returnDocument: "after" },
      );
    }
    console.log(`Seeded ${DEMO_WATCHLIST_ITEMS.length} watchlist items for demo user.`);

    console.log("\nDemo login credentials:");
    console.log(`  email:    ${DEMO_EMAIL}`);
    console.log(`  password: ${DEMO_PASSWORD}`);
  } finally {
    await mongoose.disconnect();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
