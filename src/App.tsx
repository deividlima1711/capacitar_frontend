import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Login from './components/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import Processos from './components/Processos/Processos';
import Tarefas from './components/Tarefas/Tarefas';
import Equipe from './components/Equipe/Equipe';
import Relatorios from './components/Relatorios/Relatorios';
import ModelosProcessos from './components/ModelosProcessos/ModelosProcessos';
import Register from './components/Register';
import { User } from './types';
import './App.css';

const Configuracoes: React.FC = () => (
  <div className="section-placeholder">
    <h1>Configurações</h1>
    <p>Seção de configurações em desenvolvimento...</p>
  </div>
);

const AppContent: React.FC = () => {
  const { user, setUser } = useApp();
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [showRegister, setShowRegister] = useState(false);

  // Verificar se há usuário logado ao inicializar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken && !user) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Erro ao recuperar dados do usuário:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, [user, setUser]);

  const handleLoginSuccess = (userData: User, userToken: string) => {
    setUser(userData);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentSection('dashboard');
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'processos':
        return <Processos />;
      case 'tarefas':
        return <Tarefas />;
      case 'equipe':
        return <Equipe />;
      case 'relatorios':
        return <Relatorios />;
      case 'modelos-processos':
        return <ModelosProcessos />;
      case 'configuracoes':
        return <Configuracoes />;
      default:
        return <Dashboard />;
    }
  };

  if (!user) {
    if (showRegister) {
      return (
        <>
          <Register />
          <div style={{textAlign: 'center', marginTop: 16}}>
            <button onClick={() => setShowRegister(false)} style={{color: '#1976d2', background: 'none', border: 'none', cursor: 'pointer'}}>Já tem conta? Entrar</button>
          </div>
        </>
      );
    }
    return (
      <>
        <Login onLoginSuccess={handleLoginSuccess} />
        <div style={{textAlign: 'center', marginTop: 16}}>
          <button onClick={() => setShowRegister(true)} style={{color: '#1976d2', background: 'none', border: 'none', cursor: 'pointer'}}>Criar nova conta</button>
        </div>
      </>
    );
  }

  return (
    <Layout
      user={user}
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      onLogout={handleLogout}
    >
      {renderCurrentSection()}
    </Layout>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento inicial
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Carregando ProcessFlow...</p>
        </div>
      </div>
    );
  }

  return (
    <AppProvider>
      <div className="App">
        <AppContent />
      </div>
    </AppProvider>
  );
}

export default App;

