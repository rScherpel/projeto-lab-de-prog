import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleLoginSubmit } from "./login.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    await handleLoginSubmit(email, password, rememberMe, navigate);
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
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
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Lembre de mim
          </label>
        </div>

        <button type="submit">Entrar</button>
      </form>

      <p>
        Não tem conta? <Link to="/register">Registrar</Link>
      </p>
    </div>
  );
}

export default Login;