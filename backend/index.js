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

app.use("/api", authRoutes);        // públicas
app.use("/api/user", userRoutes);   // protegidas

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});