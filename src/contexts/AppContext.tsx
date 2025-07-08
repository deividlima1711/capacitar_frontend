import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppState, User, Processo, Tarefa, Notificacao, Estatisticas } from '../types';
import { authAPI } from '../services/api';

interface AppContextType extends AppState {
  setUser: (user: User | null) => void;
  addProcesso: (processo: Omit<Processo, 'id' | 'criadoEm' | 'atualizadoEm'>) => Processo;
  updateProcesso: (id: string, updates: Partial<Processo>) => void;
  deleteProcesso: (id: string) => void;
  addTarefa: (tarefa: Omit<Tarefa, 'id' | 'criadoEm' | 'atualizadoEm'>) => void;
  updateTarefa: (id: string, updates: Partial<Tarefa>) => void;
  deleteTarefa: (id: string) => void;
  addUsuario: (usuario: Omit<User, 'id' | 'criadoEm'>) => void;
  updateUsuario: (id: number, updates: Partial<User>) => void;
  deleteUsuario: (id: number) => void;
  markNotificationAsRead: (id: number) => void;
  addNotification: (notification: Omit<Notificacao, 'id' | 'criadoEm'>) => void;
  updateEstatisticas: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_PROCESSO'; payload: Processo }
  | { type: 'UPDATE_PROCESSO'; payload: { id: string; updates: Partial<Processo> } }
  | { type: 'DELETE_PROCESSO'; payload: string }
  | { type: 'ADD_TAREFA'; payload: Tarefa }
  | { type: 'UPDATE_TAREFA'; payload: { id: string; updates: Partial<Tarefa> } }
  | { type: 'DELETE_TAREFA'; payload: string }
  | { type: 'ADD_USUARIO'; payload: User }
  | { type: 'UPDATE_USUARIO'; payload: { id: number; updates: Partial<User> } }
  | { type: 'DELETE_USUARIO'; payload: number }
  | { type: 'ADD_NOTIFICATION'; payload: Notificacao }
  | { type: 'MARK_NOTIFICATION_READ'; payload: number }
  | { type: 'UPDATE_ESTATISTICAS'; payload: Estatisticas }
  | { type: 'LOAD_DATA'; payload: Partial<AppState> };

const initialState: AppState = {
  user: null,
  processos: [],
  tarefas: [],
  usuarios: [],
  notificacoes: [],
  modelosProcessos: [],
  estatisticas: {
    processosAtivos: 0,
    tarefasPendentes: 0,
    tempoMedio: '0h',
    processosAtrasados: 0,
    tendencias: {
      processosAtivos: 0,
      tarefasPendentes: 0,
      tempoMedio: 0,
      processosAtrasados: 0,
    },
  },
  loading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_PROCESSO':
      return { ...state, processos: [...state.processos, action.payload] };
    case 'UPDATE_PROCESSO':
      return {
        ...state,
        processos: state.processos.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        ),
      };
    case 'DELETE_PROCESSO':
      return {
        ...state,
        processos: state.processos.filter(p => p.id !== action.payload),
      };
    case 'ADD_TAREFA':
      return { ...state, tarefas: [...state.tarefas, action.payload] };
    case 'UPDATE_TAREFA':
      return {
        ...state,
        tarefas: state.tarefas.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
        ),
      };
    case 'DELETE_TAREFA':
      return {
        ...state,
        tarefas: state.tarefas.filter(t => t.id !== action.payload),
      };
    case 'ADD_USUARIO':
      return { ...state, usuarios: [...state.usuarios, action.payload] };
    case 'UPDATE_USUARIO':
      return {
        ...state,
        usuarios: state.usuarios.map(u =>
          u.id === action.payload.id ? { ...u, ...action.payload.updates } : u
        ),
      };
    case 'DELETE_USUARIO':
      return {
        ...state,
        usuarios: state.usuarios.filter(u => u.id !== action.payload),
      };
    case 'ADD_NOTIFICATION':
      return { ...state, notificacoes: [...state.notificacoes, action.payload] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notificacoes: state.notificacoes.map(n =>
          n.id === action.payload ? { ...n, lida: true } : n
        ),
      };
    case 'UPDATE_ESTATISTICAS':
      return { ...state, estatisticas: action.payload };
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const loadData = () => {
      try {
        const savedProcessos = localStorage.getItem('pf_processos');
        const savedTarefas = localStorage.getItem('pf_tarefas');
        const savedUsuarios = localStorage.getItem('pf_usuarios');
        const savedNotificacoes = localStorage.getItem('pf_notificacoes');

        const data: Partial<AppState> = {};
        if (savedProcessos) data.processos = JSON.parse(savedProcessos);
        if (savedTarefas) data.tarefas = JSON.parse(savedTarefas);
        if (savedUsuarios) data.usuarios = JSON.parse(savedUsuarios);
        if (savedNotificacoes) data.notificacoes = JSON.parse(savedNotificacoes);

        dispatch({ type: 'LOAD_DATA', payload: data });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    loadData();
  }, []);

  const saveToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  };

  const calculateEstatisticas = (): Estatisticas => {
    const processosAtivos = state.processos.filter(p => p.status === 'em-andamento').length;
    const tarefasPendentes = state.tarefas.filter(t => t.status === 'pendente').length;
    const processosAtrasados = state.processos.filter(p => {
      if (!p.prazo || p.status === 'concluido') return false;
      try {
        const prazo = new Date(p.prazo);
        const hoje = new Date();
        return prazo < hoje;
      } catch (error) {
        console.warn('Data inválida encontrada:', p.prazo);
        return false;
      }
    }).length;

    const tarefasConcluidas = state.tarefas.filter(t => t.status === 'concluido');
    let tempoMedio = '0h';
    if (tarefasConcluidas.length > 0) {
      const totalHoras = tarefasConcluidas.reduce((acc, t) => acc + (t.horasGastas || 0), 0);
      const media = totalHoras / tarefasConcluidas.length;
      tempoMedio = `${Math.round(media)}h`;
    }

    return {
      processosAtivos,
      tarefasPendentes,
      tempoMedio,
      processosAtrasados,
      tendencias: {
        processosAtivos: 5,
        tarefasPendentes: -3,
        tempoMedio: 2,
        processosAtrasados: -1,
      },
    };
  };

  const contextValue: AppContextType = {
    ...state,
    setUser: (user) => dispatch({ type: 'SET_USER', payload: user }),
    addProcesso: (processoData) => {
      const processo: Processo = {
        ...processoData,
        id: uuidv4(),
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_PROCESSO', payload: processo });
      saveToStorage('pf_processos', [...state.processos, processo]);
      return processo;
    },
    updateProcesso: (id, updates) => {
      const updated = { ...updates, atualizadoEm: new Date().toISOString() };
      dispatch({ type: 'UPDATE_PROCESSO', payload: { id, updates: updated } });
      const newList = state.processos.map(p => (p.id === id ? { ...p, ...updated } : p));
      saveToStorage('pf_processos', newList);
    },
    deleteProcesso: (id) => {
      // Exclui o processo
      dispatch({ type: 'DELETE_PROCESSO', payload: id });
      saveToStorage('pf_processos', state.processos.filter(p => p.id !== id));
      // Exclui todas as tarefas relacionadas a esse processo
      const tarefasRestantes = state.tarefas.filter(t => t.processoId !== id);
      dispatch({ type: 'LOAD_DATA', payload: { tarefas: tarefasRestantes } });
      saveToStorage('pf_tarefas', tarefasRestantes);
    },
    addTarefa: (tarefaData) => {
      const tarefa: Tarefa = {
        ...tarefaData,
        id: uuidv4(),
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_TAREFA', payload: tarefa });
      saveToStorage('pf_tarefas', [...state.tarefas, tarefa]);
    },
    updateTarefa: (id, updates) => {
      const updated = { ...updates, atualizadoEm: new Date().toISOString() };
      dispatch({ type: 'UPDATE_TAREFA', payload: { id, updates: updated } });
      const newList = state.tarefas.map(t => (t.id === id ? { ...t, ...updated } : t));
      saveToStorage('pf_tarefas', newList);
    },
    deleteTarefa: (id) => {
      dispatch({ type: 'DELETE_TAREFA', payload: id });
      saveToStorage('pf_tarefas', state.tarefas.filter(t => t.id !== id));
    },
    addUsuario: async (usuarioData) => {
      try {
        // Chama o backend para criar o usuário
        const response = await authAPI.register(
          usuarioData.username,
          '123456', // senha padrão temporária
          usuarioData.email
        );
        // Atualiza a lista de usuários buscando do backend
        const usuarios = await authAPI.getUsers();
        dispatch({ type: 'LOAD_DATA', payload: { usuarios } });
      } catch (error) {
        console.error('Erro ao criar usuário via API:', error);
      }
    },
    updateUsuario: (id, updates) => {
      dispatch({ type: 'UPDATE_USUARIO', payload: { id, updates } });
      saveToStorage('pf_usuarios', state.usuarios.map(u => (u.id === id ? { ...u, ...updates } : u)));
    },
    deleteUsuario: (id) => {
      dispatch({ type: 'DELETE_USUARIO', payload: id });
      saveToStorage('pf_usuarios', state.usuarios.filter(u => u.id !== id));
    },
    markNotificationAsRead: (id) => {
      dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
      saveToStorage('pf_notificacoes', state.notificacoes.map(n => (n.id === id ? { ...n, lida: true } : n)));
    },
    addNotification: (notificationData) => {
      const notification: Notificacao = {
        ...notificationData,
        id: Date.now(),
        criadoEm: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      saveToStorage('pf_notificacoes', [...state.notificacoes, notification]);
    },
    updateEstatisticas: () => {
      const estatisticas = calculateEstatisticas();
      dispatch({ type: 'UPDATE_ESTATISTICAS', payload: estatisticas });
    },
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};
