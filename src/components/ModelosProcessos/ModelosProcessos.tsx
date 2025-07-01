import React, { useState, useEffect } from 'react';
import { ModeloProcesso } from '../../types';
import ModelosList from './ModelosList';
import ModeloForm from './ModeloForm';
import ModeloDetails from './ModeloDetails';
import './ModelosProcessos.css';

const ModelosProcessos: React.FC = () => {
  const [modelos, setModelos] = useState<ModeloProcesso[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'form' | 'details'>('list');
  const [selectedModelo, setSelectedModelo] = useState<ModeloProcesso | null>(null);
  const [editingModelo, setEditingModelo] = useState<ModeloProcesso | null>(null);
  const [loading, setLoading] = useState(false);

  // Carregar modelos do localStorage
  useEffect(() => {
    const loadModelos = () => {
      try {
        const savedModelos = localStorage.getItem('pf_modelos_processos');
        if (savedModelos) {
          setModelos(JSON.parse(savedModelos));
        } else {
          // Dados mock para demonstração (apenas na primeira vez)
          const mockModelos: ModeloProcesso[] = [
            {
              id: 1,
              nome: 'Implantação de nova unidade',
              ativo: true,
              criadoPor: 'Pâmela Leite',
              dataCriacao: '2023-11-23T11:50:00',
              ultimaEdicaoPor: 'Pâmela Leite',
              dataUltimaEdicao: '2023-11-23T11:59:00',
              totalAtividades: 6,
              atividades: [
                {
                  id: 1,
                  nome: 'Assinatura do pré-contrato',
                  ordem: 1,
                  cargosExecutores: ['Coordenador Pedagógico'],
                  usuariosAdicionais: [],
                  descricao: 'Processo de assinatura do pré-contrato com a franqueadora'
                },
                {
                  id: 2,
                  nome: 'Fase de planejamento - Reuniões',
                  ordem: 2,
                  cargosExecutores: ['Coordenador Pedagógico'],
                  usuariosAdicionais: [],
                  descricao: 'Reuniões de planejamento para definir estratégias'
                },
                {
                  id: 3,
                  nome: 'Definição da constituição societária da empresa',
                  ordem: 3,
                  cargosExecutores: ['Coordenador Pedagógico'],
                  usuariosAdicionais: [],
                  descricao: 'Definir estrutura societária da nova unidade'
                },
                {
                  id: 4,
                  nome: 'Aprovação da constituição societária pela franqueadora',
                  ordem: 4,
                  cargosExecutores: ['Coordenador Pedagógico'],
                  usuariosAdicionais: [],
                  descricao: 'Submeter para aprovação da franqueadora'
                },
                {
                  id: 5,
                  nome: 'Contratação de escritório de contabilidade',
                  ordem: 5,
                  cargosExecutores: ['Coordenador Pedagógico'],
                  usuariosAdicionais: [],
                  descricao: 'Contratar serviços contábeis para a nova unidade'
                },
                {
                  id: 6,
                  nome: 'Assinatura de Contrato Social e entrada na Junta Comercial',
                  ordem: 6,
                  cargosExecutores: ['Coordenador Pedagógico'],
                  usuariosAdicionais: [],
                  descricao: 'Formalização legal da empresa'
                }
              ]
            }
          ];
          setModelos(mockModelos);
          localStorage.setItem('pf_modelos_processos', JSON.stringify(mockModelos));
        }
      } catch (error) {
        console.error('Erro ao carregar modelos:', error);
      }
    };

    loadModelos();
  }, []);

  // Salvar modelos no localStorage sempre que houver mudanças
  const saveModelos = (newModelos: ModeloProcesso[]) => {
    try {
      localStorage.setItem('pf_modelos_processos', JSON.stringify(newModelos));
      setModelos(newModelos);
    } catch (error) {
      console.error('Erro ao salvar modelos:', error);
    }
  };

  const handleCreateModelo = () => {
    setEditingModelo(null);
    setCurrentView('form');
  };

  const handleEditModelo = (modelo: ModeloProcesso) => {
    setEditingModelo(modelo);
    setCurrentView('form');
  };

  const handleViewModelo = (modelo: ModeloProcesso) => {
    setSelectedModelo(modelo);
    setCurrentView('details');
  };

  const handleSaveModelo = (modelo: Omit<ModeloProcesso, 'id' | 'dataCriacao' | 'dataUltimaEdicao'>) => {
    setLoading(true);
    
    setTimeout(() => {
      let newModelos: ModeloProcesso[];
      
      if (editingModelo) {
        // Editar modelo existente
        const updatedModelo: ModeloProcesso = {
          ...editingModelo,
          ...modelo,
          dataUltimaEdicao: new Date().toISOString(),
          totalAtividades: modelo.atividades.length
        };
        newModelos = modelos.map(m => m.id === editingModelo.id ? updatedModelo : m);
      } else {
        // Criar novo modelo
        const newModelo: ModeloProcesso = {
          ...modelo,
          id: Date.now(),
          dataCriacao: new Date().toISOString(),
          dataUltimaEdicao: new Date().toISOString(),
          totalAtividades: modelo.atividades.length
        };
        newModelos = [...modelos, newModelo];
      }
      
      saveModelos(newModelos);
      setCurrentView('list');
      setEditingModelo(null);
      setLoading(false);
    }, 1000);
  };

  const handleDeleteModelo = (id: number) => {
    if (window.confirm('Tem certeza que deseja remover este modelo?')) {
      const newModelos = modelos.filter(m => m.id !== id);
      saveModelos(newModelos);
      
      if (selectedModelo?.id === id) {
        setCurrentView('list');
        setSelectedModelo(null);
      }
    }
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedModelo(null);
    setEditingModelo(null);
  };

  return (
    <div className="modelos-processos">
      <div className="modelos-header">
        <h1>Modelos de Processos</h1>
        <p>Gerencie modelos reutilizáveis para seus processos</p>
      </div>

      {currentView === 'list' && (
        <ModelosList
          modelos={modelos}
          onCreateModelo={handleCreateModelo}
          onEditModelo={handleEditModelo}
          onViewModelo={handleViewModelo}
          onDeleteModelo={handleDeleteModelo}
        />
      )}

      {currentView === 'form' && (
        <ModeloForm
          modelo={editingModelo}
          onSave={handleSaveModelo}
          onCancel={handleBackToList}
          loading={loading}
        />
      )}

      {currentView === 'details' && selectedModelo && (
        <ModeloDetails
          modelo={selectedModelo}
          onEdit={() => handleEditModelo(selectedModelo)}
          onDelete={() => handleDeleteModelo(selectedModelo.id)}
          onBack={handleBackToList}
        />
      )}
    </div>
  );
};

export default ModelosProcessos;

