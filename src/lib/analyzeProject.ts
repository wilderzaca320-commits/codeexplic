/**
 * Motor de análisis real de proyectos (client-side).
 * Extrae un ZIP con JSZip, calcula métricas reales (SLOC, lenguajes,
 * dependencias) y construye un "digest" que se envía al servidor
 * para su interpretación con Gemini IA (o motor heurístico local).
 */

import JSZip from 'jszip';

// ===== Tipos =====

export interface DigestFile {
  path: string;
  size: number;
}

export interface ProjectDigest {
  name: string;
  files: DigestFile[];
  totalFiles: number;
  codeFiles: number;
  totalSloc: number;
  languages: Record<string, number>;
  dependencies: string[];
  entryCandidates: string[];
  textSample: string;
  sourceKind: 'zip' | 'url';
}

export interface ProjectAnalysis {
  name: string;
  description: string;
  languages: string[];
  astHealth: number;
  debtHours: number;
  spofCount: number;
  reposCount: number;
  summary: string;
  model: string;
}

// ===== Detección de lenguaje por extensión =====

export const EXT_LANGUAGE: Record<string, string> = {
  js: 'JavaScript', mjs: 'JavaScript', cjs: 'JavaScript', jsx: 'JavaScript',
  ts: 'TypeScript', tsx: 'TypeScript', mts: 'TypeScript', cts: 'TypeScript',
  py: 'Python', rb: 'Ruby', go: 'Go', rs: 'Rust', java: 'Java', kt: 'Kotlin',
  cs: 'C#', cpp: 'C++', cc: 'C++', cxx: 'C++', c: 'C', h: 'C/C++', hpp: 'C++',
  php: 'PHP', swift: 'Swift', scala: 'Scala', dart: 'Dart', lua: 'Lua',
  vue: 'Vue', svelte: 'Svelte', html: 'HTML', htm: 'HTML',
  css: 'CSS', scss: 'SCSS', sass: 'Sass', less: 'Less',
  sql: 'SQL', sh: 'Shell', bash: 'Shell', ps1: 'PowerShell',
  json: 'JSON', yml: 'YAML', yaml: 'YAML', toml: 'TOML', env: 'Config',
  md: 'Markdown', txt: 'Text', xml: 'XML', gradle: 'Gradle'
};

// Extensiones consideradas texto (para leer contenido)
const TEXT_EXTS = new Set([
  ...Object.keys(EXT_LANGUAGE),
  'gitignore', 'gitattributes', 'editorconfig', 'npmrc', 'nvmrc',
  'lock', 'cfg', 'conf', 'ini', 'properties', 'csv', 'svg', 'map'
]);

const SKIP_DIRS = ['node_modules/', '.git/', '__MACOSX/', '.idea/', '.vscode/', '.next/', '.turbo/', 'target/'];

const MAX_TEXT_FILES = 300;
const MAX_TOTAL_TEXT_BYTES = 4 * 1024 * 1024; // 4 MB de texto total
const MAX_SAMPLE_BYTES = 48 * 1024;          // 48 KB de muestra enviada a la IA
const MAX_PER_FILE_SAMPLE = 6 * 1024;         // 6 KB por archivo en la muestra

// ===== Utilidades =====

export function extOf(filePath: string): string {
  const base = filePath.split('/').pop() || '';
  const idx = base.lastIndexOf('.');
  return idx === -1 ? '' : base.slice(idx + 1).toLowerCase();
}

function isSkipped(path: string): boolean {
  const p = path.replace(/^\.\//, '').toLowerCase();
  if (SKIP_DIRS.some((d) => p.includes(d))) return true;
  if (p.endsWith('.ds_store') || p.endsWith('thumbs.db')) return true;
  return false;
}

export function isTextFile(path: string): boolean {
  const ext = extOf(path);
  if (TEXT_EXTS.has(ext)) return true;
  // Archivos sin extensión relevantes (LICENSE, Dockerfile, Makefile, Procfile)
  const base = (path.split('/').pop() || '').toUpperCase();
  return ['LICENSE', 'LICENCE', 'DOCKERFILE', 'MAKEFILE', 'PROCFILE', 'README'].some((n) => base === n || base.startsWith(n + '.'));
}

export function isCodeFile(path: string): boolean {
  const ext = extOf(path);
  return ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'mts', 'cts', 'py', 'rb', 'go', 'rs',
    'java', 'kt', 'cs', 'cpp', 'cc', 'cxx', 'c', 'h', 'hpp', 'php', 'swift', 'scala',
    'dart', 'lua', 'vue', 'svelte', 'sql'].includes(ext);
}

export function countSloc(text: string): number {
  let count = 0;
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (t.length > 0 && !t.startsWith('//') && !t.startsWith('#!')) count++;
  }
  return count;
}

// ===== Prioridad de archivos para la muestra de código =====

function samplePriority(path: string): number {
  const p = path.toLowerCase();
  const base = p.split('/').pop() || '';
  if (base === 'package.json' || base === 'go.mod' || base === 'cargo.toml' || base === 'pyproject.toml' || base === 'composer.json') return 100;
  if (base.startsWith('readme')) return 95;
  if (p.includes('docker-compose') || base === 'dockerfile') return 85;
  if (['tsconfig.json', 'vite.config.ts', 'next.config.js', 'next.config.mjs', 'webpack.config.js', 'nest-cli.json', 'requirements.txt', 'pom.xml', 'build.gradle'].includes(base)) return 80;
  if (base.startsWith('index.') || base.startsWith('main.') || base.startsWith('app.') || base.startsWith('server.')) return 70;
  if (p.includes('.env')) return 10; // no priorizar secrets
  if (isCodeFile(p)) return 50 + Math.min(20, (p.split('/').length - 1) * -0); // código en raíz primero
  if (isTextFile(p)) return 30;
  return 5;
}

function truncateMiddle(text: string, max: number): string {
  if (text.length <= max) return text;
  const half = Math.floor(max / 2);
  return `${text.slice(0, half)}\n/* [...truncado...] */\n${text.slice(-half)}`;
}

// ===== Extracción de dependencias =====

export function extractDependencies(files: Map<string, string>): string[] {
  const deps = new Set<string>();
  const pkg = files.get('package.json');
  if (pkg) {
    try {
      const json = JSON.parse(pkg);
      [...Object.keys(json.dependencies || {}), ...Object.keys(json.devDependencies || {})]
        .slice(0, 25)
        .forEach((d) => deps.add(d));
    } catch { /* ignorar JSON inválido */ }
  }
  const req = files.get('requirements.txt');
  if (req) {
    req.split('\n')
      .map((l) => l.split(/[=><#]/)[0].trim())
      .filter((l) => l && !l.startsWith('-'))
      .slice(0, 25)
      .forEach((d) => deps.add(d));
  }
  const goMod = files.get('go.mod');
  if (goMod) {
    const matches = goMod.matchAll(/,\s*$/) ? [] : [...goMod.matchAll(/^[ \t]*(?:require\s+)?([\w./-]+)\s+v[\w.-]+/gm)];
    matches.slice(0, 25).forEach((m) => deps.add(m[1]));
  }
  const cargo = files.get('Cargo.toml');
  if (cargo) {
    [...cargo.matchAll(/^[ \t]*([\w-]+)[ \t]*=[ \t]*\{/gm)].slice(0, 25).forEach((m) => deps.add(m[1]));
  }
  return [...deps].slice(0, 30);
}

// ===== Constructor del digest desde un ZIP (File del navegador) =====

export async function buildDigestFromZipFile(file: File): Promise<ProjectDigest> {
  const zip = await JSZip.loadAsync(file);
  const name = (file.name.replace(/\.zip$/i, '') || 'proyecto-analizado')
    .split(/[\\/]/).pop() || 'proyecto-analizado';

  const entries = Object.values(zip.files)
    .filter((e) => !e.dir && !isSkipped(e.name));

  const textFiles = new Map<string, string>();
  const allFiles: DigestFile[] = [];
  const languages: Record<string, number> = {};
  let totalSloc = 0;
  let codeFiles = 0;
  let totalTextBytes = 0;

  // Ordenar por prioridad para maximizar valor dentro de los límites
  const sorted = [...entries].sort((a, b) => samplePriority(b.name) - samplePriority(a.name));

  for (const entry of sorted) {
    const path = entry.name.replace(/^\.\//, '');
    allFiles.push({ path, size: 0 }); // size real se ajusta abajo
    const size = (entry as unknown as { _data?: { uncompressedSize?: number } })._data?.uncompressedSize ?? 0;
    allFiles[allFiles.length - 1].size = size;

    if (textFiles.size >= MAX_TEXT_FILES || totalTextBytes >= MAX_TOTAL_TEXT_BYTES) continue;
    if (!isTextFile(path)) continue;

    try {
      const content = await entry.async('string');
      textFiles.set(path, content);
      totalTextBytes += content.length;

      const ext = extOf(path);
      if (ext && EXT_LANGUAGE[ext]) {
        languages[EXT_LANGUAGE[ext]] = (languages[EXT_LANGUAGE[ext]] || 0) + 1;
      }
      if (isCodeFile(path)) {
        codeFiles++;
        totalSloc += countSloc(content);
      }
    } catch { /* archivo ilegible, continuar */ }
  }

  // Asegurar que archivos no-texto también cuenten su lenguaje (por extensión)
  for (const entry of entries) {
    const path = entry.name.replace(/^\.\//, '');
    const ext = extOf(path);
    if (ext && EXT_LANGUAGE[ext] && !languages[EXT_LANGUAGE[ext]]) {
      // Solo agregar si no se contaron ya (conteo parcial)
      continue;
    }
  }

  const dependencies = extractDependencies(textFiles);

  // Muestra de texto con encabezados de ruta
  const sampleFiles = [...textFiles.entries()]
    .sort((a, b) => samplePriority(b[0]) - samplePriority(a[0]));

  let sampleBudget = MAX_SAMPLE_BYTES;
  const sampleParts: string[] = [];
  const entryCandidates: string[] = [];

  for (const [path, content] of sampleFiles) {
    const base = (path.split('/').pop() || '').toLowerCase();
    if (['index.', 'main.', 'app.', 'server.'].some((p) => base.startsWith(p))) {
      entryCandidates.push(path);
    }
    if (sampleBudget <= 0) continue;
    const snippet = truncateMiddle(content, Math.min(MAX_PER_FILE_SAMPLE, sampleBudget));
    sampleBudget -= snippet.length;
    sampleParts.push(`=== ARCHIVO: ${path} ===\n${snippet}`);
  }

  return {
    name,
    files: allFiles,
    totalFiles: entries.length,
    codeFiles,
    totalSloc,
    languages,
    dependencies,
    entryCandidates,
    textSample: sampleParts.join('\n\n'),
    sourceKind: 'zip'
  };
}

// ===== Análisis con el servidor =====

export async function analyzeDigest(digest: ProjectDigest): Promise<ProjectAnalysis> {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(digest)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Error ${res.status} al analizar el proyecto`);
  }
  return res.json();
}

export async function analyzeUrl(url: string, branch: string): Promise<ProjectAnalysis> {
  const res = await fetch('/api/analyze-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, branch })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Error ${res.status} al analizar la URL`);
  }
  return res.json();
}

// ===== Derivar tag de calidad =====

export function tagFromHealth(astHealth: number): ProjectAnalysis extends never ? never : 'ÉLITE A+' | 'PROD' | 'STAGE' | 'ATENCIÓN' {
  if (astHealth >= 92) return 'ÉLITE A+';
  if (astHealth >= 82) return 'PROD';
  if (astHealth >= 70) return 'STAGE';
  return 'ATENCIÓN';
}
