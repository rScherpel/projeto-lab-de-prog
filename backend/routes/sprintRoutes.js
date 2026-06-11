const express = require("express");
const router = express.Router();
const db = require("../database/database");

// GET todos os sprints de um projeto
router.get("/project/:projectId", (req, res) => {
  const { projectId } = req.params;

  db.all(
    `SELECT sprints.*, COUNT(issues.id) as issue_count 
     FROM sprints 
     LEFT JOIN issues ON sprints.id = issues.sprint_id 
     WHERE sprints.project_id = ? 
     GROUP BY sprints.id 
     ORDER BY sprints.created_at DESC`,
    [projectId],
    (err, sprints) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(sprints);
    }
  );
});

// GET sprint por ID com suas issues
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM sprints WHERE id = ?", [id], (err, sprint) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!sprint) {
      return res.status(404).json({ error: "Sprint não encontrada" });
    }

    db.all("SELECT * FROM issues WHERE sprint_id = ? ORDER BY status, priority", [id], (err, issues) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ ...sprint, issues });
    });
  });
});

// POST criar novo sprint
router.post("/", (req, res) => {
  const { projectId, name, startDate, endDate } = req.body;

  if (!projectId || !name) {
    return res.status(400).json({ error: "Projeto e nome são obrigatórios" });
  }

  db.run(
    `INSERT INTO sprints (project_id, name, start_date, end_date, status) 
     VALUES (?, ?, ?, ?, ?)`,
    [projectId, name, startDate || null, endDate || null, "not_started"],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        id: this.lastID,
        projectId,
        name,
        startDate: startDate || null,
        endDate: endDate || null,
        status: "not_started",
        created_at: new Date(),
      });
    }
  );
});

// PUT atualizar sprint
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, status, startDate, endDate } = req.body;

  db.run(
    `UPDATE sprints SET name = ?, status = ?, start_date = ?, end_date = ? WHERE id = ?`,
    [name, status, startDate || null, endDate || null, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Sprint não encontrada" });
      }
      res.json({ message: "Sprint atualizada com sucesso" });
    }
  );
});

// DELETE deletar sprint
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  // Mover todas as issues para o backlog
  db.run("UPDATE issues SET sprint_id = NULL WHERE sprint_id = ?", [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    db.run("DELETE FROM sprints WHERE id = ?", [id], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Sprint não encontrada" });
      }
      res.json({ message: "Sprint deletada com sucesso" });
    });
  });
});

module.exports = router;
