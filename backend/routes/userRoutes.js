const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile", authMiddleware, (req, res) => {

  res.json({
    message: "Rota protegida funcionando",
    user: req.user
  });

});

router.post("/logout", authMiddleware, (req, res) => {
  // No JWT, o logout é feito apenas no cliente removendo o token
  // O backend valida que o token é válido antes de confirmar
  res.status(200).json({
    message: "Logout realizado com sucesso"
  });
});

router.get("/validate-token", authMiddleware, (req, res) => {
  // Se chegou aqui, o token é válido
  res.status(200).json({
    valid: true,
    message: "Token é válido",
    user: req.user
  });
});

module.exports = router;