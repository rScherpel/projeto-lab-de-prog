const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.log("Erro ao conectar no banco", err);
  } else {
    console.log("Banco SQLite conectado");
  }
});

// cria tabela se não existir
db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password TEXT
)
`);

module.exports = db;