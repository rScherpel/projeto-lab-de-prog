const express = require("express");
const router = express.Router();
const db = require("../database/database");

// GET todos os comentários de uma issue
router.get("/issue/:issueId", (req, res) => {
  const { issueId } = req.params;

  db.all(
    "SELECT * FROM comments WHERE issue_id = ? ORDER BY created_at ASC",
    [issueId],
    (err, comments) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(comments);
    }
  );
});

// GET comentário por ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM comments WHERE id = ?", [id], (err, comment) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!comment) {
      return res.status(404).json({ error: "Comentário não encontrado" });
    }
    res.json(comment);
  });
});

// POST criar novo comentário
router.post("/", (req, res) => {
  const { issueId, content } = req.body;

  if (!issueId || !content) {
    return res.status(400).json({ error: "Issue e conteúdo são obrigatórios" });
  }

  db.run(
    "INSERT INTO comments (issue_id, content) VALUES (?, ?)",
    [issueId, content],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        id: this.lastID,
        issueId,
        content,
        created_at: new Date(),
      });
    }
  );
});

// PUT atualizar comentário
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Conteúdo é obrigatório" });
  }

  db.run("UPDATE comments SET content = ? WHERE id = ?", [content, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Comentário não encontrado" });
    }
    res.json({ message: "Comentário atualizado com sucesso" });
  });
});

// DELETE deletar comentário
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM comments WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Comentário não encontrado" });
    }
    res.json({ message: "Comentário deletado com sucesso" });
  });
});

module.exports = router;
