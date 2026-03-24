import { getToken, clearTokens } from "@/utils/auth.js";

export const validateToken = async () => {
  const token = getToken();
  
  if (!token) {
    return false;
  }

  try {
    const response = await fetch("http://localhost:3000/api/user/validate-token", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Token inválido");
    }

    const data = await response.json();
    
    if (data.valid) {
      return true;
    } else {
      throw new Error("Token inválido");
    }
  } catch (error) {
    clearTokens();
    return false;
  }
};
