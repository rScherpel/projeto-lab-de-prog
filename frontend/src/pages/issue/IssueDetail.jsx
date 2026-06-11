import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "@/utils/auth.js";
import "./IssueDetail.css";

export default function IssueDetail() {
  const { issueId } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editingIssue, setEditingIssue] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [issueId]);

  const fetchData = async () => {
    try {
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [issueRes, commentsRes] = await Promise.all([
        fetch(`http://localhost:3000/api/issues/${issueId}`, { headers }),
        fetch(`http://localhost:3000/api/comments/issue/${issueId}`, { headers }),
      ]);

      if (!issueRes.ok || !commentsRes.ok) {
        throw new Error("Erro ao buscar dados");
      }

      const issueData = await issueRes.json();
      const commentsData = await commentsRes.json();

      setIssue(issueData);
      setComments(commentsData);
      setEditData({
        title: issueData.title,
        description: issueData.description,
        type: issueData.type,
        status: issueData.status,
        priority: issueData.priority,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const token = getToken();
      const response = await fetch("http://localhost:3000/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          issueId: parseInt(issueId),
          content: commentText,
        }),
      });

      if (!response.ok) throw new Error("Erro ao adicionar comentário");
      const newComment = await response.json();
      setComments([...comments, newComment]);
      setCommentText("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateIssue = async () => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:3000/api/issues/${issueId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...issue,
          ...editData,
        }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar issue");
      setIssue({ ...issue, ...editData });
      setEditingIssue(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (confirm("Tem certeza que deseja deletar este comentário?")) {
      try {
        const token = getToken();
        const response = await fetch(`http://localhost:3000/api/comments/${commentId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Erro ao deletar comentário");
        setComments(comments.filter((c) => c.id !== commentId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleDeleteIssue = async () => {
    if (confirm("Tem certeza que deseja deletar esta issue? Esta ação não pode ser desfeita.")) {
      try {
        const token = getToken();
        const response = await fetch(`http://localhost:3000/api/issues/${issueId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Erro ao deletar issue");
        navigate(`/board/${issue.project_id}`);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="issue-detail-loading">Carregando issue...</div>;
  if (!issue) return <div className="issue-detail-error">Issue não encontrada</div>;

  return (
    <div className="issue-detail-container">
      <button className="btn-back" onClick={() => navigate(`/board/${issue.project_id}`)}>
        ← Voltar ao Board
      </button>

      {error && <div className="error-message">{error}</div>}

      <div className="issue-detail-header">
        <div className="issue-detail-title-section">
          <span className="issue-detail-key">{issue.key}</span>
          {!editingIssue ? (
            <>
              <h1>{issue.title}</h1>
              <button className="btn-edit" onClick={() => setEditingIssue(true)}>
                Editar
              </button>
            </>
          ) : (
            <div className="edit-issue-form">
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              />
              <div className="edit-actions">
                <button className="btn-primary" onClick={handleUpdateIssue}>
                  Salvar
                </button>
                <button className="btn-secondary" onClick={() => setEditingIssue(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
        <button className="btn-danger" onClick={handleDeleteIssue}>
          Deletar Issue
        </button>
      </div>

      <div className="issue-detail-content">
        <div className="issue-detail-main">
          <div className="issue-section">
            <h3>Descrição</h3>
            {!editingIssue ? (
              <p className="issue-description">{issue.description || "Sem descrição"}</p>
            ) : (
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              />
            )}
          </div>

          <div className="issue-section">
            <h3>Comentários ({comments.length})</h3>

            <form className="comment-form" onSubmit={handleAddComment}>
              <textarea
                placeholder="Adicionar um comentário..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button type="submit" className="btn-primary">
                Comentar
              </button>
            </form>

            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <span className="comment-date">
                      {new Date(comment.created_at).toLocaleDateString("pt-BR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <button
                      className="btn-delete-comment"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Deletar
                    </button>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="issue-detail-sidebar">
          <div className="sidebar-section">
            <h4>Status</h4>
            {!editingIssue ? (
              <span className={`status-badge status-${issue.status}`}>{issue.status}</span>
            ) : (
              <select
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
              >
                <option value="todo">A Fazer</option>
                <option value="in_progress">Em Progresso</option>
                <option value="in_review">Em Revisão</option>
                <option value="done">Pronto</option>
              </select>
            )}
          </div>

          <div className="sidebar-section">
            <h4>Tipo</h4>
            {!editingIssue ? (
              <span className={`type-badge type-${issue.type}`}>{issue.type}</span>
            ) : (
              <select
                value={editData.type}
                onChange={(e) => setEditData({ ...editData, type: e.target.value })}
              >
                <option value="task">Task</option>
                <option value="bug">Bug</option>
                <option value="feature">Feature</option>
              </select>
            )}
          </div>

          <div className="sidebar-section">
            <h4>Prioridade</h4>
            {!editingIssue ? (
              <span className={`priority-badge priority-${issue.priority}`}>
                {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
              </span>
            ) : (
              <select
                value={editData.priority}
                onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            )}
          </div>

          <div className="sidebar-section">
            <h4>Criada em</h4>
            <p className="meta-info">
              {new Date(issue.created_at).toLocaleDateString("pt-BR")}
            </p>
          </div>

          {issue.updated_at !== issue.created_at && (
            <div className="sidebar-section">
              <h4>Atualizada em</h4>
              <p className="meta-info">
                {new Date(issue.updated_at).toLocaleDateString("pt-BR")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
