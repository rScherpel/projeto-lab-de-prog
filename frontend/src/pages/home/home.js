import { logout } from "@/utils/auth.js";

export const handleLogout = (navigate) => {
  logout(navigate);
};
