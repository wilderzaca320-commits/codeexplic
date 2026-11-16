import React, { useState } from 'react';
import { 
  X, 
  GitBranch, 
  FileCode2, 
  Terminal, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  UploadCloud,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ProjectWorkspace } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (newProject: ProjectWorkspace) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onAddProject
}) => {
  const [activeTab, setActiveTab] = useState<'git' | 'zip' | 'snippet'>('git');
  const [gitUrl, setGitUrl] = useState('https://github.com/opencommerce/core-services.git');
  const [branch, setBranch] = useState('main');
  const [parserEngine, setParserEngine] = useState('tree-sitter');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    'Clonando repositorio remoto y verificando árbol de commits...',
    'Construyendo AST sintáctico multilingüe con Tree-Sitter v0.22...',
    'Inferencia semántica con Gemini Pro v2.4 (extracción de bounded contexts)...',
    'Generando diagramas C4, modelo de datos relacional y catálogo de riesgos...'
  ];

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisStep(0);

    const stepInterval = setInterval(() => {
      setAnalysisStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setTimeout(() => {
            // Create and inject new project
            const repoName = gitUrl.split('/').pop()?.replace('.git', '') || 'nuevo-proyecto-analizado';
            const newProj: ProjectWorkspace = {
              id: repoName,
              name: `Análisis de ${repoName}`,
              repoIdentifier: `${repoName}-core`,
              tag: 'PROD',
              languages: ['TypeScript', 'Node.js', 'PostgreSQL'],
              reposCount: 1,
              astHealth: 88.0,
              debtHours: 12.0,
              spofCount: 1,
              lastActive: 'Justo ahora',
              description: `Proyecto software ingerido y parseado mediante AST semántico. Código estructurado y documentado en niveles básico, intermedio y avanzado.`
            };
            onAddProject(newProj);
            setIsAnalyzing(false);
            setAnalysisStep(0);
            onClose();
          }, 800);
          return prev;
        }
      });
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#09100c] border border-[#1b3123] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#17271d] flex items-center justify-between bg-[#060a08]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00FF87]/15 border border-[#00FF87]/30 flex items-center justify-center text-[#00FF87]">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                Ingerir & Analizar Nuevo Proyecto
                <span className="text-[10px] font-mono uppercase bg-[#00FF87]/10 text-[#00FF87] px-2 py-0.5 rounded border border-[#00FF87]/30">
                  AST v3.9
                </span>
              </h2>
              <p className="text-xs text-[#94a3b8]">
                Conecta un repositorio para generar la radiografía arquitectónica completa y explicación guiada.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isAnalyzing}
            className="text-[#64748b] hover:text-white p-1 rounded-lg hover:bg-[#121c15] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Tabs */}
          <div className="flex items-center gap-2 bg-[#060a08] p-1 rounded-xl border border-[#142319]">
            <button
              onClick={() => setActiveTab('git')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'git'
                  ? 'bg-[#122419] text-[#00FF87] border border-[#00FF87]/40 shadow-sm'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>Repositorio Git Remoto</span>
            </button>
            <button
              onClick={() => setActiveTab('zip')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'zip'
                  ? 'bg-[#122419] text-[#00FF87] border border-[#00FF87]/40 shadow-sm'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              <FileCode2 className="w-4 h-4" />
              <span>Archivo ZIP / Carpeta</span>
            </button>
            <button
              onClick={() => setActiveTab('snippet')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'snippet'
                  ? 'bg-[#122419] text-[#00FF87] border border-[#00FF87]/40 shadow-sm'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Pegar Código Fuente</span>
            </button>
          </div>

          {!isAnalyzing ? (
            <div className="space-y-4">
              {activeTab === 'git' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">
                      URL del Repositorio (GitHub, GitLab, Bitbucket)
                    </label>
                    <input
                      type="text"
                      value={gitUrl}
                      onChange={(e) => setGitUrl(e.target.value)}
                      placeholder="https://github.com/usuario/mi-proyecto.git"
                      className="w-full bg-[#060907] border border-[#192a1f] focus:border-[#00FF87] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs font-mono text-emerald-100 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">
                        Rama Principal (Branch)
                      </label>
                      <input
                        type="text"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full bg-[#060907] border border-[#192a1f] focus:border-[#00FF87] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs font-mono text-emerald-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">
                        Motor de Parser AST
                      </label>
                      <select
                        value={parserEngine}
                        onChange={(e) => setParserEngine(e.target.value)}
                        className="w-full bg-[#060907] border border-[#192a1f] focus:border-[#00FF87] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs font-mono text-emerald-100"
                      >
                        <option value="tree-sitter">Tree-Sitter v0.22 (Universal)</option>
                        <option value="babel">Babel AST (JS/TS Spec)</option>
                        <option value="syn">Rust Syn (Zero-Copy)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'zip' && (
                <div className="border-2 border-dashed border-[#1a2d21] rounded-2xl p-8 text-center bg-[#060907] hover:border-[#00FF87]/50 transition-colors cursor-pointer">
                  <UploadCloud className="w-10 h-10 text-[#00FF87] mx-auto mb-2 opacity-80" />
                  <p className="text-xs font-medium text-white mb-1">
                    Arrastra y suelta tu archivo ZIP o carpeta del proyecto
                  </p>
                  <p className="text-[11px] text-[#64748b]">
                    Soporta Node.js, Python, Go, Rust, Java, C#, PHP (hasta 200MB)
                  </p>
                </div>
              )}

              {activeTab === 'snippet' && (
                <div>
                  <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">
                    Pegar Bloque o Módulo de Código
                  </label>
                  <textarea
                    rows={6}
                    placeholder="// Pega aquí clases, controladores o esquemas DTO..."
                    className="w-full bg-[#060907] border border-[#192a1f] focus:border-[#00FF87] focus:outline-none rounded-xl p-3 text-xs font-mono text-emerald-100"
                    defaultValue={`export class PaymentEngine {\n  async chargeOrder(orderId: string, amount: number) {\n    const lock = await this.redlock.acquire(['order:' + orderId], 3000);\n    // Transacción atómica\n  }\n}`}
                  />
                </div>
              )}

              {/* Informative Note */}
              <div className="p-3 rounded-xl bg-[#0d1c13] border border-[#1a3826] flex items-start gap-2.5 text-xs text-[#a7f3d0]">
                <Sparkles className="w-4 h-4 text-[#00FF87] shrink-0 mt-0.5" />
                <span>
                  CodeExplain generará de inmediato explicaciones estructuradas en 3 niveles (Básico, Intermedio y Avanzado), diagramas C4 y modelo de base de datos relacional.
                </span>
              </div>
            </div>
          ) : (
            /* Live Analysis Progress Animation */
            <div className="py-6 space-y-6">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-[#122419] border border-[#00FF87] flex items-center justify-center mx-auto mb-3 shadow-[0_0_25px_rgba(0,255,135,0.4)]">
                  <Loader2 className="w-7 h-7 text-[#00FF87] animate-spin" />
                </div>
                <h3 className="text-sm font-semibold text-white">
                  Ingiriendo Repositorio & Generando Grafo AST
                </h3>
                <p className="text-xs text-[#94a3b8] mt-1 font-mono">
                  {gitUrl} [{branch}]
                </p>
              </div>

              {/* Steps Progress */}
              <div className="space-y-3 bg-[#060907] p-4 rounded-xl border border-[#16271c]">
                {steps.map((st, idx) => {
                  const isDone = idx < analysisStep;
                  const isCurrent = idx === analysisStep;
                  return (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-[#00FF87] shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-[#00FF87] animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-[#23382b] shrink-0" />
                      )}
                      <span className={isCurrent ? 'text-white font-medium' : isDone ? 'text-[#a7f3d0]' : 'text-[#475569]'}>
                        {st}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#17271d] bg-[#060a08] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isAnalyzing}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#94a3b8] hover:text-white hover:bg-[#121c15] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleStartAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#00FF87] hover:bg-[#00e076] text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(0,255,135,0.3)] cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analizando AST...</span>
              </>
            ) : (
              <>
                <span>Iniciar Ingestión & Análisis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
