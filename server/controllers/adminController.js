import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";

// API to check if user is admin
export const isAdmin = async (req, res) => {
  const isAdmin = req.role === "admin" || req.role === "superadmin";
  res.json({ success: true, isAdmin });
};

// API to get dashboard data
export const getDashboardData = async (req, res) => {
  try {
    const bookings = await Booking.find({});
    const paidBookings = bookings.filter(b => b.isPaid);
    const showDocs = await Show.find({}).populate("movie");
    const upcomingShows = [];
    const now = new Date();
    showDocs.forEach((doc) => {
      Object.entries(doc.schedule || {}).forEach(([date, timeMap]) => {
        Object.entries(timeMap || {}).forEach(([timeStr, payload]) => {
          const dt = new Date(`${date}T${timeStr}:00.000Z`);
          if (dt >= now) {
            upcomingShows.push({ movie: doc.movie, showPrice: payload.showPrice, showDateTime: dt });
          }
        });
      });
    });

    // For dashboard cards we may want unique by movie
    const uniqueShowsMap = new Map();
    upcomingShows.forEach((s) => {
      if (!uniqueShowsMap.has(s.movie._id)) uniqueShowsMap.set(s.movie._id, s);
    });

    const activeShows = Array.from(uniqueShowsMap.values());

    const totalUser = await User.countDocuments();

    const dashboardData = {
      totalBookings: bookings.length,
      totalRevenue: paidBookings.reduce((acc, booking) => acc + booking.amount, 0),
      activeShows: activeShows,
      totalUser,
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all shows
export const getAllShows = async (req, res) => {
  try {
    const showDocs = await Show.find({}).populate("movie");
    const shows = [];
    showDocs.forEach((doc) => {
      Object.entries(doc.schedule || {}).forEach(([date, timeMap]) => {
        Object.entries(timeMap || {}).forEach(([timeStr, payload]) => {
          shows.push({
            _id: doc._id, // show doc id
            movie: doc.movie,
            showDateTime: new Date(`${date}T${timeStr}:00.000Z`),
            showPrice: payload.showPrice,
            occupiedSeats: Object.keys(payload.occupiedSeats || {}).length,
          });
        });
      });
    });
    shows.sort((a, b) => a.showDateTime - b.showDateTime);
    res.json({ success: true, shows });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("user")
      .populate("movie")
      .sort({ createdAt: -1 });

    // Filter out bookings where the show or movie has been deleted
    const validBookings = bookings.filter((b) => b.movie);

    res.json({ success: true, bookings: validBookings });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "_id name email role image").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update user role (admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body; // 'user' or 'admin' or 'superadmin'
    if (!['user','admin','superadmin'].includes(role)) {
      return res.json({ success:false, message:"Invalid role"});
    }
    // Fetch target user
    const targetUser = await User.findById(userId);
    if (!targetUser) return res.json({ success:false, message:"User not found"});

    // Non-superadmin cannot change role of a superadmin
    if (targetUser.role === 'superadmin' && req.role !== 'superadmin') {
      return res.json({ success:false, message:"Cannot modify superadmin role"});
    }
    // Non-superadmin cannot assign superadmin role
    if (role === 'superadmin' && req.role !== 'superadmin') {
      return res.json({ success:false, message:"Only superadmin can assign superadmin role"});
    }

    targetUser.role = role;
    await targetUser.save();
    res.json({ success: true, message: "Role updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
