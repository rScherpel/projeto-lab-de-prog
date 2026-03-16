import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordChecks = {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
  };

  const passwordRequirements = [
    {
      key: "hasMinLength",
      message: "A senha deve ter pelo menos 8 caracteres",
    },
    {
      key: "hasUppercase",
      message: "A senha deve ter pelo menos 1 letra maiúscula",
    },
    {
      key: "hasNumber",
      message: "A senha deve ter pelo menos 1 número",
    },
    {
      key: "hasSpecialChar",
      message: "A senha deve ter pelo menos 1 caractere especial",
    },
  ];

  const missingPasswordRequirements = passwordRequirements.filter(
    (requirement) => !passwordChecks[requirement.key],
  );

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  const canSubmit =
    email.trim() !== "" &&
    missingPasswordRequirements.length === 0 &&
    passwordsMatch;

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!canSubmit) {
      return;
    }

    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    alert(data.message);
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
