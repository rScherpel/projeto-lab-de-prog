import { useState } from "react";
import { Link } from "react-router-dom";

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
    (requirement) => !passwordChecks[requirement.key]
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

      <form onSubmit={handleRegister}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label>Confirmar senha</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {password.length > 0 && missingPasswordRequirements.length > 0 && (
          <div>
            {missingPasswordRequirements.map((requirement) => (
              <p key={requirement.key}>{requirement.message}</p>
            ))}
          </div>
        )}

        {confirmPassword.length > 0 && !passwordsMatch && (
          <p>A confirmação de senha não confere.</p>
        )}

        <button type="submit" disabled={!canSubmit}>
          Registrar
        </button>
      </form>

      <p>
        Já tem conta? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default Register;