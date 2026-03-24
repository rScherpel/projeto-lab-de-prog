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
  getEmailChecks,
  emailRequirements,
  getEmailSuggestions,
} from "./register.js";

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
