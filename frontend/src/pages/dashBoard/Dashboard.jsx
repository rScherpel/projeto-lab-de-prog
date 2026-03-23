import { useNavigate } from "react-router-dom";
import { handleNavigate } from "./dashboard.js";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Área protegida</p>

      <button onClick={() => navigate("/home")}>
        Voltar para Home
      </button>
    </div>
  );
}

export default Dashboard;