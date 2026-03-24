const express = require("express");
const cors = require("cors");
require("./database/database");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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

app.use("/api", authRoutes);        // públicas
app.use("/api/user", userRoutes);   // protegidas

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Health check disponível em http://localhost:${PORT}/health`);
  console.log(`Frontend rodando em http://localhost:5173`);
});