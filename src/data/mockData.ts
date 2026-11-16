import { ProjectWorkspace, MonitoredRepo, QueryHistoryItem, DatabaseTable, UseCaseItem, RiskItem } from '../types';

export const MOCK_PROJECTS: ProjectWorkspace[] = [
  {
    id: 'ecommerce-microservices-v2',
    name: 'E-Commerce Core & Checkout',
    repoIdentifier: 'ec-core-prod-v2',
    tag: 'PROD',
    languages: ['Python', 'TypeScript', 'NestJS', 'Redis'],
    reposCount: 6,
    astHealth: 84.5,
    debtHours: 18.5,
    spofCount: 1,
    lastActive: 'hace 4m',
    description: 'Motor de comercio distribuido con procesamiento de checkout, pagos Stripe con Redlock y catálogo asíncrono.'
  },
  {
    id: 'fintech-payments-ledger',
    name: 'Fintech Payments & Ledger',
    repoIdentifier: 'pay-ledger-core',
    tag: 'PROD',
    languages: ['Go', 'PostgreSQL', 'Apache Kafka'],
    reposCount: 4,
    astHealth: 92.1,
    debtHours: 6.2,
    spofCount: 0,
    lastActive: 'hace 18m',
    description: 'Libro mayor de transacciones financieras inmutables con particionamiento mensual y conciliación bancaria.'
  },
  {
    id: 'logistics-fleet-tracking',
    name: 'Logistics Fleet Tracking',
    repoIdentifier: 'fleet-telematics-iot',
    tag: 'ATENCIÓN',
    languages: ['Node.js', 'Express', 'MongoDB', 'Socket.io'],
    reposCount: 3,
    astHealth: 68.4,
    debtHours: 32.0,
    spofCount: 3,
    lastActive: 'hace 42m',
    description: 'Telemetría de vehículos y rastreo en tiempo real de rutas logísticas con ingesta de sensores IoT.'
  },
  {
    id: 'healthcare-patient-portal',
    name: 'Healthcare Patient Portal',
    repoIdentifier: 'med-portal-hipaa',
    tag: 'STAGE',
    languages: ['Next.js 14', 'FastAPI', 'Supabase'],
    reposCount: 2,
    astHealth: 89.0,
    debtHours: 8.4,
    spofCount: 0,
    lastActive: 'hace 2h',
    description: 'Portal de gestión de expedientes clínicos y teleconsultas con cumplimiento HIPAA y cifrado AES-256.'
  },
  {
    id: 'auth-sso-identity-server',
    name: 'Auth & SSO Identity Server',
    repoIdentifier: 'id-sso-auth-core',
    tag: 'ÉLITE A+',
    languages: ['Rust', 'Redis', 'OAuth2.1'],
    reposCount: 1,
    astHealth: 96.2,
    debtHours: 1.1,
    spofCount: 0,
    lastActive: 'hace 5h',
    description: 'Servidor central de autenticación asimétrica RS256 con revocación instantánea en memoria.'
  },
  {
    id: 'ai-vector-search-engine',
    name: 'AI Vector Search Engine',
    repoIdentifier: 'vector-qdrant-rag',
    tag: 'LABS',
    languages: ['Python', 'Qdrant', 'LangChain', 'FastAPI'],
    reposCount: 3,
    astHealth: 79.5,
    debtHours: 14.2,
    spofCount: 0,
    lastActive: 'hace 1d',
    description: 'Motor de búsqueda semántica híbrida y embeddings densos para recuperación aumentada de información.'
  }
];

export const MOCK_REPOS: MonitoredRepo[] = [
  {
    id: 'ec-core-auth-service',
    name: 'ec-core/auth-service',
    branch: 'main',
    language: 'TypeScript / NestJS',
    sloc: 8420,
    filesCount: 34,
    astStatus: 'Verified',
    lastCommitHash: '#b7f4a9b',
    lastCommitMessage: 'fix(auth): sanitización de tokens JWT en edge middleware',
    author: 'Alejandro R.',
    timeAgo: 'hace 3 mins'
  },
  {
    id: 'pay-ledger-core-db',
    name: 'pay-ledger-core/ledger-db',
    branch: 'release/v2.1',
    language: 'Go / PostgreSQL',
    sloc: 16290,
    filesCount: 52,
    astStatus: 'Verified',
    lastCommitHash: '#901af3e',
    lastCommitMessage: 'Auditoría AST completada: Sin ciclos de dependencia circulares',
    author: 'CodeExplain Engine',
    timeAgo: 'hace 18 mins'
  },
  {
    id: 'fleet-telematics-iot-ws',
    name: 'fleet-telematics-iot',
    branch: 'staging',
    language: 'Node.js / Express',
    sloc: 12400,
    filesCount: 41,
    astStatus: 'Parsed',
    lastCommitHash: '#f401cb2',
    lastCommitMessage: 'Alerta de Vulnerabilidad: Paquete WebSocket obsoleto CVE-2024-3184',
    author: 'María Santos',
    timeAgo: 'hace 42 mins'
  },
  {
    id: 'payments-stripe-worker',
    name: 'ec-core/payments-worker',
    branch: 'main',
    language: 'TypeScript',
    sloc: 5740,
    filesCount: 21,
    astStatus: 'Verified',
    lastCommitHash: '#7b3f99a',
    lastCommitMessage: 'feat(payments): Redlock distributed mutex con TTL 5000ms',
    author: 'David Chen',
    timeAgo: 'hace 1 hora'
  }
];

export const MOCK_QUERY_HISTORY: QueryHistoryItem[] = [
  {
    id: 'q-1',
    category: 'ARQUITECTURA & FLUJOS',
    timestamp: 'Hace 4 min',
    repo: 'ecommerce-microservices-v2',
    tokens: 1488,
    isFavorite: true,
    question: '¿Cómo funciona el flujo completo de cobro y qué pasa si el webhook de Stripe falla a mitad de camino?',
    summary: 'Explicación detallada de implementación mediante patrón Saga Coreografiada con Idempotencia Forzada (UUIDv5). Si el webhook falla tras debitar el cargo, la transacción se enruta a una cola de reintentos exponenciales DLQ (Dead Letter Queue) en RabbitMQ con compensación rollback de inventario a los 120s.',
    codeSnippet: `// Manejo de reintentos con backoff exponencial
async function handleStripeWebhookWithRetry(event: StripeEvent) {
  const lock = await redlock.acquire([\`lock:\${event.id}\`], 5000);
  try {
    const order = await ordersRepo.findOneOrFail({ txId: event.id });
    await eventEmitter.emit('order.settled', { orderId: order.id });
  } finally {
    await lock.release();
  }
}`,
    codeLanguage: 'typescript'
  },
  {
    id: 'q-2',
    category: 'REFACTOR & AST PARCHING',
    timestamp: 'Hace 18 min',
    repo: 'apps/checkout/services/order.py',
    tokens: 2140,
    question: 'Solucionar carrera de concurrencia al expirar lock de Redis en proceso de checkout',
    summary: 'Generación de parche AST: Aislamiento transaccional estricto con SELECT FOR UPDATE a nivel fila en DB y renovación asíncrona de lock atómico mediante Redis Redlock con algoritmo watchdog de 500ms.',
    codeSnippet: `--- a/services/order.py
+++ b/services/order.py
@@ -42,7 +42,9 @@
- with redis.lock("checkout:" + user_id, timeout=10):
-     process_order(user_id, cart)
+ async with RedlockWatchdog(key=f"checkout:{user_id}", ttl_ms=5000):
+     async with db.transaction(isolation="REPEATABLE_READ"):
+         await process_order_atomic(user_id, cart)`,
    codeLanguage: 'diff'
  },
  {
    id: 'q-3',
    category: 'BASE DE DATOS & SQL',
    timestamp: 'Hace 45 min',
    repo: 'PostgreSQL 16 / orders, payments_ledger',
    tokens: 1820,
    isFavorite: true,
    question: 'Generar consulta SQL para calcular facturación mensual agrupada por divisa y desglosar rendimiento de índices',
    summary: 'Query optimizada con DATE_TRUNC y Window Function validada sobre 1.2M de filas con índice compuesto idx_orders_user_status en 18ms de tiempo de ejecución estimado.',
    codeSnippet: `SELECT 
  DATE_TRUNC('month', o.created_at) AS billing_month,
  o.currency,
  COUNT(DISTINCT o.id) AS total_successful_orders,
  SUM(o.amount_cents) / 100.0 AS gross_revenue
FROM orders o
INNER JOIN payments_ledger p ON p.order_id = o.id
WHERE o.status = 'COMPLETED' AND p.state = 'SETTLED'
GROUP BY 1, 2
ORDER BY billing_month DESC;`,
    codeLanguage: 'sql'
  },
  {
    id: 'q-4',
    category: 'SEGURIDAD & CVE',
    timestamp: 'Hace 2 horas',
    repo: 'package-lock.json (raíz)',
    tokens: 1290,
    question: 'Auditoría de vulnerabilidades en package-lock.json y vectores de ataque SSRF en axios < 1.6.0',
    summary: 'Detección de vulnerabilidad de derivación de cabeceras en redirecciones cruzadas (CVE-2023-45857). Recomendación de actualización inmediata a axios@1.7.4 y fijación de directiva CORS estricta.',
    codeSnippet: `// Parche de mitigación en API Gateway
const allowedRedirectHosts = ['api.stripe.com', 'internal.payments'];
axiosInstance.interceptors.request.use(config => {
  if (config.url && !allowedRedirectHosts.some(host => config.url.includes(host))) {
    throw new SecurityException('Blocked cross-origin redirect');
  }
  return config;
});`,
    codeLanguage: 'typescript'
  },
  {
    id: 'q-5',
    category: 'DOCUMENTACIÓN & C4',
    timestamp: 'Ayer, 18:24',
    repo: 'Docs Suite Automática',
    tokens: 3820,
    isFavorite: true,
    question: 'Generar guía completa de Onboarding y arquitectura C4 Nivel 2 en formato Markdown para nuevos desarrolladores',
    summary: 'Especificación técnica generada (4,200 palabras) integrando topología de contenedores de microservicios, variables de entorno requeridas en archivo .env.example y comandos de bootstrap vía Docker Compose.',
    codeSnippet: `# Onboarding E-Commerce Core v2.4
1. Requisitos: Node 20+, Docker Compose, Redis 7+
2. docker compose up -d postgres redis
3. cp .env.example .env && npm run seed
4. npm run test:unit`,
    codeLanguage: 'markdown'
  }
];

export const MOCK_DB_TABLES: DatabaseTable[] = [
  {
    name: 'users',
    rowsEstimate: '1.2M rows',
    columns: [
      { name: 'id', type: 'uuid', isPk: true },
      { name: 'email', type: 'varchar(255)', isUnique: true },
      { name: 'password_hash', type: 'text' },
      { name: 'role', type: 'user_role_enum' },
      { name: 'created_at', type: 'timestamptz' }
    ]
  },
  {
    name: 'orders',
    isCore: true,
    rowsEstimate: '4.8M rows',
    partitionStrategy: 'Range (fecha)',
    columns: [
      { name: 'id', type: 'uuid', isPk: true },
      { name: 'user_id', type: 'uuid', isFk: true, fkTarget: 'users.id' },
      { name: 'status', type: 'order_status' },
      { name: 'amount_cents', type: 'numeric(12,2)' },
      { name: 'idempotency_key', type: 'varchar(64)', isUnique: true },
      { name: 'currency', type: 'varchar(3)' }
    ]
  },
  {
    name: 'order_items',
    rowsEstimate: 'N:M Item',
    columns: [
      { name: 'id', type: 'bigserial', isPk: true },
      { name: 'order_id', type: 'uuid', isFk: true, fkTarget: 'orders.id' },
      { name: 'product_id', type: 'uuid', isFk: true, fkTarget: 'products.id' },
      { name: 'quantity', type: 'integer' },
      { name: 'unit_price', type: 'decimal(10,2)' }
    ]
  },
  {
    name: 'payments_ledger',
    rowsEstimate: 'Append-only',
    columns: [
      { name: 'id', type: 'uuid', isPk: true },
      { name: 'order_id', type: 'uuid', isFk: true, fkTarget: 'orders.id' },
      { name: 'provider', type: 'varchar(50)' },
      { name: 'payload', type: 'jsonb' },
      { name: 'state', type: 'payment_state' }
    ]
  }
];

export const MOCK_USE_CASES: UseCaseItem[] = [
  {
    id: 'cu-01',
    code: 'CU-01',
    title: 'Checkout Transaccional con Reserva de Inventario',
    actor: 'Comprador Autenticado',
    precondition: 'Carrito activo con stock verificado en Redis.',
    postcondition: 'Orden creada en estado PENDING y lock de inventario adquirido por 15 min.',
    complexity: 'Alta',
    steps: [
      'El cliente envía la solicitud de compra con token de idempotencia en header.',
      'El API Gateway valida el JWT y reenruta al Order Service.',
      'Order Service adquiere lock distribuido Redlock para evitar sobreventa.',
      'Se persiste el registro en PostgreSQL y se emite evento orden.iniciada.'
    ],
    gherkin: `Feature: Checkout Transaccional
  Scenario: Compra exitosa con stock disponible
    Given el usuario autenticado tiene 2 items en el carrito
    When solicita finalizar la compra con idempotency_key válida
    Then el sistema bloquea el stock por 900 segundos
    And crea una orden en estado "PENDING"
    And devuelve el secreto del PaymentIntent de Stripe`
  },
  {
    id: 'cu-02',
    code: 'CU-02',
    title: 'Conciliación Asíncrona de Webhook Bancario',
    actor: 'Pasarela Stripe / Webhook Worker',
    precondition: 'Firma criptográfica HMAC-SHA256 válida en header Stripe-Signature.',
    postcondition: 'Asiento inmutable en payments_ledger y orden marcada como COMPLETED.',
    complexity: 'Alta',
    steps: [
      'Recepción de evento webhook con payload JSON.',
      'Verificación de firma criptográfica mediante secreto del webhook.',
      'Verificación de procesamiento previo mediante mutex idempotente.',
      'Inserción atómica en payments_ledger y disparo de factura PDF.'
    ],
    gherkin: `Feature: Procesamiento Webhook
  Scenario: Webhook firmado correctamente
    Given un evento "charge.succeeded" emitido por Stripe
    When el webhook worker valida la firma HMAC
    Then adquiere un lock atómico por 5 segundos
    And actualiza el estado de la orden a "COMPLETED"
    And responde con HTTP 200 en menos de 250ms`
  },
  {
    id: 'cu-03',
    code: 'CU-03',
    title: 'Rotación y Revocación de Tokens de Sesión',
    actor: 'Identity Service & Edge Middleware',
    precondition: 'Refresh token presente en cookie HttpOnly.',
    postcondition: 'Nuevo par de Access/Refresh tokens y token anterior en lista negra.',
    complexity: 'Media',
    steps: [
      'Cliente detecta expiración de access token y pide renovación.',
      'Identity Service revisa si el refresh token ha sido reusado indebidamente.',
      'Si hubo reuso, revoca toda la cadena de sesiones familiares.',
      'Emite nuevos tokens asimétricos con claims actualizados.'
    ],
    gherkin: `Feature: Rotación Segura de Sesiones
  Scenario: Renovación válida dentro del periodo de gracia
    Given un refresh token no expirado y no revocado
    When se envía solicitud a /api/v1/auth/refresh
    Then se entrega un nuevo Access Token de 15 minutos
    And se añade el token previo a la lista de exclusión en Redis`
  },
  {
    id: 'cu-04',
    code: 'CU-04',
    title: 'Búsqueda Semántica de Catálogo con Filtro Facetado',
    actor: 'Visitante Web / App Móvil',
    precondition: 'Índice Qdrant y PostgreSQL en sincronía vía Change Data Capture.',
    postcondition: 'Lista de productos ranqueada por similitud de coseno y disponibilidad.',
    complexity: 'Media',
    steps: [
      'Usuario teclea consulta en lenguaje natural (ej: "zapatos cómodos para correr").',
      'API genera vector embedding denso de 1536 dimensiones.',
      'Qdrant realiza k-NN search filtrando por inventario > 0.',
      'Retorna resultados paginados en menos de 35 milisegundos.'
    ],
    gherkin: `Feature: Búsqueda Semántica
  Scenario: Búsqueda por lenguaje natural con facetas
    Given una consulta de usuario en texto libre
    When se calcula el vector embedding en el endpoint de búsqueda
    Then se consultan los 20 vecinos más cercanos con score > 0.82
    And se enriquecen con precios y stock en tiempo real`
  }
];

export const MOCK_RISKS: RiskItem[] = [
  {
    id: 'R-01',
    category: 'Denial of Service (DoS)',
    severity: 'ALTA',
    status: 'Mitigado al 90%',
    title: 'Inundación de Webhooks sin rate limiting dinámico en Stripe endpoint',
    impact: 'Caída de memoria en pods de workers y encolamiento crítico de transacciones financieras.',
    mitigation: 'Bucket Token Rate Limiting en API Gateway + Cola Kafka amortiguadora distribuida.',
    targetEndpoint: '/api/v1/webhooks/stripe',
    prReference: 'PR #481 Mergeado'
  },
  {
    id: 'R-02',
    category: 'Information Disclosure',
    severity: 'MEDIA',
    status: 'En Implementación',
    title: 'Exposición de Stacktrace en respuestas de error HTTP 500 en staging',
    impact: 'Fuga de rutas internas del servidor, nombres de módulos y versiones de dependencias.',
    mitigation: 'Middleware global de sanitización de excepciones de FastAPI con correlation-id ofuscado.',
    targetEndpoint: 'app.middleware.errors',
    prReference: 'Target: Sprint 14'
  },
  {
    id: 'R-03',
    category: 'Tampering',
    severity: 'BAJA',
    status: 'Blindado al 100%',
    title: 'Manipulación de parámetros de divisa en payload JSON de checkout',
    impact: 'Riesgo de discrepancia cambiaria en procesamiento de órdenes con múltiples divisas.',
    mitigation: 'Validación estricta con Pydantic V2 schemas e inmutabilidad de precios vía catálogo centralizado.',
    targetEndpoint: 'schemas.checkout.OrderPayload',
    prReference: '100% Tests Pasados (32/32)'
  }
];

export const SURVEY_METRICS = {
  nps: '+68',
  promoters: 'Promotores',
  evaluatedDevs: 142,
  pmfRatio: '79%',
  questions: [
    {
      q: '1. ¿CodeExplain redujo tu tiempo de onboarding en repositorios heredados?',
      percentage: '92%',
      detail: '131 de 142 respondieron "Sí, significativamente"',
      meta: '>75%'
    },
    {
      q: '2. ¿Qué tan confiable consideras la explicación del AST sobre el código?',
      rating: '4.8 / 5.0',
      detail: '(96% satisfacción técnica)'
    },
    {
      q: '3. Disposición a integrar CodeExplain en pipelines CI/CD (GitHub Actions / GitLab)',
      percentage: '84%',
      detail: '119 equipos solicitaron acceso al plugin CLI',
      meta: 'Alta Intención'
    }
  ],
  quotes: [
    {
      text: '“Poder ver el diagrama C4 autogenerado en 2 minutos nos ahorró 3 semanas de reverse engineering en el módulo de transferencias.”',
      author: 'Fernando López',
      role: 'Lead Tech @ Fintech Latam'
    },
    {
      text: '“El detector de SPOF nos evitó una caída mayor en el Black Friday al alertarnos sobre el nodo único en Redis.”',
      author: 'Mariana Chen',
      role: 'DevOps Senior @ SaaS Corp'
    }
  ]
};
