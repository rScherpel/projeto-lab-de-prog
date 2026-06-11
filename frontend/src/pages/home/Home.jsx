import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Projects from "@/pages/projects/Projects";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar para /projects ao montar o componente
    // Comentado para mostrar Projects diretamente na Home
    // navigate("/projects");
  }, [navigate]);

  // Renderizar Projects diretamente na Home
  return <Projects />;
}

export default Home;