// Utilitários de autenticação centralizados

/**
 * Limpar token de ambos os storages
 */
export const clearTokens = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
};

/**
 * Obter token de qualquer um dos storages
 */
export const getToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

/**
 * Verificar se usuário está autenticado
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Fazer logout completo
 * @param {function} navigate - Função de navegação do react-router
 */
export const logout = async (navigate) => {
  try {
    const token = getToken();

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
    // Limpar tudo e redirecionar
    clearTokens();
    navigate("/");
  }
};
