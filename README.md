# Lab de Prog - Aplicação de Login e Registro

Aplicação full-stack com autenticação JWT, construída com React (frontend) e Express.js (backend).

---

## 📋 Pré-requisitos

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **npm** 8+ (vem com Node.js)
- **SQLite3** (incluído no pacote npm, sem instalação separada necessária)

---

## 📦 Dependências

### Backend
```json
{
  "bcrypt": "^6.0.0",          // Criptografia de senhas
  "cors": "^2.8.6",             // Controle de CORS
  "express": "^5.2.1",          // Framework HTTP
  "jsonwebtoken": "^9.0.3",     // Autenticação JWT
  "sqlite3": "^6.0.1"           // Banco de dados
}
```

### Frontend
**Dependências:**
```json
{
  "react": "^19.2.4",                    // Biblioteca UI
  "react-dom": "^19.2.4",                // Renderização DOM
  "react-router-dom": "^7.13.1"          // Roteamento
}
```

**Dev Dependencies:**
```json
{
  "@eslint/js": "^9.39.4",
  "@types/react": "^19.2.14",
  "@types/react-dom": "^19.2.3",
  "@vitejs/plugin-react": "^6.0.0",      // Plugin React para Vite
  "eslint": "^9.39.4",                   // Linter
  "eslint-plugin-react-hooks": "^7.0.1",
  "eslint-plugin-react-refresh": "^0.5.2",
  "globals": "^17.4.0",
  "vite": "^8.0.0"                       // Build tool
}
```

---

## 🚀 Instalação

### 1. Clonar o Repositório
```bash
git clone https://github.com/rScherpel/projeto-lab-de-prog.git
cd "Lab de Prog"
```

### 2. Instalar Dependências

Um comando instala tudo de uma vez:
```bash
npm install && npm run install-all
```

Ou manualmente (de um único terminal):
```bash
npm install                  # Raiz
cd backend && npm install && cd ..    # Backend
cd frontend && npm install && cd ..   # Frontend
```

---

## ⚙️ Configuração

### Backend

#### Arquivo: `backend/index.js`
- Porta padrão: **3000**
- CORS habilitado para acesso do frontend

#### Arquivo: `backend/database/database.js`
- Banco de dados SQLite: `app.db`
- Tabelas: `users` (com email e senha criptografada)

### Frontend

#### Arquivo: `frontend/vite.config.js`
- Porta padrão: **5173** (durante desenvolvimento)
- Base: `/`

## 🏃 Como Executar

Execute tudo com um único comando pela raiz:

```bash
npm run dev
```

✅ Backend rodando em: `http://localhost:3000`
✅ Frontend rodando em: `http://localhost:5173`

**Pronto!** Ambas as aplicações estão rodando automaticamente.

### Alternativa: Executar Separadamente (se necessário)

```bash
# Somente backend
npm run backend

# Somente frontend
npm run frontend
```

---

## 📁 Estrutura do Projeto

```
Lab de Prog/
├── backend/
│   ├── index.js                    # Servidor principal
│   ├── package.json
│   ├── database/
│   │   └── database.js             # Configuração SQLite
│   ├── middleware/
│   │   ├── authMiddleware.js       # Validação de token
│   │   └── errorHandler.js         # Tratamento de erros
│   ├── routes/
│   │   ├── authRoutes.js           # Rotas de autenticação
│   │   └── userRoutes.js           # Rotas protegidas
│   └── utils/
│       └── AppError.js             # Classe de erro customizada
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js              # Configuração do Vite
│   ├── eslint.config.js            # Configuração ESLint
│   ├── index.html                  # HTML principal
│   └── src/
│       ├── main.jsx                # Entrada da aplicação
│       ├── App.jsx                 # Componente root
│       ├── index.css
│       ├── assets/
│       ├── components/
│       │   ├── ProtectedRoute.jsx  # Rota protegida
│       │   └── protectedRoute.js
│       └── pages/
│           ├── home/               # Dashboard
│           ├── login/              # Página de login
│           └── register/           # Página de registro
│
├── .gitignore
└── README.md
```

---

## ✨ Funcionalidades

### Autenticação
- ✅ Registro de usuário com validação de senha forte
- ✅ Login com JWT
- ✅ Opção "Lembre de mim" (localStorage/sessionStorage)
- ✅ Proteção de rotas

### Segurança
- ✅ Senhas criptografadas com bcrypt
- ✅ JWT para autenticação stateless
- ✅ CORS configurado
- ✅ Validação de campos (frontend e backend)
- ✅ Tratamento de erros robusto

### UX
- ✅ Validação em tempo real
- ✅ Mensagens de erro específicas
- ✅ Feedback visual de carregamento
- ✅ Roteamento dinâmico

---

## 🔑 Rotas da API

### Autenticação
```
POST /api/register
  Body: { email: string, password: string }
  Response: { message: string }

POST /api/login
  Body: { email: string, password: string }
  Response: { token: string }
```

### Protegidas (requer Authorization: Bearer <token>)
```
GET /api/user/profile
  Response: { id: number, email: string }

POST /api/user/logout
  Response: { message: string }
```

---

## 🧪 Testando a Aplicação

### Teste de Registro com cURL
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Senha123!"}'
```

### Teste de Login com cURL
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Senha123!"}'
```

---

## 🐛 Troubleshooting

### Erro: "Port 3000 already in use"
- Mude a porta no `backend/index.js`
- Ou termine o processo usando a porta: `lsof -ti:3000 | xargs kill`

### Erro: "CORS error"
- Verifique se o backend está rodando na porta 3000
- Verifique se CORS está habilitado em `backend/index.js`

### Erro: "Database locked"
- Verifique se não há múltiplas instâncias do backend rodando
- Delete `backend/app.db` e reinicie

### Frontend não conecta com Backend
- Configure o URL correto em `frontend/src/pages/login/login.js`
- Verifique se backend está rodando: `curl http://localhost:3000`

---

## 📝 Scripts Disponíveis

### 🎯 Pela Raiz (Recomendado)
```bash
npm run dev           # ⚡ Backend + Frontend simultaneamente
npm run install-all   # 📦 Instala todas as dependências
npm run backend       # 🔧 Apenas backend (porta 3000)
npm run frontend      # 🎨 Apenas frontend (porta 5173)
```

---

## 🔐 Requisitos de Senha

A validação de senha requer:
- ✅ Mínimo 8 caracteres
- ✅ Pelo menos 1 letra maiúscula
- ✅ Pelo menos 1 letra minúscula
- ✅ Pelo menos 1 número
- ✅ Pelo menos 1 caractere especial (!@#$%^&*)

---

## 📄 Licença

ISC

---

## 👨‍💻 Autor

Rafael

---

