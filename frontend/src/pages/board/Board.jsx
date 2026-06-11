import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "@/utils/auth.js";
import "./Board.css";

export default function Board() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [activeSprint, setActiveSprint] = useState(null);
  const [showNewIssue, setShowNewIssue] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "task",
    priority: "medium",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [projectRes, issuesRes, sprintsRes] = await Promise.all([
        fetch(`http://localhost:3000/api/projects/${projectId}`, { headers }),
        fetch(`http://localhost:3000/api/issues/project/${projectId}`, { headers }),
        fetch(`http://localhost:3000/api/sprints/project/${projectId}`, { headers }),
      ]);

      if (!projectRes.ok || !issuesRes.ok || !sprintsRes.ok) {
        throw new Error("Erro ao buscar dados");
      }

      const projectData = await projectRes.json();
      const issuesData = await issuesRes.json();
      const sprintsData = await sprintsRes.json();

      setProject(projectData);
      setIssues(issuesData);
      setSprints(sprintsData);

      const activeSpr = sprintsData.find((s) => s.status === "active");
      if (activeSpr) {
        setActiveSprint(activeSpr.id);
      } else if (sprintsData.length > 0) {
        setActiveSprint(sprintsData[0].id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      setError("Título é obrigatório");
      return;
    }

    try {
      const token = getToken();
      const response = await fetch("http://localhost:3000/api/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          projectId: parseInt(projectId),
          sprintId: activeSprint,
        }),
      });

      if (!response.ok) throw new Error("Erro ao criar issue");
      const newIssue = await response.json();
      setIssues([newIssue, ...issues]);
      setFormData({ title: "", description: "", type: "task", priority: "medium" });
      setShowNewIssue(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateIssueStatus = async (issueId, newStatus) => {
    try {
      const token = getToken();
      const issue = issues.find((i) => i.id === issueId);
      await fetch(`http://localhost:3000/api/issues/${issueId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...issue,
          status: newStatus,
        }),
      });

      setIssues(
        issues.map((i) => (i.id === issueId ? { ...i, status: newStatus } : i))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteIssue = async (issueId) => {
    if (confirm("Tem certeza que deseja deletar esta issue?")) {
      try {
        const token = getToken();
        await fetch(`http://localhost:3000/api/issues/${issueId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        setIssues(issues.filter((i) => i.id !== issueId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="board-loading">Carregando board...</div>;
  if (!project) return <div className="board-error">Projeto não encontrado</div>;

  const statuses = ["todo", "in_progress", "in_review", "done"];
  const statusLabels = {
    todo: "A Fazer",
    in_progress: "Em Progresso",
    in_review: "Em Revisão",
    done: "Pronto",
  };

  const sprintIssues = issues.filter((i) => i.sprint_id === activeSprint || !activeSprint);

  return (
    <div className="board-container">
      <div className="board-header">
        <div>
          <button className="btn-back" onClick={() => navigate("/projects")}>
            ← Voltar
          </button>
          <h1>{project.name}</h1>
          <p className="project-key-badge">{project.key}</p>
        </div>
        <button className="btn-primary" onClick={() => setShowNewIssue(!showNewIssue)}>
          {showNewIssue ? "Cancelar" : "+ Nova Issue"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showNewIssue && (
        <form className="new-issue-form" onSubmit={handleCreateIssue}>
          <input
            type="text"
            placeholder="Título da issue"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Descrição (opcional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="form-row">
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="task">Task</option>
              <option value="bug">Bug</option>
              <option value="feature">Feature</option>
            </select>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="low">Baixa Prioridade</option>
              <option value="medium">Média Prioridade</option>
              <option value="high">Alta Prioridade</option>
            </select>
            <button type="submit" className="btn-primary">
              Criar
            </button>
          </div>
        </form>
      )}

      {sprints.length > 0 && (
        <div className="sprints-selector">
          <label>Sprint Ativo:</label>
          <select value={activeSprint || ""} onChange={(e) => setActiveSprint(parseInt(e.target.value) || null)}>
            <option value="">Backlog</option>
            {sprints.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.issue_count || 0})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="kanban-board">
        {statuses.map((status) => (
          <div key={status} className="kanban-column">
            <div className="column-header">
              <h3>{statusLabels[status]}</h3>
              <span className="issue-count">
                {sprintIssues.filter((i) => i.status === status).length}
              </span>
            </div>
            <div className="column-content">
              {sprintIssues
                .filter((i) => i.status === status)
                .map((issue) => (
                  <div key={issue.id} className={`issue-card priority-${issue.priority}`}>
                    <div className="issue-card-header">
                      <div className="issue-key-type">
                        <span className="issue-key">{issue.key}</span>
                        <span className={`issue-type ${issue.type}`}>{issue.type}</span>
                      </div>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteIssue(issue.id)}
                      >
                        ×
                      </button>
                    </div>
                    <h4
                      className="issue-title"
                      onClick={() => navigate(`/issue/${issue.id}`)}
                    >
                      {issue.title}
                    </h4>
                    <p className="issue-description">{issue.description}</p>
                    <div className="issue-actions">
                      {status !== "done" && (
                        <button
                          className="btn-move"
                          onClick={() => {
                            const nextIndex = statuses.indexOf(status) + 1;
                            if (nextIndex < statuses.length) {
                              handleUpdateIssueStatus(issue.id, statuses[nextIndex]);
                            }
                          }}
                        >
                          Avançar →
                        </button>
                      )}
                      {status !== "todo" && (
                        <button
                          className="btn-move btn-back"
                          onClick={() => {
                            const prevIndex = statuses.indexOf(status) - 1;
                            if (prevIndex >= 0) {
                              handleUpdateIssueStatus(issue.id, statuses[prevIndex]);
                            }
                          }}
                        >
                          ← Voltar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
