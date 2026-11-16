import React, { useState } from 'react';
import { 
  Network, 
  Workflow, 
  Copy, 
  Check, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Play, 
  Layers, 
  Sparkles,
  ArrowRight,
  Code2
} from 'lucide-react';
import { ProjectWorkspace, ExplanationLevel } from '../types';

interface DiagramasC4UMLProps {
  project: ProjectWorkspace;
  level: ExplanationLevel;
}

export const DiagramasC4UML: React.FC<DiagramasC4UMLProps> = ({ project, level }) => {
  const [activeTab, setActiveTab] = useState<'canvas' | 'plantuml' | 'mermaid' | 'sequence'>('canvas');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [copied, setCopied] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>('orders-engine');

  const plantumlCode = `@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

LAYOUT_WITH_LEGEND()

Person(user, "Cliente Web", "Inicia el flujo de checkout y pago")
System_Boundary(c1, "${project.name}") {
    Container(api_gw, "API Gateway", "Envoy / Node.js", "Enrutamiento, SSL y Rate Limiting")
    Container(auth_svc, "Auth Identity", "NestJS / JWT", "Validación de claims y tokens RS256")
    Container(orders_svc, "Orders Engine", "TypeScript / NestJS", "Gestión de pedidos y orquestación de inventario")
    Container(payments_worker, "Payment Webhook Worker", "TypeScript", "Procesamiento asíncrono y Redlock")
    ContainerDb(postgres, "PostgreSQL 16", "Relational DB", "Particionamiento y tablas normalizadas")
    ContainerDb(redis, "Redis Cluster", "Lock Distribuido", "Mutex atómico con TTL 5000ms")
    ContainerQueue(rabbitmq, "RabbitMQ Exchange", "AMQP Broker", "Topic Exchange para eventos de dominio")
}

Rel(user, api_gw, "HTTPS / JSON", "Puerto 443")
Rel(api_gw, auth_svc, "gRPC", "Validar Token")
Rel(api_gw, orders_svc, "gRPC", "Crear Pedido")
Rel(orders_svc, redis, "Redlock Acquire", "TTL 5s")
Rel(orders_svc, postgres, "INSERT Order", "ACID")
Rel(orders_svc, rabbitmq, "order.settled", "Topic")
Rel(rabbitmq, payments_worker, "Consumir evento", "AMQP")
@enduml`;

  const mermaidCode = `sequenceDiagram
    autonumber
    actor Cliente as 👤 Cliente Web
    participant Gateway as 🚪 API Gateway
    participant OrderSvc as 📦 Orders Engine
    participant Redis as ⚡ Redis (Redlock)
    participant DB as 🗄️ PostgreSQL 16
    participant Bus as 📨 RabbitMQ

    Cliente->>Gateway: POST /payments/checkout (Idempotency-Key)
    Gateway->>OrderSvc: Enrutar payload verificado
    OrderSvc->>Redis: Adquirir Mutex lock:tx_uuid (TTL 5000ms)
    alt Lock adquirido con éxito
        OrderSvc->>DB: INSERT INTO orders (Status: PENDING)
        OrderSvc->>Bus: Emitir "order.settled"
        OrderSvc->>Redis: Liberar Mutex
        OrderSvc-->>Gateway: HTTP 200 (Order Created)
        Gateway-->>Cliente: Confirmación y Token de Pago
    else Conflicto de Concurrencia
        OrderSvc-->>Gateway: HTTP 429 (Retry-After: 500ms)
        Gateway-->>Cliente: Error de colisión transitoria
    end`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#15231b]">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-pulse" />
              SÍNTESIS C4 L2 / CONTAINER WIRE CANVAS
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Diagramas C4, Secuencia & Topología UML
          </h1>
          <p className="text-xs text-[#94a3b8] mt-1 max-w-3xl">
            Representación interactiva de contenedores, colas de mensajería y persistencia sintetizada a partir del AST estático.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#09110d] border border-[#182c20] p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab('canvas')}
              className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
                activeTab === 'canvas' ? 'bg-[#00FF87] text-black font-semibold' : 'text-[#94a3b8]'
              }`}
            >
              Canvas Interactivo
            </button>
            <button
              onClick={() => setActiveTab('sequence')}
              className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
                activeTab === 'sequence' ? 'bg-[#00FF87] text-black font-semibold' : 'text-[#94a3b8]'
              }`}
            >
              Diagrama de Secuencia
            </button>
            <button
              onClick={() => setActiveTab('plantuml')}
              className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
                activeTab === 'plantuml' ? 'bg-[#00FF87] text-black font-semibold' : 'text-[#94a3b8]'
              }`}
            >
              PlantUML
            </button>
            <button
              onClick={() => setActiveTab('mermaid')}
              className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
                activeTab === 'mermaid' ? 'bg-[#00FF87] text-black font-semibold' : 'text-[#94a3b8]'
              }`}
            >
              Mermaid
            </button>
          </div>

          <button
            onClick={() => handleCopy(activeTab === 'plantuml' ? plantumlCode : mermaidCode)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0d1611] border border-[#1b2a20] text-xs text-white hover:border-[#00FF87]/40 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#00FF87]" /> : <Copy className="w-3.5 h-3.5 text-[#00FF87]" />}
            <span>Copiar Definición</span>
          </button>
        </div>
      </div>

      {activeTab === 'canvas' && (
        <div className="rounded-2xl bg-[#060a08] border border-[#17271d] p-6 cyber-grid relative overflow-hidden shadow-2xl">
          {/* Canvas Top Bar */}
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#142318] flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-semibold text-white">
                C4 Nivel 2: Contenedores de Microservicios & Canales de Datos
              </span>
              <span className="text-[10px] font-mono text-[#00FF87] bg-[#0d1f14] px-2 py-0.5 rounded border border-[#1a3d28]">
                Flujos Vivos Activos
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#09110d] border border-[#192b20] rounded-lg p-1 text-xs">
              <button 
                onClick={() => setZoomLevel(z => Math.max(z - 10, 60))}
                className="p-1 text-[#94a3b8] hover:text-white"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-emerald-200 text-xs px-1">{zoomLevel}%</span>
              <button 
                onClick={() => setZoomLevel(z => Math.min(z + 10, 150))}
                className="p-1 text-[#94a3b8] hover:text-white"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setZoomLevel(100)}
                className="p-1 text-[#94a3b8] hover:text-white"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive SVG Diagram Canvas */}
          <div 
            className="w-full h-[520px] relative transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            {/* SVG Connecting Flow Lines with Cybernetic Neon mint pulse */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="streamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00FF87" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* User -> Gateway */}
              <line x1="120" y1="240" x2="260" y2="240" stroke="#00FF87" strokeWidth="2" strokeDasharray="6 6" className="animate-data-stream" />
              {/* Gateway -> Auth */}
              <path d="M 330 200 L 330 110 L 460 110" fill="none" stroke="#00FF87" strokeWidth="2" strokeDasharray="6 6" className="animate-data-stream" />
              {/* Gateway -> Orders */}
              <line x1="400" y1="240" x2="460" y2="240" stroke="#00FF87" strokeWidth="2" strokeDasharray="6 6" className="animate-data-stream" />
              {/* Orders -> Redis */}
              <path d="M 600 210 L 600 110 L 700 110" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 6" className="animate-data-stream" />
              {/* Orders -> Postgres */}
              <path d="M 600 270 L 600 370 L 700 370" fill="none" stroke="#00FF87" strokeWidth="2" strokeDasharray="6 6" className="animate-data-stream" />
              {/* Orders -> RabbitMQ */}
              <line x1="600" y1="240" x2="700" y2="240" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 6" className="animate-data-stream" />
            </svg>

            {/* Nodes Layout */}
            {/* Node 1: Client */}
            <div className="absolute left-6 top-48 w-28 p-3 rounded-xl bg-[#09120e] border border-[#1b3123] text-center shadow-lg">
              <div className="text-xl mb-1">👤</div>
              <div className="text-xs font-semibold text-white">Cliente Web</div>
              <div className="text-[9px] text-[#64748b] font-mono mt-0.5">HTTPS / Browser</div>
            </div>

            {/* Node 2: API Gateway */}
            <div 
              onClick={() => setActiveNode('api-gateway')}
              className={`absolute left-64 top-44 w-36 p-4 rounded-xl cursor-pointer transition-all ${
                activeNode === 'api-gateway'
                  ? 'bg-[#122419] border-2 border-[#00FF87] shadow-[0_0_20px_rgba(0,255,135,0.4)]'
                  : 'bg-[#09120e] border border-[#1b3123] hover:border-[#00FF87]/40'
              }`}
            >
              <div className="text-[10px] font-mono text-[#00FF87] font-semibold">CONTAINER</div>
              <div className="text-xs font-bold text-white mt-0.5">API Gateway</div>
              <div className="text-[10px] text-[#94a3b8] mt-1 font-mono">Envoy / Node.js</div>
              <div className="text-[9px] text-[#4edea3] mt-2 font-mono">Rate Limiting • SSL</div>
            </div>

            {/* Node 3: Auth Identity */}
            <div 
              onClick={() => setActiveNode('auth-identity')}
              className={`absolute left-[460px] top-12 w-36 p-4 rounded-xl cursor-pointer transition-all ${
                activeNode === 'auth-identity'
                  ? 'bg-[#122419] border-2 border-[#00FF87] shadow-[0_0_20px_rgba(0,255,135,0.4)]'
                  : 'bg-[#09120e] border border-[#1b3123] hover:border-[#00FF87]/40'
              }`}
            >
              <div className="text-[10px] font-mono text-[#00FF87] font-semibold">SERVICE</div>
              <div className="text-xs font-bold text-white mt-0.5">Auth Identity</div>
              <div className="text-[10px] text-[#94a3b8] mt-1 font-mono">NestJS / JWT RS256</div>
              <div className="text-[9px] text-[#64748b] mt-2 font-mono">RBAC Claims</div>
            </div>

            {/* Node 4: Orders Engine */}
            <div 
              onClick={() => setActiveNode('orders-engine')}
              className={`absolute left-[460px] top-44 w-36 p-4 rounded-xl cursor-pointer transition-all ${
                activeNode === 'orders-engine'
                  ? 'bg-[#122419] border-2 border-[#00FF87] shadow-[0_0_20px_rgba(0,255,135,0.4)]'
                  : 'bg-[#09120e] border border-[#1b3123] hover:border-[#00FF87]/40'
              }`}
            >
              <div className="text-[10px] font-mono text-[#00FF87] font-semibold">CORE SERVICE</div>
              <div className="text-xs font-bold text-white mt-0.5">Orders Engine</div>
              <div className="text-[10px] text-[#94a3b8] mt-1 font-mono">TypeScript / Redlock</div>
              <div className="text-[9px] text-[#00FF87] mt-2 font-mono">Idempotencia Activa</div>
            </div>

            {/* Node 5: Redis Cluster */}
            <div 
              onClick={() => setActiveNode('redis')}
              className={`absolute left-[700px] top-12 w-36 p-4 rounded-xl cursor-pointer transition-all ${
                activeNode === 'redis'
                  ? 'bg-[#122419] border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                  : 'bg-[#09120e] border border-[#1b3123] hover:border-amber-400/40'
              }`}
            >
              <div className="text-[10px] font-mono text-amber-400 font-semibold">IN-MEMORY MUTEX</div>
              <div className="text-xs font-bold text-white mt-0.5">Redis Cluster</div>
              <div className="text-[10px] text-[#94a3b8] mt-1 font-mono">Port 6379 (SPOF)</div>
              <div className="text-[9px] text-amber-300 mt-2 font-mono">TTL: 5000ms</div>
            </div>

            {/* Node 6: RabbitMQ */}
            <div 
              onClick={() => setActiveNode('rabbitmq')}
              className={`absolute left-[700px] top-44 w-36 p-4 rounded-xl cursor-pointer transition-all ${
                activeNode === 'rabbitmq'
                  ? 'bg-[#122419] border-2 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                  : 'bg-[#09120e] border border-[#1b3123] hover:border-cyan-400/40'
              }`}
            >
              <div className="text-[10px] font-mono text-cyan-400 font-semibold">EVENT BROKER</div>
              <div className="text-xs font-bold text-white mt-0.5">RabbitMQ</div>
              <div className="text-[10px] text-[#94a3b8] mt-1 font-mono">Topic: order.settled</div>
              <div className="text-[9px] text-[#64748b] mt-2 font-mono">DLQ Backoff</div>
            </div>

            {/* Node 7: PostgreSQL 16 */}
            <div 
              onClick={() => setActiveNode('postgres')}
              className={`absolute left-[700px] top-76 w-36 p-4 rounded-xl cursor-pointer transition-all ${
                activeNode === 'postgres'
                  ? 'bg-[#122419] border-2 border-[#00FF87] shadow-[0_0_20px_rgba(0,255,135,0.4)]'
                  : 'bg-[#09120e] border border-[#1b3123] hover:border-[#00FF87]/40'
              }`}
            >
              <div className="text-[10px] font-mono text-[#00FF87] font-semibold">DATABASE</div>
              <div className="text-xs font-bold text-white mt-0.5">PostgreSQL 16</div>
              <div className="text-[10px] text-[#94a3b8] mt-1 font-mono">Port 5432 / ACID</div>
              <div className="text-[9px] text-emerald-300 mt-2 font-mono">34 Tablas • 3NF</div>
            </div>
          </div>

          {/* Node Inspector Bottom Drawer */}
          {activeNode && (
            <div className="mt-4 p-4 rounded-xl bg-[#08100c] border border-[#182c20] flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#64748b]">Nodo Seleccionado:</span>
                <h4 className="text-sm font-semibold text-white font-mono uppercase text-[#00FF87]">
                  {activeNode}
                </h4>
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  {activeNode === 'orders-engine'
                    ? 'Microservicio central de pedidos. Emplea el algoritmo Redlock para asegurar que ningún pago se cobre dos veces y publica eventos asíncronos hacia RabbitMQ.'
                    : activeNode === 'redis'
                    ? 'Instancia Redis Cluster utilizada como almacén de mutexes de baja latencia (1.2ms p95). Actualmente categorizado como SPOF al no contar con replica failover.'
                    : 'Componente activo dentro del bounded context del sistema.'}
                </p>
              </div>
              <button className="px-3.5 py-1.5 rounded-lg bg-[#00FF87] text-black font-semibold text-xs hover:bg-[#00e076] transition-colors cursor-pointer">
                Inspeccionar AST del Nodo
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'sequence' && (
        <div className="rounded-2xl bg-[#08100c] border border-[#182c20] p-5 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#142318]">
            <span className="text-xs font-semibold text-white">Flujo Temporal de Transacción & Manejo de Concurrencia</span>
            <span className="text-[10px] text-[#00FF87] px-2 py-0.5 rounded bg-[#0d1f14] border border-[#1a3d28]">
              Mermaid Sequence Engine
            </span>
          </div>
          <pre className="p-4 rounded-xl bg-[#050806] border border-[#142318] text-emerald-100 overflow-x-auto leading-6">
            {mermaidCode}
          </pre>
        </div>
      )}

      {activeTab === 'plantuml' && (
        <div className="rounded-2xl bg-[#08100c] border border-[#182c20] p-5 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#142318]">
            <span className="text-xs font-semibold text-white">PlantUML C4 Container Definition</span>
            <span className="text-[10px] text-[#00FF87] px-2 py-0.5 rounded bg-[#0d1f14]">C4-PlantUML Spec</span>
          </div>
          <pre className="p-4 rounded-xl bg-[#050806] border border-[#142318] text-emerald-100 overflow-x-auto leading-6">
            {plantumlCode}
          </pre>
        </div>
      )}

      {activeTab === 'mermaid' && (
        <div className="rounded-2xl bg-[#08100c] border border-[#182c20] p-5 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#142318]">
            <span className="text-xs font-semibold text-white">Mermaid JS Definition</span>
            <span className="text-[10px] text-[#00FF87] px-2 py-0.5 rounded bg-[#0d1f14]">Mermaid v10</span>
          </div>
          <pre className="p-4 rounded-xl bg-[#050806] border border-[#142318] text-emerald-100 overflow-x-auto leading-6">
            {mermaidCode}
          </pre>
        </div>
      )}
    </div>
  );
};
