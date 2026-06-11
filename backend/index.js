const express = require("express");
const cors = require("cors");
require("./database/database");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const issueRoutes = require("./routes/issueRoutes");
const sprintRoutes = require("./routes/sprintRoutes");
const commentRoutes = require("./routes/commentRoutes");
const errorHandler = require("./middleware/errorHandler");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Middleware de logging para todas as requisições
app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.path}`);
  next();
});

// Rota raiz
app.get("/", (req, res) => {
  res.status(200).json({
    message: "API de Autenticação - Lab de Prog",
    version: "1.0.0",
    endpoints: {
      health: "GET /health",
      register: "POST /api/register",
      login: "POST /api/login",
      profile: "GET /api/user/profile",
      logout: "POST /api/user/logout",
      projects: "GET /api/projects | POST /api/projects",
      issues: "GET /api/issues/project/:id | POST /api/issues",
      sprints: "GET /api/sprints/project/:id | POST /api/sprints",
      comments: "GET /api/comments/issue/:id | POST /api/comments",
    },
    frontend: "http://localhost:5173",
  });
});

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Rotas específicas primeiro (mais específicas)
app.use("/api/projects", authMiddleware, projectRoutes);
app.use("/api/issues", authMiddleware, issueRoutes);
app.use("/api/sprints", authMiddleware, sprintRoutes);
app.use("/api/comments", authMiddleware, commentRoutes);

// Depois rotas genéricas
app.use("/api", authRoutes);        // públicas (register, login, etc)
app.use("/api/user", userRoutes);   // protegidas (profile, logout)

// Handler para 404 - antes do errorHandler
app.use((req, res, next) => {
  console.log(`[404] Rota não encontrada: ${req.method} ${req.path}`);
  res.status(404).json({ error: "Rota não encontrada", path: req.path, method: req.method });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Health check disponível em http://localhost:${PORT}/health`);
  console.log(`Frontend rodando em http://localhost:5173`);
});