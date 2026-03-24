export const handleLogout = async (navigate) => {
  try {
    // Obter token para passar no header
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    // Chamar endpoint de logout no backend (validar token)
    if (token) {
      await fetch("http://localhost:3000/api/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error("Erro ao fazer logout no servidor:", error);
  } finally {
    // Limpar token de ambos storage (localStorage e sessionStorage)
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    
    // Redirecionar para login
    navigate("/");
  }
};
