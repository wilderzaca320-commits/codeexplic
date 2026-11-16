import React, { useState } from 'react';
import { 
  Database, 
  Key, 
  Layers, 
  Sparkles, 
  Copy, 
  Check, 
  FileCode, 
  ArrowRight, 
  Play, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { DatabaseTable, ExplanationLevel } from '../types';
import { MOCK_DB_TABLES } from '../data/mockData';

interface ModeloDatosBDProps {
  level: ExplanationLevel;
  onNavigate: (view: any) => void;
}

export const ModeloDatosBD: React.FC<ModeloDatosBDProps> = ({ level }) => {
  const [activeDomain, setActiveDomain] = useState('todos');
  const [activeOrm, setActiveOrm] = useState<'prisma' | 'typeorm' | 'ddl'>('prisma');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const prismaSchema = `// schema.prisma autogenerado por CodeExplain
model Order {
  id              String         @id @default(uuid()) @db.Uuid
  userId          String         @map("user_id") @db.Uuid
  status          OrderStatus
  amountCents     Decimal
  idempotencyKey  String         @unique @map("idempotency_key")
  currency        String         @default("USD") @db.VarChar(3)
  createdAt       DateTime       @default(now()) @map("created_at")

  // Relaciones tipadas
  user            User           @relation(fields: [userId], references: [id])
  items           OrderItem[]
  payments        PaymentsLedger?

  @@index([userId, status], name: "idx_orders_user_status")
  @@map("orders")
}`;

  const typeormSchema = `// TypeORM Entity autogenerada por CodeExplain
@Entity('orders')
@Index('idx_orders_user_status', ['userId', 'status'])
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column({ name: 'amount_cents', type: 'decimal', precision: 12, scale: 2 })
  amountCents: number;

  @Column({ name: 'idempotency_key', unique: true })
  idempotencyKey: string;

  @ManyToOne(() => User, (u) => u.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;
}`;

  const ddlSchema = `-- DDL PostgreSQL 16 con particionado
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(32) NOT NULL,
  amount_cents NUMERIC(12,2) NOT NULL,
  idempotency_key VARCHAR(64) UNIQUE NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE INDEX idx_orders_user_status ON orders (user_id, status);`;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#15231b]">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-pulse" />
              MOTOR RELACIONAL POSTGRESQL 16.2
            </span>
            <span className="text-[11px] font-mono text-[#64748b]">
              Schema: <span className="text-emerald-200">public</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Modelo de Datos & Diccionario Relacional
          </h1>
          <p className="text-xs text-[#94a3b8] mt-1 max-w-3xl">
            Topología inferida por AST estático y reverse engineering de migraciones SQL. Inspección semántica de integridad referencial, normalización e indexación computada.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => copyToClipboard(ddlSchema, 'ddl-full')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0d1611] border border-[#1b2a20] text-xs text-white hover:border-[#00FF87]/50 transition-colors cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5 text-[#00FF87]" />
            <span>{copiedCode === 'ddl-full' ? 'DDL Copiado!' : 'Exportar DDL (SQL)'}</span>
          </button>
          <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#00FF87] hover:bg-[#00e076] text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(0,255,135,0.3)] cursor-pointer">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Analizar Migración AI</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20]">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-[10px] font-mono uppercase">Tablas Detectadas</span>
            <Database className="w-4 h-4 text-[#00FF87]" />
          </div>
          <div className="text-2xl font-mono font-bold text-white mt-1">
            34 <span className="text-xs font-normal text-[#00FF87]">+2 vs v2.3</span>
          </div>
          <div className="text-[11px] text-[#64748b] mt-1">9 esquemas de particionado</div>
        </div>

        <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20]">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-[10px] font-mono uppercase">Foreign Keys (FK)</span>
            <Key className="w-4 h-4 text-[#00FF87]" />
          </div>
          <div className="text-2xl font-mono font-bold text-white mt-1">
            82 <span className="text-xs font-normal text-[#4edea3]">100% integradas</span>
          </div>
          <div className="text-[11px] text-[#64748b] mt-1">0 relaciones huérfanas</div>
        </div>

        <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20]">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-[10px] font-mono uppercase">Índices Críticos</span>
            <Layers className="w-4 h-4 text-[#00FF87]" />
          </div>
          <div className="text-2xl font-mono font-bold text-white mt-1">
            14 <span className="text-xs font-normal text-[#94a3b8]">B-Tree + GIN</span>
          </div>
          <div className="text-[11px] text-[#64748b] mt-1">1 cuello de botella resuelto</div>
        </div>

        <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20]">
          <div className="flex items-center justify-between text-[#64748b]">
            <span className="text-[10px] font-mono uppercase">Normalización</span>
            <CheckCircle2 className="w-4 h-4 text-[#00FF87]" />
          </div>
          <div className="text-2xl font-mono font-bold text-white mt-1">
            3NF <span className="text-xs font-normal text-[#00FF87]">0 anomalías</span>
          </div>
          <div className="text-[11px] text-[#64748b] mt-1">Boyce-Codd compliant</div>
        </div>
      </div>

      {/* Domain Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveDomain('todos')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeDomain === 'todos'
              ? 'bg-[#00FF87] text-black font-semibold shadow-sm'
              : 'bg-[#09110d] border border-[#192b20] text-[#94a3b8] hover:text-white'
          }`}
        >
          Todos los Dominios (34)
        </button>
        <button
          onClick={() => setActiveDomain('pagos')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeDomain === 'pagos'
              ? 'bg-[#00FF87] text-black font-semibold shadow-sm'
              : 'bg-[#09110d] border border-[#192b20] text-[#94a3b8] hover:text-white'
          }`}
        >
          Pagos & Facturación (8)
        </button>
        <button
          onClick={() => setActiveDomain('usuarios')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeDomain === 'usuarios'
              ? 'bg-[#00FF87] text-black font-semibold shadow-sm'
              : 'bg-[#09110d] border border-[#192b20] text-[#94a3b8] hover:text-white'
          }`}
        >
          Usuarios & Roles (6)
        </button>
        <button
          onClick={() => setActiveDomain('catalogo')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeDomain === 'catalogo'
              ? 'bg-[#00FF87] text-black font-semibold shadow-sm'
              : 'bg-[#09110d] border border-[#192b20] text-[#94a3b8] hover:text-white'
          }`}
        >
          Catálogo & Stock (12)
        </button>
        <button
          onClick={() => setActiveDomain('auditoria')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeDomain === 'auditoria'
              ? 'bg-[#00FF87] text-black font-semibold shadow-sm'
              : 'bg-[#09110d] border border-[#192b20] text-[#94a3b8] hover:text-white'
          }`}
        >
          Auditoría & Logs (8)
        </button>
      </div>

      {/* Relational Graph Canvas */}
      <div className="rounded-2xl bg-[#060a08] border border-[#17271d] p-5 shadow-2xl relative cyber-grid">
        {/* Canvas Top Bar */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#142318] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00FF87] animate-pulse" />
            <span className="text-xs font-mono font-semibold text-white tracking-wide">
              GRAFO RELACIONAL EN VIVO • CLUSTER PRIMARIO
            </span>
            <span className="text-[10px] font-mono text-[#00FF87] bg-[#0d1f14] px-2 py-0.5 rounded border border-[#1a3d28]">
              Modo: Auto-Layout Cardinal
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#09110d] border border-[#192b20] rounded-lg p-1 text-xs">
            <button 
              onClick={() => setZoomLevel((z) => Math.max(z - 10, 60))}
              className="p-1 rounded hover:bg-[#121f17] text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] text-emerald-200 px-1">{zoomLevel}%</span>
            <button 
              onClick={() => setZoomLevel((z) => Math.min(z + 10, 150))}
              className="p-1 rounded hover:bg-[#121f17] text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setZoomLevel(100)}
              className="p-1 rounded hover:bg-[#121f17] text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ERD Interactive Cards Grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
        >
          {MOCK_DB_TABLES.map((table) => (
            <div 
              key={table.name}
              className="rounded-xl bg-[#09120e] border border-[#192b20] hover:border-[#00FF87]/50 transition-all p-3.5 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#142318]">
                  <div className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-[#00FF87]" />
                    <span className="font-mono font-bold text-xs text-white">{table.name}</span>
                  </div>
                  {table.isCore ? (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30">
                      CORE TABLE
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-[#64748b]">{table.rowsEstimate}</span>
                  )}
                </div>

                {/* Columns */}
                <div className="space-y-1.5 font-mono text-[11px]">
                  {table.columns.map((col) => (
                    <div key={col.name} className="flex items-center justify-between text-xs py-0.5 px-1.5 rounded bg-[#060a08]/60">
                      <div className="flex items-center gap-1.5 truncate">
                        {col.isPk && (
                          <span className="text-[9px] px-1 rounded bg-[#00FF87]/20 text-[#00FF87] font-bold">
                            PK
                          </span>
                        )}
                        {col.isFk && (
                          <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-400 font-bold">
                            FK
                          </span>
                        )}
                        {col.isUnique && (
                          <span className="text-[9px] px-1 rounded bg-purple-500/20 text-purple-300 font-bold">
                            UQ
                          </span>
                        )}
                        <span className={col.isPk ? 'text-white font-semibold' : 'text-[#94a3b8]'}>
                          {col.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#64748b] truncate ml-2">
                        {col.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-3 pt-2 border-t border-[#142318] flex items-center justify-between text-[10px] font-mono text-[#64748b]">
                <span>
                  {table.partitionStrategy ? `Partición: ${table.partitionStrategy}` : 'Inmutable: Trigger Check'}
                </span>
                <span className="text-[#00FF87]">
                  {table.name === 'orders' ? '1:N | 1:1' : '1:N -> orders'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Graph Legend */}
        <div className="mt-4 pt-3 border-t border-[#142318] flex items-center justify-between text-[11px] text-[#64748b] flex-wrap gap-2 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#00FF87]" /> Relación Fuerte (1:N)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-400" /> Relación Débil (N:M bridge)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-red-400" /> Restricción de Integridad FK ON DELETE CASCADE
            </span>
          </div>
          <span className="text-[#00FF87]">4 de 34 Tablas renderizadas en viewport activo</span>
        </div>
      </div>

      {/* Two Column Grid: Index Analysis & Model/ORM Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Index Analysis (5 cols) */}
        <div className="lg:col-span-5 rounded-xl bg-[#08100c] border border-[#182c20] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between pb-3 border-b border-[#142318]">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#00FF87]" />
                  Análisis de Índices & Cuellos de Botella
                </h3>
                <p className="text-[11px] text-[#64748b] mt-0.5">
                  Diagnóstico de costo de ejecución estimado (pg_stat_statements)
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30">
                ⚡ -73% Latencia
              </span>
            </div>

            <div className="mt-3 space-y-3">
              <div className="p-3 rounded-lg bg-[#060a08] border border-[#1a2e22]">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-red-950/60 text-red-400 text-[10px] font-mono font-bold">
                    ALTA PRIORIDAD
                  </span>
                  <span className="text-[10px] font-mono text-[#64748b]">Seq Scan detectado</span>
                </div>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Se identificó un cuello de botella recurrente en endpoints de conciliación: la consulta por <strong className="text-white font-mono">orders(user_id, status)</strong> ejecuta barridos secuenciales sobre 1.2M de tuplas.
                </p>

                {/* SQL snippet */}
                <div className="mt-2.5 p-2 rounded bg-[#040605] border border-[#16271c] font-mono text-[11px] text-[#00FF87] relative group">
                  <code>CREATE INDEX CONCURRENTLY idx_orders_user_status ON orders (user_id, status) WHERE status != 'cancelled';</code>
                  <button 
                    onClick={() => copyToClipboard("CREATE INDEX CONCURRENTLY idx_orders_user_status ON orders (user_id, status) WHERE status != 'cancelled';", 'idx-sql')}
                    className="absolute right-2 top-2 p-1 rounded bg-[#0d1611] text-[#94a3b8] hover:text-white"
                  >
                    {copiedCode === 'idx-sql' ? <Check className="w-3 h-3 text-[#00FF87]" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 text-center text-[10px] font-mono">
                  <div className="p-1.5 rounded bg-[#08100c] border border-[#16271c]">
                    <div className="text-[#64748b]">Costo Planificado</div>
                    <div className="text-red-400 font-bold">4,812.20 → 12.40</div>
                  </div>
                  <div className="p-1.5 rounded bg-[#08100c] border border-[#16271c]">
                    <div className="text-[#64748b]">Impacto CPU</div>
                    <div className="text-[#00FF87] font-bold">-81.4% I/O</div>
                  </div>
                  <div className="p-1.5 rounded bg-[#08100c] border border-[#16271c]">
                    <div className="text-[#64748b]">Tamaño Índice</div>
                    <div className="text-white font-bold">~14.2 MB</div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#060a08] border border-[#1a2e22] text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-white text-[11px]">GIN Index verificado en payments_ledger(payload)</span>
                  <span className="text-[10px] font-mono text-[#00FF87]">ÓPTIMO</span>
                </div>
                <p className="text-[11px] text-[#94a3b8] mt-1">
                  Búsqueda rápida en JSONB estructurada con operador `jsonb_path_ops`.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: ORM & Model Generator (7 cols) */}
        <div className="lg:col-span-7 rounded-xl bg-[#08100c] border border-[#182c20] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#142318]">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-[#00FF87]" />
                  Generador de Modelos & ORM
                </h3>
                <p className="text-[11px] text-[#64748b] mt-0.5">
                  Código tipado sincrónico extraído del esquema actual
                </p>
              </div>

              {/* ORM Tabs */}
              <div className="flex items-center gap-1 bg-[#060a08] border border-[#16271c] p-0.5 rounded-lg text-xs">
                <button
                  onClick={() => setActiveOrm('prisma')}
                  className={`px-2.5 py-1 rounded font-mono transition-colors cursor-pointer ${
                    activeOrm === 'prisma' ? 'bg-[#00FF87] text-black font-semibold' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  Prisma
                </button>
                <button
                  onClick={() => setActiveOrm('typeorm')}
                  className={`px-2.5 py-1 rounded font-mono transition-colors cursor-pointer ${
                    activeOrm === 'typeorm' ? 'bg-[#00FF87] text-black font-semibold' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  TypeORM
                </button>
                <button
                  onClick={() => setActiveOrm('ddl')}
                  className={`px-2.5 py-1 rounded font-mono transition-colors cursor-pointer ${
                    activeOrm === 'ddl' ? 'bg-[#00FF87] text-black font-semibold' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  Raw DDL
                </button>
              </div>
            </div>

            {/* Code view */}
            <div className="mt-3 p-3.5 rounded-lg bg-[#050806] border border-[#16271c] font-mono text-xs overflow-x-auto relative">
              <button 
                onClick={() => copyToClipboard(
                  activeOrm === 'prisma' ? prismaSchema : activeOrm === 'typeorm' ? typeormSchema : ddlSchema,
                  'orm-code'
                )}
                className="absolute right-3 top-3 p-1.5 rounded-md bg-[#0d1812] border border-[#1c3324] text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
                title="Copiar esquema"
              >
                {copiedCode === 'orm-code' ? <Check className="w-3.5 h-3.5 text-[#00FF87]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <pre className="text-emerald-100 text-[11px] leading-5">
                {activeOrm === 'prisma' ? prismaSchema : activeOrm === 'typeorm' ? typeormSchema : ddlSchema}
              </pre>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-[#142318] flex items-center justify-between text-[11px] font-mono text-[#64748b]">
            <span>Sincronizado con commit: <strong className="text-emerald-300">7b3f99a (HEAD)</strong></span>
            <span className="text-[#00FF87]">Validación de Tipos Exitosa</span>
          </div>
        </div>
      </div>

      {/* Common Queries & AI Semantic Explanation */}
      <div className="rounded-xl bg-[#08100c] border border-[#182c20] p-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#142318]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00FF87]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Consultas Comunes & Explicación Semántica por IA
            </h3>
          </div>
          <span className="text-[11px] text-[#64748b]">Pregunta en lenguaje natural para obtener la consulta SQL validada sobre este modelo relacional</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-3">
          {/* Query Left */}
          <div className="lg:col-span-7 p-3 rounded-lg bg-[#050806] border border-[#16271c] font-mono text-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#142318] text-[11px]">
              <span className="text-[#00FF87] font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87]" />
                Query SQL Generada & Optimizada
              </span>
              <button 
                onClick={() => copyToClipboard(`SELECT 
  DATE_TRUNC('month', o.created_at) AS billing_month,
  o.currency,
  COUNT(DISTINCT o.id) AS total_successful_orders,
  SUM(o.amount_cents) / 100.0 AS gross_revenue
FROM orders o
INNER JOIN payments_ledger p ON p.order_id = o.id
WHERE o.status = 'COMPLETED' AND p.state = 'SETTLED'
GROUP BY 1, 2
ORDER BY billing_month DESC;`, 'gen-sql')}
                className="flex items-center gap-1 text-[#94a3b8] hover:text-white cursor-pointer"
              >
                {copiedCode === 'gen-sql' ? <Check className="w-3 h-3 text-[#00FF87]" /> : <Copy className="w-3 h-3" />}
                <span>Copiar SQL</span>
              </button>
            </div>
            <pre className="text-emerald-100 text-[11px] leading-5 overflow-x-auto">
{`SELECT 
  DATE_TRUNC('month', o.created_at) AS billing_month,
  o.currency,
  COUNT(DISTINCT o.id) AS total_successful_orders,
  SUM(o.amount_cents) / 100.0 AS gross_revenue,
  COALESCE(SUM(p.fee_cents) / 100.0, 0) AS gateway_fees
FROM
  orders o
INNER JOIN
  payments_ledger p ON p.order_id = o.id
WHERE
  o.status = 'COMPLETED'
  AND p.state = 'SETTLED'
  AND o.created_at >= NOW() - INTERVAL '12 months'
GROUP BY
  DATE_TRUNC('month', o.created_at),
  o.currency
ORDER BY
  billing_month DESC;`}
            </pre>
          </div>

          {/* Semantic Breakdown Right */}
          <div className="lg:col-span-5 p-3 rounded-lg bg-[#050806] border border-[#16271c] flex flex-col justify-between text-xs">
            <div>
              <div className="text-[11px] font-mono text-[#00FF87] font-semibold pb-2 mb-2 border-b border-[#142318]">
                Desglose Semántico (Línea por Línea)
              </div>
              <div className="space-y-2 text-[11px] text-[#94a3b8]">
                <div>
                  <strong className="text-white font-mono">1. DATE_TRUNC('month', created_at)</strong>
                  <p className="mt-0.5">Agrupa las ventas en bloques mensuales continuos respetando la zona horaria UTC del cluster.</p>
                </div>
                <div>
                  <strong className="text-white font-mono">2. INNER JOIN payments_ledger ON p.order_id = o.id</strong>
                  <p className="mt-0.5">Garantiza consistencia contable: solo suma pedidos que tengan una transacción bancaria respaldada en el ledger inmutable.</p>
                </div>
                <div>
                  <strong className="text-white font-mono">3. WHERE status = 'COMPLETED' AND state = 'SETTLED'</strong>
                  <p className="mt-0.5">Aprovecha el índice parcial compuesto sin escanear reembolsos o pagos pendientes.</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#142318] flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#64748b]">Tiempo de Ejecución Estimado: <strong className="text-[#00FF87]">18ms</strong></span>
              <button className="text-[#00FF87] hover:underline flex items-center gap-1 cursor-pointer">
                <span>Ejecutar en Playground</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
