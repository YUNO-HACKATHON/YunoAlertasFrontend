# 🔌 Integración Frontend con Backend - Yuno Alert System

## 📋 Contexto

Necesito conectar el frontend con el backend del sistema de alertas. El backend está corriendo en FastAPI y expone una API REST con los siguientes endpoints.

## 🎯 Objetivo

Implementar la integración completa entre el frontend y el backend, incluyendo:
- Configuración de llamadas HTTP al API
- Manejo de estados de carga y errores
- Actualización automática de datos
- Notificaciones en tiempo real (opcional)
- Autenticación (si es necesario)

## 📡 Endpoints Disponibles

### Base URL
```y 
http://localhost:8000/api, que este en una variable para que se pueda cambiar facilmente 
```

### 1. Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-14T04:30:00Z",
  "database_connected": true
}
```

### 2. Listar Alertas (con paginación y filtros)
```http
GET /api/anomalies?page=1&page_size=20&status=active&severity=critical
```
**Query Parameters:**
- `page` (int, default=1): Número de página
- `page_size` (int, default=20, max=100): Items por página
- `status` (string, optional): Filtrar por estado (`active`, `investigating`, `resolved`)
- `severity` (string, optional): Filtrar por severidad (`low`, `medium`, `high`, `critical`)

**Response:**
```json
{
  "total": 45,
  "page": 1,
  "page_size": 20,
  "alerts": [
    {
      "alert_id": 1,
      "error_pattern": "Stripe + MX experiencing timeout errors",
      "entity_type": "provider",
      "entity_id": "Stripe_MX",
      "severity": "critical",
      "error_rate": 75.5,
      "affected_transactions": 120,
      "rag_recommendation": {
        "confidence": "high",
        "root_cause_hypothesis": "Gateway timeout...",
        "recommended_actions": ["Check provider status", "Scale infrastructure"],
        "notify_roles": ["DevOps", "On-Call Engineer"],
        "estimated_resolution_minutes": 30
      },
      "similar_incident_id": 5,
      "notified_users": ["DevOps", "On-Call Engineer"],
      "assigned_to_user_id": 1,
      "status": "active",
      "created_at": "2025-12-14T04:15:00Z",
      "updated_at": "2025-12-14T04:20:00Z",
      "resolved_at": null
    }
  ]
}
```

### 3. Obtener Alerta Específica
```http
GET /api/anomalies/{alert_id}
```
**Response:** (mismo formato que un item del array de alerts)

### 4. Trigger Manual de Detección de Anomalías
```http
POST /api/anomalies/check
Content-Type: application/json

{
  "time_window_minutes": 15
}
```
**Response:**
```json
{
  "anomalies_found": 3,
  "anomalies": [
    {
      "provider_id": "Stripe",
      "country_code": "MX",
      "error_rate": 75.5,
      "baseline_error_rate": 8.2,
      "affected_transactions": 120,
      "declined_transactions": 90,
      "error_codes": {
        "timeout": 85,
        "fraud_suspected": 5
      },
      "severity": "critical",
      "detected_at": "2025-12-14T04:15:00Z"
    }
  ],
  "timestamp": "2025-12-14T04:15:00Z"
}
```

### 5. Listar Incidentes Históricos
```http
GET /api/incidents?page=1&page_size=20&provider_id=Stripe&country_code=MX
```
**Response:**
```json
{
  "total": 25,
  "page": 1,
  "page_size": 20,
  "incidents": [
    {
      "incident_id": 1,
      "error_description": "Stripe gateway timeout in Mexico",
      "provider_id": "Stripe",
      "country_code": "MX",
      "root_cause": "Provider infrastructure overload",
      "resolution_steps": ["Scaled infrastructure", "Contacted provider"],
      "resolved_by": "Diego García",
      "resolution_time_minutes": 45,
      "created_at": "2025-12-10T15:30:00Z"
    }
  ]
}
```

### 6. Resolver Incidente
```http
POST /api/incidents/resolve
Content-Type: application/json

{
  "alert_id": 1,
  "resolved_by": "Diego García",
  "resolution_steps": [
    "Contacted Stripe support",
    "Scaled infrastructure",
    "Monitored for 30 minutes"
  ],
  "root_cause": "Stripe gateway experiencing high load in Mexico region"
}
```
**Response:**
```json
{
  "incident_id": 15,
  "message": "Incident resolved and added to knowledge base"
}
```

### 7. Dashboard Metrics
```http
GET /api/dashboard/metrics
```
**Response:**
```json
{
  "total_alerts": 45,
  "active_alerts": 8,
  "resolved_alerts": 37,
  "critical_alerts": 2,
  "high_alerts": 6,
  "average_error_rate": 35.5,
  "total_affected_transactions": 1250,
  "most_affected_provider": "Stripe_MX",
  "most_affected_country": "MX"
}
```

## 🛠️ Implementación Requerida

### Paso 1: Configuración de API Client

Crear un servicio/módulo para manejar todas las llamadas HTTP al backend:

**Requisitos:**
- Base URL configurable mediante variable de entorno
- Interceptor para manejo de errores
- Retry logic para errores de red
- Loading states
- Timeout configuration (30 segundos recomendado)

**Variables de Entorno:**
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000
```

### Paso 2: Tipos/Interfaces

Definir tipos TypeScript o interfaces para los modelos del API:
- Alert
- Anomaly
- Incident
- DashboardMetrics
- PaginatedResponse

### Paso 3: Servicios por Entidad

Crear servicios separados para cada entidad:
- **AlertService**: `getAlerts()`, `getAlert(id)`, `checkAnomalies()`
- **IncidentService**: `getIncidents()`, `resolveIncident()`
- **DashboardService**: `getMetrics()`

### Paso 4: Estado Global

Implementar manejo de estado para:
- Alertas activas (actualización cada 30 segundos)
- Métricas del dashboard (actualización cada 60 segundos)
- Filtros aplicados (persistir en localStorage)

### Paso 5: Componentes UI

**Dashboard:**
- Mostrar métricas en cards
- Gráfica de tendencias de error rate
- Lista de alertas activas con scroll infinito

**Lista de Alertas:**
- Tabla paginada con filtros (severity, status)
- Ordenamiento por fecha/severidad
- Badges de severidad con colores
- Botones de acción (resolver, asignar, ver detalles)

**Detalle de Alerta:**
- Modal o página dedicada
- Mostrar toda la información de la alerta
- Panel de recomendaciones de IA
- Timeline de actualizaciones
- Formulario para resolver incidente

**Detección Manual:**
- Botón para trigger detección
- Loading spinner durante análisis
- Resultados en cards o lista
- Opción para crear alerta desde anomalía detectada

### Paso 6: Notificaciones en UI

Implementar toast/snackbar para:
- ✅ Éxito al resolver incidente
- ⚠️ Nueva alerta crítica detectada
- ❌ Errores del API
- ℹ️ Acciones completadas

### Paso 7: Polling/WebSockets (Opcional)

Para actualizaciones en tiempo real:
- **Polling**: GET `/api/anomalies` cada 30 segundos cuando el tab está activo
- **WebSockets**: Implementar si el backend lo soporta (no implementado aún)

### Paso 8: Manejo de Errores

**Errores a manejar:**
- `404`: Recurso no encontrado
- `422`: Validación fallida
- `500`: Error del servidor
- `Network Error`: Sin conexión al backend
- `Timeout`: Request tardó más de 30 segundos

**UI para errores:**
- Mensaje amigable al usuario
- Botón de "Reintentar"
- Log en consola para debugging
- Fallback a datos cacheados si están disponibles

### Paso 9: Optimizaciones

- **Caché**: Cachear métricas del dashboard por 60 segundos
- **Debounce**: En búsquedas y filtros (300ms)
- **Lazy Loading**: Cargar componentes pesados bajo demanda
- **Infinite Scroll**: Para listas largas de alertas
- **Skeleton Loaders**: Mientras cargan los datos

### Paso 10: Testing (Opcional)

- Tests unitarios para servicios API
- Tests de integración para flujos completos
- Mock del API para tests del frontend

## 📝 Ejemplo de Implementación (React + TypeScript)

### API Client Base
```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 500) {
      console.error('Error del servidor:', error.response.data);
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Alert Service
```typescript
// src/services/alertService.ts
import api from './api';
import { Alert, PaginatedAlerts, AnomalyCheckRequest } from '../types';

export const alertService = {
  getAlerts: async (params?: {
    page?: number;
    page_size?: number;
    status?: string;
    severity?: string;
  }): Promise<PaginatedAlerts> => {
    const response = await api.get('/anomalies', { params });
    return response.data;
  },

  getAlert: async (id: number): Promise<Alert> => {
    const response = await api.get(`/anomalies/${id}`);
    return response.data;
  },

  checkAnomalies: async (data: AnomalyCheckRequest) => {
    const response = await api.post('/anomalies/check', data);
    return response.data;
  },
};
```

### Custom Hook para Alertas
```typescript
// src/hooks/useAlerts.ts
import { useState, useEffect } from 'react';
import { alertService } from '../services/alertService';
import { Alert } from '../types';

export const useAlerts = (autoRefresh = true) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async (filters?: any) => {
    try {
      setLoading(true);
      const data = await alertService.getAlerts(filters);
      setAlerts(data.alerts);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar alertas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchAlerts();
      }, 30000); // 30 segundos
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  return { alerts, loading, error, refetch: fetchAlerts };
};
```

## 🔧 Configuración del Backend (CORS)

Si el frontend está en diferente puerto/dominio, verificar que el backend tenga CORS habilitado:

```python
# backend/api/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # URLs del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## ✅ Checklist de Implementación

- [ ] Configurar API client con axios/fetch
- [ ] Definir tipos/interfaces TypeScript
- [ ] Crear servicios para cada entidad (Alert, Incident, Dashboard)
- [ ] Implementar custom hooks para manejo de estado
- [ ] Crear componente Dashboard con métricas
- [ ] Crear componente Lista de Alertas con filtros
- [ ] Crear componente Detalle de Alerta
- [ ] Implementar formulario de Resolución de Incidente
- [ ] Agregar botón de Detección Manual
- [ ] Implementar sistema de notificaciones (toast)
- [ ] Agregar manejo de errores global
- [ ] Implementar loading states y skeletons
- [ ] Configurar polling para auto-refresh (cada 30s)
- [ ] Agregar caché para optimización
- [ ] Configurar CORS en el backend
- [ ] Testing de integración frontend-backend
- [ ] Documentar endpoints usados en el código

## 🎨 Consideraciones de UX

1. **Severidad Visual**: Usar colores distintivos
   - 🔴 Critical: Rojo (#DC2626)
   - 🟠 High: Naranja (#F59E0B)
   - 🟡 Medium: Amarillo (#FBBF24)
   - 🔵 Low: Azul (#3B82F6)

2. **Estados de Alerta**: Usar badges
   - ⚫ Active: Badge rojo pulsante
   - 🔍 Investigating: Badge naranja
   - ✅ Resolved: Badge verde

3. **Actualizaciones en Tiempo Real**:
   - Indicador visual cuando hay nuevas alertas
   - Sonido opcional para alertas críticas
   - Badge con contador de alertas no vistas

4. **Responsive**: Asegurar que funcione en móvil/tablet

## 🚀 Próximos Pasos

1. Implementar el API client base
2. Crear tipos TypeScript
3. Implementar servicios uno por uno
4. Conectar componentes existentes del frontend
5. Probar cada endpoint individualmente
6. Implementar auto-refresh
7. Pulir UX y manejo de errores

## 📞 Endpoints para Testing

Puedes probar los endpoints directamente con:
```bash
# Health check
curl http://localhost:8000/api/health

# Listar alertas
curl http://localhost:8000/api/anomalies?page=1&page_size=10

# Dashboard metrics
curl http://localhost:8000/api/dashboard/metrics

# Trigger detección
curl -X POST http://localhost:8000/api/anomalies/check \
  -H "Content-Type: application/json" \
  -d '{"time_window_minutes": 15}'
```

O usar la colección de Postman: `Yuno_Alert_System.postman_collection.json`
