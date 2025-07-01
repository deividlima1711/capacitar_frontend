import { useState, useMemo } from 'react';
import relatoriosData from '../data/mock/relatoriosData.json';

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

  // Função para filtrar dados por empresa
  const filtrarDadosPorEmpresa = (empresaId: number) => {
    return {
      processos: relatoriosData.processos.filter(p => p.empresaId === empresaId),
      tarefas: relatoriosData.tarefas.filter(t => t.empresaId === empresaId),
      usuarios: relatoriosData.usuarios.filter(u => u.empresaId === empresaId)
    };
  };

  // Dados filtrados baseados nos filtros atuais
  const dadosFiltrados = useMemo(() => {
    let { processos, tarefas, usuarios } = filtrarDadosPorEmpresa(filtros.empresaId || 1);

    // Aplicar filtros de período
    if (filtros.periodo !== 'todos') {
      const hoje = new Date();
      let dataLimite = new Date();
      
      switch (filtros.periodo) {
        case 'ultima-semana':
          dataLimite.setDate(hoje.getDate() - 7);
          break;
        case 'ultimo-mes':
          dataLimite.setMonth(hoje.getMonth() - 1);
          break;
        case 'ultimo-trimestre':
          dataLimite.setMonth(hoje.getMonth() - 3);
          break;
      }
      
      processos = processos.filter(p => new Date(p.dataInicio) >= dataLimite);
      tarefas = tarefas.filter(t => new Date(t.dataInicio) >= dataLimite);
    }

    // Aplicar filtro de responsável
    if (filtros.responsavel !== 'todos') {
      const responsavelId = parseInt(filtros.responsavel);
      processos = processos.filter(p => p.responsavelId === responsavelId);
      tarefas = tarefas.filter(t => t.responsavelId === responsavelId);
    }

    // Aplicar filtro de status
    if (filtros.status !== 'todos') {
      processos = processos.filter(p => p.status === filtros.status);
      tarefas = tarefas.filter(t => t.status === filtros.status);
    }

    // Aplicar filtro de setor
    if (filtros.setor !== 'todos') {
      processos = processos.filter(p => p.setor === filtros.setor);
      tarefas = tarefas.filter(t => t.setor === filtros.setor);
    }

    return { processos, tarefas, usuarios };
  }, [filtros]);

  // Calcular métricas resumo
  const metricas = useMemo(() => {
    const { processos, tarefas } = dadosFiltrados;
    
    return {
      processosEmAndamento: processos.filter(p => p.status === 'em-andamento').length,
      processosConcluidos: processos.filter(p => p.status === 'concluido').length,
      processosAtrasados: processos.filter(p => p.status === 'atrasado').length,
      tarefasConcluidas: tarefas.filter(t => t.status === 'concluido').length,
      tarefasAtrasadas: tarefas.filter(t => t.status === 'atrasado').length,
      totalProcessos: processos.length,
      totalTarefas: tarefas.length
    };
  }, [dadosFiltrados]);

  // Dados para gráficos
  const dadosGraficos = useMemo(() => {
    const { processos, tarefas, usuarios } = dadosFiltrados;

    // Gráfico de pizza - Distribuição de status dos processos
    const statusDistribuicao = {
      labels: ['Em Andamento', 'Concluído', 'Atrasado', 'Pendente'],
      datasets: [{
        label: 'Processos por Status',
        data: [
          processos.filter(p => p.status === 'em-andamento').length,
          processos.filter(p => p.status === 'concluido').length,
          processos.filter(p => p.status === 'atrasado').length,
          processos.filter(p => p.status === 'pendente').length
        ],
        backgroundColor: [
          '#3B82F6', // Azul
          '#10B981', // Verde
          '#EF4444', // Vermelho
          '#F59E0B'  // Amarelo
        ]
      }]
    };

    // Gráfico de barras - Volume de tarefas por usuário
    const tarefasPorUsuario = {
      labels: usuarios.map(u => u.nome),
      datasets: [{
        label: 'Tarefas por Usuário',
        data: usuarios.map(u => tarefas.filter(t => t.responsavelId === u.id).length),
        backgroundColor: '#3B82F6'
      }]
    };

    // Gráfico de linha - Evolução mensal (simulado)
    const evolucaoMensal = {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [{
        label: 'Processos Concluídos',
        data: [2, 4, 3, 5, 7, 6],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      }]
    };

    return {
      statusDistribuicao,
      tarefasPorUsuario,
      evolucaoMensal
    };
  }, [dadosFiltrados]);

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
    empresas: relatoriosData.empresas,
    usuarios: relatoriosData.usuarios,
    filtrarDadosPorEmpresa
  };
};

