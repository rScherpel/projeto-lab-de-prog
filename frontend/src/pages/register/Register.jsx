import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";
import {
  getPasswordChecks,
  passwordRequirements,
  getMissingRequirements,
  checkPasswordsMatch,
  canSubmitForm,
  handleRegisterSubmit,
} from "./register.js";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordChecks = getPasswordChecks(password);
  const missingPasswordRequirements = getMissingRequirements(passwordChecks);
  const passwordsMatch = checkPasswordsMatch(password, confirmPassword);
  const canSubmit = canSubmitForm(email, missingPasswordRequirements, passwordsMatch);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!canSubmit) {
      return;
    }

    const message = await handleRegisterSubmit(email, password);
    alert(message);
  };

  return (
    <div>
      <h1>Registro</h1>
      <div className="input-wrapper">
        <form onSubmit={handleRegister}>
          <div className="input">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-1"
            />
          </div>

          <div className="input">
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-1"
            />
          </div>

          <div className="input">
            <label>Confirmar senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-1"
            />
          </div>
          {password.length > 0 && missingPasswordRequirements.length > 0 && (
            <div className="password-requirements-box">
              {missingPasswordRequirements.map((requirement) => (
                <p key={requirement.key}>{requirement.message}</p>
              ))}
            </div>
          )}
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p>A confirmação de senha não confere.</p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="register-button"
          >
            Registrar
          </button>
        </form>
        <p>
          Já tem conta? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
