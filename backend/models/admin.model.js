import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema ({
    // username: {
    //     type: String,
    // },
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
    },
    refreshToken: {
        type: String,
    }
}, {timestamps: true})

adminSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}
adminSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}

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
