import { useNavigate } from "react-router-dom";
import { handleLogout } from "./home.js";

function Home() {
  const navigate = useNavigate();

  const logout = () => {
    handleLogout(navigate);
  };

  return (
    <div>
      <h1>Home</h1>

      <p>Usuário logado.</p>

      <button onClick={() => navigate("/dashboard")}>
        Ir para Dashboard
      </button>

      <br /><br />

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Home;