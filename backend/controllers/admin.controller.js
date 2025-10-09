import bcrypt from "bcryptjs";
import { Admin } from "../models/admin.model.js";
import { randomBytes } from "crypto";

const generateAccessandRefreshToken = async(userId)=> {
    try {
        const user = await Admin.findById(userId)
        // console.log("User: ", user);
    
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        // console.log("Access Token: ", accessToken);
        // console.log("Refresh Token: ", refreshToken);
        
    
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})
    
        return {accessToken,refreshToken}
    } catch (error) {
        return error;
    }
}

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

    const {accessToken,refreshToken} = await generateAccessandRefreshToken(admin._id)
    // console.log("Access Token: ", accessToken);
    // console.log("Refresh Token: ", refreshToken);
    

    const options = {
        httpOnly: true,
        // secure: true,
        sameSite: "lax",
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      message: "Login successful",
      accessToken,
      refreshToken,
      admin: { id: admin._id, email: admin.email, role: admin.role },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const generateTemporaryPassword = (email, length = 8) => {
    if (!email || typeof email !== 'string') {
        throw new TypeError('email (string) is required');
      }
    
      const MIN_LENGTH = 8;
      if (typeof length !== 'number' || length < MIN_LENGTH) {
        length = MIN_LENGTH;
      }
    
      const localPart = email.split('@')[0] || '';
        // console.log(localPart)
      // take up to 2 safe chars from local part (letters/numbers only) to make password memorable a bit
      const prefix = (localPart.match(/[A-Za-z0-9]/g) || []).slice(0, 2).join('') || 'u';
        // console.log(prefix)
    
      // charset: letters, digits and a few safe symbols
      const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
      const needed = Math.max(length - prefix.length, 4); // ensure at least 4 random chars
      const bytes = randomBytes(needed);
      let randomPart = '';
    
      for (let i = 0; i < needed; i++) {
        // map each random byte to a char in charset
        randomPart += charset[bytes[i] % charset.length];
      }
    
      // Simple shuffle of the combined password to avoid fixed prefix position (keeps implementation simple)
      const combined = (prefix + randomPart).split('');
      for (let i = combined.length - 1; i > 0; i--) {
        const j = bytes[i % bytes.length] % (i + 1);
        [combined[i], combined[j]] = [combined[j], combined[i]];
      }
    
      return combined.join('');   
}

// Add new admin (superadmin only)
const addAdmin = async (req, res) => {
  try {
    // const { username, email, password } = req.body;
    const { email } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const password = generateTemporaryPassword(email)
    // console.log("Password: ", password)

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      email,
      password: hashedPassword,
      role: "admin",
    });

    return res.status(201).json({ message: "Admin added", newAdmin, password });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    return res.status(200).json({ message: "Admin removed", admin });
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

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    return res.status(200).json({ message: "Admins fetched successfully", admins });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get current admin
const getCurrentAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin?._id).select('-password -refreshToken');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json(admin);
  } catch (error) {
    console.error('Error getting admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Logout admin
const logoutAdmin = async (req, res) => {
  try {
    await Admin.findByIdAndUpdate(
      req.admin._id,
      {
        $unset: {
          refreshToken: 1
        }
      },
      {
        new: true
      }
    );

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 0
    };

    return res.status(200)
      .clearCookie('accessToken', options)
      .clearCookie('refreshToken', options)
      .json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const resetPassword = async(req, res) => {
    try {
        const {email, currentPassword, newPassword, confirmNewPassword} = req.body;
        if(!email || !currentPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const admin = await Admin.findOne({email});
        if(!admin) return res.status(404).json({ message: "Admin not found" });

        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if(!isMatch) return res.status(400).json({ message: "Invalid current password" });

        if(newPassword !== confirmNewPassword) return res.status(400).json({ message: "New passwords do not match" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedPassword;
        await admin.save();

        return res.status(200).json({ message: "Password reset successfully", admin });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export { 
  registerSuperAdmin, 
  loginAdmin, 
  addAdmin, 
  removeAdmin,
  handoverSuperAdmin, 
  getAllAdmins, 
  getCurrentAdmin, 
  logoutAdmin,
  resetPassword
};
