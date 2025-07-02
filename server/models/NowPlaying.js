import mongoose from "mongoose";

const nowPlayingSchema = new mongoose.Schema(
  {
    _id: { type: String, default: "singleton" },
    movies: { type: Array, required: true },
  },
  { timestamps: true }
);

const NowPlaying = mongoose.model("NowPlaying", nowPlayingSchema);

export default NowPlaying; 