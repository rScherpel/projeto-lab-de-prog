import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';

// Mock do fetch
global.fetch = jest.fn();

describe('ProtectedRoute', () => {
  const mockChildren = <div data-testid="protected-content">Conteúdo Protegido</div>;

  beforeEach(() => {
    fetch.mockClear();
  });

  it('deve mostrar "Carregando..." enquanto valida token', () => {
    fetch.mockImplementation(() =>
      new Promise(() => {}) // Nunca resolve
    );

    render(
      <BrowserRouter>
        <ProtectedRoute>{mockChildren}</ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve renderizar conteúdo quando token é válido', async () => {
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
  });

  it('deve redirecionar para "/" quando token é inválido', async () => {
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
  });

  it('deve redirecionar quando não há token', async () => {
    localStorage.clear();

    render(
      <BrowserRouter>
        <ProtectedRoute>{mockChildren}</ProtectedRoute>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });
});
