import React, { useState } from 'react';
import { 
  Terminal, 
  ArrowUpRight, 
  Send, 
  ShieldAlert, 
  AlertTriangle, 
  Activity, 
  Copy, 
  Check, 
  Sparkles, 
  FileCode, 
  Database, 
  Network, 
  CheckCircle2, 
  Layers, 
  SlidersHorizontal, 
  ExternalLink,
  Lock,
  Workflow
} from 'lucide-react';
import { ProjectWorkspace, ExplanationLevel } from '../types';

interface VisionGeneralProps {
  project: ProjectWorkspace;
  level: ExplanationLevel;
  onNavigate: (view: any) => void;
  onSendToChat: (prompt: string) => void;
}

export const VisionGeneral: React.FC<VisionGeneralProps> = ({
  project,
  level,
  onNavigate,
  onSendToChat
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [localLevel, setLocalLevel] = useState<ExplanationLevel>(level);
  const [activeTab, setActiveTab] = useState<'resumen' | 'metricas' | 'estructura' | 'flujos'>('resumen');
  const [patchApplied, setPatchApplied] = useState(false);

  const handleCopyCode = () => {
    const code = `// src/payments/services/stripe-webhook.worker.ts
@Injectable()
export class StripeWebhookWorker {
  // Mutex distribuido para evitar doble procesamiento (Idempotencia)
  async processChargeSucceeded(event: StripeEvent): Promise<void> {
    const lock = await this.redlock.acquire(['lock:\${event.id}'], 5000);
    try {
      const order = await this.ordersRepo.findOneOrFail({ where: { txId: event.id } });
      this.eventEmitter.emit('order.settled', { orderId: order.id });
    } finally {
      await lock.release();
    }
  }
}`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    onSendToChat(promptInput);
    setPromptInput('');
  };

  const quickPrompts = [
    { label: 'Explicar autenticación JWT', icon: <Lock className="w-3 h-3" /> },
    { label: '¿Por qué falla el módulo de pagos?', icon: <AlertTriangle className="w-3 h-3 text-red-400" /> },
    { label: 'Generar diagrama ER', icon: <Database className="w-3 h-3 text-emerald-400" /> },
    { label: 'Identificar cuellos de botella', icon: <Activity className="w-3 h-3 text-cyan-400" /> }
  ];

  // Explanations tailored to Básico, Intermedio, Avanzado
  const stepExplanations = {
    basico: [
      {
        step: 1,
        title: 'Candado de Seguridad (Línea 05)',
        desc: 'Funciona como el cerrojo de un baño: asegura que una sola persona a la vez pueda procesar este cobro. Si Stripe envía dos notificaciones por error, la segunda tendrá que esperar y no te cobrarán doble.'
      },
      {
        step: 2,
        title: 'Buscar el Pedido en la Tienda (Línea 07)',
        desc: 'Busca el número de orden en los registros. Si no lo encuentra, detiene todo de inmediato para no cometer errores ni registrar un pago de un pedido fantasma.'
      },
      {
        step: 3,
        title: 'Avisar a los demás Departamentos (Línea 08)',
        desc: 'Envía un mensaje rápido que dice "¡La orden ya fue pagada!". Así el almacén puede comenzar a empacar sin tener que esperar a que termine todo el proceso de cobro.'
      }
    ],
    intermedio: [
      {
        step: 1,
        title: 'Garantía de Idempotencia con Redlock (Línea 05)',
        desc: 'La función previene condiciones de carrera causadas por reintentos automáticos del webhook de Stripe implementando un bloqueo atómico distribuido en Redis con un TTL de seguridad de 5,000 milisegundos.'
      },
      {
        step: 2,
        title: 'Búsqueda Estricta de Orden (Línea 07)',
        desc: 'Utiliza el operador estricto findOneOrFail para arrojar de manera inmediata una excepción si no existe el identificador de transacción en PostgreSQL, abortando el ciclo sin disparar eventos de dominio.'
      },
      {
        step: 3,
        title: 'Desacoplamiento Mediante Eventos (Línea 08)',
        desc: 'La orden no modifica inventario directamente aquí; en su lugar, delega la actualización publicando el evento asíncrono "order.settled" hacia el bus de eventos del microservicio de facturación.'
      }
    ],
    avanzado: [
      {
        step: 1,
        title: 'Mutex Distribuido Redlock & Concurrencia (Línea 05)',
        desc: 'Adquisición de cerrojo distribuido multi-nodo con algoritmo Redlock. Garantiza linearizabilidad ante particiones de red transitorias con tiempo de arrendamiento estricto de 5s, previniendo replay attacks y transacciones fantasmas.'
      },
      {
        step: 2,
        title: 'Aislamiento Read Committed & Fail-Fast (Línea 07)',
        desc: 'Ejecución bajo transacción con aislamiento Read Committed. La cláusula findOneOrFail actúa como assertion determinista del AST para prevenir mutaciones en estado inconsistente en la réplica de lectura.'
      },
      {
        step: 3,
        title: 'Event-Driven Choreography & Saga Pattern (Línea 08)',
        desc: 'Publicación de dominio en broker asíncrono (RabbitMQ Topic Exchange). Cumple con el principio de responsabilidad única (SRP), manteniendo el índice de inestabilidad de Martin (I = 0.28) en rango óptimo.'
      }
    ]
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Live Structural Telemetry Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#15231b]">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-pulse" />
              TELEMETRÍA ESTRUCTURAL EN VIVO
            </span>
            <span className="text-[11px] font-mono text-[#64748b]">
              HASH commit: <span className="text-emerald-200">7f8a4e9b</span>
            </span>
            <span className="text-[10px] font-mono text-[#4ade80] px-2 py-0.5 rounded bg-[#0d2215] border border-[#1b3d27]">
              AST v3.9 Parsed
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Análisis Integral del Sistema:
            <span className="text-[#00FF87] font-mono">{project.name}</span>
          </h1>
          <p className="text-xs text-[#94a3b8] mt-1 max-w-3xl">
            Documento vivo de arquitectura e ingeniería inversa procesado por IA. Análisis sobre{' '}
            <strong className="text-white font-mono">42,850 líneas de código</strong> distribuidas en TypeScript, NestJS y PostgreSQL.
          </p>
        </div>

        {/* Header Action Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-lg bg-[#00FF87] text-black font-semibold text-xs shadow-[0_0_12px_rgba(0,255,135,0.3)]">
            v2.4.0 (Actual)
          </span>
          <button className="px-3 py-1 rounded-lg bg-[#0d1611] border border-[#1d2f23] text-xs text-[#94a3b8] hover:text-white transition-colors cursor-pointer">
            Diff con v2.3
          </button>
          <button className="px-3 py-1 rounded-lg bg-[#0d1611] border border-[#1d2f23] text-xs text-[#94a3b8] hover:text-white transition-colors cursor-pointer">
            Histórico
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0d1611] border border-[#1d2f23] text-xs text-[#00FF87] hover:border-[#00FF87]/50 transition-colors cursor-pointer">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Configurar Motor</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-[#15231b] pb-2 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('resumen')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'resumen'
                ? 'bg-[#00FF87] text-black font-semibold shadow-sm'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Resumen Ejecutivo</span>
          </button>
          <button
            onClick={() => setActiveTab('metricas')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'metricas'
                ? 'bg-[#00FF87] text-black font-semibold shadow-sm'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Métricas de Calidad</span>
          </button>
          <button
            onClick={() => setActiveTab('estructura')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'estructura'
                ? 'bg-[#00FF87] text-black font-semibold shadow-sm'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Estructura de Componentes</span>
          </button>
          <button
            onClick={() => setActiveTab('flujos')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'flujos'
                ? 'bg-[#00FF87] text-black font-semibold shadow-sm'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Flujos de Datos</span>
          </button>
        </div>

        <button 
          onClick={() => onNavigate('generador-documentacion')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1812] border border-[#1f3727] text-xs text-[#00FF87] hover:border-[#00FF87] transition-colors cursor-pointer"
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Exportar Informe</span>
        </button>
      </div>

      {/* AI Semantic Search Console Input Bar */}
      <div className="rounded-2xl bg-[#09110d] border border-[#1a2f22] p-4 shadow-xl">
        <div className="flex items-center justify-between text-xs text-[#64748b] mb-2 font-mono">
          <div className="flex items-center gap-2 text-[#a7f3d0]">
            <Sparkles className="w-3.5 h-3.5 text-[#00FF87]" />
            <span>CONSOLA SEMÁNTICA DE CÓDIGO GEMINI PRO 1.5</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87]" />
            <span>Contexto: 148 Archivos Ingestados</span>
          </div>
        </div>

        <form onSubmit={handlePromptSubmit} className="relative">
          <textarea
            rows={2}
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handlePromptSubmit(e);
              }
            }}
            placeholder="Hazle una pregunta a la IA sobre este código o pide una explicación de arquitectura, refactorización o flujos..."
            className="w-full bg-[#060a08] border border-[#17271d] focus:border-[#00FF87] focus:outline-none rounded-xl p-3 pr-12 text-xs font-mono text-emerald-100 placeholder:text-[#475569] resize-none"
          />
          <button
            type="submit"
            className="absolute right-3 bottom-3.5 w-8 h-8 rounded-lg bg-[#00FF87] hover:bg-[#00e076] text-black flex items-center justify-center transition-all cursor-pointer shadow-[0_0_12px_rgba(0,255,135,0.4)]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Chips */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 text-xs">
          <span className="text-[10px] font-mono uppercase text-[#64748b] shrink-0">Consultas Rápidas:</span>
          {quickPrompts.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => onSendToChat(chip.label)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0d1812] border border-[#1a2f22] text-[#94a3b8] hover:text-white hover:border-[#00FF87]/40 transition-colors shrink-0 cursor-pointer text-[11px]"
            >
              {chip.icon}
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Genesis Score Radar & Health (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#08100c] border border-[#182c20] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#00FF87]" />
                  Salud Arquitectónica (Genesis Score)
                </h3>
                <p className="text-[11px] text-[#64748b] mt-0.5">
                  Diagnóstico multicriterio derivado de grafos de dependencia.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono font-bold text-white">
                  84.5<span className="text-xs text-[#64748b]">/100</span>
                </div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30">
                  Arquitectura Saludable
                </span>
              </div>
            </div>

            {/* Radar SVG Diagram */}
            <div className="my-4 flex items-center justify-center relative">
              <svg className="w-56 h-56" viewBox="0 0 200 200">
                {/* Background Web Polygons */}
                <polygon points="100,20 176,75 147,165 53,165 24,75" fill="none" stroke="#16291e" strokeWidth="1" />
                <polygon points="100,45 153,84 133,145 67,145 47,84" fill="none" stroke="#16291e" strokeWidth="1" />
                <polygon points="100,70 130,92 118,126 82,126 70,92" fill="none" stroke="#16291e" strokeWidth="1" />
                
                {/* Axis lines */}
                <line x1="100" y1="100" x2="100" y2="20" stroke="#16291e" strokeWidth="1" />
                <line x1="100" y1="100" x2="176" y2="75" stroke="#16291e" strokeWidth="1" />
                <line x1="100" y1="100" x2="147" y2="165" stroke="#16291e" strokeWidth="1" />
                <line x1="100" y1="100" x2="53" y2="165" stroke="#16291e" strokeWidth="1" />
                <line x1="100" y1="100" x2="24" y2="75" stroke="#16291e" strokeWidth="1" />

                {/* Score Area (88% Cohesión, 72% Docs, 85% Complejidad, 92% Seguridad, 86% Tests) */}
                <polygon
                  points="100,29 154,82 139,155 57,159 34,78"
                  fill="rgba(0, 255, 135, 0.2)"
                  stroke="#00FF87"
                  strokeWidth="2"
                  className="filter drop-shadow-[0_0_8px_rgba(0,255,135,0.6)]"
                />
                
                {/* Vertices */}
                <circle cx="100" cy="29" r="3.5" fill="#00FF87" />
                <circle cx="154" cy="82" r="3.5" fill="#00FF87" />
                <circle cx="139" cy="155" r="3.5" fill="#00FF87" />
                <circle cx="57" cy="159" r="3.5" fill="#00FF87" />
                <circle cx="34" cy="78" r="3.5" fill="#00FF87" />

                {/* Labels */}
                <text x="100" y="14" fill="#a7f3d0" fontSize="7" textAnchor="middle" fontFamily="monospace">COHESIÓN MODULAR (88%)</text>
                <text x="180" y="78" fill="#64748b" fontSize="7" textAnchor="start" fontFamily="monospace">DOCS (72%)</text>
                <text x="150" y="177" fill="#a7f3d0" fontSize="7" textAnchor="middle" fontFamily="monospace">COMPLEJIDAD (85%)</text>
                <text x="50" y="177" fill="#00FF87" fontSize="7" textAnchor="middle" fontFamily="monospace">SEGURIDAD (92%)</text>
                <text x="18" y="78" fill="#64748b" fontSize="7" textAnchor="end" fontFamily="monospace">TESTS (86%)</text>
              </svg>
            </div>
          </div>

          <div>
            {/* Score Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-[11px] font-mono text-[#94a3b8] mb-1">
                <span>Your Genesis Score: <strong className="text-white">84.5</strong></span>
                <span className="text-[#00FF87] font-semibold">Tier: Elite A+</span>
              </div>
              <div className="h-2 w-full bg-[#121f17] rounded-full overflow-hidden flex">
                <div className="bg-red-500/40 w-1/4" />
                <div className="bg-amber-500/40 w-1/4" />
                <div className="bg-emerald-500/40 w-1/4" />
                <div className="bg-[#00FF87] w-1/4 relative">
                  <div className="absolute right-4 -top-1 w-2 h-4 bg-white rounded-full shadow-[0_0_8px_white]" />
                </div>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-[#475569] mt-1">
                <span>0</span>
                <span>20</span>
                <span>40</span>
                <span>60</span>
                <span>80</span>
                <span>100</span>
              </div>
            </div>

            {/* Metrics Triad */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#16271c] text-center">
              <div className="p-2 rounded-lg bg-[#060a08] border border-[#16271c]">
                <div className="text-[10px] text-[#64748b] uppercase">Acoplamiento</div>
                <div className="text-xs font-mono font-bold text-white mt-0.5">A- (Bajo)</div>
              </div>
              <div className="p-2 rounded-lg bg-[#060a08] border border-[#16271c]">
                <div className="text-[10px] text-[#64748b] uppercase">Fragilidad</div>
                <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">12.4%</div>
              </div>
              <div className="p-2 rounded-lg bg-[#060a08] border border-[#16271c]">
                <div className="text-[10px] text-[#64748b] uppercase">Estabilidad</div>
                <div className="text-xs font-mono font-bold text-[#00FF87] mt-0.5">0.89</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 6 Telemetry Cards (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Topología del Código */}
          <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider">Topología del Código</div>
                <h4 className="text-sm font-semibold text-white mt-0.5">Archivos y Módulos</h4>
              </div>
              <div className="w-7 h-7 rounded-lg bg-[#00FF87]/10 flex items-center justify-center text-[#00FF87]">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl font-mono font-bold text-white">
                148 <span className="text-xs font-normal text-[#94a3b8]">ficheros analizados</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0e1d15] text-[#4edea3] border border-[#1a3827]">
                  12 módulos core
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0e1d15] text-[#94a3b8] border border-[#1a3827]">
                  24 microservicios
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Refactorización & Deuda */}
          <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider">Refactorización</div>
                <h4 className="text-sm font-semibold text-white mt-0.5">Deuda Técnica Estimada</h4>
              </div>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl font-mono font-bold text-white">
                ~18.5 h <span className="text-xs font-normal text-[#94a3b8]">esfuerzo de saneo</span>
              </div>
              <div className="mt-2 text-[10px] font-mono text-[#00FF87] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87]" />
                <span>Bajo impacto (-3.2h vs v2.3)</span>
              </div>
            </div>
          </div>

          {/* Card 3: Vulnerabilidad CVE */}
          <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider">Vulnerabilidad CVE</div>
                <h4 className="text-sm font-semibold text-white mt-0.5">Riesgo de Seguridad</h4>
              </div>
              <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl font-mono font-bold text-red-400">
                2 Dep. <span className="text-xs font-normal text-[#94a3b8]">vulnerables detectadas</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950/40 text-red-400 border border-red-800/50">
                  axios &lt; 1.6.0 (DoS)
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#141b16] text-[#94a3b8]">
                  1 Media
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Complejidad Ciclomática */}
          <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider">Ciclomática / Ruta</div>
                <h4 className="text-sm font-semibold text-white mt-0.5">Complejidad Media</h4>
              </div>
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Workflow className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl font-mono font-bold text-white">
                4.2 <span className="text-xs font-semibold text-[#00FF87]">Rango Óptimo (&lt; 10)</span>
              </div>
              <div className="mt-2 text-[10px] font-mono text-[#64748b] truncate">
                Máx en: <span className="text-[#a7f3d0]">payment-gateway.service.ts (14.1)</span>
              </div>
            </div>
          </div>

          {/* Card 5: Acoplamiento Intermódulos */}
          <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider">Aferente / Eferente</div>
                <h4 className="text-sm font-semibold text-white mt-0.5">Acoplamiento Intermódulos</h4>
              </div>
              <div className="w-7 h-7 rounded-lg bg-[#00FF87]/10 flex items-center justify-center text-[#00FF87]">
                <Network className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl font-mono font-bold text-white">
                34% <span className="text-xs font-normal text-[#94a3b8]">acoplamiento relativo</span>
              </div>
              <div className="mt-2 text-[10px] text-[#4edea3]">
                Alta cohesión interna, baja interdependencia entre dominios.
              </div>
            </div>
          </div>

          {/* Card 6: Punto Crítico SPOF */}
          <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider">Disponibilidad Sistema</div>
                <h4 className="text-sm font-semibold text-white mt-0.5">Punto Crítico SPOF</h4>
              </div>
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl font-mono font-bold text-amber-400">
                1 <span className="text-xs font-normal text-[#94a3b8]">servicio no redundante</span>
              </div>
              <div className="mt-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/40 text-amber-300 border border-amber-800/40">
                  Redis Cluster (session cache)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Structural Mapping Cards Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold text-white">
              Mapeo Estructural & Documentación Viva
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Especificaciones técnicas y artefactos sintetizados directamente desde el AST del repositorio
            </p>
          </div>
          <button 
            onClick={() => onNavigate('generador-documentacion')}
            className="text-xs text-[#00FF87] hover:underline flex items-center gap-1 font-mono cursor-pointer"
          >
            <span>Explorar todos los esquemas</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div 
            onClick={() => onNavigate('casos-de-uso-requerimientos')}
            className="p-4 rounded-xl bg-[#08100c] border border-[#182c20] hover:border-[#00FF87]/40 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-[#00FF87]/10 flex items-center justify-center text-[#00FF87] mb-3 group-hover:scale-105 transition-transform">
                <FileCode className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-mono text-[#00FF87] uppercase tracking-wider">Reglas de Negocio</div>
              <h3 className="text-sm font-semibold text-white mt-1">Requerimientos & Lógica</h3>
              <p className="text-xs text-[#94a3b8] mt-1.5 leading-relaxed">
                28 invariantes y políticas de checkout extraídas automáticamente de validaciones NestJS DTO.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#15231b] flex items-center justify-between text-xs text-[#64748b]">
              <span>28 Reglas validadas</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#00FF87]" />
            </div>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => onNavigate('diagramas-c4-uml')}
            className="p-4 rounded-xl bg-[#08100c] border border-[#182c20] hover:border-[#00FF87]/40 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-[#00FF87]/10 flex items-center justify-center text-[#00FF87] mb-3 group-hover:scale-105 transition-transform">
                <Network className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-mono text-[#00FF87] uppercase tracking-wider">Arquitectura C4</div>
              <h3 className="text-sm font-semibold text-white mt-1">Diagramas C4 & APIs</h3>
              <p className="text-xs text-[#94a3b8] mt-1.5 leading-relaxed">
                Topología de microservicios, brokers RabbitMQ y puertas de enlace API en formato interactivo.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#15231b] flex items-center justify-between text-xs text-[#64748b]">
              <span>Niveles 1, 2 y 3</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#00FF87]" />
            </div>
          </div>

          {/* Card 3 */}
          <div 
            onClick={() => onNavigate('modelo-datos-bd')}
            className="p-4 rounded-xl bg-[#08100c] border border-[#182c20] hover:border-[#00FF87]/40 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-[#00FF87]/10 flex items-center justify-center text-[#00FF87] mb-3 group-hover:scale-105 transition-transform">
                <Database className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-mono text-[#00FF87] uppercase tracking-wider">Persistencia Relacional</div>
              <h3 className="text-sm font-semibold text-white mt-1">Modelo ER PostgreSQL</h3>
              <p className="text-xs text-[#94a3b8] mt-1.5 leading-relaxed">
                34 entidades mapeadas con TypeORM, llaves foráneas, índices de alta concurrencia y particiones.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#15231b] flex items-center justify-between text-xs text-[#64748b]">
              <span>34 Tablas • 82 Llaves</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#00FF87]" />
            </div>
          </div>

          {/* Card 4 */}
          <div 
            onClick={() => onNavigate('riesgos-validacion')}
            className="p-4 rounded-xl bg-[#08100c] border border-[#182c20] hover:border-[#00FF87]/40 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-[#00FF87]/10 flex items-center justify-center text-[#00FF87] mb-3 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-mono text-[#00FF87] uppercase tracking-wider">Onboarding & Riesgo</div>
              <h3 className="text-sm font-semibold text-white mt-1">Matriz de Validación</h3>
              <p className="text-xs text-[#94a3b8] mt-1.5 leading-relaxed">
                Guía de onboarding para nuevos desarrolladores y advertencias sobre zonas frágiles del código.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#15231b] flex items-center justify-between text-xs text-[#64748b]">
              <span>16 Puntos críticos</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#00FF87]" />
            </div>
          </div>
        </div>
      </div>

      {/* Code Breakdown & Step-by-Step Explanation Viewer with Level Switcher */}
      <div className="rounded-2xl bg-[#08100c] border border-[#182c20] p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#16271c]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#00FF87]/15 flex items-center justify-center text-[#00FF87]">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Explicaciones de Código & Desglose Paso a Paso
              </h3>
              <p className="text-xs text-[#94a3b8]">
                Inferencia semántica generada por Gemini Core v2.4 sobre el módulo crítico de pagos
              </p>
            </div>
          </div>

          {/* Local Level Switcher for this snippet */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#64748b]">Nivel:</span>
            <div className="flex items-center bg-[#060a08] border border-[#1b2f23] rounded-lg p-0.5 text-xs">
              {(['basico', 'intermedio', 'avanzado'] as ExplanationLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLocalLevel(lvl)}
                  className={`px-2.5 py-1 rounded capitalize font-medium transition-colors cursor-pointer ${
                    localLevel === lvl
                      ? 'bg-[#00FF87] text-black font-semibold shadow-xs'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <span className="text-[11px] font-mono text-[#64748b] hidden md:inline ml-2">
              Última inferencia: hace 4 min
            </span>
          </div>
        </div>

        {/* Code & Steps Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Code Snippet (6 cols) */}
          <div className="lg:col-span-6 rounded-xl bg-[#050806] border border-[#16271c] p-4 flex flex-col justify-between font-mono text-xs">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#142318] text-[#64748b]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="text-xs text-[#a7f3d0] ml-2">src/payments/services/stripe-webhook.worker.ts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#0d1c13] text-[#00FF87] border border-[#1b3a27]">
                    TypeScript
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1 rounded hover:bg-[#122218] text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
                    title="Copiar código"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-[#00FF87]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Code lines */}
              <div className="space-y-1 text-[11px] leading-5 text-[#cbd5e1] overflow-x-auto">
                <div className="text-[#64748b]"><span className="text-[#475569] mr-3">01</span><span className="text-[#38bdf8]">@Injectable</span>()</div>
                <div className="text-[#cbd5e1]"><span className="text-[#475569] mr-3">02</span><span className="text-[#f43f5e]">export class</span> <span className="text-[#fbbf24]">StripeWebhookWorker</span> {'{'}</div>
                <div className="text-[#64748b]"><span className="text-[#475569] mr-3">03</span>  <span className="italic">// Mutex distribuido para evitar doble procesamiento (Idempotencia)</span></div>
                <div className="text-[#cbd5e1]"><span className="text-[#475569] mr-3">04</span>  <span className="text-[#f43f5e]">async</span> <span className="text-[#38bdf8]">processChargeSucceeded</span>(event: <span className="text-[#fbbf24]">StripeEvent</span>): <span className="text-[#fbbf24]">Promise</span>&lt;<span className="text-[#f43f5e]">void</span>&gt; {'{'}</div>
                <div className="bg-[#00FF87]/10 -mx-4 px-4 py-0.5 border-l-2 border-[#00FF87] text-[#00FF87]">
                  <span className="text-[#00FF87]/60 mr-3">05</span>    <span className="text-[#f43f5e]">const</span> lock = <span className="text-[#f43f5e]">await</span> <span className="text-[#f43f5e]">this</span>.redlock.<span className="text-[#38bdf8]">acquire</span>([<span className="text-amber-300">&apos;lock:$&#123;event.id&#125;&apos;</span>], <span className="text-purple-400">5000</span>);
                </div>
                <div className="text-[#cbd5e1]"><span className="text-[#475569] mr-3">06</span>    <span className="text-[#f43f5e]">try</span> {'{'}</div>
                <div className="bg-[#00FF87]/10 -mx-4 px-4 py-0.5 border-l-2 border-[#00FF87] text-[#00FF87]">
                  <span className="text-[#00FF87]/60 mr-3">07</span>      <span className="text-[#f43f5e]">const</span> order = <span className="text-[#f43f5e]">await</span> <span className="text-[#f43f5e]">this</span>.ordersRepo.<span className="text-[#38bdf8]">findOneOrFail</span>({'{'} where: {'{'} txId: <span className="text-amber-300">event.id</span> {'}'} {'}'});
                </div>
                <div className="bg-[#00FF87]/10 -mx-4 px-4 py-0.5 border-l-2 border-[#00FF87] text-[#00FF87]">
                  <span className="text-[#00FF87]/60 mr-3">08</span>      <span className="text-[#f43f5e]">this</span>.eventEmitter.<span className="text-[#38bdf8]">emit</span>(&apos;<span className="text-amber-300">order.settled</span>&apos;, {'{'} orderId: order.id {'}'});
                </div>
                <div className="text-[#cbd5e1]"><span className="text-[#475569] mr-3">09</span>    {'}'} <span className="text-[#f43f5e]">finally</span> {'{'}</div>
                <div className="text-[#cbd5e1]"><span className="text-[#475569] mr-3">10</span>      <span className="text-[#f43f5e]">await</span> lock.<span className="text-[#38bdf8]">release</span>();</div>
                <div className="text-[#cbd5e1]"><span className="text-[#475569] mr-3">11</span>    {'}'}</div>
                <div className="text-[#cbd5e1]"><span className="text-[#475569] mr-3">12</span>  {'}'}</div>
                <div className="text-[#cbd5e1]"><span className="text-[#475569] mr-3">13</span>{'}'}</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#142318] flex items-center justify-between text-[11px] text-[#64748b]">
              <span>AST Tokenized: 84 tokens</span>
              <span className="text-[#00FF87]">Idempotency Pattern v2</span>
            </div>
          </div>

          {/* Right: Step-by-Step Breakdown (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              {stepExplanations[localLevel].map((item) => (
                <div key={item.step} className="p-3.5 rounded-xl bg-[#060a08] border border-[#16271c] hover:border-[#00FF87]/30 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded bg-[#00FF87]/15 border border-[#00FF87]/30 text-[#00FF87] text-xs font-mono font-bold flex items-center justify-center">
                      {item.step}
                    </span>
                    <h4 className="text-xs font-semibold text-white">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[#94a3b8] leading-relaxed pl-7">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Auditor Tip & One-click patch */}
            <div className="p-3.5 rounded-xl bg-[#09150e] border border-[#1b3a27] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#00FF87]/15 text-[#00FF87] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-white">Consejo del Auditor:</span>{' '}
                  <span className="text-[#a7f3d0]">
                    Añadir captura explícita de LockAcquisitionError para responder con HTTP 429 a Stripe.
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPatchApplied(true)}
                disabled={patchApplied}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  patchApplied
                    ? 'bg-emerald-950 text-[#00FF87] border border-[#00FF87]'
                    : 'bg-[#00FF87] hover:bg-[#00e076] text-black shadow-[0_0_12px_rgba(0,255,135,0.3)]'
                }`}
              >
                {patchApplied ? 'Parche Aplicado ✓' : 'Aplicar Parche'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
