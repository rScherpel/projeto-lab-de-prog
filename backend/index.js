const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);        // públicas
app.use("/api/user", userRoutes);   // protegidas

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});