const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const SECRET = "segredo_super";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  console.log(`[AUTH] ${req.method} ${req.path} - Auth Header: ${authHeader ? "presente" : "ausente"}`);

  if (!authHeader) {
    return next(new AppError("Token não fornecido", 401));
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return next(new AppError("Cabeçalho de autorização inválido", 401));
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    console.log(`[AUTH] Token válido para usuário: ${decoded.email}`);
    next();
  } catch (error) {
    console.log(`[AUTH] Token inválido: ${error.message}`);
    next(new AppError("Token inválido", 401));
  }
}

module.exports = authMiddleware;