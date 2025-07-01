import express from "express";
import { protect, protectAdmin } from "../middleware/auth.js";
import {
  getAllBookings,
  getAllShows,
  getDashboardData,
  isAdmin,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// The `is-admin` route itself must remain publicly reachable (only Clerk-authenticated).
// If we gate it behind `protectAdmin` the client cannot know whether the user is
// actually an admin, because the middleware would reject non-admin users first.
adminRouter.get("/is-admin", protect, isAdmin);
adminRouter.get("/dashboard", protectAdmin, getDashboardData);
adminRouter.get("/all-shows", protectAdmin, getAllShows);
adminRouter.get("/all-bookings", protectAdmin, getAllBookings);

export default adminRouter;
