// Validação de email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validação de campos
export const validateLoginFields = (email, password) => {
  const errors = {};

  if (!email || email.trim() === "") {
    errors.email = "Email é obrigatório";
  } else if (!validateEmail(email)) {
    errors.email = "Email inválido";
  }

  if (!password || password.trim() === "") {
    errors.password = "Senha é obrigatória";
  } else if (password.length < 6) {
    errors.password = "Senha deve ter no mínimo 6 caracteres";
  }

  return errors;
};

// Mapeamento de erros específicos do servidor
const mapErrorMessage = (statusCode, serverMessage) => {
  const errorMap = {
    401: "Login ou senha incorretos",
    500: "Erro no servidor. Tente novamente mais tarde",
  };

  // Se houver uma mensagem específica do servidor, usar
  if (serverMessage && typeof serverMessage === "string") {
    return serverMessage;
  }

  // Caso contrário, usar mapa de erros
  return errorMap[statusCode] || "Erro ao fazer login. Tente novamente";
};

export const handleLoginSubmit = async (email, password, rememberMe, navigate, setErrors, setLoading) => {
  try {
    // Validar campos antes de enviar
    const fieldErrors = validateLoginFields(email, password);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return false;
    }

    // Limpar erros anteriores
    setErrors({});
    setLoading(true);

    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // Verificar se houve erro na requisição
    if (!response.ok) {
      const errorMessage = mapErrorMessage(response.status, data.message);
      setErrors({ submit: errorMessage });
      return false;
    }

    // Verificar se token foi retornado
    if (!data.token) {
      setErrors({ submit: data.message || "Erro ao fazer login" });
      return false;
    }

    // Armazenar token
    if (rememberMe) {
      localStorage.setItem("token", data.token);
    } else {
      sessionStorage.setItem("token", data.token);
    }

    // Sucesso!
    navigate("/home");
    return true;
  } catch (error) {
    // Erro de rede ou parsing
    if (error instanceof TypeError) {
      setErrors({
        submit: "Erro de conexão. Verifique sua internet e tente novamente",
      });
    } else {
      setErrors({ submit: "Erro inesperado. Por favor, tente novamente" });
    }
    console.error("Login error:", error);
    return false;
  } finally {
    setLoading(false);
  }
};
