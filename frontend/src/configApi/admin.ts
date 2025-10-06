import axios, { type AxiosResponse } from "axios";

interface Admin {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "superadmin";
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  status: number;
  data: {
    message: string;
    token: string;
    admin: Admin;
  } | string;
}

interface AddAdminResponse {
  status: number;
  data: {
    message: string;
    newAdmin: Admin;
  } | string;
}

interface HandoverResponse {
  status: number;
  data: {
    message: string;
    newSuperAdmin: {
      id: string;
      username: string;
      role: string;
    };
  } | string;
}

// Admin Login
const loginAdmin = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response: AxiosResponse<LoginResponse["data"]> = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/admin/login`,
      { email, password }
    );
    return { status: 200, data: response.data };
  } catch (error: any) {
    console.error(error);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || "Login failed",
    };
  }
};

// Add New Admin (Superadmin only)
const addAdmin = async (
  token: string,
  username: string,
  email: string,
  password: string
): Promise<AddAdminResponse> => {
  try {
    const response: AxiosResponse<AddAdminResponse["data"]> = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/admin/add-admin`,
      { username, email, password },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { status: 200, data: response.data };
  } catch (error: any) {
    console.error(error);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || "Add admin failed",
    };
  }
};

//  Handover Superadmin
const handoverSuperAdmin = async (
  token: string,
  newSuperAdminId: string
): Promise<HandoverResponse> => {
  try {
    const response: AxiosResponse<HandoverResponse["data"]> = await axios.put(
      `${import.meta.env.VITE_BASE_URL}/api/admin/handover-superadmin`,
      { newSuperAdminId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { status: 200, data: response.data };
  } catch (error: any) {
    console.error(error);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || "Handover failed",
    };
  }
};

// (Optional) Get All Admins — for dashboard display
const getAllAdmins = async (
  token: string
): Promise<{ status: number; data: Admin[] | string }> => {
  try {
    const response: AxiosResponse<Admin[]> = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/admin/getAllAdmins`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { status: 200, data: response.data };
  } catch (error: any) {
    console.error(error);
    return {
      status: error.response?.status || 500,
      data: error.response?.data || "Failed to fetch admins",
    };
  }
};

export { loginAdmin, addAdmin, handoverSuperAdmin, getAllAdmins };
export type { Admin };
