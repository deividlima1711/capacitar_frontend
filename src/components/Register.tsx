import React, { useState } from 'react';
import { authAPI } from '../services/api';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      await authAPI.register(username, password, email);
      setSuccess('Usuário criado! Verifique seu e-mail para confirmar o cadastro.');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setEmail('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px #0001' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Criar Conta</h2>
      <input
        type="text"
        placeholder="Usuário"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 12, padding: 8 }}
      />
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 12, padding: 8 }}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 12, padding: 8 }}
      />
      <input
        type="password"
        placeholder="Confirme a senha"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 20, padding: 8 }}
      />
      <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600 }}>
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
      {error && <div style={{color: 'red', marginTop: 16}}>{error}</div>}
      {success && <div style={{color: 'green', marginTop: 16}}>{success}</div>}
    </form>
  );
};

export default Register;
