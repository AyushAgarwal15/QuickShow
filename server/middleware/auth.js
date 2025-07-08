import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;

    // Fetch the latest role from DB to reflect any changes made after token issuance
    const user = await User.findById(decoded.userId).select("role");
    req.role = user?.role || "user";

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const protectAdmin = async (req, res, next) => {
  await protect(req, res, async () => {
    if (req.role !== "admin" && req.role !== "superadmin") {
      return res.json({
        success: false,
        message: "user is not authorized to access admin dashboard",
      });
    }
    next();
  });
};
