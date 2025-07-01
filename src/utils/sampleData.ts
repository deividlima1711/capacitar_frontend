import { User, Processo, Tarefa } from '../types';

// Dados de exemplo para popular o sistema
export const sampleUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    nome: 'Administrador',
    email: 'admin@processflow.com',
    role: 'admin',
    cargo: 'Administrador do Sistema',
    departamento: 'TI',
    tipoUsuario: 'Gestor',
    criadoEm: new Date().toISOString(),
  },
  {
    id: 2,
    username: 'joao.silva',
    nome: 'João Silva',
    email: 'joao.silva@processflow.com',
    role: 'user',
    cargo: 'Desenvolvedor Senior',
    departamento: 'Desenvolvimento',
    tipoUsuario: 'Comum',
    criadoEm: new Date().toISOString(),
  },
  {
    id: 3,
    username: 'maria.santos',
    nome: 'Maria Santos',
    email: 'maria.santos@processflow.com',
    role: 'user',
    cargo: 'Gerente de Projetos',
    departamento: 'Projetos',
    tipoUsuario: 'Gestor',
    criadoEm: new Date().toISOString(),
  },
  {
    id: 4,
    username: 'pedro.oliveira',
    nome: 'Pedro Oliveira',
    email: 'pedro.oliveira@processflow.com',
    role: 'user',
    cargo: 'Designer UX/UI',
    departamento: 'Design',
    tipoUsuario: 'Comum',
    criadoEm: new Date().toISOString(),
  },
];

export const sampleProcessos: Processo[] = [
  {
    id: 'proc-1',
    titulo: 'Desenvolvimento do Sistema de Vendas',
    descricao: 'Criar um sistema completo de vendas online com integração de pagamentos e gestão de estoque.',
    status: 'em-andamento',
    prioridade: 'alta',
    responsavelId: 2,
    dataInicio: '2024-01-15T00:00:00.000Z',
    prazo: '2024-03-15T00:00:00.000Z',
    progresso: 65,
    categoria: 'Desenvolvimento',
    tags: ['sistema', 'vendas', 'e-commerce'],
    criadoEm: '2024-01-15T00:00:00.000Z',
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: 'proc-2',
    titulo: 'Redesign da Interface do Dashboard',
    descricao: 'Modernizar a interface do dashboard principal com foco na experiência do usuário.',
    status: 'pendente',
    prioridade: 'media',
    responsavelId: 4,
    dataInicio: '2024-02-01T00:00:00.000Z',
    prazo: '2024-02-28T00:00:00.000Z',
    progresso: 25,
    categoria: 'Design',
    tags: ['ui', 'ux', 'dashboard'],
    criadoEm: '2024-02-01T00:00:00.000Z',
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: 'proc-3',
    titulo: 'Implementação do Sistema de Relatórios',
    descricao: 'Desenvolver módulo de relatórios com gráficos interativos e exportação em PDF.',
    status: 'concluido',
    prioridade: 'baixa',
    responsavelId: 2,
    dataInicio: '2023-12-01T00:00:00.000Z',
    dataFim: '2024-01-10T00:00:00.000Z',
    prazo: '2024-01-15T00:00:00.000Z',
    progresso: 100,
    categoria: 'Desenvolvimento',
    tags: ['relatórios', 'gráficos', 'pdf'],
    criadoEm: '2023-12-01T00:00:00.000Z',
    atualizadoEm: '2024-01-10T00:00:00.000Z',
  },
  {
    id: 'proc-4',
    titulo: 'Migração para Nova Infraestrutura',
    descricao: 'Migrar todos os serviços para a nova infraestrutura em nuvem.',
    status: 'atrasado',
    prioridade: 'critica',
    responsavelId: 1,
    dataInicio: '2024-01-01T00:00:00.000Z',
    prazo: '2024-01-31T00:00:00.000Z',
    progresso: 40,
    categoria: 'Infraestrutura',
    tags: ['migração', 'nuvem', 'infraestrutura'],
    criadoEm: '2024-01-01T00:00:00.000Z',
    atualizadoEm: new Date().toISOString(),
  },
];

export const sampleTarefas: Tarefa[] = [
  {
    id: 'task-1',
    titulo: 'Configurar banco de dados',
    descricao: 'Configurar e otimizar o banco de dados PostgreSQL para o sistema de vendas.',
    status: 'concluido',
    prioridade: 'alta',
    responsavelId: 2,
    processoId: 'proc-1',
    dataInicio: '2024-01-15T00:00:00.000Z',
    dataFim: '2024-01-18T00:00:00.000Z',
    prazo: '2024-01-20T00:00:00.000Z',
    progresso: 100,
    estimativaHoras: 16,
    horasGastas: 14,
    tags: ['database', 'postgresql'],
    criadoEm: '2024-01-15T00:00:00.000Z',
    atualizadoEm: '2024-01-18T00:00:00.000Z',
  },
  {
    id: 'task-2',
    titulo: 'Desenvolver API de produtos',
    descricao: 'Criar endpoints REST para gerenciamento de produtos no sistema.',
    status: 'em-andamento',
    prioridade: 'alta',
    responsavelId: 2,
    processoId: 'proc-1',
    dataInicio: '2024-01-20T00:00:00.000Z',
    prazo: '2024-02-05T00:00:00.000Z',
    progresso: 70,
    estimativaHoras: 24,
    horasGastas: 18,
    tags: ['api', 'rest', 'produtos'],
    criadoEm: '2024-01-20T00:00:00.000Z',
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: 'task-3',
    titulo: 'Criar wireframes do dashboard',
    descricao: 'Desenvolver wireframes de baixa fidelidade para o novo dashboard.',
    status: 'pendente',
    prioridade: 'media',
    responsavelId: 4,
    processoId: 'proc-2',
    dataInicio: '2024-02-01T00:00:00.000Z',
    prazo: '2024-02-10T00:00:00.000Z',
    progresso: 0,
    estimativaHoras: 12,
    horasGastas: 0,
    tags: ['wireframes', 'design'],
    criadoEm: '2024-02-01T00:00:00.000Z',
    atualizadoEm: '2024-02-01T00:00:00.000Z',
  },
  {
    id: 'task-4',
    titulo: 'Implementar autenticação JWT',
    descricao: 'Desenvolver sistema de autenticação usando JSON Web Tokens.',
    status: 'pendente',
    prioridade: 'alta',
    responsavelId: 2,
    processoId: 'proc-1',
    dataInicio: '2024-02-06T00:00:00.000Z',
    prazo: '2024-02-15T00:00:00.000Z',
    progresso: 0,
    estimativaHoras: 20,
    horasGastas: 0,
    tags: ['auth', 'jwt', 'segurança'],
    criadoEm: '2024-02-01T00:00:00.000Z',
    atualizadoEm: '2024-02-01T00:00:00.000Z',
  },
  {
    id: 'task-5',
    titulo: 'Configurar monitoramento',
    descricao: 'Implementar sistema de monitoramento e alertas para a infraestrutura.',
    status: 'atrasado',
    prioridade: 'critica',
    responsavelId: 1,
    processoId: 'proc-4',
    dataInicio: '2024-01-15T00:00:00.000Z',
    prazo: '2024-01-25T00:00:00.000Z',
    progresso: 30,
    estimativaHoras: 32,
    horasGastas: 12,
    tags: ['monitoramento', 'alertas'],
    criadoEm: '2024-01-15T00:00:00.000Z',
    atualizadoEm: new Date().toISOString(),
  },
];

// Função para inicializar dados de exemplo
export const initializeSampleData = () => {
  // Verificar se já existem dados
  const existingUsers = localStorage.getItem('pf_usuarios');
  const existingProcessos = localStorage.getItem('pf_processos');
  const existingTarefas = localStorage.getItem('pf_tarefas');

  // Se não existirem dados, criar dados de exemplo
  if (!existingUsers) {
    localStorage.setItem('pf_usuarios', JSON.stringify(sampleUsers));
  }

  if (!existingProcessos) {
    localStorage.setItem('pf_processos', JSON.stringify(sampleProcessos));
  }

  if (!existingTarefas) {
    localStorage.setItem('pf_tarefas', JSON.stringify(sampleTarefas));
  }

  // Configurar contadores
  const config = {
    nextUsuarioId: sampleUsers.length + 1,
    nextProcessoId: sampleProcessos.length + 1,
    nextTarefaId: sampleTarefas.length + 1,
  };
  
  if (!localStorage.getItem('pf_config')) {
    localStorage.setItem('pf_config', JSON.stringify(config));
  }
};

// Função para limpar todos os dados de processos e tarefas órfãs (tarefas sem processo).
export const clearOrphanTarefas = () => {
  const processos = JSON.parse(localStorage.getItem('pf_processos') || '[]');
  const tarefas = JSON.parse(localStorage.getItem('pf_tarefas') || '[]');
  const processoIds = processos.map((p: any) => p.id);
  const tarefasFiltradas = tarefas.filter((t: any) => !t.processoId || processoIds.includes(t.processoId));
  localStorage.setItem('pf_tarefas', JSON.stringify(tarefasFiltradas));
};

