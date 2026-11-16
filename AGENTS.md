# AGENTS.md — Instrucciones para agentes de IA

Este archivo existe para que **cualquier IA o colaborador** pueda continuar el proyecto sin contexto previo. Léelo completo antes de tocar código.

## Qué es este proyecto

**CodeExplain**: plataforma web que analiza proyectos de software (archivos o `.zip`) y los explica/documenta con IA (Gemini), en tres niveles de audiencia: `basico`, `intermedio`, `avanzado`.

## Stack y arquitectura

- **Frontend**: React 19 + TypeScript, Vite 8, Tailwind CSS 4, lucide-react, motion.
- **Backend**: Express 4 en `server.ts`, ejecutado con `tsx`.
- **IA**: `@google/genai` (`GoogleGenAI`). El cliente se inicializa en `server.ts` solo si existe `GEMINI_API_KEY`.
- **Puerto**: `3100` por defecto (`PORT`). **Nunca** uses 3000: está reservado para el proyecto Sparkhub.
- Alias de imports: `@` apunta a la raíz del proyecto (`vite.config.ts`).

## Comandos

```bash
npm install          # instalar dependencias
npm run dev          # desarrollo en http://localhost:3100
npm run lint         # verificación de tipos (tsc --noEmit) — ejecutar SIEMPRE antes de terminar
npm run build        # build de producción
```

## Reglas para modificar código

1. **Antes de empezar**: `git pull origin main`. No trabajes directamente sobre `main` si el cambio es grande; usa rama `feat/...` o `fix/...`.
2. **Conserva el estilo existente**: componentes funcionales, TypeScript estricto, nombres en inglés para código y en español para textos de UI.
3. **UI**: los textos visibles van en español. Mantén la estructura `src/components` (reutilizables) y `src/views` (pantallas).
4. **Backend**: nuevos endpoints en `server.ts` bajo `/api/...`, validando el body y devolviendo `{ error: '...' }` con el status adecuado.
5. **Nivel de audiencia**: los prompts viven en `LEVEL_PROMPTS` (`server.ts`). Si se añade un nivel, actualízalo también en `src/types/index.ts` y en la UI.
6. **No refactorices** archivos grandes (`VisionGeneral.tsx`, `ModeloDatosBD.tsx`) sin necesidad: contienen la lógica principal y validaciones.
7. **Documentación**: si cambias comportamiento relevante, actualiza `README.md` y, si aplica, `Documentacion_Fase*.txt`.

## Seguridad (obligatorio)

- **NUNCA** crees, modifiques ni subas `.env` con claves reales. Solo `.env.example` va al repo.
- No imprimas ni incluyas `GEMINI_API_KEY` en logs, commits ni código.
- No subas `node_modules/`, `dist/`, `build/`, logs ni archivos temporales.
- Antes de hacer commit, verifica: `git status` no debe mostrar `.env`.

## Antes de terminar una tarea

```bash
npm run lint
git status
git add -A
git commit -m "feat|fix|docs|refactor|chore: descripción corta"
git push
```

## Contexto de negocio

Proyecto académico/profesional orientado a explicar software a distintos públicos (estudiantes, desarrolladores, arquitectos). La calidad de las explicaciones y la claridad de la UI son prioridad sobre features nuevas.
