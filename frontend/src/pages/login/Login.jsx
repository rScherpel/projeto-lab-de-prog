import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleLoginSubmit } from "./login.js";
import "./Login.css";

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