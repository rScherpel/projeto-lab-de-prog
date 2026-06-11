import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

// Validação de email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validação de campos
const validateLoginFields = (email, password) => {
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

const handleLoginSubmit = async (email, password, rememberMe, navigate, setErrors, setLoading) => {
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
      console.log("[LOGIN] Token salvo em localStorage");
    } else {
      sessionStorage.setItem("token", data.token);
      console.log("[LOGIN] Token salvo em sessionStorage");
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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setSuccess(false);

    const result = await handleLoginSubmit(email, password, rememberMe, navigate, setErrors, setLoading);

    if (result) {
      setSuccess(true);
      // Limpar formulário após sucesso
      setTimeout(() => {
        setEmail("");
        setPassword("");
        setRememberMe(false);
      }, 500);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>

      {/* Erro geral (erro de servidor, rede, etc) */}
      {errors.submit && (
        <div className="error-box">
          <strong>⚠️</strong>
          <div className="error-content">
            <p>{errors.submit}</p>
          </div>
        </div>
      )}

      {/* Mensagem de sucesso */}
      {success && (
        <div className="success-message">
          ✓ Login realizado com sucesso! Redirecionando...
        </div>
      )}

      <form onSubmit={handleLogin} className="login-form">
        {/* Campo de Email */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className={errors.email ? "input-error" : ""}
            placeholder="seu@email.com"
          />
          {errors.email && <div className="error-message">✗ {errors.email}</div>}
        </div>

        {/* Campo de Senha */}
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

        {/* Checkbox Lembre de Mim */}
        <div className="checkbox-group">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={loading}
          />
          <label htmlFor="rememberMe">Lembre de mim</label>
        </div>

        {/* Botão de Submissão */}
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? (
            <>
              <span className="loading-spinner"></span> Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </button>
      </form>

      {/* Link para Registro */}
      <p className="register-link">
        Não tem conta? <Link to="/register">Registrar</Link>
      </p>
    </div>
  );
}

export default Login;