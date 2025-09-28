import { Admin } from "./models/admin.model.js";

const ensureOneSuperAdmin = async () => {
  const superadmins = await Admin.find({ role: "superadmin" });
  if (superadmins.length === 0) {
    console.warn("⚠️ No superadmin exists. Please register one.");
  } else if (superadmins.length > 1) {
    console.warn("⚠️ Multiple superadmins found. Please resolve manually!");
  }
};

ensureOneSuperAdmin();
