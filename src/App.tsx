/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ViewType, ExplanationLevel, ProjectWorkspace } from './types';
import { MOCK_PROJECTS } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { UploadModal } from './components/UploadModal';
import { VisionGeneral } from './views/VisionGeneral';
import { ModeloDatosBD } from './views/ModeloDatosBD';
import { HistorialConsultas } from './views/HistorialConsultas';
import { Proyectos } from './views/Proyectos';
import { RiesgosValidacion } from './views/RiesgosValidacion';
import { ChatAsistenteIA } from './views/ChatAsistenteIA';
import { DiagramasC4UML } from './views/DiagramasC4UML';
import { ArquitecturaModulos } from './views/ArquitecturaModulos';
import { CasosDeUso } from './views/CasosDeUso';
import { AuditorDeudaTecnica } from './views/AuditorDeudaTecnica';
import { GeneradorDocumentacion } from './views/GeneradorDocumentacion';
import { RepositoriosAnalizados } from './views/RepositoriosAnalizados';

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('vision-general');
  const [projects, setProjects] = useState<ProjectWorkspace[]>(MOCK_PROJECTS);
  const [activeProject, setActiveProject] = useState<ProjectWorkspace>(MOCK_PROJECTS[0]);
  const [explanationLevel, setExplanationLevel] = useState<ExplanationLevel>('intermedio');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>(undefined);

  const handleAddProject = (newProject: ProjectWorkspace) => {
    setProjects((prev) => [newProject, ...prev]);
    setActiveProject(newProject);
    setActiveView('vision-general');
  };

  const handleSendToChat = (prompt?: string) => {
    setChatInitialPrompt(prompt);
    setActiveView('chat-asistente-ia');
  };

  const handleSelectView = (view: ViewType) => {
    if (view !== 'chat-asistente-ia') {
      setChatInitialPrompt(undefined);
    }
    setActiveView(view);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#060807] text-[#e2e8f0]">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar 
        activeView={activeView} 
        onSelectView={handleSelectView} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          projects={projects}
          activeProject={activeProject}
          onSelectProject={setActiveProject}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
          explanationLevel={explanationLevel}
          onChangeLevel={setExplanationLevel}
        />

        {/* View Router */}
        <main className="flex-1 overflow-y-auto">
          {activeView === 'vision-general' && (
            <VisionGeneral
              project={activeProject}
              level={explanationLevel}
              onNavigate={handleSelectView}
              onSendToChat={handleSendToChat}
            />
          )}

          {activeView === 'modelo-datos-bd' && (
            <ModeloDatosBD
              level={explanationLevel}
              onNavigate={handleSelectView}
            />
          )}

          {activeView === 'historial-consultas' && (
            <HistorialConsultas
              level={explanationLevel}
              onNavigateToChat={handleSendToChat}
            />
          )}

          {activeView === 'proyectos' && (
            <Proyectos
              projects={projects}
              activeProject={activeProject}
              onSelectProject={setActiveProject}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
              onNavigateToView={handleSelectView}
            />
          )}

          {activeView === 'riesgos-validacion' && (
            <RiesgosValidacion
              level={explanationLevel}
            />
          )}

          {activeView === 'chat-asistente-ia' && (
            <ChatAsistenteIA
              project={activeProject}
              initialPrompt={chatInitialPrompt}
              level={explanationLevel}
              onChangeLevel={setExplanationLevel}
            />
          )}

          {activeView === 'diagramas-c4-uml' && (
            <DiagramasC4UML
              project={activeProject}
              level={explanationLevel}
            />
          )}

          {activeView === 'arquitectura-modulos' && (
            <ArquitecturaModulos
              project={activeProject}
              level={explanationLevel}
            />
          )}

          {activeView === 'casos-de-uso-requerimientos' && (
            <CasosDeUso
              level={explanationLevel}
            />
          )}

          {activeView === 'auditor-deuda-tecnica' && (
            <AuditorDeudaTecnica
              project={activeProject}
              level={explanationLevel}
            />
          )}

          {activeView === 'generador-documentacion' && (
            <GeneradorDocumentacion
              project={activeProject}
              level={explanationLevel}
            />
          )}

          {activeView === 'repositorios-analizados' && (
            <RepositoriosAnalizados
              project={activeProject}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
              level={explanationLevel}
            />
          )}
        </main>
      </div>

      {/* Interactive Git Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAddProject={handleAddProject}
      />
    </div>
  );
}
