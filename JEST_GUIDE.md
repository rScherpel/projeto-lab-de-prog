# Guia de Testes com Jest

## Backend

### Instalar dependências
```bash
cd backend
npm install
```

### Rodar testes
```bash
npm test           # Executa em watch mode
npm run test:ci    # Executa com coverage report
```

### Estrutura de testes

Os testes estão organizados na pasta `__tests__/`:

- **`__tests__/utils/AppError.test.js`** - Testes da classe de erro customizada (4 testes)

#### Testes do AppError:
✅ Criar erro com mensagem e statusCode
✅ Verificar se é instância de Error
✅ Validar statusCode 401 (autenticação)
✅ Validar statusCode 404 (não encontrado)

### Executar teste específico
```bash
npm test -- AppError.test.js
```

**Status:** ✅ 4 testes passando | Coverage: 100%

---

## Frontend

### Instalar dependências
```bash
cd frontend
npm install
```

### Rodar testes
```bash
npm test           # Executa em watch mode
npm run test:ci    # Executa com coverage report
```

### Estrutura de testes

Os testes estão organizados em `src/__tests__/`:

- **`src/__tests__/components/ProtectedRoute.test.jsx`** - Testes do componente ProtectedRoute (4 testes)

#### Testes do ProtectedRoute:
✅ Mostrar "Carregando..." enquanto valida token
✅ Renderizar conteúdo quando token é válido
✅ Redirecionar para "/" quando token é inválido
✅ Redirecionar quando não há token

### Executar teste específico
```bash
npm test -- ProtectedRoute.test.jsx
```

**Status:** ✅ 4 testes passando | Coverage: 96% (ProtectedRoute), 57% (auth.js)

---

## Comandos úteis

### Watch mode (desenvolvimento)
```bash
npm test
```
No watch mode, você pode:
- Pressionar `a` para rodar todos os testes
- Pressionar `f` para rodar apenas testes falhados
- Pressionar `p` para filtrar por nome de arquivo
- Pressionar `t` para filtrar por nome de teste
- Pressionar `q` para sair

### Coverage report
```bash
npm run test:ci
```
Gera um relatório completo de cobertura de testes

---

## Próximos passos

Você pode:
1. **Adicionar mais testes** para outras rotas, componentes e funções
2. **Melhorar a cobertura** de código (veja o relatório com `npm run test:ci`)
3. **Integrar com CI/CD** (GitHub Actions, GitLab CI, etc)
4. **Usar fixtures** para dados de teste reutilizáveis

### Exemplo: Criar novo teste
```javascript
describe('minha funcionalidade', () => {
  it('deve fazer algo específico', () => {
    const resultado = minhaFuncao();
    expect(resultado).toBe(valorEsperado);
  });
});
```

---

## Resumo da configuração

| Aspecto | Backend | Frontend |
|---------|---------|----------|
| **Testes** | 4 | 4 |
| **Status** | ✅ Passando | ✅ Passando |
| **Arquivo config** | jest.config.js | jest.config.js |
| **Environment** | node | jsdom |
| **Coverage** | AppError: 100% | ProtectedRoute: 96% |

