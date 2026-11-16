import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  Terminal, 
  GraduationCap, 
  Code2, 
  Cpu, 
  Layers, 
  ArrowRight,
  Bot,
  User,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { ProjectWorkspace, ExplanationLevel, ChatMessage } from '../types';

interface ChatAsistenteIAProps {
  project: ProjectWorkspace;
  initialPrompt?: string;
  level: ExplanationLevel;
  onChangeLevel: (lvl: ExplanationLevel) => void;
}

export const ChatAsistenteIA: React.FC<ChatAsistenteIAProps> = ({
  project,
  initialPrompt,
  level,
  onChangeLevel
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      content: `### Bienvenido a la Consola de Inteligencia Artificial de CodeExplain 🚀\n\nHe analizado el repositorio **${project.name}** (\`${project.repoIdentifier}\`). Conozco su topología de microservicios, el árbol sintáctico (AST), el esquema de PostgreSQL 16 y el patrón de idempotencia con Redlock.\n\nPuedo explicarte el proyecto en tres niveles de profundidad:\n\n- 🎓 **Básico:** Analogías sencillas y explicaciones claras para estudiantes y principiantes.\n- 💻 **Intermedio:** Patrones de arquitectura, TypeScript, APIs y control de errores para desarrolladores.\n- ⚙️ **Avanzado:** Concurrencia distribuida, métricas de Martin, AST y modelos de consistencia para arquitectos.\n\n*¿Qué componente o flujo deseas inspeccionar hoy?*`,
      timestamp: 'Ahora',
      level: level
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeDocTab, setActiveDocTab] = useState<'readme' | 'openapi' | 'business' | 'c4'>('readme');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialPrompt) {
      sendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: textToSend,
      timestamp: 'Justo ahora',
      level: level
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          level: level,
          projectContext: {
            name: project.name,
            description: project.description,
            techStack: project.languages,
            astHealth: project.astHealth
          }
        })
      });

      if (!response.ok) throw new Error('Network error');
      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: data.reply || 'Análisis completado.',
        timestamp: 'Justo ahora',
        level: level
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      // Fallback local explanation
      let fallbackText = '';
      if (level === 'basico') {
        fallbackText = `### Explicación en Nivel Básico (Para Principiantes) 🎓\n\nRespecto a tu consulta sobre **"${textToSend}"**:\n\nImagina que este software es como un restaurante de alta cocina:\n- El **API Gateway** es el recepcionista que te da la bienvenida y verifica que tengas reservación.\n- Los **Microservicios** son los cocineros especializados (uno hace postres, otro prepara la carne).\n- El **Redlock en Redis** es una campana que suena para avisar que un plato ya se sirvió, evitando que dos meseros lleven la misma comida a la misma mesa.`;
      } else if (level === 'avanzado') {
        fallbackText = `### Análisis de Arquitectura Distribuida (Nivel Avanzado) ⚙️\n\nRespecto a **"${textToSend}"**:\n\n1. **Linearizabilidad:** El sistema impone ordenamiento total de transacciones mediante timestamps UTC y leases atómicos en Redis Cluster.\n2. **Métricas de Acoplamiento de Martin:**\n   - Eferente ($C_e = 4$), Aferente ($C_a = 11$), dando una inestabilidad $I = 0.26$ (altamente estable).\n3. **Resiliencia:** Retry jitter exponencial con límite de 5 intentos y encolamiento en Dead Letter Queue (DLQ) para salvaguardar el throughput de la pasarela.`;
      } else {
        fallbackText = `### Explicación Técnica (Nivel Intermedio) 💻\n\nRespecto a tu consulta sobre **"${textToSend}"**:\n\n- **Estructura:** El módulo implementa inyección de dependencias con NestJS y TypeORM.\n- **Flujo:** La solicitud entra al controlador, pasa por los DTO Pipes de validación y llega al servicio transaccional.\n- **Idempotencia:** Se verifica el header \`Idempotency-Key\` para evitar ejecuciones repetidas.`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: fallbackText,
        timestamp: 'Justo ahora',
        level: level
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const docSnippets = {
    readme: `# ${project.name} (${project.repoIdentifier})
> Documentación técnica inferida automáticamente por CodeExplain AI Engine v2.4

## 📌 Arquitectura del Sistema
- **Patrón:** Microservicios orientados a eventos (Event-Driven Architecture).
- **Core Stack:** ${project.languages.join(' • ')}
- **Persistencia:** PostgreSQL 16 con particionamiento por rangos temporales.
- **Concurrencia:** Mutex distribuido Redlock sobre Redis Cluster.

## 🚀 Puesta en Marcha (Bootstrap)
\`\`\`bash
# 1. Clonar el repositorio
git clone https://github.com/org/${project.repoIdentifier}.git
cd ${project.repoIdentifier}

# 2. Levantar infraestructura local
docker compose up -d postgres redis rabbitmq

# 3. Instalar y correr migraciones
npm install
npm run db:migrate
npm run dev
\`\`\``,
    openapi: `openapi: 3.1.0
info:
  title: ${project.name} REST API
  version: 2.4.0
  description: API autogenerada y validada contra esquemas de tipos TypeScript.
paths:
  /api/v1/payments/checkout:
    post:
      summary: Finalizar orden de compra con idempotencia
      headers:
        Idempotency-Key:
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Orden procesada correctamente
        '409':
          description: Conflicto de concurrencia detectado (Lock activo)`,
    business: `### Reglas de Negocio Validadas (Invariantes del Sistema)
1. **RN-01 (Invariante de Moneda):** Todas las transacciones en una misma orden deben cotizarse en la divisa original de creación del carrito.
2. **RN-02 (TTL de Checkout):** El stock se reserva por un máximo de 15 minutos (900s). Tras este periodo, un worker libera las unidades en Redis.
3. **RN-03 (Idempotencia Estricta):** Reintentos del webhook de Stripe con el mismo \`event.id\` retornan HTTP 200 sin volver a debitar inventario ni disparar email.`,
    c4: `@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

Person(user, "Cliente Web", "Usuario final de la plataforma")
System_Boundary(c1, "${project.name}") {
    Container(api_gw, "API Gateway", "Envoy / Node.js", "Enrutamiento seguro y Rate Limiting")
    Container(auth_svc, "Auth Identity", "NestJS / JWT", "Firma RS256 y roles RBAC")
    Container(orders_svc, "Orders Engine", "NestJS", "Gestión de pedidos e inventario")
    ContainerDb(db, "PostgreSQL 16", "Relational DB", "Esquema normalizado 3NF")
    ContainerDb(redis, "Redis Cluster", "Lock In-Memory", "Algoritmo Redlock")
}

Rel(user, api_gw, "HTTPS")
Rel(api_gw, orders_svc, "gRPC")
Rel(orders_svc, redis, "Atomic Mutex")
Rel(orders_svc, db, "ACID Transactions")
@enduml`
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#15231b] flex-wrap gap-2 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00FF87]/15 border border-[#00FF87]/30 flex items-center justify-center text-[#00FF87]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              Consola Semántica Gemini Pro & Split View
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30">
                GEMINI 2.5 FLASH
              </span>
            </h1>
            <p className="text-xs text-[#94a3b8]">
              Conserva el contexto del repositorio <strong className="text-emerald-200">{project.name}</strong> y responde según tu nivel de expertise.
            </p>
          </div>
        </div>

        {/* Level Selector Pills */}
        <div className="flex items-center gap-1.5 bg-[#09110d] border border-[#182c20] p-1 rounded-xl text-xs">
          <button
            onClick={() => onChangeLevel('basico')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              level === 'basico' ? 'bg-[#00FF87] text-black font-semibold shadow-sm' : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Básico</span>
          </button>
          <button
            onClick={() => onChangeLevel('intermedio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              level === 'intermedio' ? 'bg-[#00FF87] text-black font-semibold shadow-sm' : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Intermedio</span>
          </button>
          <button
            onClick={() => onChangeLevel('avanzado')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              level === 'avanzado' ? 'bg-[#00FF87] text-black font-semibold shadow-sm' : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Avanzado</span>
          </button>
        </div>
      </div>

      {/* Main Dual Console Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0 overflow-hidden">
        {/* Left Column: Chat Conversation (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#08100c] border border-[#182c20] flex flex-col h-full overflow-hidden shadow-2xl">
          {/* Chat Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-[#00FF87]/20 border border-[#00FF87]/40 flex items-center justify-center text-[#00FF87] shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-md leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#122419] border border-[#00FF87]/40 text-emerald-100'
                      : 'bg-[#050806] border border-[#16271c] text-[#e2e8f0]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 pb-2 mb-2 border-b border-[#142318] text-[10px] text-[#64748b]">
                    <span>{msg.sender === 'user' ? 'Desarrollador' : 'CodeExplain AI Core'}</span>
                    <div className="flex items-center gap-2">
                      <span className="capitalize text-[#00FF87] font-semibold">[{msg.level || level}]</span>
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-2 whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-[#14241a] border border-[#1f3d2a] flex items-center justify-center text-[#94a3b8] shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 items-center text-xs text-[#00FF87]">
                <div className="w-7 h-7 rounded-lg bg-[#00FF87]/20 border border-[#00FF87]/40 flex items-center justify-center text-[#00FF87]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <span>Gemini Pro está razonando sobre el AST del repositorio...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-2 border-t border-[#142318] bg-[#060a08] flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-[10px] font-mono text-[#64748b] shrink-0 uppercase px-1">Sugerencias:</span>
            <button
              onClick={() => sendMessage('¿Cómo funciona el patrón Redlock para evitar cobros dobles?')}
              className="px-2.5 py-1 rounded-lg bg-[#0d1812] border border-[#192f22] text-[#94a3b8] hover:text-white shrink-0 cursor-pointer"
            >
              Explicar Redlock
            </button>
            <button
              onClick={() => sendMessage('¿Cómo se relacionan los modelos de PostgreSQL users y orders?')}
              className="px-2.5 py-1 rounded-lg bg-[#0d1812] border border-[#192f22] text-[#94a3b8] hover:text-white shrink-0 cursor-pointer"
            >
              Relación DB
            </button>
            <button
              onClick={() => sendMessage('¿Cuáles son los riesgos identificados en el módulo de pagos?')}
              className="px-2.5 py-1 rounded-lg bg-[#0d1812] border border-[#192f22] text-[#94a3b8] hover:text-white shrink-0 cursor-pointer"
            >
              Riesgos de Pagos
            </button>
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-[#142318] bg-[#070c09]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(inputText);
              }}
              className="flex items-center gap-2"
            >
              <textarea
                rows={1}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(inputText);
                  }
                }}
                placeholder={`Pregunta lo que sea sobre ${project.name} (Nivel ${level.toUpperCase()})...`}
                className="flex-1 bg-[#040605] border border-[#17271d] focus:border-[#00FF87] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs font-mono text-emerald-100 placeholder:text-[#475569] resize-none"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-[#00FF87] hover:bg-[#00e076] text-black flex items-center justify-center transition-all cursor-pointer shadow-[0_0_15px_rgba(0,255,135,0.3)] disabled:opacity-50 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live Documentation Split View (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#08100c] border border-[#182c20] flex flex-col h-full overflow-hidden shadow-2xl">
          {/* Docs Tab Header */}
          <div className="p-3 border-b border-[#142318] flex items-center justify-between bg-[#060a08] flex-wrap gap-2">
            <div className="flex items-center gap-1.5 bg-[#09110d] border border-[#182c20] p-1 rounded-lg text-xs">
              <button
                onClick={() => setActiveDocTab('readme')}
                className={`px-2.5 py-1 rounded font-mono transition-colors cursor-pointer ${
                  activeDocTab === 'readme' ? 'bg-[#00FF87] text-black font-semibold' : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                README Vivo
              </button>
              <button
                onClick={() => setActiveDocTab('openapi')}
                className={`px-2.5 py-1 rounded font-mono transition-colors cursor-pointer ${
                  activeDocTab === 'openapi' ? 'bg-[#00FF87] text-black font-semibold' : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                OpenAPI 3.1
              </button>
              <button
                onClick={() => setActiveDocTab('business')}
                className={`px-2.5 py-1 rounded font-mono transition-colors cursor-pointer ${
                  activeDocTab === 'business' ? 'bg-[#00FF87] text-black font-semibold' : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                Reglas
              </button>
              <button
                onClick={() => setActiveDocTab('c4')}
                className={`px-2.5 py-1 rounded font-mono transition-colors cursor-pointer ${
                  activeDocTab === 'c4' ? 'bg-[#00FF87] text-black font-semibold' : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                C4 PlantUML
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => copyToClipboard(docSnippets[activeDocTab], 'doc-copy')}
                className="p-1.5 rounded-lg bg-[#0d1611] border border-[#1a2e22] text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
                title="Copiar contenido"
              >
                {copiedId === 'doc-copy' ? <Check className="w-3.5 h-3.5 text-[#00FF87]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([docSnippets[activeDocTab]], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${project.repoIdentifier}-${activeDocTab}.txt`;
                  a.click();
                }}
                className="p-1.5 rounded-lg bg-[#0d1611] border border-[#1a2e22] text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
                title="Descargar"
              >
                <Download className="w-3.5 h-3.5 text-[#00FF87]" />
              </button>
            </div>
          </div>

          {/* Document Content View */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#050806] font-mono text-xs leading-relaxed text-emerald-100">
            <pre className="whitespace-pre-wrap break-words">
              {docSnippets[activeDocTab]}
            </pre>
          </div>

          {/* Sync Footer */}
          <div className="p-3 border-t border-[#142318] bg-[#060a08] flex items-center justify-between text-[11px] font-mono text-[#64748b]">
            <span className="flex items-center gap-1.5 text-[#00FF87]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-pulse" />
              En Sincronía (v2.4.0)
            </span>
            <span>Confluence & GitHub Wiki Sync Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
