import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";

// Protect routes for logged-in admin
const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ message: "Not authorized, admin not found" });

    req.admin = admin._id; // attach admin id to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

export { protectAdmin };
