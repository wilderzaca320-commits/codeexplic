# CodeExplain — Análisis & Explicación de Software con IA

Plataforma de inteligencia artificial para **analizar, comprender, explicar y documentar** proyectos de software en tres niveles de audiencia: básico, intermedio y avanzado.

> Repositorio privado. El código es la fuente de verdad: siempre se trabaja clonando/puliendo desde Git, nunca desde copias sueltas.

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + TypeScript + Vite 8 |
| Estilos | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Iconos / animación | lucide-react, motion |
| Backend | Express 4 sobre Node (ejecutado con `tsx`) |
| IA | `@google/genai` (Gemini) |
| Utilidades | JSZip (análisis de repos subidos en .zip) |

Los diagramas del proyecto están documentados en los archivos `Documentacion_Fase*.txt` y `Mapa_*.{txt,html}`.

---

## Requisitos

- Node.js 20 o superior
- npm
- Una **API key de Gemini** (solo para las funciones de IA)

---

## Instalación

```bash
npm install
cp .env.example .env     # Windows PowerShell: Copy-Item .env.example .env
```

Edita `.env` y coloca tu key:

```env
PORT=3100
GEMINI_API_KEY=tu_api_key_aqui
APP_URL="http://localhost:3100"
```

> **Nunca subas `.env` al repositorio.** Está en `.gitignore`. Cada máquina tiene su propio `.env` local.

## Ejecutar en desarrollo

```bash
npm run dev
```

Disponible en **http://localhost:3100**.

El puerto **3000 está reservado para el proyecto Sparkhub**; por eso CodeExplain usa 3100. Puedes cambiarlo con la variable `PORT`.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta el servidor Express + Vite en modo desarrollo (`tsx server.ts`) |
| `npm run build` | Compila el frontend con Vite (`dist/`) |
| `npm run preview` | Previsualiza el build de Vite |
| `npm run lint` | Verificación de tipos con `tsc --noEmit` |
| `npm start` | Ejecuta `node server.ts` |

---

## API

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/gemini/chat` | Chat con contexto del repositorio y nivel de audiencia (`basico`, `intermedio`, `avanzado`) |
| `POST` | `/api/gemini/explain` | Explica un archivo o fragmento de código |
| `POST` | `/api/gemini/document` | Genera documentación del proyecto |
| `GET` | `*` | Sirve el frontend (SPA) |

---

## Estructura

```
server.ts                 Servidor Express + endpoints Gemini
index.html                Entrada HTML
vite.config.ts            Configuración Vite/Tailwind
src/
  App.tsx                 Composición principal
  components/             Header, Sidebar, UploadModal
  views/                  Vistas: VisiónGeneral, ModeloDatosBD, DiagramasC4UML,
                          AuditorDeudaTecnica, ChatAsistenteIA, GeneradorDocumentacion, ...
  lib/analyzeProject.ts   Lógica de análisis de proyectos
  data/mockData.ts        Datos de ejemplo
  types/index.ts          Tipos compartidos
Documentacion_Fase*.txt   Documentación de las 6 fases del proyecto
Mapa_*                    Mapas de conocimiento y estructura
metadata.json             Metadatos de la app
```

---

## Flujo de trabajo con Git

`main` siempre debe quedar estable. Para cualquier cambio:

```bash
git pull origin main                  # 1. traer cambios antes de empezar
git checkout -b feat/mi-cambio        # 2. crear rama
# ... trabajar ...
git add .
git commit -m "feat: descripción corta del cambio"
git push -u origin feat/mi-cambio     # 3. subir la rama
```

Luego se abre un **Pull Request** en GitHub y se fusiona a `main`.

### Trabajar desde otra PC

```bash
git clone https://github.com/wilderzaca320-commits/codeexplic.git
cd codeexplic
npm install
# crear .env con tu propia GEMINI_API_KEY
```

En adelante, solo `git pull` / `git push` (Git descarga únicamente los cambios, no el proyecto completo).

### Convención de commits

| Prefijo | Uso |
|---|---|
| `feat:` | nueva funcionalidad |
| `fix:` | corrección de bug |
| `docs:` | documentación |
| `refactor:` | reorganización sin cambio de comportamiento |
| `chore:` | tareas de mantenimiento/configuración |

---

## Seguridad

- `.env` y cualquier `.env.*` están ignorados por Git (excepto `.env.example`).
- No incluir claves API, tokens ni rutas absolutas personales en el código.
- En despliegue, la `GEMINI_API_KEY` va en las variables de entorno/Secrets del hosting, nunca en el repo.
