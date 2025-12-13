# Prompt para Frontend - Sistema de Alertas Inteligentes de Pagos

Eres un desarrollador frontend experto. Necesito que generes un frontend completo y moderno para el sistema de alertas inteligentes de pagos con RAG que ya está implementado en el backend.

## CONTEXTO DEL PROYECTO

Sistema de monitoreo en tiempo real que detecta anomalías en transacciones de pago, usa RAG para buscar soluciones en historial de incidentes pasados, y muestra análisis inteligente con IA.

**Backend existente:**

- FastAPI REST API en `http://localhost:8000`
- 8 endpoints implementados (ver sección API ENDPOINTS)
- Base de datos PostgreSQL con transacciones, incidentes y alertas
- Sistema RAG con embeddings y análisis GPT-4

## STACK TECNOLÓGICO REQUERIDO

**Core:**

- React 18+ con TypeScript
- Vite como build tool
- TailwindCSS para estilos
- shadcn/ui para componentes (https://ui.shadcn.com/)

**Estado & Data Fetching:**

- TanStack Query (React Query) para llamadas a API
- Zustand para estado global (opcional)

**Visualización:**

- Recharts o Chart.js para gráficos
- Lucide React para íconos
- React Hot Toast para notificaciones

**Routing:**

- React Router v6

**Otros:**

- Axios para HTTP requests
- date-fns para manejo de fechas
- clsx para utilidades CSS

## ESTRUCTURA DEL PROYECTO

```
yuno-alert-dashboard/
├── public/
│   └── favicon.ico
├── src/
│   ├── api/
│   │   ├── client.ts              # Axios instance configurado
│   │   ├── endpoints.ts           # Funciones API tipadas
│   │   └── types.ts               # TypeScript interfaces del backend
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── table.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── select.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx        # Navegación lateral
│   │   │   ├── Header.tsx         # Top bar con usuario
│   │   │   └── Layout.tsx         # Main layout wrapper
│   │   ├── dashboard/
│   │   │   ├── MetricsCard.tsx    # Tarjeta de métricas
│   │   │   ├── ErrorRateChart.tsx # Gráfico de error rate
│   │   │   ├── RecentAlerts.tsx   # Lista de alertas recientes
│   │   │   └── ProviderStatus.tsx # Estado por proveedor
│   │   ├── alerts/
│   │   │   ├── AlertsTable.tsx    # Tabla de alertas con filtros
│   │   │   ├── AlertDetail.tsx    # Modal con detalle completo
│   │   │   ├── SeverityBadge.tsx  # Badge de severidad
│   │   │   └── StatusBadge.tsx    # Badge de estado
│   │   ├── anomalies/
│   │   │   ├── DetectionTrigger.tsx   # Botón para trigger manual
│   │   │   ├── TimeWindowSelector.tsx # Selector de ventana tiempo
│   │   │   └── AnomalyCard.tsx        # Card con anomalía detectada
│   │   ├── incidents/
│   │   │   ├── IncidentsTable.tsx     # Knowledge base de incidentes
│   │   │   ├── IncidentDetail.tsx     # Detalle de resolución
│   │   │   └── ResolutionSteps.tsx    # Pasos de resolución
│   │   └── common/
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorMessage.tsx
│   │       └── EmptyState.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx          # Vista principal
│   │   ├── Alerts.tsx             # Página de alertas
│   │   ├── Anomalies.tsx          # Detección de anomalías
│   │   ├── Incidents.tsx          # Knowledge base
│   │   └── NotFound.tsx           # 404
│   ├── hooks/
│   │   ├── useAlerts.ts           # Hook para alertas
│   │   ├── useAnomalies.ts        # Hook para anomalías
│   │   ├── useIncidents.ts        # Hook para incidentes
│   │   └── useDashboardMetrics.ts # Hook para métricas
│   ├── lib/
│   │   ├── utils.ts               # Utilidades (cn, formatters)
│   │   └── constants.ts           # Constantes (colores, severidades)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── components.json               # shadcn/ui config
└── README.md
```

## API ENDPOINTS DEL BACKEND

**Base URL:** `http://localhost:8000`

### 1. Health & Status

```typescript
GET /api/health
Response: {
  status: "ok",
  timestamp: "2025-12-13T20:00:00Z",
  database: "connected"
}
```

### 2. Dashboard Metrics

```typescript
GET /api/dashboard/metrics
Response: {
  total_alerts: 15,
  active_alerts: 8,
  critical_alerts: 2,
  avg_error_rate: 12.5,
  total_transactions_24h: 5432,
  alerts_by_severity: {
    critical: 2,
    high: 5,
    medium: 6,
    low: 2
  },
  top_providers_with_issues: [
    { provider_id: "Stripe", error_rate: 18.5, affected_transactions: 234 },
    { provider_id: "Adyen", error_rate: 12.3, affected_transactions: 156 }
  ]
}
```

### 3. Anomalies Detection

```typescript
POST /api/anomalies/check
Body: { time_window_minutes: 15 }
Response: {
  anomalies: [
    {
      provider_id: "Stripe",
      country_code: "MX",
      error_rate: 45.2,
      baseline: 12.5,
      affected_transactions: 120,
      error_codes: {"timeout": 45, "51": 30, "fraud_suspected": 25},
      time_window: "15 minutes"
    }
  ],
  timestamp: "2025-12-13T20:00:00Z"
}
```

### 4. Alerts

```typescript
GET /api/alerts?page=1&page_size=20&severity=critical&status=active
Response: {
  alerts: [
    {
      alert_id: 1,
      error_pattern: "Stripe_MX_errors",
      entity_type: "provider",
      entity_id: "Stripe",
      severity: "critical",
      error_rate: 45.2,
      affected_transactions: 120,
      rag_recommendation: {
        confidence: "high",
        root_cause: "Payment gateway timeout in Mexico region",
        actions: ["Check Stripe API status", "Review network connectivity"]
      },
      similar_incident_id: 3,
      notified_users: ["DevOps", "Integration Team"],
      status: "active",
      created_at: "2025-12-13T19:45:00Z"
    }
  ],
  total: 15,
  page: 1,
  page_size: 20
}

GET /api/alerts/{alert_id}
Response: { ...alert detail with full rag_recommendation }

PATCH /api/alerts/{alert_id}/status
Body: { status: "investigating" | "resolved" }
Response: { message: "Alert status updated", alert: {...} }
```

### 5. Incidents (Knowledge Base)

```typescript
GET /api/incidents?provider_id=Stripe&country_code=MX
Response: {
  incidents: [
    {
      incident_id: 1,
      error_description: "Stripe Mexico experiencing timeout errors...",
      provider_id: "Stripe",
      country_code: "MX",
      root_cause: "Network latency spike in Mexico data center",
      resolution_steps: [
        "Contact Stripe support",
        "Enable fallback payment gateway",
        "Monitor error rates every 5 minutes",
        "Notify affected merchants"
      ],
      resolved_by: "DevOps Team",
      resolution_time_minutes: 45,
      created_at: "2025-12-10T14:30:00Z"
    }
  ],
  total: 5
}

GET /api/incidents/{incident_id}
Response: { ...incident detail }
```

## REQUISITOS FUNCIONALES DETALLADOS

### 1. Dashboard Principal (`/`)

**Componentes:**

- **Header**: Logo "Yuno Alerts", botón de manual check, health status indicator
- **Metrics Cards** (4 cards en grid):
  - Total Alertas (con trend ↑↓)
  - Alertas Activas (badge verde/rojo)
  - Tasa de Error Promedio (gauge chart)
  - Transacciones 24h (número grande)
- **Error Rate Chart**: Line chart con últimas 24 horas (por hora)
- **Alerts by Severity**: Donut chart (Critical: rojo, High: naranja, Medium: amarillo, Low: azul)
- **Recent Alerts Table**: Últimas 10 alertas con:
  - Severity badge
  - Provider + Country
  - Error rate %
  - Timestamp (relative: "2 hours ago")
  - Status badge
  - Action button (ver detalle)
- **Top Providers with Issues**: Bar chart horizontal

**Interacciones:**

- Auto-refresh cada 30 segundos
- Click en alerta abre modal con detalle
- Filtros rápidos por severidad (tabs)

### 2. Página de Alertas (`/alerts`)

**Componentes:**

- **Filtros**:
  - Severity (select multi)
  - Status (active, investigating, resolved)
  - Provider (autocomplete)
  - Country (select)
  - Date range picker
  - Search por error_pattern
- **Tabla de Alertas**:
  - Columnas: ID, Severity, Provider, Country, Error Rate, Affected Txns, Status, Created, Actions
  - Sorteable por todas las columnas
  - Paginación (20 items por página)
  - Row expansion para ver RAG recommendation inline
- **Bulk Actions**:
  - Marcar como "investigating" (multi-select)
  - Export to CSV

**Modal de Detalle:**

- Error pattern & entity info
- Error rate con sparkline histórico
- **AI Analysis Section**:
  - Confidence badge
  - Root cause hypothesis (card con ícono 🔍)
  - Recommended actions (checklist)
  - Notify roles (avatars)
  - Estimated resolution time
- **Similar Incident** (si existe):
  - Link al incidente
  - Resolution steps preview
  - Similarity score (%)
- Timeline de eventos
- Botones: Mark as Investigating, Resolve, Notify Again

### 3. Detección de Anomalías (`/anomalies`)

**Componentes:**

- **Detection Control Panel**:
  - Time window selector (15min, 30min, 1h, 2h, 24h)
  - "Check Now" button (con loading spinner)
  - Last check timestamp
- **Results Section**:
  - Si no hay anomalías: Empty state con ícono ✅ "All systems normal"
  - Si hay anomalías: Cards para cada una con:
    - Provider + Country (grande)
    - Error rate con indicador vs baseline (↑ +120%)
    - Affected transactions counter
    - Error codes list (badges)
    - "Analyze with AI" button → Trigger full analysis
- **Real-time Status Indicator**:
  - Verde: "No anomalies detected"
  - Amarillo: "Anomalies detected, investigating..."
  - Rojo: "Critical anomalies requiring attention"

### 4. Knowledge Base de Incidentes (`/incidents`)

**Componentes:**

- **Filtros**:
  - Provider (select)
  - Country (select)
  - Search por descripción o root cause
- **Tabla de Incidentes**:
  - Columnas: ID, Provider, Country, Root Cause, Resolution Time, Resolved By, Date
  - Click en row abre panel lateral con:
    - Error description completa
    - Root cause detallado
    - Resolution steps (expandible con checkmarks)
    - Resolved by + time
    - Tags: provider, country, error_type
- **Add New Incident** (botón):
  - Form para agregar incidente resuelto manualmente
  - Genera embedding automáticamente en backend

## DISEÑO UI/UX

### Paleta de Colores

```typescript
// tailwind.config.js
colors: {
  // Severities
  critical: '#EF4444',    // red-500
  high: '#F59E0B',        // amber-500
  medium: '#FBBF24',      // yellow-400
  low: '#3B82F6',         // blue-500

  // Status
  active: '#EF4444',      // red-500
  investigating: '#F59E0B', // amber-500
  resolved: '#10B981',    // green-500

  // Providers (opcional)
  stripe: '#635BFF',
  adyen: '#00112C',
  dlocal: '#00D4FF',
  bac: '#003DA5'
}
```

### Tipografía

- Headings: `font-bold` Inter
- Body: `font-normal` Inter
- Code/IDs: `font-mono` monospace

### Componentes shadcn/ui a usar

```bash
npx shadcn-ui@latest add button card badge table dialog select input label toast tabs alert sheet
```

## TYPESCRIPT TYPES

```typescript
// src/api/types.ts

export type Severity = "critical" | "high" | "medium" | "low";
export type AlertStatus = "active" | "investigating" | "resolved";
export type EntityType = "provider" | "merchant" | "country" | "method";

export interface Alert {
  alert_id: number;
  error_pattern: string;
  entity_type: EntityType;
  entity_id: string;
  severity: Severity;
  error_rate: number;
  affected_transactions: number;
  rag_recommendation: RAGRecommendation | null;
  similar_incident_id: number | null;
  notified_users: string[];
  status: AlertStatus;
  created_at: string;
}

export interface RAGRecommendation {
  confidence: "high" | "medium" | "low";
  is_known_issue: boolean;
  root_cause_hypothesis: string;
  recommended_actions: string[];
  notify_roles: string[];
  estimated_resolution_minutes: number;
}

export interface Anomaly {
  provider_id: string;
  country_code: string;
  error_rate: number;
  baseline: number;
  affected_transactions: number;
  error_codes: Record<string, number>;
  time_window: string;
}

export interface Incident {
  incident_id: number;
  error_description: string;
  provider_id: string;
  country_code: string;
  root_cause: string;
  resolution_steps: string[];
  resolved_by: string;
  resolution_time_minutes: number;
  created_at: string;
}

export interface DashboardMetrics {
  total_alerts: number;
  active_alerts: number;
  critical_alerts: number;
  avg_error_rate: number;
  total_transactions_24h: number;
  alerts_by_severity: Record<Severity, number>;
  top_providers_with_issues: {
    provider_id: string;
    error_rate: number;
    affected_transactions: number;
  }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
}
```

## HOOKS PERSONALIZADOS

### useAlerts

```typescript
// src/hooks/useAlerts.ts
import { useQuery } from "@tanstack/react-query";

interface UseAlertsParams {
  page?: number;
  page_size?: number;
  severity?: Severity;
  status?: AlertStatus;
  provider_id?: string;
}

export const useAlerts = (params: UseAlertsParams) => {
  return useQuery({
    queryKey: ["alerts", params],
    queryFn: () => fetchAlerts(params),
    refetchInterval: 30000, // Auto-refresh cada 30s
  });
};
```

### useAnomalies

```typescript
export const useCheckAnomalies = () => {
  return useMutation({
    mutationFn: (timeWindow: number) => checkAnomalies(timeWindow),
    onSuccess: (data) => {
      if (data.anomalies.length > 0) {
        toast.error(`${data.anomalies.length} anomalies detected!`);
      } else {
        toast.success("No anomalies detected");
      }
    },
  });
};
```

## FEATURES ESPECIALES

### 1. Auto-refresh Inteligente

- Dashboard y Alerts se actualizan cada 30 segundos
- Pausar auto-refresh cuando usuario está interactuando con tabla
- Indicador visual de "última actualización"

### 2. Notificaciones Toast

- Nueva alerta crítica → Toast rojo con sonido
- Anomalía resuelta → Toast verde
- Error en API → Toast rojo con retry button

### 3. Búsqueda Avanzada

- Búsqueda full-text en error_pattern, root_cause, resolution_steps
- Debounce de 300ms
- Highlight de términos encontrados

### 4. Export a CSV

- Botón "Export" en tabla de alertas
- Genera CSV con todas las columnas visibles
- Filename: `yuno-alerts-{date}.csv`

### 5. Responsive Design

- Mobile: Stack cards, collapse sidebar
- Tablet: 2 columns layout
- Desktop: Full layout con sidebar

### 6. Dark Mode (Opcional)

- Toggle en header
- Persistir en localStorage
- Usar CSS variables de Tailwind

## CONFIGURACIÓN INICIAL

### package.json dependencies

```json
{
  "name": "yuno-alert-dashboard",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@tanstack/react-query": "^5.14.0",
    "axios": "^1.6.2",
    "date-fns": "^3.0.0",
    "recharts": "^2.10.0",
    "lucide-react": "^0.294.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.1.0",
    "react-hot-toast": "^2.4.1",
    "zustand": "^4.4.7",
    "class-variance-authority": "^0.7.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.7",
    "tailwindcss": "^3.3.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5"
  }
}
```

### .env.example

```
VITE_API_BASE_URL=http://localhost:8000
VITE_AUTO_REFRESH_INTERVAL=30000
VITE_ENABLE_NOTIFICATIONS=true
```

### vite.config.ts

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
```

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        critical: "#EF4444",
        high: "#F59E0B",
        medium: "#FBBF24",
        low: "#3B82F6",
        active: "#EF4444",
        investigating: "#F59E0B",
        resolved: "#10B981",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

## INSTRUCCIONES DE IMPLEMENTACIÓN

1. **Setup Inicial**:

   ```bash
   npm create vite@latest yuno-alert-dashboard -- --template react-ts
   cd yuno-alert-dashboard
   npm install
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   npx shadcn-ui@latest init
   ```

2. **Instalar Dependencias**:

   ```bash
   npm install react-router-dom @tanstack/react-query axios date-fns recharts lucide-react clsx tailwind-merge react-hot-toast zustand class-variance-authority
   ```

3. **Instalar Componentes shadcn/ui**:

   ```bash
   npx shadcn-ui@latest add button card badge table dialog select input label toast tabs alert sheet dropdown-menu
   ```

4. **Desarrollo por Capas**:

   - **Capa 1**: API client + hooks + types
   - **Capa 2**: Componentes UI básicos (shadcn/ui)
   - **Capa 3**: Componentes específicos (AlertsTable, etc)
   - **Capa 4**: Páginas y routing
   - **Capa 5**: Interacciones y features avanzadas

5. **Testing**:

   - Mock data para desarrollo sin backend
   - Manejo de loading states
   - Manejo de error states
   - Empty states

6. **Optimización**:
   - Lazy loading de rutas
   - Memoización de componentes pesados
   - Virtualización de tablas largas (react-virtual)

## EJEMPLO DE IMPLEMENTACIÓN: API Client

```typescript
// src/api/client.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if needed
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default apiClient;
```

```typescript
// src/api/endpoints.ts
import apiClient from "./client";
import type { Alert, Anomaly, Incident, DashboardMetrics } from "./types";

export const alertsAPI = {
  getAll: (params?: any) => apiClient.get<Alert[]>("/api/alerts", { params }),
  getById: (id: number) => apiClient.get<Alert>(`/api/alerts/${id}`),
  updateStatus: (id: number, status: string) =>
    apiClient.patch(`/api/alerts/${id}/status`, { status }),
};

export const anomaliesAPI = {
  check: (timeWindow: number) =>
    apiClient.post<{ anomalies: Anomaly[] }>("/api/anomalies/check", {
      time_window_minutes: timeWindow,
    }),
};

export const incidentsAPI = {
  getAll: (params?: any) =>
    apiClient.get<Incident[]>("/api/incidents", { params }),
  getById: (id: number) => apiClient.get<Incident>(`/api/incidents/${id}`),
};

export const dashboardAPI = {
  getMetrics: () => apiClient.get<DashboardMetrics>("/api/dashboard/metrics"),
  getHealth: () => apiClient.get("/api/health"),
};
```

## CRITERIOS DE ÉXITO

✅ Dashboard muestra métricas en tiempo real
✅ Tabla de alertas con filtros funcionales
✅ Detección manual de anomalías funciona
✅ Modal de detalle de alerta muestra RAG recommendation
✅ Knowledge base de incidentes es navegable
✅ Auto-refresh implementado
✅ Responsive en mobile/tablet/desktop
✅ Loading y error states bien manejados
✅ UI/UX profesional y moderna
✅ TypeScript sin errores
✅ Código limpio y mantenible

## ENTREGABLES

1. ✅ Código fuente completo del frontend
2. ✅ README.md con instrucciones de instalación y ejecución
3. ✅ Screenshots de las principales vistas
4. ✅ Archivo .env.example con variables necesarias
5. ✅ Documentación de componentes principales

---

**IMPORTANTE**: El código debe ser production-ready, bien documentado, con tipos TypeScript completos, y seguir las mejores prácticas de React. Prioriza la usabilidad y la claridad visual para un sistema de monitoreo crítico.

## NOTAS ADICIONALES

- Usa `formatDistanceToNow` de date-fns para timestamps relativos
- Implementa debounce en búsquedas (usa `useDebouncedValue` custom hook)
- Los gráficos deben ser responsive y animados
- Colores de severidad deben ser consistentes en toda la app
- Los loading states deben usar skeleton loaders, no spinners genéricos
- Error boundaries para capturar errores de React
- Tooltips informativos en métricas complejas
- Keyboard shortcuts para acciones comunes (Cmd+K para buscar, etc)
