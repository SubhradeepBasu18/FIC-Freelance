import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";

// Register Superadmin (only at system setup)
const registerSuperAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingSuper = await Admin.findOne({ role: "superadmin" });
    if (existingSuper) {
      return res.status(400).json({ message: "Superadmin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newSuper = await Admin.create({
      username,
      email,
      password: hashedPassword,
      role: "superadmin",
    });

    return res.status(201).json({ message: "Superadmin registered", newSuper });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).json({
      message: "Login successful",
      token,
      admin: { id: admin._id, username: admin.username, role: admin.role },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Add new admin (superadmin only)
const addAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      username,
      email,
      password: hashedPassword,
      role: "admin",
    });

    return res.status(201).json({ message: "Admin added", newAdmin });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Handover superadmin (delete old superadmin safely using transaction)
const handoverSuperAdmin = async (req, res) => {
  try {
    const { newSuperAdminId } = req.body;

    if (!newSuperAdminId) {
      return res.status(400).json({ message: "New superadmin ID required" });
    }

    const currentSuper = await Admin.findById(req.admin._id);
    if (!currentSuper || currentSuper.role !== "superadmin") {
      return res.status(403).json({ message: "Only superadmin can handover access" });
    }

    const newSuper = await Admin.findById(newSuperAdminId);
    if (!newSuper) return res.status(404).json({ message: "New superadmin not found" });

    if (newSuper._id.toString() === currentSuper._id.toString()) {
      return res.status(400).json({ message: "You cannot handover to yourself" });
    }

    // Atomic transaction
    const session = await Admin.startSession();
    session.startTransaction();

    try {
      newSuper.role = "superadmin";
      await newSuper.save({ session });

      await Admin.findByIdAndDelete(currentSuper._id, { session });

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        message: "Superadmin rights handed over successfully",
        newSuperAdmin: { id: newSuper._id, username: newSuper.username, role: newSuper.role },
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { registerSuperAdmin, loginAdmin, addAdmin, handoverSuperAdmin };
