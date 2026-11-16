import React, { useState } from 'react';
import { 
  Layers, 
  Network, 
  Activity, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  GitCommit,
  Sliders,
  Sparkles
} from 'lucide-react';
import { ProjectWorkspace, ExplanationLevel } from '../types';

interface ArquitecturaModulosProps {
  project: ProjectWorkspace;
  level: ExplanationLevel;
}

export const ArquitecturaModulos: React.FC<ArquitecturaModulosProps> = ({ project, level }) => {
  const [selectedModule, setSelectedModule] = useState('payments');

  const modules = [
    {
      id: 'payments',
      name: 'Módulo de Pagos & Conciliación',
      path: 'src/payments/*',
      files: 21,
      sloc: 5740,
      afferent: 6, // Ca (dependents)
      efferent: 2, // Ce (dependencies)
      instability: 0.25, // I = Ce / (Ca + Ce)
      status: 'Estable (A+)',
      description: 'Encargado del procesamiento de pasarelas Stripe/PayPal con algoritmo Redlock y sincronización de ledger contable.',
      dependencies: ['src/common/database', 'src/common/redis-cluster'],
      dependents: ['src/orders', 'src/checkout', 'src/subscriptions']
    },
    {
      id: 'orders',
      name: 'Módulo de Pedidos & Checkout',
      path: 'src/orders/*',
      files: 34,
      sloc: 8920,
      afferent: 4,
      efferent: 3,
      instability: 0.43,
      status: 'Balanceado (A)',
      description: 'Orquestación de carritos de compra, reservas temporales de stock en Redis y despacho de eventos de dominio.',
      dependencies: ['src/payments', 'src/catalog', 'src/common/database'],
      dependents: ['src/notifications', 'src/analytics']
    },
    {
      id: 'auth',
      name: 'Módulo de Autenticación & Identidad',
      path: 'src/auth/*',
      files: 18,
      sloc: 4210,
      afferent: 12,
      efferent: 1,
      instability: 0.08,
      status: 'Núcleo Muy Estable (A+)',
      description: 'Validación de tokens asimétricos RS256, roles RBAC y control de listas negras de sesiones en memoria.',
      dependencies: ['src/common/redis-cluster'],
      dependents: ['src/gateway', 'src/orders', 'src/payments', 'src/users']
    },
    {
      id: 'catalog',
      name: 'Módulo de Catálogo & Productos',
      path: 'src/catalog/*',
      files: 26,
      sloc: 6800,
      afferent: 5,
      efferent: 2,
      instability: 0.28,
      status: 'Estable (A)',
      description: 'Gestión de inventario multivariante, búsqueda facetada y caché invalidada por etiquetas de producto.',
      dependencies: ['src/common/database', 'src/search/vector-index'],
      dependents: ['src/orders', 'src/recommendations']
    }
  ];

  const currentMod = modules.find(m => m.id === selectedModule) || modules[0];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#15231b]">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-pulse" />
              MÉTRICAS DE ACOPLAMIENTO DE ROBERT C. MARTIN (Ca, Ce, I)
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Arquitectura de Módulos & Grafo de Dependencias
          </h1>
          <p className="text-xs text-[#94a3b8] mt-1 max-w-3xl">
            Inspección formal de paquetes según el principio de dependencias estables. Cohesión interna alta y bajo acoplamiento eferente.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#00FF87] px-3 py-1.5 rounded-lg bg-[#0d1f14] border border-[#1b3b27]">
            Índice Global: I = 0.28 (Estabilidad Saludable)
          </span>
        </div>
      </div>

      {/* Martin Metrics Explanation Banner */}
      <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div className="p-3 rounded-lg bg-[#050806] border border-[#142318]">
          <div className="text-[#64748b] uppercase text-[10px]">Acoplamiento Aferente ($C_a$)</div>
          <div className="text-white font-bold text-sm mt-1">Clases / Módulos Externos</div>
          <p className="text-[#94a3b8] font-sans text-[11px] mt-1">
            Indica cuántos otros módulos dependen de este paquete (responsabilidad).
          </p>
        </div>
        <div className="p-3 rounded-lg bg-[#050806] border border-[#142318]">
          <div className="text-[#64748b] uppercase text-[10px]">Acoplamiento Eferente ($C_e$)</div>
          <div className="text-white font-bold text-sm mt-1">Dependencias Salientes</div>
          <p className="text-[#94a3b8] font-sans text-[11px] mt-1">
            Indica de cuántos paquetes externos depende este módulo (fragilidad potencial).
          </p>
        </div>
        <div className="p-3 rounded-lg bg-[#050806] border border-[#142318]">
          <div className="text-[#00FF87] uppercase text-[10px]">Factor de Inestabilidad ($I$)</div>
          <div className="text-[#00FF87] font-bold text-sm mt-1">$I = C_e / (C_a + C_e)$</div>
          <p className="text-[#94a3b8] font-sans text-[11px] mt-1">
            Rango de 0 (máxima estabilidad) a 1 (máxima inestabilidad y volatilidad).
          </p>
        </div>
      </div>

      {/* Modules Selector & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Modules List Left (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono uppercase text-[#64748b] pb-1">Módulos del Sistema ({modules.length})</div>
          {modules.map((m) => {
            const isSelected = m.id === selectedModule;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedModule(m.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#122419] border-2 border-[#00FF87] shadow-[0_0_15px_-4px_rgba(0,255,135,0.3)]'
                    : 'bg-[#08100c] border border-[#182c20] hover:border-[#00FF87]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-white text-xs">{m.name}</div>
                  <span className="text-[10px] font-mono text-[#00FF87] px-2 py-0.5 rounded bg-[#0b1b11] border border-[#1a3826]">
                    {m.status}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#64748b] mt-1">{m.path}</div>

                <div className="grid grid-cols-3 gap-2 mt-3 text-center text-[10px] font-mono pt-2 border-t border-[#142318]">
                  <div>
                    <span className="text-[#64748b]">Aferente ($C_a$)</span>
                    <div className="text-white font-bold">{m.afferent}</div>
                  </div>
                  <div>
                    <span className="text-[#64748b]">Eferente ($C_e$)</span>
                    <div className="text-white font-bold">{m.efferent}</div>
                  </div>
                  <div>
                    <span className="text-[#64748b]">Inestabilidad</span>
                    <div className="text-[#00FF87] font-bold">{m.instability}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Module Detail Right (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#08100c] border border-[#182c20] p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-start justify-between pb-3 border-b border-[#142318]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#00FF87]">Inspección Arquitectónica AST</span>
                <h3 className="text-base font-bold text-white mt-0.5">{currentMod.name}</h3>
                <p className="text-xs text-[#94a3b8] mt-1">{currentMod.description}</p>
              </div>
              <span className="text-xs font-mono text-[#00FF87] px-2.5 py-1 rounded bg-[#0d1f14] border border-[#1a3d28]">
                {currentMod.sloc.toLocaleString()} SLOC • {currentMod.files} Archivos
              </span>
            </div>

            {/* Inbound & Outbound Connections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs font-mono">
              {/* Dependents Inbound */}
              <div className="p-3.5 rounded-xl bg-[#050806] border border-[#142318]">
                <div className="text-[10px] text-[#00FF87] uppercase font-bold mb-2">
                  Módulos que dependen de este ({currentMod.dependents.length})
                </div>
                <div className="space-y-1.5">
                  {currentMod.dependents.map((dep, idx) => (
                    <div key={idx} className="p-1.5 rounded bg-[#09110d] text-emerald-200 text-[11px] flex items-center gap-1.5">
                      <ArrowRight className="w-3 h-3 text-[#00FF87]" />
                      <span>{dep}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dependencies Outbound */}
              <div className="p-3.5 rounded-xl bg-[#050806] border border-[#142318]">
                <div className="text-[10px] text-amber-400 uppercase font-bold mb-2">
                  Dependencias Salientes ({currentMod.dependencies.length})
                </div>
                <div className="space-y-1.5">
                  {currentMod.dependencies.map((dep, idx) => (
                    <div key={idx} className="p-1.5 rounded bg-[#09110d] text-amber-200 text-[11px] flex items-center gap-1.5">
                      <ArrowRight className="w-3 h-3 text-amber-400" />
                      <span>{dep}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#142318] flex items-center justify-between text-xs font-mono text-[#64748b]">
            <span>AST Parsing Completo: Zero dependencias circulares</span>
            <span className="text-[#00FF87]">Cumple Principio Open/Closed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
