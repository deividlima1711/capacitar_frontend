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

      {modelos.length === 0 ? (
        <div style={{ padding: 32, textAlign: 'center', color: '#888' }}>
          Nenhum modelo de processo disponível. Aguarde integração com backend.
        </div>
      ) : (
        currentView === 'list' && (
          <ModelosList
            modelos={modelos}
            onCreateModelo={handleCreateModelo}
            onEditModelo={handleEditModelo}
            onViewModelo={handleViewModelo}
            onDeleteModelo={handleDeleteModelo}
          />
        )
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

