const AppError = require('../../utils/AppError');

describe('AppError', () => {
  it('deve criar um erro com mensagem e statusCode', () => {
    const error = new AppError('Teste erro', 400);
    
    expect(error.message).toBe('Teste erro');
    expect(error.statusCode).toBe(400);
  });

  it('deve ser uma instância de Error', () => {
    const error = new AppError('Teste', 500);
    
    expect(error instanceof Error).toBe(true);
  });

  it('deve ter statusCode 401 para erros de autenticação', () => {
    const error = new AppError('Não autorizado', 401);
    
    expect(error.statusCode).toBe(401);
  });

  it('deve ter statusCode 404 para recurso não encontrado', () => {
    const error = new AppError('Recurso não encontrado', 404);
    
    expect(error.statusCode).toBe(404);
  });
});
