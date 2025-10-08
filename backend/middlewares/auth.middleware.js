import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";

export const protectAdmin = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;
    // console.log("Token: ", token);
    
    if (!token) return res.status(401).json({ message: "Not authorized" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const admin = await Admin.findById(decoded._id).select("-password");
    // console.log("Admin: ", admin);
    if (!admin) return res.status(401).json({ message: "Invalid token" });
    req.admin = admin;

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
