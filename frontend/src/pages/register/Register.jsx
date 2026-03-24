import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import {
  getPasswordChecks,
  passwordRequirements,
  getMissingRequirements,
  checkPasswordsMatch,
  validateRegisterFields,
  handleRegisterSubmit,
} from "./register.js";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const passwordChecks = getPasswordChecks(password);
  const missingPasswordRequirements = getMissingRequirements(passwordChecks);
  const passwordsMatch = checkPasswordsMatch(password, confirmPassword);

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

        {/* Requisitos de Senha */}
        {password.length > 0 && (
          <div className="password-requirements-box">
            {passwordRequirements.map((requirement) => {
              const isMet = passwordChecks[requirement.key];
              return (
                <p key={requirement.key} className={isMet ? "requirement-met" : "requirement-pending"}>
                  {isMet ? "✓" : "✗"} {requirement.message}
                </p>
              );
            })}
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
          disabled={loading || missingPasswordRequirements.length > 0 || !passwordsMatch || !email}
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
