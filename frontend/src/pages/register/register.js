// Validação robusta de email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email);
};

// Normalizar email: remover espaços e converter para minúsculas
const normalizeEmail = (email) => {
  return email.trim().toLowerCase();
};

// Função para verificar estado do email em tempo real
export const getEmailChecks = (email) => {
  const normalizedEmail = normalizeEmail(email);
  return {
    hasText: normalizedEmail.length > 0,
    hasAtSign: normalizedEmail.includes("@"),
    hasValidDomain: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail),
    isValid: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail) && normalizedEmail.length <= 255,
  };
};

export const emailRequirements = [
  {
    key: "hasText",
    message: "Insira um email",
  },
  {
    key: "hasAtSign",
    message: "Email deve conter @",
  },
  {
    key: "hasValidDomain",
    message: "Email deve ter um domínio válido (ex: exemplo.com)",
  },
];

// Domínios mais comuns para autocomplete (UFV primeiro)
const commonDomains = [
  "ufv.br",
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com",
  "gmail.br",
  "uol.com.br",
  "r7.com",
];

// Função para gerar sugestões de email
export const getEmailSuggestions = (email) => {
  const normalizedEmail = normalizeEmail(email);
  
  // Se não tem @, retorna vazio
  if (!normalizedEmail.includes("@")) {
    return [];
  }

  // Separa usuário e domínio parcial
  const [username, partialDomain] = normalizedEmail.split("@");
  
  if (!username) {
    return [];
  }

  // Filtra domínios que começam com o que o usuário digitou
  const suggestions = commonDomains
    .filter((domain) => domain.startsWith(partialDomain.toLowerCase()))
    .map((domain) => `${username}@${domain}`);

  return suggestions;
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
  const normalizedEmail = normalizeEmail(email);

  if (!email || email.trim() === "") {
    errors.email = "Email é obrigatório";
  } else if (!validateEmail(normalizedEmail)) {
    errors.email = "Email inválido. Use o formato: seu@email.com";
  } else if (normalizedEmail.length > 255) {
    errors.email = "Email muito longo (máximo 255 caracteres)";
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
    400: serverMessage || "Dados inválidos. Verifique email e senha",
    409: "Este email já está registrado. Use outro email ou tente fazer login",
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
    const normalizedEmail = normalizeEmail(email);

    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: normalizedEmail, password }),
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
