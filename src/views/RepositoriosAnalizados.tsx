import React from 'react';
import { 
  GitBranch, 
  GitCommit, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ExternalLink, 
  Plus, 
  Search,
  ArrowRight
} from 'lucide-react';
import { ProjectWorkspace, ExplanationLevel } from '../types';
import { MOCK_REPOS } from '../data/mockData';

interface RepositoriosAnalizadosProps {
  project: ProjectWorkspace;
  onOpenUploadModal: () => void;
  level: ExplanationLevel;
}

export const RepositoriosAnalizados: React.FC<RepositoriosAnalizadosProps> = ({
  project,
  onOpenUploadModal,
  level
}) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#15231b]">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-pulse" />
              INVENTARIO DE REPOSITORIOS MONITOREADOS • WEBHOOK CI/CD
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Repositorios Analizados & Telemetría AST
          </h1>
          <p className="text-xs text-[#94a3b8] mt-1 max-w-3xl">
            Pipeline de sincronización continua con GitHub y GitLab. Re-análisis sintáctico activado por commits y pull requests.
          </p>
        </div>

        <button 
          onClick={onOpenUploadModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00FF87] hover:bg-[#00e076] text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(0,255,135,0.3)] cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Vincular Nuevo Repositorio</span>
        </button>
      </div>

      {/* Webhook CI/CD Ingestion Pipeline Graphic */}
      <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20] text-xs font-mono">
        <div className="text-[10px] uppercase text-[#64748b] mb-2">Pipeline de Ingestión Automática AST</div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-lg bg-[#050806] border border-[#142318]">
            <div className="text-[#00FF87] font-bold">1. Git Push Webhook</div>
            <div className="text-[10px] text-[#64748b] mt-1">GitHub / GitLab trigger</div>
          </div>
          <div className="p-3 rounded-lg bg-[#050806] border border-[#142318]">
            <div className="text-[#00FF87] font-bold">2. AST Tokenizer</div>
            <div className="text-[10px] text-[#64748b] mt-1">Tree-Sitter v0.22</div>
          </div>
          <div className="p-3 rounded-lg bg-[#050806] border border-[#142318]">
            <div className="text-[#00FF87] font-bold">3. Inferencia Gemini</div>
            <div className="text-[10px] text-[#64748b] mt-1">Comprensión semántica</div>
          </div>
          <div className="p-3 rounded-lg bg-[#050806] border border-[#142318]">
            <div className="text-[#00FF87] font-bold">4. Docs & C4 Sync</div>
            <div className="text-[10px] text-[#64748b] mt-1">Portal vivo actualizado</div>
          </div>
        </div>
      </div>

      {/* Repositories Table */}
      <div className="rounded-2xl bg-[#08100c] border border-[#182c20] overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#142318] flex items-center justify-between">
          <span className="text-xs font-semibold text-white font-mono uppercase">
            Repositorios Vinculados ({MOCK_REPOS.length})
          </span>
          <span className="text-[10px] font-mono text-[#00FF87]">Auto-Sync Activado</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#050806] text-[#64748b] text-[10px] uppercase border-b border-[#142318]">
              <tr>
                <th className="p-3.5">Repositorio</th>
                <th className="p-3.5">Rama</th>
                <th className="p-3.5">Lenguaje / Stack</th>
                <th className="p-3.5">Líneas (SLOC)</th>
                <th className="p-3.5">Estado AST</th>
                <th className="p-3.5">Último Commit</th>
                <th className="p-3.5 text-right">Tiempo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#142318]">
              {MOCK_REPOS.map((repo) => (
                <tr key={repo.id} className="hover:bg-[#0c1611] transition-colors">
                  <td className="p-3.5 font-semibold text-white flex items-center gap-2">
                    <GitBranch className="w-3.5 h-3.5 text-[#00FF87]" />
                    <span>{repo.name}</span>
                  </td>
                  <td className="p-3.5 text-[#94a3b8]">
                    <span className="px-2 py-0.5 rounded bg-[#09110d] border border-[#17271d]">
                      {repo.branch}
                    </span>
                  </td>
                  <td className="p-3.5 text-emerald-200">{repo.language}</td>
                  <td className="p-3.5 text-white">{repo.sloc.toLocaleString()}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0d1f14] text-[#00FF87] border border-[#1b3a27] flex items-center gap-1 w-max">
                      <CheckCircle2 className="w-3 h-3" />
                      {repo.astStatus}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#94a3b8] max-w-xs truncate">
                    <span className="text-[#00FF87] mr-1.5">{repo.lastCommitHash}</span>
                    <span>{repo.lastCommitMessage}</span>
                  </td>
                  <td className="p-3.5 text-right text-[#64748b]">{repo.timeAgo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
