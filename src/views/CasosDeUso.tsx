import React, { useState } from 'react';
import { 
  FileCheck2, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Workflow, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { ExplanationLevel, UseCaseItem } from '../types';
import { MOCK_USE_CASES } from '../data/mockData';

interface CasosDeUsoProps {
  level: ExplanationLevel;
}

export const CasosDeUso: React.FC<CasosDeUsoProps> = ({ level }) => {
  const [selectedCase, setSelectedCase] = useState<UseCaseItem>(MOCK_USE_CASES[0]);
  const [copiedGherkin, setCopiedGherkin] = useState(false);

  const handleCopyGherkin = () => {
    navigator.clipboard.writeText(selectedCase.gherkin);
    setCopiedGherkin(true);
    setTimeout(() => setCopiedGherkin(false), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#15231b]">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-pulse" />
              MATRIZ DE REQUERIMIENTOS FUNCIONALES (IEEE 830) & BDD
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Casos de Uso, Requerimientos & Escenarios BDD
          </h1>
          <p className="text-xs text-[#94a3b8] mt-1 max-w-3xl">
            Inferencia de comportamiento del sistema y contratos funcionales derivados automáticamente de pruebas unitarias y validaciones de DTO.
          </p>
        </div>

        <button
          onClick={handleCopyGherkin}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1611] border border-[#1b2a20] text-xs text-white hover:border-[#00FF87]/40 transition-colors cursor-pointer"
        >
          {copiedGherkin ? <Check className="w-3.5 h-3.5 text-[#00FF87]" /> : <Copy className="w-3.5 h-3.5 text-[#00FF87]" />}
          <span>Copiar Gherkin Feature</span>
        </button>
      </div>

      {/* Two-Column Grid: Use Cases List & Detail Stepper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Use Case Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono uppercase text-[#64748b]">Casos de Uso Detectados ({MOCK_USE_CASES.length})</div>
          {MOCK_USE_CASES.map((cu) => {
            const isSelected = cu.id === selectedCase.id;
            return (
              <div
                key={cu.id}
                onClick={() => setSelectedCase(cu)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#122419] border-2 border-[#00FF87] shadow-[0_0_15px_-4px_rgba(0,255,135,0.3)]'
                    : 'bg-[#08100c] border border-[#182c20] hover:border-[#00FF87]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#00FF87]">
                    {cu.code}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#060a08] text-[#94a3b8] border border-[#142318]">
                    Complejidad: {cu.complexity}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white mt-1">
                  {cu.title}
                </h4>
                <div className="text-[11px] text-[#64748b] mt-1">
                  Actor Principal: <strong className="text-emerald-200">{cu.actor}</strong>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Stepper & Gherkin Generator (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Detail Card */}
          <div className="p-5 rounded-2xl bg-[#08100c] border border-[#182c20] space-y-4 shadow-xl">
            <div className="pb-3 border-b border-[#142318] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#00FF87]">{selectedCase.code} • Especificación</span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedCase.title}</h3>
              </div>
              <span className="text-xs font-mono text-[#00FF87] px-2.5 py-1 rounded bg-[#0d1f14] border border-[#1a3d28]">
                {selectedCase.actor}
              </span>
            </div>

            {/* Pre & Post Conditions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#050806] border border-[#142318]">
                <div className="text-[10px] text-[#64748b] uppercase">Precondición</div>
                <p className="text-emerald-100 font-sans mt-0.5">{selectedCase.precondition}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#050806] border border-[#142318]">
                <div className="text-[10px] text-[#00FF87] uppercase">Postcondición</div>
                <p className="text-[#a7f3d0] font-sans mt-0.5">{selectedCase.postcondition}</p>
              </div>
            </div>

            {/* Happy Path Stepper */}
            <div>
              <div className="text-xs font-mono uppercase text-[#64748b] mb-2">Flujo Principal (Happy Path)</div>
              <div className="space-y-2">
                {selectedCase.steps.map((st, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#060a08] border border-[#142318] flex items-start gap-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-[#00FF87]/15 border border-[#00FF87]/30 text-[#00FF87] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="text-[#cbd5e1] leading-relaxed">{st}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gherkin Code Box */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#64748b] mb-1.5">
                <span className="text-[#00FF87]">Escenario BDD (Gherkin Sintético)</span>
                <span>Cucumber / Behave Ready</span>
              </div>
              <pre className="p-3.5 rounded-xl bg-[#040605] border border-[#142318] font-mono text-xs text-emerald-200 leading-5 overflow-x-auto">
                {selectedCase.gherkin}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
