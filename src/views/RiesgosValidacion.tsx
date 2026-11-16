import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  FileCheck2, 
  ArrowRight, 
  Star, 
  Users, 
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { ExplanationLevel } from '../types';
import { MOCK_RISKS, SURVEY_METRICS } from '../data/mockData';

interface RiesgosValidacionProps {
  level: ExplanationLevel;
}

export const RiesgosValidacion: React.FC<RiesgosValidacionProps> = ({ level }) => {
  const [activeTab, setActiveTab] = useState<'actual' | 'historico'>('actual');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#15231b]">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-pulse" />
              MODELADO DE AMENAZAS & ENCUESTA DE VALIDACIÓN EMPÍRICA • PROTOCOLO STRIDE V4.2
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Matriz de Riesgos & Validación de Mercado
          </h1>
          <p className="text-xs text-[#94a3b8] mt-1 max-w-3xl">
            Evaluación integral de riesgos técnicos (arquitectónicos, ciberseguridad y resiliencia) en tiempo real con la validación de adopción del producto basada en telemetría de 142 arquitectos de software.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('actual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
              activeTab === 'actual' ? 'bg-[#00FF87] text-black font-semibold' : 'bg-[#0d1611] text-[#94a3b8]'
            }`}
          >
            Último Análisis
          </button>
          <button
            onClick={() => setActiveTab('historico')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
              activeTab === 'historico' ? 'bg-[#00FF87] text-black font-semibold' : 'bg-[#0d1611] text-[#94a3b8]'
            }`}
          >
            Histórico 30D
          </button>
          <button 
            onClick={() => {
              const report = JSON.stringify({ risks: MOCK_RISKS, survey: SURVEY_METRICS }, null, 2);
              const blob = new Blob([report], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'stride-risk-matrix.json';
              a.click();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1611] border border-[#1b2a20] text-xs text-white hover:border-[#00FF87]/40 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#00FF87]" />
            <span>Exportar Informe Ejecutivo</span>
          </button>
          <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#00FF87] hover:bg-[#00e076] text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(0,255,135,0.3)] cursor-pointer">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>+ Ejecutar Auditoría STRIDE</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Nivel de Riesgo Global */}
        <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-[10px] font-mono uppercase">Nivel de Riesgo Global</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0d1f14] text-[#00FF87] border border-[#1b3a27]">
              STRIDE SCORE
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-mono font-bold text-white">24</span>
            <span className="text-xs text-[#64748b]">/ 100</span>
          </div>
          <div className="flex items-center justify-between text-[11px] mt-2 font-mono">
            <span className="text-[#00FF87] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87]" />
              Bajo - Controlado
            </span>
            <span className="text-[#64748b]">-6.4 pts vs ciclo ant.</span>
          </div>
        </div>

        {/* Card 2: SPOF */}
        <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-[10px] font-mono uppercase">Puntos Únicos de Falla</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-800/40">
              CRÍTICO
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-mono font-bold text-red-400">1</span>
            <span className="text-xs text-[#94a3b8]">Detectado</span>
          </div>
          <div className="text-[10px] text-[#94a3b8] mt-1 font-mono leading-tight">
            Cluster de Redis en instancia única (<span className="text-red-400">redis-master-node</span>)
          </div>
        </div>

        {/* Card 3: Riesgos Mitigados */}
        <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-[10px] font-mono uppercase">Riesgos Mitigados</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0d1f14] text-[#00FF87]">
              COBERTURA
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-mono font-bold text-white">14 / 16</span>
            <span className="text-xs font-mono text-[#00FF87] font-semibold">87.5%</span>
          </div>
          <div className="w-full bg-[#121c16] rounded-full h-1.5 mt-2">
            <div className="bg-[#00FF87] h-full rounded-full" style={{ width: '87.5%' }} />
          </div>
        </div>

        {/* Card 4: Validación NPS Técnico */}
        <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-[10px] font-mono uppercase">Validación NPS Técnico</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#00FF87]/20 text-[#00FF87]">
              PROMOTORES
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-mono font-bold text-[#00FF87]">+68</span>
            <span className="text-xs text-white font-medium">Excelente</span>
          </div>
          <div className="text-[10px] text-[#64748b] font-mono mt-1">
            Validado empíricamente con <strong className="text-emerald-300">142 arquitectos</strong> y devs.
          </div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: STRIDE Threat Matrix (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-[#08100c] border border-[#182c20] p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#142318]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#00FF87]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Matriz de Riesgos Arquitectónicos & Ciberseguridad
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#00FF87] px-2 py-0.5 rounded bg-[#0d1f14] border border-[#1a3d28]">
                FRAMEWORK STRIDE
              </span>
            </div>

            {/* Radar Mini & Vector Reading */}
            <div className="my-4 p-4 rounded-xl bg-[#050806] border border-[#142318] flex items-center gap-5 flex-wrap sm:flex-nowrap">
              <svg className="w-36 h-36 shrink-0" viewBox="0 0 100 100">
                <polygon points="50,10 88,38 73,83 27,83 12,38" fill="none" stroke="#16291e" strokeWidth="1" />
                <polygon points="50,25 76,44 65,74 35,74 24,44" fill="none" stroke="#16291e" strokeWidth="1" />
                <polygon points="50,20 82,42 66,76 32,77 20,40" fill="rgba(0,255,135,0.2)" stroke="#00FF87" strokeWidth="1.5" />
                <circle cx="50" cy="20" r="2" fill="#00FF87" />
                <circle cx="82" cy="42" r="2" fill="#00FF87" />
                <circle cx="66" cy="76" r="2" fill="#00FF87" />
                <circle cx="32" cy="77" r="2" fill="#00FF87" />
                <circle cx="20" cy="40" r="2" fill="#00FF87" />
              </svg>
              <div className="text-xs space-y-1.5">
                <div className="text-[10px] font-mono text-[#00FF87] uppercase font-bold">
                  Lectura del Vector Defensivo
                </div>
                <p className="text-[#94a3b8] leading-relaxed text-[11px]">
                  Vector de Disponibilidad reforzado tras el despliegue de colas asíncronas. El vector de Confidencialidad reporta menor margen de error con encriptación en reposo habilitada.
                </p>
                <div className="flex items-center gap-4 text-[10px] font-mono text-[#64748b] pt-1">
                  <span>Índice STRIDE: <strong className="text-white">8.9/10</strong></span>
                  <span>Exposición: <strong className="text-[#00FF87]">11.2%</strong></span>
                </div>
              </div>
            </div>

            {/* Risk Items */}
            <div className="space-y-3">
              {MOCK_RISKS.map((risk) => (
                <div
                  key={risk.id}
                  className="p-4 rounded-xl bg-[#060a08] border border-[#16271c] hover:border-[#00FF87]/30 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#0e1c14] text-white font-bold border border-[#1d3826]">
                        {risk.id}
                      </span>
                      <span className="text-[#94a3b8]">{risk.category}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        risk.severity === 'ALTA' ? 'bg-red-950/60 text-red-400 border border-red-800/40' :
                        risk.severity === 'MEDIA' ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40' :
                        'bg-emerald-950/60 text-[#00FF87] border border-[#00FF87]/30'
                      }`}>
                        SEVERIDAD {risk.severity}
                      </span>
                    </div>
                    <span className="text-[#00FF87] text-[11px] font-semibold">
                      {risk.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-white">
                    {risk.title}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded bg-[#09110d] border border-[#142318]">
                      <div className="text-[10px] font-mono uppercase text-[#64748b]">Impacto Directo</div>
                      <p className="text-red-300/90 mt-0.5">{risk.impact}</p>
                    </div>
                    <div className="p-2.5 rounded bg-[#09110d] border border-[#142318]">
                      <div className="text-[10px] font-mono uppercase text-[#64748b]">Mitigación Implementada / Sugerida</div>
                      <p className="text-[#a7f3d0] mt-0.5">{risk.mitigation}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#142318] flex items-center justify-between text-[10px] font-mono text-[#64748b]">
                    <span>Endpoint: <strong className="text-emerald-300">{risk.targetEndpoint}</strong></span>
                    {risk.prReference && (
                      <span className="text-[#00FF87]">{risk.prReference}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Empirical Survey & PMF Validation (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-[#08100c] border border-[#182c20] p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#142318]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#00FF87]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Validación de Idea & Product-Market Fit
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#00FF87] px-2 py-0.5 rounded bg-[#0d1f14] border border-[#1a3d28]">
                N=142 DEVS
              </span>
            </div>

            <p className="text-xs text-[#94a3b8] mt-2 leading-relaxed">
              Resultados consolidados de la prueba piloto de CodeExplain con equipos de ingeniería senior, Tech Leads y DevOps.
            </p>

            {/* Questions with progress metrics */}
            <div className="space-y-4 mt-4">
              {/* Question 1 */}
              <div className="p-3 rounded-xl bg-[#060a08] border border-[#16271c] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-medium">{SURVEY_METRICS.questions[0].q}</span>
                  <span className="font-mono text-sm font-bold text-[#00FF87]">
                    {SURVEY_METRICS.questions[0].percentage}
                  </span>
                </div>
                <div className="w-full bg-[#121c16] rounded-full h-1.5">
                  <div className="bg-[#00FF87] h-full rounded-full shadow-[0_0_8px_#00FF87]" style={{ width: '92%' }} />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#64748b]">
                  <span>{SURVEY_METRICS.questions[0].detail}</span>
                  <span className="text-[#00FF87]">Meta: {SURVEY_METRICS.questions[0].meta}</span>
                </div>
              </div>

              {/* Question 2 */}
              <div className="p-3 rounded-xl bg-[#060a08] border border-[#16271c] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-medium">{SURVEY_METRICS.questions[1].q}</span>
                  <span className="font-mono text-sm font-bold text-[#00FF87]">
                    {SURVEY_METRICS.questions[1].rating}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-[10px] text-[#64748b] font-mono ml-2">
                    {SURVEY_METRICS.questions[1].detail}
                  </span>
                </div>
              </div>

              {/* Question 3 */}
              <div className="p-3 rounded-xl bg-[#060a08] border border-[#16271c] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-medium">{SURVEY_METRICS.questions[2].q}</span>
                  <span className="font-mono text-sm font-bold text-[#00FF87]">
                    {SURVEY_METRICS.questions[2].percentage}
                  </span>
                </div>
                <div className="w-full bg-[#121c16] rounded-full h-1.5">
                  <div className="bg-[#00FF87] h-full rounded-full shadow-[0_0_8px_#00FF87]" style={{ width: '84%' }} />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#64748b]">
                  <span>{SURVEY_METRICS.questions[2].detail}</span>
                  <span className="text-[#00FF87]">{SURVEY_METRICS.questions[2].meta}</span>
                </div>
              </div>
            </div>

            {/* Testimonials Quotes */}
            <div className="mt-5 pt-4 border-t border-[#142318] space-y-3">
              <div className="text-[10px] font-mono uppercase text-[#64748b] flex items-center justify-between">
                <span>Insights Cualitativos & Feedback Directo</span>
                <span className="text-[#00FF87]">VERIFICADOS</span>
              </div>

              {SURVEY_METRICS.quotes.map((q, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#060a08] border border-[#142318] text-xs">
                  <p className="italic text-[#cbd5e1] leading-relaxed">
                    {q.text}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-[#64748b]">
                    <span className="text-emerald-300 font-semibold">{q.author}</span>
                    <span>{q.role}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Download Button */}
            <button 
              onClick={() => {
                const csvContent = "data:text/csv;charset=utf-8,ID,Pregunta,Respuesta,Porcentaje\n1,Onboarding reducido,Si,92%\n2,Confiabilidad AST,Alta,4.8/5\n3,Integracion CI/CD,Si,84%";
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "codeexplain-survey-results.csv");
                document.body.appendChild(link);
                link.click();
              }}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-xl bg-[#0d1611] border border-[#1b2a20] hover:border-[#00FF87]/50 text-xs text-white transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#00FF87]" />
              <span>Descargar Dataset de Respuestas (CSV / JSON)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
