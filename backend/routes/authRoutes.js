const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const db = require("../database/database");
const AppError = require("../utils/AppError");

const SECRET = "segredo_super";

// =========================
// REGISTER
// =========================
router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email e senha são obrigatórios", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (email, password) VALUES (?, ?)";

    db.run(sql, [email, hashedPassword], function (err) {
      if (err) {
        return next(new AppError("Usuário já existe", 400));
      }

      res.json({
        message: "Usuário criado com sucesso",
        id: this.lastID,
      });
    });

  } catch (error) {
    next(error);
  }
});

// =========================
// LOGIN
// =========================
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.get(sql, [email], async (err, user) => {
    if (err) {
      return next(new AppError("Erro no servidor", 500));
    }

    if (!user) {
      return next(new AppError("Usuário não encontrado", 404));
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return next(new AppError("Senha incorreta", 401));
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login realizado com sucesso",
      token,
    });
  });
});

router.get("/token/validate", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ valid: false, message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, SECRET);
    return res.json({ valid: true });
  } catch {
    return res.status(401).json({ valid: false, message: "Token inválido" });
  }
});

module.exports = router;