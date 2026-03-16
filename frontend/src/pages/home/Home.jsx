import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
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