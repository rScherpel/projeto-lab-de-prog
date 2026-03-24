// Validação de email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation logic
export const getPasswordChecks = (password) => ({
  hasMinLength: password.length >= 8,
  hasUppercase: /[A-Z]/.test(password),
  hasNumber: /\d/.test(password),
  hasSpecialChar: /[^A-Za-z0-9]/.test(password),
});

export const passwordRequirements = [
  {
    key: "hasMinLength",
    message: "Mínimo 8 caracteres",
  },
  {
    key: "hasUppercase",
    message: "Pelo menos 1 letra maiúscula",
  },
  {
    key: "hasNumber",
    message: "Pelo menos 1 número",
  },
  {
    key: "hasSpecialChar",
    message: "Pelo menos 1 caractere especial (!@#$%^&*)",
  },
];

export const getMissingRequirements = (passwordChecks) =>
  passwordRequirements.filter((req) => !passwordChecks[req.key]);

export const checkPasswordsMatch = (password, confirmPassword) =>
  confirmPassword.length > 0 && password === confirmPassword;

// Validação de campos do formulário
export const validateRegisterFields = (email, password, confirmPassword, missingRequirements) => {
  const errors = {};

  if (!email || email.trim() === "") {
    errors.email = "Email é obrigatório";
  } else if (!validateEmail(email)) {
    errors.email = "Email inválido";
  }

  if (!password || password.trim() === "") {
    errors.password = "Senha é obrigatória";
  } else if (missingRequirements.length > 0) {
    errors.password = "Senha não atende aos requisitos";
  }

  if (!confirmPassword || confirmPassword.trim() === "") {
    errors.confirmPassword = "Confirmação de senha é obrigatória";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "As senhas não conferem";
  }

  return errors;
};

// Mapeamento de erros específicos do servidor
const mapErrorMessage = (statusCode, serverMessage) => {
  const errorMap = {
    400: "Email ou formato inválido",
    409: "Este email já está registrado",
    500: "Erro no servidor. Tente novamente mais tarde",
  };

  if (serverMessage && typeof serverMessage === "string") {
    return serverMessage;
  }

  return errorMap[statusCode] || "Erro ao criar conta. Tente novamente";
};

export const handleRegisterSubmit = async (email, password, setErrors, setLoading) => {
  try {
    setLoading(true);

    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // Verificar se houve erro
    if (!response.ok) {
      const errorMessage = mapErrorMessage(response.status, data.message);
      setErrors({ submit: errorMessage });
      return { success: false };
    }

    // Sucesso
    return { success: true, message: data.message };
  } catch (error) {
    if (error instanceof TypeError) {
      setErrors({
        submit: "Erro de conexão. Verifique sua internet e tente novamente",
      });
    } else {
      setErrors({ submit: "Erro inesperado. Por favor, tente novamente" });
    }
    console.error("Register error:", error);
    return { success: false };
  } finally {
    setLoading(false);
  }
};
