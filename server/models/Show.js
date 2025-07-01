import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
  {
    movie: { type: String, required: true, ref: "Movie" },
    showDateTime: { type: Date, required: true },
    showPrice: { type: Number, required: true },
    occupiedSeats: { type: Object, default: {} },
  },
  { minimize: false }
);

// Ensure a movie cannot have two shows at the exact same date-time
showSchema.index({ movie: 1, showDateTime: 1 }, { unique: true });

const Show = mongoose.model("Show", showSchema);

export default Show;
