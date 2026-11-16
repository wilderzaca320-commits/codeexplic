export type ExplanationLevel = 'basico' | 'intermedio' | 'avanzado';

export type ViewType = 
  | 'vision-general'
  | 'arquitectura-modulos'
  | 'diagramas-c4-uml'
  | 'modelo-datos-bd'
  | 'casos-de-uso-requerimientos'
  | 'riesgos-validacion'
  | 'chat-asistente-ia'
  | 'generador-documentacion'
  | 'auditor-deuda-tecnica'
  | 'proyectos'
  | 'repositorios-analizados'
  | 'historial-consultas';

export interface ProjectWorkspace {
  id: string;
  name: string;
  repoIdentifier: string;
  tag: 'PROD' | 'STAGE' | 'LABS' | 'ATENCIÓN' | 'ÉLITE A+';
  languages: string[];
  reposCount: number;
  astHealth: number; // 0-100
  debtHours: number;
  spofCount: number;
  lastActive: string;
  description: string;
}

export interface MonitoredRepo {
  id: string;
  name: string;
  branch: string;
  language: string;
  sloc: number;
  filesCount: number;
  astStatus: 'Parsed' | 'Syncing' | 'Verified';
  lastCommitHash: string;
  lastCommitMessage: string;
  author: string;
  timeAgo: string;
}

export interface QueryHistoryItem {
  id: string;
  category: 'ARQUITECTURA & FLUJOS' | 'REFACTOR & AST PARCHING' | 'BASE DE DATOS & SQL' | 'SEGURIDAD & CVE' | 'DOCUMENTACIÓN & C4';
  timestamp: string;
  repo: string;
  tokens: number;
  question: string;
  summary: string;
  codeSnippet?: string;
  codeLanguage?: string;
  isFavorite?: boolean;
}

export interface DatabaseTable {
  name: string;
  isCore?: boolean;
  rowsEstimate?: string;
  partitionStrategy?: string;
  columns: {
    name: string;
    type: string;
    isPk?: boolean;
    isFk?: boolean;
    isUnique?: boolean;
    fkTarget?: string;
  }[];
}

export interface UseCaseItem {
  id: string;
  code: string;
  title: string;
  actor: string;
  precondition: string;
  postcondition: string;
  complexity: 'Alta' | 'Media' | 'Baja';
  steps: string[];
  gherkin: string;
}

export interface RiskItem {
  id: string;
  category: 'Denial of Service (DoS)' | 'Information Disclosure' | 'Tampering' | 'Spoofing' | 'Elevation of Privilege';
  severity: 'ALTA' | 'MEDIA' | 'BAJA';
  status: 'Mitigado al 90%' | 'En Implementación' | 'Blindado al 100%';
  title: string;
  impact: string;
  mitigation: string;
  targetEndpoint: string;
  prReference?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  level?: ExplanationLevel;
  codeSnippet?: {
    code: string;
    language: string;
  };
}
