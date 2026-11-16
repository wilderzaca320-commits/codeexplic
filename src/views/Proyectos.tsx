import React, { useState } from 'react';
import { 
  FolderKanban, 
  GitBranch, 
  Activity, 
  Clock, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowRight,
  Sparkles,
  Layers,
  Terminal,
  Cpu
} from 'lucide-react';
import { ProjectWorkspace } from '../types';

interface ProyectosProps {
  projects: ProjectWorkspace[];
  activeProject: ProjectWorkspace;
  onSelectProject: (p: ProjectWorkspace) => void;
  onOpenUploadModal: () => void;
  onNavigateToView: (view: any) => void;
}

export const Proyectos: React.FC<ProyectosProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onOpenUploadModal,
  onNavigateToView
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('todos');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.repoIdentifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.languages.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    if (filterTag === 'prod') return p.tag === 'PROD';
    if (filterTag === 'stage') return p.tag === 'STAGE';
    if (filterTag === 'micro') return p.reposCount >= 3;
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#15231b]">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-pulse" />
              GESTIÓN DE ESPACIOS DE TRABAJO • MOTOR AST V2.4
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Proyectos & Espacios de Ingeniería
          </h1>
          <p className="text-xs text-[#94a3b8] mt-1 max-w-3xl">
            Organiza tus arquitecturas de software, asigna equipos y supervisa el estado global de salud de código en múltiples repositorios.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0d1611] border border-[#1b2a20] text-xs text-[#94a3b8] hover:text-white transition-colors cursor-pointer">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtrar por Organización</span>
          </button>
          <button 
            onClick={onOpenUploadModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00FF87] hover:bg-[#00e076] text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(0,255,135,0.3)] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Nuevo Proyecto</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20]">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-[10px] font-mono uppercase">Total Proyectos</span>
            <FolderKanban className="w-4 h-4 text-[#00FF87]" />
          </div>
          <div className="text-2xl font-mono font-bold text-white mt-1">
            {projects.length} <span className="text-xs font-normal text-[#00FF87]">Activos</span>
          </div>
          <div className="text-[11px] text-[#4edea3] mt-1 font-mono">+2 creados este sprint mensual</div>
        </div>

        <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20]">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-[10px] font-mono uppercase">Repositorios Vinculados</span>
            <GitBranch className="w-4 h-4 text-[#00FF87]" />
          </div>
          <div className="text-2xl font-mono font-bold text-white mt-1">
            28 <span className="text-xs font-normal text-[#94a3b8]">Repositorios</span>
          </div>
          <div className="text-[11px] text-[#64748b] mt-1 font-mono">GitHub: 18 • GitLab: 10</div>
        </div>

        <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20]">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-[10px] font-mono uppercase">Salud Arquitectónica Media</span>
            <Activity className="w-4 h-4 text-[#00FF87]" />
          </div>
          <div className="text-2xl font-mono font-bold text-white mt-1">
            81.4 <span className="text-xs text-[#64748b]">/ 100</span>
          </div>
          <div className="text-[11px] text-[#00FF87] mt-1 font-mono">Saludable Óptimo • AST Verified</div>
        </div>

        <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20]">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-[10px] font-mono uppercase">Deuda Técnica Global</span>
            <Clock className="w-4 h-4 text-[#00FF87]" />
          </div>
          <div className="text-2xl font-mono font-bold text-white mt-1">
            ~64.2 <span className="text-xs font-normal text-[#94a3b8]">hrs</span>
          </div>
          <div className="text-[11px] text-[#00FF87] mt-1 font-mono">-12.5 hrs resueltas este sprint</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar proyecto por nombre, stack o tag..."
            className="w-full bg-[#08100c] border border-[#182c20] focus:border-[#00FF87] focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-emerald-100 placeholder:text-[#475569]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setFilterTag('todos')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filterTag === 'todos' ? 'bg-[#00FF87] text-black font-semibold' : 'bg-[#09110d] border border-[#182c20] text-[#94a3b8] hover:text-white'
            }`}
          >
            Todos ({projects.length})
          </button>
          <button
            onClick={() => setFilterTag('prod')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filterTag === 'prod' ? 'bg-[#00FF87] text-black font-semibold' : 'bg-[#09110d] border border-[#182c20] text-[#94a3b8] hover:text-white'
            }`}
          >
            Producción (5)
          </button>
          <button
            onClick={() => setFilterTag('stage')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filterTag === 'stage' ? 'bg-[#00FF87] text-black font-semibold' : 'bg-[#09110d] border border-[#182c20] text-[#94a3b8] hover:text-white'
            }`}
          >
            Staging (4)
          </button>
          <button
            onClick={() => setFilterTag('micro')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filterTag === 'micro' ? 'bg-[#00FF87] text-black font-semibold' : 'bg-[#09110d] border border-[#182c20] text-[#94a3b8] hover:text-white'
            }`}
          >
            Microservicios (6)
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((p) => {
          const isSelected = p.id === activeProject.id;
          return (
            <div
              key={p.id}
              className={`rounded-2xl bg-[#08100c] border transition-all p-5 flex flex-col justify-between relative group ${
                isSelected 
                  ? 'border-[#00FF87] shadow-[0_0_20px_-5px_rgba(0,255,135,0.3)]' 
                  : 'border-[#182c20] hover:border-[#00FF87]/40'
              }`}
            >
              <div>
                {/* Card Top */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0d1c13] border border-[#1a3826] flex items-center justify-center text-[#00FF87] group-hover:scale-105 transition-transform">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-[#00FF87] transition-colors">
                        {p.name}
                      </h3>
                      <div className="text-[10px] font-mono text-[#64748b]">
                        {p.repoIdentifier}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    p.tag === 'PROD' ? 'bg-emerald-950/60 text-[#00FF87] border border-[#00FF87]/30' :
                    p.tag === 'ÉLITE A+' ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/40' :
                    p.tag === 'ATENCIÓN' ? 'bg-red-950/60 text-red-400 border border-red-800/40' :
                    'bg-[#121c16] text-[#94a3b8]'
                  }`}>
                    {p.tag}
                  </span>
                </div>

                {/* Tags / Stack */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {p.languages.map((lang, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0d1611] text-[#94a3b8] border border-[#18261e]">
                      {lang}
                    </span>
                  ))}
                </div>

                {/* Metrics 3-box */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs font-mono p-2.5 rounded-xl bg-[#060a08] border border-[#142318]">
                  <div>
                    <div className="text-[9px] text-[#64748b] uppercase">Repositorios</div>
                    <div className="text-white font-bold mt-0.5">{p.reposCount} Repos</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-[#64748b] uppercase">Salud AST</div>
                    <div className="text-[#00FF87] font-bold mt-0.5">{p.astHealth}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-[#64748b] uppercase">Deuda</div>
                    <div className="text-[#e2e8f0] font-bold mt-0.5">{p.debtHours}h</div>
                  </div>
                </div>

                {/* Sub status alert */}
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  {p.spofCount > 0 ? (
                    <span className="text-red-400 font-mono text-[10px] flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {p.spofCount} SPOF Detectado
                    </span>
                  ) : (
                    <span className="text-[#00FF87] font-mono text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      CI/CD Sincronizado
                    </span>
                  )}
                  <span className="text-[#64748b] text-[10px] font-mono">
                    Activo {p.lastActive}
                  </span>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="mt-4 pt-3 border-t border-[#142318] flex items-center gap-2">
                <button
                  onClick={() => {
                    onSelectProject(p);
                    onNavigateToView('vision-general');
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#122419] text-[#00FF87] border border-[#00FF87]/40'
                      : 'bg-[#0d1611] text-[#94a3b8] hover:text-white border border-[#1b2a20]'
                  }`}
                >
                  {isSelected ? 'Espacio Activo ✓' : 'Abrir Espacio'}
                </button>
                <button
                  onClick={() => {
                    onSelectProject(p);
                    onNavigateToView('auditor-deuda-tecnica');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#00FF87] hover:bg-[#00e076] text-black font-semibold text-xs transition-colors cursor-pointer"
                >
                  Auditar AST
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Log */}
      <div className="rounded-2xl bg-[#08100c] border border-[#182c20] p-5">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#142318]">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#00FF87]" />
            <h3 className="text-sm font-semibold text-white">
              Actividad Reciente del Espacio de Trabajo
            </h3>
          </div>
          <span className="text-xs text-[#00FF87] font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-pulse" />
            Refresco automático: En vivo (3s)
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-[#060a08] border border-[#15231b] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#00FF87]" />
              <div>
                <span className="text-white font-mono font-medium">fix(auth): sanitización de tokens JWT en edge middleware</span>
                <span className="text-[#00FF87] font-mono ml-2">#b7f4a9b</span>
                <div className="text-[10px] text-[#64748b] mt-0.5 font-mono">
                  Repositorio: <strong className="text-emerald-200">ec-core/auth-service</strong> • Rama: <span className="text-white">main</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-right">
              <span className="px-2 py-0.5 rounded bg-[#0d1f14] text-[#00FF87] text-[10px] font-mono">
                AR Alejandro R.
              </span>
              <span className="text-[#64748b] text-[11px] font-mono">hace 3 mins</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#060a08] border border-[#15231b] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#00FF87]" />
              <div>
                <span className="text-white font-mono font-medium">Auditoría AST completada: Sin ciclos de dependencia circulares</span>
                <span className="text-[#00FF87] font-mono ml-2">PASS 100%</span>
                <div className="text-[10px] text-[#64748b] mt-0.5 font-mono">
                  Repositorio: <strong className="text-emerald-200">pay-ledger-core/ledger-db</strong> • Rama: <span className="text-white">release/v2.1</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-right">
              <span className="px-2 py-0.5 rounded bg-[#0d1f14] text-[#00FF87] text-[10px] font-mono">
                IA CodeExplain Engine
              </span>
              <span className="text-[#64748b] text-[11px] font-mono">hace 18 mins</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#060a08] border border-[#15231b] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <div>
                <span className="text-white font-mono font-medium">Alerta de Vulnerabilidad: Paquete WebSocket obsoleto reporta buffer overflow</span>
                <span className="text-red-400 font-mono ml-2">CVE-2024-3184</span>
                <div className="text-[10px] text-[#64748b] mt-0.5 font-mono">
                  Repositorio: <strong className="text-emerald-200">fleet-telematics-iot</strong> • Rama: <span className="text-white">staging</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-right">
              <span className="px-2 py-0.5 rounded bg-red-950/50 text-red-400 text-[10px] font-mono">
                MS María Santos
              </span>
              <span className="text-[#64748b] text-[11px] font-mono">hace 42 mins</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
