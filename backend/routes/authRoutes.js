const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const db = require("../database/database");
const AppError = require("../utils/AppError");

const SECRET = "segredo_super";

// Validar formato de email com regex robusto
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email);
}

// Normalizar email: remover espaços em branco e converter para minúsculas
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function isPasswordStrong(password) {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  return hasMinLength && hasUppercase && hasNumber && hasSpecialChar;
}

// =========================
// REGISTER
// =========================
router.post("/register", async (req, res, next) => {
  try {
    let { email, password } = req.body;

    // Validações básicas
    if (!email || !password) {
      throw new AppError("Email e senha são obrigatórios", 400);
    }

    // Normalizar email
    email = normalizeEmail(email);

    // Validar formato do email
    if (!validateEmail(email)) {
      throw new AppError("Email inválido. Use o formato: seu@email.com", 400);
    }

    // Validar comprimento do email
    if (email.length > 255) {
      throw new AppError("Email muito longo (máximo 255 caracteres)", 400);
    }

    // Validar força da senha
    if (!isPasswordStrong(password)) {
      throw new AppError(
        "A senha deve ter pelo menos 8 caracteres, 1 letra maiúscula, 1 número e 1 caractere especial",
        400
      );
    }

    // Verificar se o email já existe
    const checkSql = "SELECT id FROM users WHERE email = ?";
    db.get(checkSql, [email], async (err, existingUser) => {
      if (err) {
        return next(new AppError("Erro ao verificar email", 500));
      }

      if (existingUser) {
        return next(new AppError("Este email já está registrado", 409));
      }

      // Se email é novo, criar o usuário
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertSql = "INSERT INTO users (email, password) VALUES (?, ?)";

        db.run(insertSql, [email, hashedPassword], function (err) {
          if (err) {
            return next(new AppError("Erro ao criar usuário", 500));
          }

          res.status(201).json({
            message: "Usuário criado com sucesso",
            id: this.lastID,
          });
        });
      } catch (hashError) {
        next(new AppError("Erro ao processar a senha", 500));
      }
    });

  } catch (error) {
    next(error);
  }
});

// =========================
// LOGIN
// =========================
router.post("/login", (req, res, next) => {
  let { email, password } = req.body;

  // Normalizar email
  email = normalizeEmail(email);

  const sql = "SELECT * FROM users WHERE email = ?";

  db.get(sql, [email], async (err, user) => {
    if (err) {
      return next(new AppError("Erro no servidor", 500));
    }

    // Mensagem genérica para usuário não encontrado ou senha incorreta
    if (!user) {
      return next(new AppError("Login ou senha incorretos", 401));
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return next(new AppError("Login ou senha incorretos", 401));
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