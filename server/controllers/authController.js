import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const TOKEN_EXPIRES = "7d";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.json({ success: false, message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRES,
    });

    res.json({
      success: true,
      token,
      user: { _id: user._id, name, email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRES,
    });

    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
