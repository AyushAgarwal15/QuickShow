import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";

// API Controller Function to Get User Bookings
export const getUserBookings = async (req, res) => {
  try {
    const user = req.userId;

    const bookings = await Booking.find({ user })
      .populate({
        path: "show",
        populate: { path: "movie" },
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API Controller Function to update Favorite Movie in Clerk User Metadata
export const updateFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    if (!user.favorites) {
      user.favorites = [];
    }

    if (!user.favorites.includes(movieId)) {
      user.favorites.push(movieId);
    } else {
      user.favorites = user.favorites.filter((id) => id !== movieId);
    }

    await user.save();

    res.json({ success: true, message: "Favorite movies updated" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const favorites = user?.favorites || [];

    const movies = await Movie.find({ _id: { $in: favorites } });

    res.json({ success: true, movies });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
