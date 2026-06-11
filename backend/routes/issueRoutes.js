const express = require("express");
const router = express.Router();
const db = require("../database/database");

// GET todas as issues de um projeto
router.get("/project/:projectId", (req, res) => {
  const { projectId } = req.params;

  db.all(
    `SELECT issues.*, projects.key FROM issues 
     JOIN projects ON issues.project_id = projects.id 
     WHERE issues.project_id = ? 
     ORDER BY issues.created_at DESC`,
    [projectId],
    (err, issues) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(issues);
    }
  );
});

// GET issue por ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.get(
    `SELECT issues.*, projects.key FROM issues 
     JOIN projects ON issues.project_id = projects.id 
     WHERE issues.id = ?`,
    [id],
    (err, issue) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!issue) {
        return res.status(404).json({ error: "Issue não encontrada" });
      }
      res.json(issue);
    }
  );
});

// POST criar nova issue
router.post("/", (req, res) => {
  const { projectId, title, description, type, priority, sprintId } = req.body;

  if (!projectId || !title) {
    return res.status(400).json({ error: "Projeto e título são obrigatórios" });
  }

  db.run(
    `INSERT INTO issues (project_id, title, description, type, priority, sprint_id, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [projectId, title, description || "", type || "task", priority || "medium", sprintId || null, "todo"],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Get the project key to generate issue key
      db.get("SELECT key FROM projects WHERE id = ?", [projectId], (err, project) => {
        res.status(201).json({
          id: this.lastID,
          projectId,
          title,
          description,
          type: type || "task",
          priority: priority || "medium",
          status: "todo",
          sprintId: sprintId || null,
          key: `${project.key}-${this.lastID}`,
          created_at: new Date(),
        });
      });
    }
  );
});

// PUT atualizar issue
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, type, status, priority, sprintId } = req.body;

  db.run(
    `UPDATE issues SET title = ?, description = ?, type = ?, status = ?, priority = ?, sprint_id = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [title, description || "", type, status, priority, sprintId || null, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Issue não encontrada" });
      }
      res.json({ message: "Issue atualizada com sucesso" });
    }
  );
});

// DELETE deletar issue
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM issues WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Issue não encontrada" });
    }
    res.json({ message: "Issue deletada com sucesso" });
  });
});

module.exports = router;
