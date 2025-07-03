import { useState, useMemo } from 'react';

// Definição mínima para Empresa (ajuste conforme seu projeto real)
type Empresa = { id: number; nome: string };

export interface FiltrosRelatorio {
  periodo: string;
  responsavel: string;
  status: string;
  setor: string;
  empresaId?: number;
}

export const useRelatorios = () => {
  const [filtros, setFiltros] = useState<FiltrosRelatorio>({
    periodo: 'todos',
    responsavel: 'todos',
    status: 'todos',
    setor: 'todos',
    empresaId: 1 // Default para primeira empresa
  });

  // Dados vazios temporários até integração real
  const emptyData = { processos: [], tarefas: [], usuarios: [] };
  const emptyEmpresas: Empresa[] = [];

  // Função para filtrar dados por empresa
  const filtrarDadosPorEmpresa = (empresaId: number) => {
    return emptyData;
  };

  // Dados filtrados baseados nos filtros atuais
  const dadosFiltrados = useMemo(() => emptyData, [filtros]);

  // Calcular métricas resumo
  const metricas = useMemo(() => ({
    processosEmAndamento: 0,
    processosConcluidos: 0,
    processosAtrasados: 0,
    tarefasConcluidas: 0,
    tarefasAtrasadas: 0,
    totalProcessos: 0,
    totalTarefas: 0
  }), [dadosFiltrados]);

  // Dados para gráficos
  const dadosGraficos = useMemo(() => ({
    statusDistribuicao: {
      labels: ['Em Andamento', 'Concluído', 'Atrasado', 'Pendente'],
      datasets: [{
        label: 'Processos por Status',
        data: [0, 0, 0, 0],
        backgroundColor: ['#3B82F6', '#10B981', '#EF4444', '#F59E0B']
      }]
    },
    tarefasPorUsuario: {
      labels: [],
      datasets: [{ label: 'Tarefas por Usuário', data: [], backgroundColor: '#3B82F6' }]
    },
    evolucaoMensal: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [{
        label: 'Processos Concluídos',
        data: [0, 0, 0, 0, 0, 0],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      }]
    }
  }), [dadosFiltrados]);

  // Função para limpar filtros
  const limparFiltros = () => {
    setFiltros({
      periodo: 'todos',
      responsavel: 'todos',
      status: 'todos',
      setor: 'todos',
      empresaId: 1
    });
  };

  return {
    filtros,
    setFiltros,
    limparFiltros,
    dadosFiltrados,
    metricas,
    dadosGraficos,
    empresas: emptyEmpresas,
    usuarios: [],
    filtrarDadosPorEmpresa
  };
};

