import React, { useState } from 'react';
import { authAPI } from '../services/api';
import './Login.css';

interface LoginProps {
  onLoginSuccess: (user: any, token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Tentar login com backend real primeiro
      const response = await authAPI.login(username, password);
      
      if (response.token && response.user) {
        // Login com backend real bem-sucedido
        onLoginSuccess(response.user, response.token);
      } else {
        setError('Resposta inválida do servidor');
      }
    } catch (err: any) {
      console.log('Erro no backend, usando fallback local:', err.message);
      
      // Fallback para login local se backend não estiver disponível
      if (username === 'admin' && password === 'Lima12345') {
        const mockUser = {
          id: 1,
          username: 'admin',
          nome: 'Administrador',
          email: 'admin@processflow.com',
          role: 'admin',
          cargo: 'Administrador do Sistema',
          departamento: 'TI',
          tipoUsuario: 'Gestor' as const,
          avatar: 'https://cdn-icons-png.flaticon.com/512/9131/9131546.png',
          criadoEm: new Date().toISOString(),
        };

        const mockToken = 'mock-jwt-token-' + Date.now();
        onLoginSuccess(mockUser, mockToken);
      } else {
        setError(err.response?.data?.message || 'Credenciais inválidas');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setUsername('admin');
    setPassword('Lima12345');
  };

  return (
    <div className="login-container" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
      padding: 0
    }}>
      <div className="login-card" style={{
        width: '100%',
        maxWidth: 400,
        margin: '0 auto',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        padding: '40px 32px 32px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0
      }}>
        <img
          src="/Logo.png"
          alt="Logo"
          style={{
            height: '100px',
            marginTop: '40px', // desce a logo
            marginBottom: '20px',
            maxWidth: '500px',
            width: '100%',
            display: 'block',
            objectFit: 'contain',
          }}
        />
        <p
          style={{
            fontSize: '1.3em',
            fontWeight: 400,
            marginBottom: 28,
            textAlign: 'center',
            color: '#444',
          }}
        >
          Sistema de Gestão de Processos
        </p>
        <form onSubmit={handleSubmit} className="login-form" style={{ width: '100%' }}>
          <div className="form-group" style={{ marginBottom: 18 }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: 6, color: '#333', fontWeight: 500 }}>Usuário:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Digite seu usuário"
              style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #d0d0d0', fontSize: 15 }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 18 }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: 6, color: '#333', fontWeight: 500 }}>Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Digite sua senha"
              style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #d0d0d0', fontSize: 15 }}
            />
          </div>
          {error && <div className="error-message" style={{ color: '#d32f2f', marginBottom: 12, textAlign: 'center' }}>{error}</div>}
          <button type="submit" disabled={loading} className="login-button" style={{
            width: '100%',
            padding: '12px 0',
            borderRadius: 6,
            background: 'linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 16,
            border: 'none',
            marginBottom: 18,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
          }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <div className="demo-section" style={{ textAlign: 'center', marginTop: 8 }}>
          <p style={{ margin: 0, fontSize: 14, color: '#888' }}>Demonstração:</p>
          <button 
            type="button" 
            onClick={fillAdminCredentials}
            className="demo-button"
            style={{
              margin: '8px 0 2px 0',
              padding: '6px 18px',
              borderRadius: 6,
              background: '#e3f2fd',
              color: '#1976d2',
              border: 'none',
              fontWeight: 500,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            Usar credenciais admin
          </button>
          <br />
          <small style={{ color: '#888' }}>admin / Lima12345</small>
        </div>
      </div>
    </div>
  );
};

export default Login;
