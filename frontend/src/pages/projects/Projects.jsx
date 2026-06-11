import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "@/utils/auth.js";
import "./Projects.css";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", key: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      console.warn("[PROJECTS] Token ausente, redirecionando para login");
      navigate("/");
      return;
    }
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = getToken();
      console.log("[PROJECTS] Buscando projetos - token:", token ? `presente (${token.substring(0, 20)}...)` : "ausente");
      
      if (!token) {
        setError("Token expirado. Faça login novamente.");
        navigate("/");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:3000/api/projects", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      console.log("[PROJECTS] Response status:", response.status);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("[PROJECTS] Erro:", errorData);
        throw new Error("Erro ao buscar projetos");
      }
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      console.error("[PROJECTS] Erro:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.key) {
      setError("Nome e chave são obrigatórios");
      return;
    }

    try {
      const token = getToken();
      console.log("[PROJECTS] Criando projeto - token:", token ? `presente (${token.substring(0, 20)}...)` : "ausente");
      
      if (!token) {
        setError("Token expirado. Faça login novamente.");
        navigate("/");
        return;
      }

      const response = await fetch("http://localhost:3000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      console.log("[PROJECTS] POST Response status:", response.status);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("[PROJECTS] POST Erro:", errorData);
        throw new Error("Erro ao criar projeto");
      }
      const newProject = await response.json();
      setProjects([newProject, ...projects]);
      setFormData({ name: "", description: "", key: "" });
      setShowForm(false);
      setError("");
    } catch (err) {
      console.error("[PROJECTS] Erro:", err);
      setError(err.message);
    }
  };

  const handleDeleteProject = async (id) => {
    if (confirm("Tem certeza que deseja deletar este projeto?")) {
      try {
        const token = getToken();
        const response = await fetch(`http://localhost:3000/api/projects/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Erro ao deletar projeto");
        setProjects(projects.filter((p) => p.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="projects-loading">Carregando projetos...</div>;

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>Meus Projetos</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "+ Novo Projeto"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form className="project-form" onSubmit={handleCreateProject}>
          <input
            type="text"
            placeholder="Nome do projeto"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Chave do projeto (ex: JIRA)"
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value.toUpperCase() })}
            required
          />
          <textarea
            placeholder="Descrição (opcional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <button type="submit" className="btn-primary">
            Criar Projeto
          </button>
        </form>
      )}

      {projects.length === 0 && !showForm ? (
        <div className="no-projects">
          <p>Nenhum projeto criado ainda</p>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            Crie seu primeiro projeto
          </button>
        </div>
      ) : projects.length > 0 ? (
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-card-header">
                <h3>{project.name}</h3>
                <span className="project-key">{project.key}</span>
              </div>
              {project.description && <p className="project-description">{project.description}</p>}
              <div className="project-card-actions">
                <button
                  className="btn-secondary"
                  onClick={() => navigate(`/board/${project.id}`)}
                >
                  Abrir
                </button>
                <button
                  className="btn-danger"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
