import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

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
const getEmailChecks = (email) => {
  const normalizedEmail = normalizeEmail(email);
  return {
    hasText: normalizedEmail.length > 0,
    hasAtSign: normalizedEmail.includes("@"),
    hasValidDomain: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail),
    isValid: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail) && normalizedEmail.length <= 255,
  };
};

const emailRequirements = [
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
const getEmailSuggestions = (email) => {
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
const getPasswordChecks = (password) => ({
  hasMinLength: password.length >= 8,
  hasUppercase: /[A-Z]/.test(password),
  hasNumber: /\d/.test(password),
  hasSpecialChar: /[^A-Za-z0-9]/.test(password),
});

const passwordRequirements = [
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

const getMissingRequirements = (passwordChecks) =>
  passwordRequirements.filter((req) => !passwordChecks[req.key]);

const checkPasswordsMatch = (password, confirmPassword) =>
  confirmPassword.length > 0 && password === confirmPassword;

// Validação de campos do formulário
const validateRegisterFields = (email, password, confirmPassword, missingRequirements) => {
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

const handleRegisterSubmit = async (email, password, setErrors, setLoading) => {
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

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const navigate = useNavigate();

  const passwordChecks = getPasswordChecks(password);
  const missingPasswordRequirements = getMissingRequirements(passwordChecks);
  const passwordsMatch = checkPasswordsMatch(password, confirmPassword);
  const emailChecks = getEmailChecks(email);
  const missingEmailRequirements = emailRequirements.filter((req) => !emailChecks[req.key]);
  const emailSuggestions = getEmailSuggestions(email);

  const handleEmailSuggestionClick = (suggestion) => {
    setEmail(suggestion);
    setShowEmailSuggestions(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSuccess(false);

    // Validar campos
    const fieldErrors = validateRegisterFields(email, password, confirmPassword, missingPasswordRequirements);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    const result = await handleRegisterSubmit(email, password, setErrors, setLoading);

    if (result.success) {
      setSuccess(true);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  return (
    <div className="register-container">
      <h1>Criar Conta</h1>

      {/* Erro geral */}
      {errors.submit && (
        <div className="error-box">
          <strong>⚠️</strong>
          <div className="error-content">
            <p>{errors.submit}</p>
          </div>
        </div>
      )}

      {/* Sucesso */}
      {success && (
        <div className="success-message">
          ✓ Conta criada com sucesso! Redirecionando para login...
        </div>
      )}

      <form onSubmit={handleRegister} className="register-form">
        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <div className="email-input-wrapper">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setShowEmailSuggestions(true)}
              onBlur={() => setTimeout(() => setShowEmailSuggestions(false), 200)}
              disabled={loading}
              className={errors.email ? "input-error" : emailChecks.isValid ? "input-success" : ""}
              placeholder="seu@email.com"
            />
            {/* Email Suggestions Dropdown */}
            {showEmailSuggestions && emailSuggestions.length > 0 && (
              <div className="email-suggestions">
                {emailSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleEmailSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.email && <div className="error-message">✗ {errors.email}</div>}
        </div>

        {/* Validação de Email em Tempo Real - Apenas os pendentes */}
        {email.length > 0 && missingEmailRequirements.length > 0 && (
          <div className="email-requirements-box">
            {missingEmailRequirements.map((requirement) => (
              <p key={requirement.key} className="requirement-pending">
                ✗ {requirement.message}
              </p>
            ))}
          </div>
        )}

        {/* Senha */}
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className={errors.password ? "input-error" : ""}
            placeholder="••••••"
          />
          {errors.password && <div className="error-message">✗ {errors.password}</div>}
        </div>

        {/* Requisitos de Senha - Apenas os pendentes */}
        {password.length > 0 && missingPasswordRequirements.length > 0 && (
          <div className="password-requirements-box">
            {missingPasswordRequirements.map((requirement) => (
              <p key={requirement.key} className="requirement-pending">
                ✗ {requirement.message}
              </p>
            ))}
          </div>
        )}

        {/* Confirmar Senha */}
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Senha</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            className={errors.confirmPassword ? "input-error" : ""}
            placeholder="••••••"
          />
          {errors.confirmPassword && <div className="error-message">✗ {errors.confirmPassword}</div>}
        </div>

        {/* Indicador de Compatibilidade */}
        {confirmPassword.length > 0 && (
          <div
            className={`password-match-indicator ${
              passwordsMatch
                ? "success"
                : "error"
            }`}
          >
            {passwordsMatch ? "✓" : "✗"}{" "}
            {passwordsMatch ? "Senhas conferem" : "As senhas não conferem"}
          </div>
        )}

        {/* Botão de Registro */}
        <button
          type="submit"
          className="register-button"
          disabled={loading || missingPasswordRequirements.length > 0 || !passwordsMatch || !emailChecks.isValid}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span> Criando conta...
            </>
          ) : (
            "Registrar"
          )}
        </button>
      </form>

      <p className="login-link">
        Já tem conta? <Link to="/">Fazer Login</Link>
      </p>
    </div>
  );
}

export default Register;
