import { User, Tarefa, Processo } from '../types';

// Arrays de dados mockados vazios, com tipagem explícita
export const sampleUsers: User[] = [];
export const sampleTarefas: Tarefa[] = [];
export const sampleProcessos: Processo[] = [];

// Inicializa arrays vazios e limpa dados antigos
export const initializeSampleData = () => {
  localStorage.removeItem('pf_usuarios');
  localStorage.removeItem('pf_tarefas');
  localStorage.removeItem('pf_processos');
  localStorage.removeItem('pf_config');

  localStorage.setItem('pf_usuarios', JSON.stringify([]));
  localStorage.setItem('pf_tarefas', JSON.stringify([]));
  localStorage.setItem('pf_processos', JSON.stringify([]));
  const config = {
    nextUsuarioId: 1,
    nextProcessoId: 1,
    nextTarefaId: 1,
  };
  localStorage.setItem('pf_config', JSON.stringify(config));
};

export const clearOrphanTarefas = () => {
  localStorage.setItem('pf_tarefas', JSON.stringify([]));
};

