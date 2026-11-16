import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Star, 
  ExternalLink, 
  Check, 
  Copy, 
  Play, 
  FileCode, 
  Sparkles, 
  ArrowRight,
  GitBranch,
  ShieldAlert,
  Database,
  Layers,
  Share2
} from 'lucide-react';
import { QueryHistoryItem, ExplanationLevel } from '../types';
import { MOCK_QUERY_HISTORY } from '../data/mockData';

interface HistorialConsultasProps {
  onNavigateToChat: (initialPrompt?: string) => void;
  level: ExplanationLevel;
}

export const HistorialConsultas: React.FC<HistorialConsultasProps> = ({
  onNavigateToChat,
  level
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todas');
  const [selectedTime, setSelectedTime] = useState('7d');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredQueries = MOCK_QUERY_HISTORY.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.repo.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedFilter === 'flujos') return item.category.includes('FLUJOS');
    if (selectedFilter === 'refactor') return item.category.includes('REFACTOR');
    if (selectedFilter === 'sql') return item.category.includes('BASE DE DATOS');
    if (selectedFilter === 'cve') return item.category.includes('SEGURIDAD');
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
              BITÁCORA DE INFERENCIA SEMÁNTICA & AUDITORÍAS REALIZADAS
            </span>
            <span className="text-[11px] font-mono text-[#64748b]">
              [SYS_LOG // v2.4.9]
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Historial de Consultas & Diagnósticos IA
          </h1>
          <p className="text-xs text-[#94a3b8] mt-1 max-w-3xl">
            Registro completo de preguntas técnicas, análisis de arquitectura, explicaciones de código generadas por Gemini y reportes exportados en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setSearchQuery(''); setSelectedFilter('todas'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1611] border border-[#1b2a20] text-xs text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpiar Filtros</span>
          </button>
          <button 
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(MOCK_QUERY_HISTORY, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", "codeexplain-history.json");
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#00FF87] hover:bg-[#00e076] text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(0,255,135,0.3)] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Historial (JSON/CSV)</span>
          </button>
        </div>
      </div>

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20]">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-[10px] font-mono uppercase">Total Consultas Registradas</span>
            <History className="w-4 h-4 text-[#00FF87]" />
          </div>
          <div className="text-2xl font-mono font-bold text-white mt-1">
            1,254 <span className="text-xs font-normal text-[#94a3b8]">queries</span>
          </div>
          <div className="text-[11px] text-[#00FF87] mt-1 font-mono">Latencia Media: 240ms</div>
        </div>

        <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20]">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-[10px] font-mono uppercase">Tokens Consumidos</span>
            <Sparkles className="w-4 h-4 text-[#00FF87]" />
          </div>
          <div className="text-2xl font-mono font-bold text-white mt-1">
            682,410 <span className="text-xs font-normal text-[#64748b]">/ 1.0M cap</span>
          </div>
          <div className="w-full bg-[#121c16] rounded-full h-1.5 mt-2">
            <div className="bg-[#00FF87] h-full rounded-full" style={{ width: '68.2%' }} />
          </div>
          <div className="text-[10px] text-[#64748b] font-mono mt-1">Cuota Utilizada: 68.2%</div>
        </div>

        <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20]">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-[10px] font-mono uppercase">Aceptación de Parches</span>
            <Check className="w-4 h-4 text-[#00FF87]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#00FF87] mt-1">
            94.2% <span className="text-xs font-normal text-[#94a3b8]">merge rate</span>
          </div>
          <div className="text-[11px] text-[#94a3b8] mt-1 font-mono">418 parches integrados sin rollback</div>
        </div>

        <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20]">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-[10px] font-mono uppercase">Temas Más Consultados</span>
            <span className="text-[10px] font-mono text-[#00FF87]">#TAGS</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0d1812] text-[#00FF87] border border-[#1a3826]">
              #Concurrencia
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0d1812] text-emerald-300 border border-[#1a3826]">
              #PostgresERD
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0d1812] text-[#94a3b8]">
              #StripeWebhooks
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0d1812] text-[#94a3b8]">
              #AuthJWT
            </span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en el historial de prompts, respuestas de IA o archivos analizados (ej: 'saga_orchestrator', 'carrera redis')..."
            className="w-full bg-[#08100c] border border-[#182c20] focus:border-[#00FF87] focus:outline-none rounded-xl pl-10 pr-16 py-2.5 text-xs font-mono text-emerald-100 placeholder:text-[#475569]"
          />
          <span className="absolute right-3.5 top-2.5 px-2 py-0.5 rounded text-[10px] font-mono bg-[#0d1812] text-[#64748b] border border-[#1c3024]">
            ⌘ K
          </span>
        </div>

        {/* Filter categories & Time range */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedFilter('todas')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedFilter === 'todas'
                  ? 'bg-[#00FF87] text-black font-semibold'
                  : 'bg-[#09110d] border border-[#182c20] text-[#94a3b8] hover:text-white'
              }`}
            >
              Todas (1,254)
            </button>
            <button
              onClick={() => setSelectedFilter('flujos')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedFilter === 'flujos'
                  ? 'bg-[#00FF87] text-black font-semibold'
                  : 'bg-[#09110d] border border-[#182c20] text-[#94a3b8] hover:text-white'
              }`}
            >
              Explicación de Flujos (428)
            </button>
            <button
              onClick={() => setSelectedFilter('refactor')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedFilter === 'refactor'
                  ? 'bg-[#00FF87] text-black font-semibold'
                  : 'bg-[#09110d] border border-[#182c20] text-[#94a3b8] hover:text-white'
              }`}
            >
              Refactorización & Parches (312)
            </button>
            <button
              onClick={() => setSelectedFilter('sql')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedFilter === 'sql'
                  ? 'bg-[#00FF87] text-black font-semibold'
                  : 'bg-[#09110d] border border-[#182c20] text-[#94a3b8] hover:text-white'
              }`}
            >
              Consultas SQL/BD (280)
            </button>
            <button
              onClick={() => setSelectedFilter('cve')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedFilter === 'cve'
                  ? 'bg-[#00FF87] text-black font-semibold'
                  : 'bg-[#09110d] border border-[#182c20] text-[#94a3b8] hover:text-white'
              }`}
            >
              Vulnerabilidades & CVE (234)
            </button>
          </div>

          <div className="flex items-center gap-1 bg-[#09110d] border border-[#182c20] p-0.5 rounded-lg text-xs font-mono">
            <button
              onClick={() => setSelectedTime('24h')}
              className={`px-2 py-1 rounded cursor-pointer ${selectedTime === '24h' ? 'bg-[#00FF87] text-black font-bold' : 'text-[#64748b]'}`}
            >
              24h
            </button>
            <button
              onClick={() => setSelectedTime('7d')}
              className={`px-2 py-1 rounded cursor-pointer ${selectedTime === '7d' ? 'bg-[#00FF87] text-black font-bold' : 'text-[#64748b]'}`}
            >
              7 Días
            </button>
            <button
              onClick={() => setSelectedTime('1m')}
              className={`px-2 py-1 rounded cursor-pointer ${selectedTime === '1m' ? 'bg-[#00FF87] text-black font-bold' : 'text-[#64748b]'}`}
            >
              1 Mes
            </button>
            <button
              onClick={() => setSelectedTime('all')}
              className={`px-2 py-1 rounded cursor-pointer ${selectedTime === 'all' ? 'bg-[#00FF87] text-black font-bold' : 'text-[#64748b]'}`}
            >
              Histórico
            </button>
          </div>
        </div>
      </div>

      {/* Split Feed: Left List (8 cols), Right Widgets (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column Feed */}
        <div className="lg:col-span-8 space-y-4">
          {filteredQueries.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-xl bg-[#08100c] border border-[#182c20] hover:border-[#00FF87]/40 transition-all space-y-3"
            >
              {/* Top metadata row */}
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-[#0d1d14] text-[#00FF87] font-semibold border border-[#1b3a27] text-[10px]">
                    {item.category}
                  </span>
                  <span className="text-[#64748b]">{item.timestamp}</span>
                  <span className="text-[#475569]">•</span>
                  <span className="text-[#94a3b8]">{item.repo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#64748b] text-[11px]">Tokens: {item.tokens}</span>
                  {item.isFavorite && (
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  )}
                </div>
              </div>

              {/* User question */}
              <div>
                <div className="text-[10px] font-mono uppercase text-[#64748b] flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  CONSULTA DEL DESARROLLADOR
                </div>
                <h3 className="text-sm font-semibold text-white leading-snug">
                  "{item.question}"
                </h3>
              </div>

              {/* AI Diagnostic Summary */}
              <div className="p-3.5 rounded-lg bg-[#050806] border border-[#15241b] text-xs text-[#94a3b8] leading-relaxed">
                <div className="text-[10px] font-mono text-[#00FF87] flex items-center gap-1 mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>DIAGNÓSTICO GEMINI CORE V2.4</span>
                </div>
                {item.summary}
              </div>

              {/* Code snippet if present */}
              {item.codeSnippet && (
                <div className="p-3 rounded-lg bg-[#040605] border border-[#142318] font-mono text-xs overflow-x-auto relative group">
                  <button
                    onClick={() => handleCopy(item.codeSnippet || '', item.id)}
                    className="absolute right-2.5 top-2.5 p-1 rounded bg-[#0b120e] text-[#64748b] hover:text-white"
                    title="Copiar código"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-[#00FF87]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <pre className="text-emerald-100 text-[11px] leading-5">
                    {item.codeSnippet}
                  </pre>
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-2 border-t border-[#142318] flex items-center justify-between text-xs flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigateToChat(item.question)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00FF87] text-black font-semibold text-xs hover:bg-[#00e076] transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Reanudar en Chat IA</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c1611] border border-[#1b2f23] text-[#94a3b8] hover:text-white transition-colors cursor-pointer">
                    <FileCode className="w-3 h-3" />
                    <span>Ver Código</span>
                  </button>
                </div>
                <button className="flex items-center gap-1.5 text-xs text-[#64748b] hover:text-[#94a3b8] transition-colors cursor-pointer">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartir</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Widgets */}
        <div className="lg:col-span-4 space-y-4">
          {/* Consultas Favoritas */}
          <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20]">
            <div className="flex items-center justify-between pb-3 border-b border-[#142318]">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Consultas Favoritas
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#00FF87] px-1.5 py-0.5 rounded bg-[#0d1f14] border border-[#193a27]">
                4 fijadas
              </span>
            </div>

            <div className="space-y-2 mt-3 text-xs">
              <div 
                onClick={() => onNavigateToChat('Manejo de reintentos exponenciales en Stripe')}
                className="p-2.5 rounded-lg bg-[#060a08] border border-[#15231b] hover:border-[#00FF87]/40 transition-colors cursor-pointer group"
              >
                <div className="text-[10px] font-mono text-[#00FF87]">#REFACTOR_CONCURRENCY</div>
                <div className="font-medium text-white group-hover:text-[#00FF87] mt-0.5 truncate">
                  Manejo de reintentos exponenciales...
                </div>
                <div className="text-[10px] text-[#64748b] mt-1 font-mono">Última ejecución: hace 2 días</div>
              </div>

              <div 
                onClick={() => onNavigateToChat('Verificación de rotación asimétrica JWT')}
                className="p-2.5 rounded-lg bg-[#060a08] border border-[#15231b] hover:border-[#00FF87]/40 transition-colors cursor-pointer group"
              >
                <div className="text-[10px] font-mono text-emerald-400">#SECURITY_JWT</div>
                <div className="font-medium text-white group-hover:text-[#00FF87] mt-0.5 truncate">
                  Verificación de rotación asimétrica...
                </div>
                <div className="text-[10px] text-[#64748b] mt-1 font-mono">Última ejecución: hace 4 días</div>
              </div>

              <div 
                onClick={() => onNavigateToChat('Particionamiento mensual por rango en PostgreSQL')}
                className="p-2.5 rounded-lg bg-[#060a08] border border-[#15231b] hover:border-[#00FF87]/40 transition-colors cursor-pointer group"
              >
                <div className="text-[10px] font-mono text-purple-400">#SQL_PERFORMANCE</div>
                <div className="font-medium text-white group-hover:text-[#00FF87] mt-0.5 truncate">
                  Particionamiento mensual por rango...
                </div>
                <div className="text-[10px] text-[#64748b] mt-1 font-mono">Última ejecución: hace 1 semana</div>
              </div>
            </div>
          </div>

          {/* Snippets Guardados */}
          <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20]">
            <div className="flex items-center justify-between pb-3 border-b border-[#142318]">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#00FF87]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Snippets Guardados
                </h3>
              </div>
              <span className="text-[10px] text-[#00FF87] hover:underline cursor-pointer">Ver todos</span>
            </div>

            <div className="space-y-2.5 mt-3 text-xs">
              <div className="p-2.5 rounded-lg bg-[#060a08] border border-[#15231b] flex items-center justify-between">
                <div>
                  <div className="font-mono text-white text-xs">redis_lock_guard.py</div>
                  <div className="text-[10px] text-[#64748b]">Context manager con auto-release</div>
                  <div className="text-[9px] text-[#00FF87] font-mono mt-0.5">32 líneas • Python 3.12</div>
                </div>
                <button 
                  onClick={() => handleCopy("class RedisLockGuard: ...", "snip-1")}
                  className="p-1.5 rounded bg-[#0b120e] text-[#64748b] hover:text-white"
                >
                  {copiedId === 'snip-1' ? <Check className="w-3.5 h-3.5 text-[#00FF87]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-[#060a08] border border-[#15231b] flex items-center justify-between">
                <div>
                  <div className="font-mono text-white text-xs">idempotency_middleware.ts</div>
                  <div className="text-[10px] text-[#64748b]">Middleware Fastify para Idempotency-Key</div>
                  <div className="text-[9px] text-[#00FF87] font-mono mt-0.5">48 líneas • TypeScript</div>
                </div>
                <button 
                  onClick={() => handleCopy("export const idempotencyMiddleware = ...", "snip-2")}
                  className="p-1.5 rounded bg-[#0b120e] text-[#64748b] hover:text-white"
                >
                  {copiedId === 'snip-2' ? <Check className="w-3.5 h-3.5 text-[#00FF87]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Semantic Health Radar */}
          <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#142318]">
              <span className="text-xs font-mono font-bold text-white uppercase">Salud Semántica</span>
              <span className="text-xs font-mono font-bold text-[#00FF87]">88.4 / 100</span>
            </div>
            <div className="flex justify-center my-3">
              <svg className="w-36 h-36" viewBox="0 0 100 100">
                <polygon points="50,10 88,38 73,83 27,83 12,38" fill="none" stroke="#17291f" strokeWidth="1" />
                <polygon points="50,25 76,44 65,74 35,74 24,44" fill="none" stroke="#17291f" strokeWidth="1" />
                <polygon points="50,14 84,39 68,78 31,80 18,41" fill="rgba(0,255,135,0.2)" stroke="#00FF87" strokeWidth="1.5" />
                <circle cx="50" cy="14" r="2" fill="#00FF87" />
                <circle cx="84" cy="39" r="2" fill="#00FF87" />
                <circle cx="68" cy="78" r="2" fill="#00FF87" />
                <circle cx="31" cy="80" r="2" fill="#00FF87" />
                <circle cx="18" cy="41" r="2" fill="#00FF87" />
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-[#94a3b8]">
              <div>• Resiliencia: <strong className="text-white">92%</strong></div>
              <div>• Seguridad: <strong className="text-white">84%</strong></div>
              <div>• Modularidad: <strong className="text-white">96%</strong></div>
              <div>• Doc Cobertura: <strong className="text-white">78%</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
