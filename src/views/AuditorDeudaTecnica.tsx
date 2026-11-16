import React, { useState } from 'react';
import { 
  Wrench, 
  GitPullRequest, 
  Copy, 
  Check, 
  ShieldAlert, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Download,
  AlertTriangle,
  FileCode2
} from 'lucide-react';
import { ProjectWorkspace, ExplanationLevel } from '../types';

interface AuditorDeudaTecnicaProps {
  project: ProjectWorkspace;
  level: ExplanationLevel;
}

export const AuditorDeudaTecnica: React.FC<AuditorDeudaTecnicaProps> = ({ project, level }) => {
  const [copiedPatch, setCopiedPatch] = useState(false);
  const [prOpened, setPrOpened] = useState(false);

  const diffPatch = `--- a/src/payments/services/stripe-webhook.worker.ts
+++ b/src/payments/services/stripe-webhook.worker.ts
@@ -5,11 +5,19 @@ export class StripeWebhookWorker {
-    const lock = await this.redlock.acquire(['lock:\${event.id}'], 5000);
-    try {
-      const order = await this.ordersRepo.findOneOrFail({ where: { txId: event.id } });
-      this.eventEmitter.emit('order.settled', { orderId: order.id });
-    } finally {
-      await lock.release();
-    }
+    try {
+      const lock = await this.redlock.acquire([\`lock:\${event.id}\`], 5000);
+      try {
+        const order = await this.ordersRepo.findOneOrFail({ where: { txId: event.id } });
+        this.eventEmitter.emit('order.settled', { orderId: order.id });
+      } finally {
+        await lock.release();
+      }
+    } catch (err) {
+      if (err instanceof LockAcquisitionError) {
+        // Responder con HTTP 429 para que Stripe reintente con backoff
+        throw new HttpException('Concurrency collision. Lock acquired.', HttpStatus.TOO_MANY_REQUESTS);
+      }
+      throw err;
+    }`;

  const handleCopy = () => {
    navigator.clipboard.writeText(diffPatch);
    setCopiedPatch(true);
    setTimeout(() => setCopiedPatch(false), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#15231b]">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-pulse" />
              AUDITOR DE DEUDA TÉCNICA & SANEAMIENTO AST
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Auditor de Deuda Técnica & Generador de Parches Git
          </h1>
          <p className="text-xs text-[#94a3b8] mt-1 max-w-3xl">
            Inspección sintáctica profunda de patrones anti-concurrencia, dependencias vulnerables y refactorización automatizada mediante parches unificados.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1611] border border-[#1b2a20] text-xs text-white hover:border-[#00FF87]/40 transition-colors cursor-pointer"
          >
            {copiedPatch ? <Check className="w-3.5 h-3.5 text-[#00FF87]" /> : <Copy className="w-3.5 h-3.5 text-[#00FF87]" />}
            <span>Copiar Parche .diff</span>
          </button>
          <button
            onClick={() => setPrOpened(true)}
            disabled={prOpened}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#00FF87] hover:bg-[#00e076] text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(0,255,135,0.3)] cursor-pointer disabled:opacity-50"
          >
            <GitPullRequest className="w-3.5 h-3.5" />
            <span>{prOpened ? 'PR Creado en GitHub (#482) ✓' : 'Abrir Pull Request'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20]">
          <div className="text-[10px] font-mono uppercase text-[#64748b]">Esfuerzo de Saneo</div>
          <div className="text-2xl font-mono font-bold text-white mt-1">~18.5 h</div>
          <div className="text-[11px] text-[#00FF87] font-mono mt-1">-3.2h resueltas vs sprint ant.</div>
        </div>
        <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20]">
          <div className="text-[10px] font-mono uppercase text-[#64748b]">CVEs Detectados</div>
          <div className="text-2xl font-mono font-bold text-red-400 mt-1">2 Críticos</div>
          <div className="text-[11px] text-[#94a3b8] font-mono mt-1">axios &lt; 1.6.0, ws &lt; 8.17.1</div>
        </div>
        <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20]">
          <div className="text-[10px] font-mono uppercase text-[#64748b]">Parches Sintéticos</div>
          <div className="text-2xl font-mono font-bold text-[#00FF87] mt-1">4 Listos</div>
          <div className="text-[11px] text-white font-mono mt-1">100% Cobertura AST</div>
        </div>
        <div className="p-4 rounded-xl bg-[#08100c] border border-[#182c20]">
          <div className="text-[10px] font-mono uppercase text-[#64748b]">Aceptación de PRs</div>
          <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">94.2%</div>
          <div className="text-[11px] text-[#00FF87] font-mono mt-1">Zero rollbacks</div>
        </div>
      </div>

      {/* Unified Git Diff Viewer */}
      <div className="rounded-2xl bg-[#08100c] border border-[#182c20] p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#142318] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-[#00FF87]" />
            <span className="text-xs font-mono font-bold text-white">
              Parche AST Recomendado: Captura de LockAcquisitionError (HTTP 429)
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#00FF87] px-2 py-0.5 rounded bg-[#0d1f14] border border-[#1a3d28]">
            +14 líneas añadidas • -6 eliminadas
          </span>
        </div>

        {/* Diff box */}
        <div className="p-4 rounded-xl bg-[#040605] border border-[#142318] font-mono text-xs overflow-x-auto leading-6">
          <pre className="text-emerald-100">
            {diffPatch.split('\n').map((line, i) => {
              const isAdded = line.startsWith('+') && !line.startsWith('+++');
              const isRemoved = line.startsWith('-') && !line.startsWith('---');
              return (
                <div
                  key={i}
                  className={`${
                    isAdded
                      ? 'bg-emerald-950/60 text-[#00FF87] -mx-4 px-4 border-l-2 border-[#00FF87]'
                      : isRemoved
                      ? 'bg-red-950/60 text-red-400 -mx-4 px-4 border-l-2 border-red-500'
                      : 'text-[#94a3b8]'
                  }`}
                >
                  {line}
                </div>
              );
            })}
          </pre>
        </div>

        {/* PR Status Notification */}
        {prOpened && (
          <div className="mt-4 p-3 rounded-xl bg-[#0d1f14] border border-[#1b3a27] text-xs text-[#a7f3d0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00FF87]" />
              <span>Pull Request <strong>#482</strong> creado exitosamente en la rama <strong>patch/redlock-concurrency-fix</strong>.</span>
            </div>
            <a href="#pr" className="text-[#00FF87] underline font-mono text-[11px]">Ver en GitHub →</a>
          </div>
        )}
      </div>
    </div>
  );
};
