import { logout } from "@/utils/auth.js";

// Dashboard utility functions
export const handleNavigate = (path, navigate) => {
  navigate(path);
};

export const handleLogout = (navigate) => {
  logout(navigate);
};
