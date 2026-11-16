import React from 'react';
import { 
  FolderKanban, 
  GitBranch, 
  History, 
  LayoutDashboard, 
  Layers, 
  Network, 
  Database, 
  FileCheck2, 
  ShieldAlert, 
  Sparkles, 
  FileText, 
  Wrench,
  Terminal,
  ChevronLeft
} from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  activeView: ViewType;
  onSelectView: (view: ViewType) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  collapsed = false,
  onToggleCollapse
}) => {
  const exploreItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
    { id: 'proyectos', label: 'Proyectos', icon: <FolderKanban className="w-4 h-4" /> },
    { id: 'repositorios-analizados', label: 'Repositorios Analizados', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'historial-consultas', label: 'Historial de Consultas', icon: <History className="w-4 h-4" /> },
  ];

  const analysisItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
    { id: 'vision-general', label: 'Visión General', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'arquitectura-modulos', label: 'Arquitectura & Módulos', icon: <Layers className="w-4 h-4" /> },
    { id: 'diagramas-c4-uml', label: 'Diagramas C4 & UML', icon: <Network className="w-4 h-4" /> },
    { id: 'modelo-datos-bd', label: 'Modelo de Datos / BD', icon: <Database className="w-4 h-4" /> },
    { id: 'casos-de-uso-requerimientos', label: 'Casos de Uso & Requerimientos', icon: <FileCheck2 className="w-4 h-4" /> },
    { id: 'riesgos-validacion', label: 'Riesgos & Validación', icon: <ShieldAlert className="w-4 h-4" /> },
  ];

  const aiItems: { id: ViewType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'chat-asistente-ia', label: 'Chat con Asistente IA', icon: <Sparkles className="w-4 h-4" />, badge: 'Gemini' },
    { id: 'generador-documentacion', label: 'Generador de Documentación', icon: <FileText className="w-4 h-4" /> },
    { id: 'auditor-deuda-tecnica', label: 'Auditor de Deuda Técnica', icon: <Wrench className="w-4 h-4" /> },
  ];

  const renderNavButton = (item: { id: ViewType; label: string; icon: React.ReactNode; badge?: string }) => {
    const isActive = activeView === item.id;
    return (
      <button
        key={item.id}
        onClick={() => onSelectView(item.id)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 group cursor-pointer ${
          isActive 
            ? 'bg-[#122419] text-[#00FF87] border border-[#00FF87]/30 shadow-[0_0_15px_-4px_rgba(0,255,135,0.25)]' 
            : 'text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#0e1612]'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <span className={`transition-colors ${isActive ? 'text-[#00FF87]' : 'text-[#64748b] group-hover:text-[#94a3b8]'}`}>
            {item.icon}
          </span>
          <span className="truncate">{item.label}</span>
        </div>
        {item.badge ? (
          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold bg-[#00FF87]/10 text-[#00FF87] border border-[#00FF87]/30">
            {item.badge}
          </span>
        ) : isActive ? (
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] shadow-[0_0_6px_#00FF87]" />
        ) : null}
      </button>
    );
  };

  return (
    <aside className="w-64 min-w-[16rem] bg-[#070b09] border-r border-[#15201a] flex flex-col h-screen select-none z-20">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#15201a] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00FF87] to-[#0b3b24] p-[1px] shadow-[0_0_12px_rgba(0,255,135,0.3)]">
            <div className="w-full h-full bg-[#060907] rounded-[7px] flex items-center justify-center">
              <Terminal className="w-4 h-4 text-[#00FF87]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-mono font-bold tracking-tight text-sm text-white flex items-center">
                CODE<span className="text-[#00FF87]">EXPLAIN</span>
              </h1>
            </div>
            <div className="flex items-center gap-1 text-[9px] font-mono text-[#00FF87] tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-pulse" />
              AI CORE V2.4
            </div>
          </div>
        </div>

        {onToggleCollapse && (
          <button 
            onClick={onToggleCollapse} 
            className="text-[#64748b] hover:text-[#94a3b8] p-1 rounded hover:bg-[#101914] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* EXPLORAR */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#475569] font-semibold">
            <span>Explorar</span>
            <span className="text-[9px]">03</span>
          </div>
          <div className="space-y-1">
            {exploreItems.map(renderNavButton)}
          </div>
        </div>

        {/* ANÁLISIS DE SISTEMAS */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#475569] font-semibold">
            <span>Análisis de Sistemas</span>
            <span className="text-[9px]">06</span>
          </div>
          <div className="space-y-1">
            {analysisItems.map(renderNavButton)}
          </div>
        </div>

        {/* HERRAMIENTAS IA */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#475569] font-semibold">
            <span>Herramientas IA</span>
            <span className="text-[9px]">03</span>
          </div>
          <div className="space-y-1">
            {aiItems.map(renderNavButton)}
          </div>
        </div>
      </div>

      {/* Bottom Token Quota Footer */}
      <div className="p-3 border-t border-[#15201a] bg-[#060907]">
        <div className="p-2.5 rounded-lg bg-[#0b120e] border border-[#18271e]">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-[#94a3b8] font-medium">Cuota de Tokens</span>
            <span className="font-mono text-[#00FF87] font-semibold text-xs">68%</span>
          </div>
          <div className="w-full bg-[#121c16] rounded-full h-1.5 overflow-hidden mb-1.5">
            <div 
              className="bg-gradient-to-r from-[#00FF87] to-[#4edea3] h-full rounded-full shadow-[0_0_8px_#00FF87]"
              style={{ width: '68%' }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-[#64748b]">
            <span>682,410 / 1.0M</span>
            <span className="text-[#00FF87]/80">ACTIVO</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
