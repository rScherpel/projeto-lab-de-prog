export const validateToken = async () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  
  if (!token) {
    return false;
  }

  try {
    const response = await fetch("http://localhost:3000/api/token/validate", {
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
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    return false;
  }
};
