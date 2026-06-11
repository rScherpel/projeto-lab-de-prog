const express = require("express");
const router = express.Router();
const db = require("../database/database");

console.log("[ROUTES] Registrando rotas de projetos");

// GET todos os projetos do usuário
router.get("/", (req, res) => {
  console.log("[PROJECTS] GET / - usuário:", req.user?.email);
  const userId = req.user.id;
  db.all(
    "SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    (err, projects) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(projects);
    }
  );
});

// GET projeto por ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.get(
    "SELECT * FROM projects WHERE id = ? AND user_id = ?",
    [id, req.user.id],
    (err, project) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!project) {
        return res.status(404).json({ error: "Projeto não encontrado" });
      }
      res.json(project);
    }
  );
});

// POST criar novo projeto
router.post("/", (req, res) => {
  console.log("[PROJECTS] POST / - usuário:", req.user?.email, "body:", req.body);
  const { name, description, key } = req.body;
  const userId = req.user.id;

  if (!name || !key) {
    return res.status(400).json({ error: "Nome e chave são obrigatórios" });
  }

  db.run(
    "INSERT INTO projects (name, description, key, user_id) VALUES (?, ?, ?, ?)",
    [name, description || "", key.toUpperCase(), userId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        id: this.lastID,
        name,
        description,
        key: key.toUpperCase(),
        user_id: userId,
        created_at: new Date(),
      });
    }
  );
});

// PUT atualizar projeto
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const userId = req.user.id;

  db.run(
    "UPDATE projects SET name = ?, description = ? WHERE id = ? AND user_id = ?",
    [name, description || "", id, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Projeto não encontrado" });
      }
      res.json({ message: "Projeto atualizado com sucesso" });
    }
  );
});

// DELETE deletar projeto
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.run("DELETE FROM projects WHERE id = ? AND user_id = ?", [id, userId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Projeto não encontrado" });
    }
    res.json({ message: "Projeto deletado com sucesso" });
  });
});

module.exports = router;
