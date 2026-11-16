import React, { useState } from 'react';
import { 
  GitFork, 
  ChevronDown, 
  Upload, 
  Zap, 
  User, 
  Check, 
  GraduationCap, 
  Code2, 
  Cpu
} from 'lucide-react';
import { ProjectWorkspace, ExplanationLevel } from '../types';

interface HeaderProps {
  projects: ProjectWorkspace[];
  activeProject: ProjectWorkspace;
  onSelectProject: (p: ProjectWorkspace) => void;
  onOpenUploadModal: () => void;
  explanationLevel: ExplanationLevel;
  onChangeLevel: (lvl: ExplanationLevel) => void;
}

export const Header: React.FC<HeaderProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onOpenUploadModal,
  explanationLevel,
  onChangeLevel
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="h-14 bg-[#070b09]/95 backdrop-blur border-b border-[#15201a] px-4 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Active Repo Selector & Status */}
      <div className="flex items-center gap-3">
        {/* Repo Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0d1611] border border-[#1b2a20] hover:border-[#00FF87]/40 text-xs text-white transition-all cursor-pointer font-mono"
          >
            <GitFork className="w-3.5 h-3.5 text-[#00FF87]" />
            <span className="font-semibold text-emerald-100 max-w-[200px] sm:max-w-xs truncate">
              {activeProject.id}
            </span>
            <span className="text-[#64748b] hidden md:inline text-[11px]">
              [{activeProject.languages.slice(0, 2).join(' / ')}]
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748b] ml-1" />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-72 bg-[#09100c] border border-[#1d3024] rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider px-2 py-1">
                Espacios de Trabajo ({projects.length})
              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectProject(p);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      p.id === activeProject.id
                        ? 'bg-[#13261a] text-[#00FF87]'
                        : 'text-[#94a3b8] hover:bg-[#0f1b14] hover:text-white'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-mono font-medium truncate">{p.id}</div>
                      <div className="text-[10px] text-[#64748b] truncate">{p.name}</div>
                    </div>
                    {p.id === activeProject.id && (
                      <Check className="w-4 h-4 text-[#00FF87] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Engine Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0d1c13] border border-[#1e3d2b] text-[11px] text-[#4edea3]">
          <span className="w-2 h-2 rounded-full bg-[#00FF87] animate-pulse shadow-[0_0_8px_#00FF87]" />
          <span className="font-medium tracking-wide">Sistema En Línea • Motor Activo</span>
        </div>
      </div>

      {/* Center: Global Explanation Level Selector */}
      <div className="hidden lg:flex items-center bg-[#0a120d] border border-[#182a1f] p-0.5 rounded-lg">
        <span className="text-[10px] font-mono uppercase text-[#64748b] px-2">Nivel IA:</span>
        <button
          onClick={() => onChangeLevel('basico')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
            explanationLevel === 'basico'
              ? 'bg-[#00FF87]/20 text-[#00FF87] font-semibold border border-[#00FF87]/40'
              : 'text-[#94a3b8] hover:text-white'
          }`}
          title="Explicación clara con analogías y conceptos simples para estudiantes"
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Básico</span>
        </button>
        <button
          onClick={() => onChangeLevel('intermedio')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
            explanationLevel === 'intermedio'
              ? 'bg-[#00FF87]/20 text-[#00FF87] font-semibold border border-[#00FF87]/40'
              : 'text-[#94a3b8] hover:text-white'
          }`}
          title="Explicación técnica detallada de componentes y patrones para desarrolladores"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Intermedio</span>
        </button>
        <button
          onClick={() => onChangeLevel('avanzado')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
            explanationLevel === 'avanzado'
              ? 'bg-[#00FF87]/20 text-[#00FF87] font-semibold border border-[#00FF87]/40'
              : 'text-[#94a3b8] hover:text-white'
          }`}
          title="Análisis riguroso de concurrencia, métricas Martin, AST y alta disponibilidad para arquitectos"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Avanzado</span>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Subir Repo Git Button */}
        <button
          onClick={onOpenUploadModal}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#00FF87] hover:bg-[#00e076] text-black font-semibold text-xs transition-all shadow-[0_0_18px_rgba(0,255,135,0.35)] cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Subir Repo Git</span>
        </button>

        {/* Context Telemetry Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0d1611] border border-[#1b2a20] text-xs font-mono text-[#94a3b8]">
          <Zap className="w-3.5 h-3.5 text-[#00FF87]" />
          <span className="text-white font-medium">42.8k</span>
          <span className="text-[#64748b]">ctx</span>
        </div>

        {/* User Avatar */}
        <button className="w-8 h-8 rounded-full bg-[#122419] border border-[#00FF87]/30 flex items-center justify-center text-[#00FF87] hover:border-[#00FF87] transition-colors cursor-pointer">
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
