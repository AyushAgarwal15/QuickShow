import mongoose from "mongoose";

const timeBlockSchema = new mongoose.Schema(
  {
    showPrice: { type: Number, required: true },
    occupiedSeats: { type: Object, default: {} },
  },
  { _id: false, minimize: false }
);

const showSchema = new mongoose.Schema(
  {
    movie: { type: String, ref: "Movie", unique: true, required: true },
    // schedule object: { "YYYY-MM-DD": { "HH:mm": { showPrice, occupiedSeats } } }
    schedule: { type: Object, default: {} },
  },
  { minimize: false }
);

const Show = mongoose.model("Show", showSchema);

export default Show;
