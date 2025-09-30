import mongoose, { Schema } from "mongoose";

const adminSchema = new mongoose.Schema ({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "superadmin"],
        default: "admin"
    }
}, {timestamps: true})

// DB-level safety: prevent multiple superadmins
adminSchema.pre("save", async function (next) {
  if (this.role === "superadmin") {
    const superAdmins = await mongoose.model("Admin").countDocuments({ role: "superadmin" });
    if (superAdmins > 0 && this.isNew) {
      throw new Error("A superadmin already exists. Cannot create another.");
    }
  }
  next();
});

export const Admin = mongoose.model("Admin", adminSchema);
