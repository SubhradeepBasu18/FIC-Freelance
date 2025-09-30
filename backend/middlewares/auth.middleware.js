import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";

export const protectAdmin = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select("-password");
    if (!req.admin) return res.status(401).json({ message: "Invalid token" });

    next();
  } catch (error) {
    return res.status(401).json({ message: "Auth failed" });
  }
};

export const superAdminOnly = (req, res, next) => {
  if (req.admin.role !== "superadmin") {
    return res.status(403).json({ message: "Superadmin access required" });
  }
  next();
};
