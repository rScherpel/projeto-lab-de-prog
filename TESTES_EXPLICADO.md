# 🧪 Como Funcionam os Testes - Explicação Completa

## Backend - 4 Testes (AppError.test.js)

**O que testa:** A classe `AppError` que cria mensagens de erro personalizadas

### Teste 1: "Criar erro com mensagem e statusCode"

```javascript
const error = new AppError('Teste erro', 400);

expect(error.message).toBe('Teste erro');      // Verifica se a mensagem está correta
expect(error.statusCode).toBe(400);            // Verifica se o código está correto
```

**O que acontece:**
1. Criamos um novo erro com mensagem "Teste erro" e código 400
2. Verificamos se `error.message` é realmente "Teste erro"
3. Verificamos se `error.statusCode` é realmente 400

✅ **Objetivo:** Confirmar que o erro armazena a mensagem e o código corretamente

---

### Teste 2: "Verificar se é instância de Error"

```javascript
const error = new AppError('Teste', 500);

expect(error instanceof Error).toBe(true);     // Verifica se é um Error real
```

**O que acontece:**
1. Criamos um AppError
2. Verificamos se ele é realmente um Error do JavaScript (herança)

✅ **Objetivo:** Garantir que AppError funciona como um Error real

---

### Teste 3: "Validar statusCode 401"

```javascript
const error = new AppError('Não autorizado', 401);

expect(error.statusCode).toBe(401);            // Verifica se é 401 mesmo
```

**O que acontece:**
1. Criamos um erro com statusCode 401 (não autorizado)
2. Verificamos se o statusCode é realmente 401

✅ **Objetivo:** Confirmar que erros de autenticação funcionam

---

### Teste 4: "Validar statusCode 404"

```javascript
const error = new AppError('Recurso não encontrado', 404);

expect(error.statusCode).toBe(404);            // Verifica se é 404 mesmo
```

**O que acontece:**
1. Criamos um erro com statusCode 404 (não encontrado)
2. Verificamos se o statusCode é realmente 404

✅ **Objetivo:** Confirmar que erros de recurso não encontrado funcionam

---

## Frontend - 4 Testes (ProtectedRoute.test.jsx)

**O que testa:** O componente `ProtectedRoute` que protege páginas (só deixa entrar com token válido)

### Teste 1: "Mostrar 'Carregando...' enquanto valida token"

```javascript
fetch.mockImplementation(() =>
  new Promise(() => {}) // Nunca resolve
);

render(
  <BrowserRouter>
    <ProtectedRoute>{mockChildren}</ProtectedRoute>
  </BrowserRouter>
);

expect(screen.getByText('Carregando...')).toBeInTheDocument();
```

**O que acontece:**
1. Fazemos um mock do fetch que nunca retorna resposta
2. Renderizamos o ProtectedRoute
3. Verificamos se "Carregando..." aparece na tela

✅ **Objetivo:** Quando você entra na rota protegida, ele mostra "Carregando..." enquanto verifica o token

---

### Teste 2: "Renderizar conteúdo quando token é válido"

```javascript
fetch.mockResolvedValueOnce({
  ok: true,
  json: async () => ({ valid: true }),
});

localStorage.setItem('token', 'valid_token');

render(
  <BrowserRouter>
    <ProtectedRoute>{mockChildren}</ProtectedRoute>
  </BrowserRouter>
);

await waitFor(() => {
  expect(screen.getByTestId('protected-content')).toBeInTheDocument();
});
```

**O que acontece:**
1. Dizemos ao fetch para retornar sucesso (token válido)
2. Salvamos um token no localStorage
3. Renderizamos o ProtectedRoute
4. Aguardamos e verificamos se o conteúdo protegido aparece

✅ **Objetivo:** Se você tem um token válido, você vê a página protegida

---

### Teste 3: "Redirecionar com token inválido"

```javascript
fetch.mockResolvedValueOnce({
  ok: false,
  json: async () => ({ valid: false }),
});

localStorage.setItem('token', 'invalid_token');

render(
  <BrowserRouter>
    <ProtectedRoute>{mockChildren}</ProtectedRoute>
  </BrowserRouter>
);

await waitFor(() => {
  expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
});
```

**O que acontece:**
1. Dizemos ao fetch para retornar erro (token inválido)
2. Salvamos um token inválido no localStorage
3. Renderizamos o ProtectedRoute
4. Aguardamos e verificamos que o conteúdo NÃO aparece (você foi redirecionado)

✅ **Objetivo:** Se seu token é inválido, você é redirecionado

---

### Teste 4: "Redirecionar quando não há token"

```javascript
localStorage.clear();  // Apaga o token

render(
  <BrowserRouter>
    <ProtectedRoute>{mockChildren}</ProtectedRoute>
  </BrowserRouter>
);

await waitFor(() => {
  expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
});
```

**O que acontece:**
1. Limpamos o localStorage (sem token)
2. Renderizamos o ProtectedRoute
3. Aguardamos e verificamos que o conteúdo NÃO aparece

✅ **Objetivo:** Sem token, você é redirecionado

---

## 📐 A estrutura básica de um teste

```javascript
describe('Nome do que está testando', () => {
  
  it('deve fazer algo específico', () => {
    // 1. PREPARAR: Configurar dados de teste
    const entrada = 'algum valor';
    const resultado = minhaFuncao(entrada);
    
    // 2. EXECUTAR: Executar a função
    // (já feito acima)
    
    // 3. VERIFICAR: Conferir se o resultado está correto
    expect(resultado).toBe(valorEsperado);
  });
  
});
```

### Explicação dos termos:

- **`describe`**: Agrupa testes relacionados
- **`it`**: Descreve um teste específico
- **`expect`**: Verifica se o resultado é o esperado
- **`toBe`**: Compara se é exatamente igual

---

## 🤔 Por que usar testes?

| Benefício | Explicação |
|-----------|-----------|
| ✅ **Confiança** | Sabe que o código está funcionando |
| ✅ **Refatoração segura** | Muda código sem medo de quebrar |
| ✅ **Documentação viva** | Os testes mostram como usar |
| ✅ **Menos bugs** | Encontra problemas cedo |
| ✅ **Economiza tempo** | Pega erros antes de ir pra produção |

---

## 💡 Exemplo Real do Seu Projeto

### ❌ Sem teste (PROBLEMA):
```javascript
const error = new AppError('Erro', 'abc');  // Passou string ao invés de número!
console.log(error.statusCode);               // 'abc' (errado!)
// Ninguém percebia até quebrar em produção 😱
```

### ✅ Com teste (SALVOU!):
```javascript
it('deve ter statusCode numérico', () => {
  const error = new AppError('Erro', 'abc');
  expect(typeof error.statusCode).toBe('number');
});
// TESTE FALHA! ❌
// Você descobre o erro antes de enviar pra produção ✅
```

---

## 🧬 Termos importantes

### `expect(valor).toBe(esperado)`
Verifica se o valor é **exatamente** igual ao esperado.

```javascript
expect(2 + 2).toBe(4);           // ✅ Passa
expect('hello').toBe('hello');   // ✅ Passa
expect(true).toBe(true);         // ✅ Passa
expect(2 + 2).toBe(5);           // ❌ Falha
```

### `expect(valor).toBeInTheDocument()`
Verifica se um elemento existe no DOM (Frontend).

```javascript
expect(screen.getByText('Olá')).toBeInTheDocument();    // ✅ Elemento existe
```

### `expect(valor).not.toBeInTheDocument()`
Verifica se um elemento NÃO existe no DOM.

```javascript
expect(screen.queryByText('Adeus')).not.toBeInTheDocument();  // ✅ Elemento não existe
```

### `jest.fn()`
Cria uma função fake para testes (mock).

```javascript
const meuMock = jest.fn();
meuMock('teste');
expect(meuMock).toHaveBeenCalledWith('teste');  // ✅ Foi chamado com 'teste'
```

### `jest.mock()` / `mockResolvedValueOnce()`
Simula respostas de APIs.

```javascript
fetch.mockResolvedValueOnce({
  ok: true,
  json: async () => ({ valid: true }),
});
// Próxima chamada ao fetch retorna isso
```

---

## 🚀 Comandos para rodar os testes

### Backend
```bash
cd backend
npm test           # Watch mode (recarrega ao salvar)
npm run test:ci    # Com coverage report
```

### Frontend
```bash
cd frontend
npm test           # Watch mode (recarrega ao salvar)
npm run test:ci    # Com coverage report
```

### No watch mode, você pode:
- Pressionar `a` → rodar todos os testes
- Pressionar `f` → apenas testes que falharam
- Pressionar `p` → filtrar por nome de arquivo
- Pressionar `t` → filtrar por nome de teste
- Pressionar `q` → sair

---

## 📊 Status Atual dos Testes

| Parte | Arquivo | Testes | Status | Coverage |
|-------|---------|--------|--------|----------|
| Backend | `AppError.test.js` | 4 | ✅ Passando | 100% |
| Frontend | `ProtectedRoute.test.jsx` | 4 | ✅ Passando | 96% |
| **TOTAL** | **2 arquivos** | **8** | **✅ Passando** | **~98%** |

---

## ❓ Dúvidas Comuns

**P: E se um teste falhar?**  
R: Você vê exatamente qual teste falhou e por quê. Depois é só consertar o código.

**P: Preciso escrever testes para tudo?**  
R: Idealmente sim, mas comece com as coisas mais importantes (lógica crítica, APIs, autenticação).

**P: Quanto tempo leva escrever testes?**  
R: No início demora mais, mas depois economiza MUITO tempo encontrando bugs.

**P: Como adiciono mais testes?**  
R: Crie um novo arquivo em `__tests__/` ou adicione mais `it()` nos existentes.

---

## 🎓 Próximos passos

1. **Rode os testes** para ver funcionarem
2. **Experimente modificar** um teste e veja falhar
3. **Conserte o código** e veja passar novamente
4. **Adicione mais testes** para outras funcionalidades

Bom teste! 🚀
