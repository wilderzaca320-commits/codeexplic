import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  ExternalLink, 
  Share2, 
  BookOpen,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ProjectWorkspace, ExplanationLevel } from '../types';

interface GeneradorDocumentacionProps {
  project: ProjectWorkspace;
  level: ExplanationLevel;
}

export const GeneradorDocumentacion: React.FC<GeneradorDocumentacionProps> = ({ project, level }) => {
  const [selectedDoc, setSelectedDoc] = useState<'readme' | 'openapi' | 'c4' | 'adr'>('readme');
  const [copied, setCopied] = useState(false);

  const docs = {
    readme: `# ${project.name}
> Documentación generada automáticamente por CodeExplain AI Engine v2.4

## 1. Propósito del Sistema
${project.description}

## 2. Stack Tecnológico & Dependencias Core
- **Lenguajes:** ${project.languages.join(', ')}
- **Persistencia:** PostgreSQL 16.2 (Particionamiento por rango de fecha)
- **Caché y Locks:** Redis 7.2 Cluster (Algoritmo Redlock)
- **Broker de Mensajería:** RabbitMQ (Topic Exchange con DLQ)

## 3. Instrucciones de Despliegue Local
\`\`\`bash
# 1. Clonar repositorio
git clone https://github.com/org/${project.repoIdentifier}.git
cd ${project.repoIdentifier}

# 2. Iniciar contenedores auxiliares
docker compose up -d postgres redis

# 3. Instalar librerías y ejecutar tests
npm install
npm run test:unit
npm run start:dev
\`\`\``,
    openapi: `openapi: 3.1.0
info:
  title: ${project.name} API Spec
  version: 2.4.0
  description: Contrato de interfaz REST validado semánticamente.
paths:
  /api/v1/orders/checkout:
    post:
      summary: Procesa el cobro de una orden activa
      parameters:
        - name: Idempotency-Key
          in: header
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Orden cobrada con éxito
        '409':
          description: Conflicto de bloqueo concurrente`,
    c4: `@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

Person(client, "Usuario Comprador", "Navegador web / App móvil")
System_Boundary(core, "${project.name}") {
  Container(api, "API Gateway", "Node.js Envoy", "Enrutamiento perimetral")
  Container(orders, "Orders Service", "NestJS", "Lógica de negocio e inventario")
  ContainerDb(db, "PostgreSQL 16", "RDBMS", "Almacenamiento ACID")
}

Rel(client, api, "HTTPS 443")
Rel(api, orders, "gRPC")
Rel(orders, db, "SQL Queries")
@enduml`,
    adr: `# ADR-004: Adopción del Algoritmo Redlock para Concurrencia en Checkout
**Estado:** Aprobado • **Fecha:** 2026-03-12

## Contexto
El alto tráfico durante eventos de venta masiva generó colisiones de concurrencia donde dos solicitudes con el mismo ID de transacción intentaban debitar stock de forma simultánea.

## Decisión
Implementar el algoritmo Redlock distribuido sobre Redis Cluster con un tiempo de vida (TTL) de 5,000ms y reintentos exponenciales en caso de colisión.

## Consecuencias
- **Positivas:** Cero incidencias de cobros duplicados en producción.
- **Negativas:** Dependencia de red con Redis (mitigado mediante watchdog).`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(docs[selectedDoc]);
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
              SÍNTESIS DE DOCUMENTACIÓN TÉCNICA DINÁMICA
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Generador de Documentación de Software
          </h1>
          <p className="text-xs text-[#94a3b8] mt-1 max-w-3xl">
            Genera manuales, especificaciones OpenAPI 3.1, diagramas C4 y registros de decisiones arquitectónicas (ADRs) listos para consultar y exportar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1611] border border-[#1b2a20] text-xs text-white hover:border-[#00FF87]/40 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#00FF87]" /> : <Copy className="w-3.5 h-3.5 text-[#00FF87]" />}
            <span>Copiar al Portapapeles</span>
          </button>
          <button
            onClick={() => {
              const blob = new Blob([docs[selectedDoc]], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${project.repoIdentifier}-${selectedDoc}.md`;
              a.click();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#00FF87] hover:bg-[#00e076] text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(0,255,135,0.3)] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar Markdown (.md)</span>
          </button>
        </div>
      </div>

      {/* Docs Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setSelectedDoc('readme')}
          className={`p-3.5 rounded-xl text-left transition-all cursor-pointer ${
            selectedDoc === 'readme'
              ? 'bg-[#122419] border-2 border-[#00FF87] shadow-[0_0_15px_-4px_rgba(0,255,135,0.3)]'
              : 'bg-[#08100c] border border-[#182c20] hover:border-[#00FF87]/40'
          }`}
        >
          <div className="text-xs font-mono font-bold text-[#00FF87]">01. README.md</div>
          <div className="text-xs font-semibold text-white mt-1">Manual de Onboarding</div>
        </button>

        <button
          onClick={() => setSelectedDoc('openapi')}
          className={`p-3.5 rounded-xl text-left transition-all cursor-pointer ${
            selectedDoc === 'openapi'
              ? 'bg-[#122419] border-2 border-[#00FF87] shadow-[0_0_15px_-4px_rgba(0,255,135,0.3)]'
              : 'bg-[#08100c] border border-[#182c20] hover:border-[#00FF87]/40'
          }`}
        >
          <div className="text-xs font-mono font-bold text-[#00FF87]">02. OpenAPI 3.1</div>
          <div className="text-xs font-semibold text-white mt-1">Contrato Swagger REST</div>
        </button>

        <button
          onClick={() => setSelectedDoc('c4')}
          className={`p-3.5 rounded-xl text-left transition-all cursor-pointer ${
            selectedDoc === 'c4'
              ? 'bg-[#122419] border-2 border-[#00FF87] shadow-[0_0_15px_-4px_rgba(0,255,135,0.3)]'
              : 'bg-[#08100c] border border-[#182c20] hover:border-[#00FF87]/40'
          }`}
        >
          <div className="text-xs font-mono font-bold text-[#00FF87]">03. Diagrama C4</div>
          <div className="text-xs font-semibold text-white mt-1">PlantUML Containers</div>
        </button>

        <button
          onClick={() => setSelectedDoc('adr')}
          className={`p-3.5 rounded-xl text-left transition-all cursor-pointer ${
            selectedDoc === 'adr'
              ? 'bg-[#122419] border-2 border-[#00FF87] shadow-[0_0_15px_-4px_rgba(0,255,135,0.3)]'
              : 'bg-[#08100c] border border-[#182c20] hover:border-[#00FF87]/40'
          }`}
        >
          <div className="text-xs font-mono font-bold text-[#00FF87]">04. Registro ADR</div>
          <div className="text-xs font-semibold text-white mt-1">Decisiones Técnicas</div>
        </button>
      </div>

      {/* Live Markdown Document View */}
      <div className="rounded-2xl bg-[#08100c] border border-[#182c20] p-6 font-mono text-xs shadow-xl leading-relaxed">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#142318] text-[#64748b]">
          <span>Vista Previa del Artefacto Generado</span>
          <span className="text-[#00FF87]">Sincronizable con Confluence y GitHub Wiki</span>
        </div>
        <pre className="p-4 rounded-xl bg-[#040605] border border-[#142318] text-emerald-100 overflow-x-auto whitespace-pre-wrap leading-6">
          {docs[selectedDoc]}
        </pre>
      </div>
    </div>
  );
};
