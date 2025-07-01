import React, { useState, useEffect } from 'react';
import { authAPI, generalAPI } from '../services/api';
import './Dashboard.css';

interface User {
  id: string;
  username: string;
  role: string;
  email: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [status, setStatus] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Carregar status do sistema
      const statusData = await generalAPI.getStatus();
      setStatus(statusData);

      // Se for admin, carregar lista de usuários
      if (user.role === 'admin') {
        try {
          const usersData = await authAPI.getUsers();
          setUsers(usersData.users || []);
        } catch (err) {
          console.log('Erro ao carregar usuários:', err);
        }
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🚀 ProcessFlow Dashboard</h1>
          <div className="user-info">
            <span>Olá, {user.username}!</span>
            <span className={`role-badge ${user.role}`}>{user.role}</span>
            <button onClick={handleLogout} className="logout-button">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">
          {/* Card de Boas-vindas */}
          <div className="card welcome-card">
            <h2>Bem-vindo ao ProcessFlow!</h2>
            <p>Sistema de gestão de processos funcionando perfeitamente.</p>
            <div className="user-details">
              <p><strong>Usuário:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email || 'Não informado'}</p>
              <p><strong>Perfil:</strong> {user.role}</p>
            </div>
          </div>

          {/* Card de Status do Sistema */}
          <div className="card status-card">
            <h3>📊 Status do Sistema</h3>
            {status && (
              <div className="status-info">
                <div className="status-item">
                  <span className="status-label">Status:</span>
                  <span className={`status-value ${status.status}`}>
                    {status.status}
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Banco:</span>
                  <span className="status-value">{status.database}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Usuários:</span>
                  <span className="status-value">{status.users}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Última atualização:</span>
                  <span className="status-value">
                    {new Date(status.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Card de Funcionalidades */}
          <div className="card features-card">
            <h3>⚡ Funcionalidades</h3>
            <ul className="features-list">
              <li>✅ Autenticação JWT</li>
              <li>✅ Controle de acesso por perfil</li>
              <li>✅ API RESTful</li>
              <li>✅ Interface responsiva</li>
              <li>✅ Banco de dados em memória</li>
              <li>🔄 CRUD de processos (em desenvolvimento)</li>
            </ul>
          </div>

          {/* Card de Usuários (apenas para admin) */}
          {user.role === 'admin' && (
            <div className="card users-card">
              <h3>👥 Usuários do Sistema</h3>
              {users.length > 0 ? (
                <div className="users-list">
                  {users.map((u) => (
                    <div key={u.id} className="user-item">
                      <div className="user-info-item">
                        <strong>{u.username}</strong>
                        <span className={`role-badge ${u.role}`}>{u.role}</span>
                      </div>
                      <div className="user-email">{u.email || 'Sem email'}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Nenhum usuário encontrado.</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

