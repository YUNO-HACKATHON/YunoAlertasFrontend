# 📊 Integración de Analytics API - Yuno Alert System

## 📋 Descripción General

Este documento detalla los **4 nuevos endpoints de analytics** agregados al sistema para proporcionar métricas en tiempo real de proveedores, merchants y series temporales para visualización de gráficos.

## 🎯 Propósito

Estos endpoints están diseñados para alimentar dashboards y gráficos en el frontend con datos de:

- Estado de proveedores por tasas de error
- Estado de merchants por tasas de error
- Series temporales de tasas de error (para gráficos de líneas)
- Series temporales de volumen de transacciones (para gráficos de líneas)

Todos los endpoints soportan **filtrado opcional por país** y **ventanas de tiempo configurables**.

---

## 🔗 Endpoints Disponibles

### Base URL

```
http://localhost:8000/api
```

---

## 1. 📡 Provider Status (Estado de Proveedores)

### Endpoint

```http
GET /api/providers/status
```

### Descripción

Obtiene la tasa de error de cada proveedor de pago (Stripe, Adyen, PayPal, etc.) con estadísticas de transacciones.

### Query Parameters

| Parámetro      | Tipo    | Requerido | Default | Descripción                                   |
| -------------- | ------- | --------- | ------- | --------------------------------------------- |
| `country_code` | string  | No        | null    | Filtrar por código de país (MX, BR, CO, etc.) |
| `hours`        | integer | No        | 24      | Ventana de tiempo en horas (1-720)            |

### Request Examples

**Sin filtro de país (agregado global):**

```bash
curl http://localhost:8000/api/providers/status?hours=24
```

**Con filtro de país específico:**

```bash
curl http://localhost:8000/api/providers/status?country_code=MX&hours=48
```

### Response Schema

```typescript
interface ProviderStatusListResponse {
  providers: ProviderStatus[];
  total_providers: number;
}

interface ProviderStatus {
  provider_id: string; // "Stripe", "Adyen", "PayPal"
  country_code: string | null; // "MX" o null si es agregado
  total_transactions: number; // Total de transacciones
  declined_transactions: number; // Transacciones rechazadas
  error_rate: number; // Tasa de error (%)
  last_updated: string; // ISO timestamp
}
```

### Response Example

```json
{
  "providers": [
    {
      "provider_id": "Stripe",
      "country_code": null,
      "total_transactions": 15420,
      "declined_transactions": 1234,
      "error_rate": 8.01,
      "last_updated": "2025-12-14T10:30:00Z"
    },
    {
      "provider_id": "Adyen",
      "country_code": null,
      "total_transactions": 12300,
      "declined_transactions": 615,
      "error_rate": 5.0,
      "last_updated": "2025-12-14T10:30:00Z"
    },
    {
      "provider_id": "PayPal",
      "country_code": null,
      "total_transactions": 8900,
      "declined_transactions": 178,
      "error_rate": 2.0,
      "last_updated": "2025-12-14T10:30:00Z"
    }
  ],
  "total_providers": 3
}
```

### Casos de Uso Frontend

✅ **Tabla de ranking de proveedores** ordenada por error_rate  
✅ **Cards de estado de proveedores** con colores según tasa de error  
✅ **Comparación de proveedores** entre diferentes países  
✅ **Alertas visuales** cuando error_rate > 10%

---

## 2. 🏪 Merchant Status (Estado de Merchants)

### Endpoint

```http
GET /api/merchants/status
```

### Descripción

Obtiene la tasa de error de cada merchant con estadísticas de transacciones.

### Query Parameters

| Parámetro      | Tipo    | Requerido | Default | Descripción                                   |
| -------------- | ------- | --------- | ------- | --------------------------------------------- |
| `country_code` | string  | No        | null    | Filtrar por código de país (MX, BR, CO, etc.) |
| `hours`        | integer | No        | 24      | Ventana de tiempo en horas (1-720)            |

### Request Examples

**Sin filtro de país:**

```bash
curl http://localhost:8000/api/merchants/status?hours=24
```

**Con filtro de país:**

```bash
curl http://localhost:8000/api/merchants/status?country_code=BR&hours=72
```

### Response Schema

```typescript
interface MerchantStatusListResponse {
  merchants: MerchantStatus[];
  total_merchants: number;
}

interface MerchantStatus {
  merchant_id: string; // "merchant_001", "merchant_002"
  country_code: string | null; // "BR" o null si es agregado
  total_transactions: number; // Total de transacciones
  declined_transactions: number; // Transacciones rechazadas
  error_rate: number; // Tasa de error (%)
  last_updated: string; // ISO timestamp
}
```

### Response Example

```json
{
  "merchants": [
    {
      "merchant_id": "merchant_003",
      "country_code": null,
      "total_transactions": 5420,
      "declined_transactions": 651,
      "error_rate": 12.01,
      "last_updated": "2025-12-14T10:30:00Z"
    },
    {
      "merchant_id": "merchant_001",
      "country_code": null,
      "total_transactions": 8900,
      "declined_transactions": 445,
      "error_rate": 5.0,
      "last_updated": "2025-12-14T10:30:00Z"
    }
  ],
  "total_merchants": 2
}
```

### Casos de Uso Frontend

✅ **Tabla de merchants con problemas** ordenada por error_rate  
✅ **Dashboard de merchant individual** con métricas específicas  
✅ **Comparación de merchants** en diferentes regiones  
✅ **Notificaciones** cuando un merchant supera umbral de error

---

## 3. 📈 Error Rate Time Series (Serie Temporal de Tasa de Error)

### Endpoint

```http
GET /api/analytics/error-rate-timeseries
```

### Descripción

Obtiene datos de serie temporal (por hora) de tasas de error para gráficos de líneas. Ideal para visualizar tendencias y patrones en el tiempo.

### Query Parameters

| Parámetro      | Tipo    | Requerido | Default | Descripción                        |
| -------------- | ------- | --------- | ------- | ---------------------------------- |
| `country_code` | string  | No        | null    | Filtrar por código de país         |
| `hours`        | integer | No        | 24      | Ventana de tiempo en horas (1-168) |

### Request Examples

**Últimas 24 horas (global):**

```bash
curl http://localhost:8000/api/analytics/error-rate-timeseries?hours=24
```

**Últimas 48 horas en México:**

```bash
curl http://localhost:8000/api/analytics/error-rate-timeseries?country_code=MX&hours=48
```

### Response Schema

```typescript
interface ErrorRateTimeSeriesResponse {
  country_code: string | null; // "MX" o null si es global
  hours: number; // Ventana de tiempo solicitada
  data_points: HourlyErrorRate[]; // Datos por hora
  average_error_rate: number; // Promedio del período
}

interface HourlyErrorRate {
  hour: string; // "2025-12-14T10:00:00Z"
  total_transactions: number; // Transacciones en esa hora
  declined_transactions: number; // Rechazadas en esa hora
  error_rate: number; // Tasa de error de esa hora (%)
}
```

### Response Example

```json
{
  "country_code": null,
  "hours": 24,
  "data_points": [
    {
      "hour": "2025-12-14T00:00:00Z",
      "total_transactions": 450,
      "declined_transactions": 23,
      "error_rate": 5.11
    },
    {
      "hour": "2025-12-14T01:00:00Z",
      "total_transactions": 380,
      "declined_transactions": 19,
      "error_rate": 5.0
    },
    {
      "hour": "2025-12-14T02:00:00Z",
      "total_transactions": 320,
      "declined_transactions": 48,
      "error_rate": 15.0
    },
    {
      "hour": "2025-12-14T03:00:00Z",
      "total_transactions": 290,
      "declined_transactions": 29,
      "error_rate": 10.0
    }
  ],
  "average_error_rate": 8.78
}
```

### Casos de Uso Frontend

✅ **Gráfico de líneas** con Chart.js/Recharts mostrando error_rate vs time  
✅ **Dashboard de tendencias** para detectar patrones horarios  
✅ **Comparación entre países** con múltiples líneas  
✅ **Detección de picos** y alertas automáticas cuando error_rate > threshold

---

## 4. 📊 Transaction Volume Time Series (Serie Temporal de Volumen)

### Endpoint

```http
GET /api/analytics/transaction-volume-timeseries
```

### Descripción

Obtiene datos de serie temporal (por hora) del volumen de transacciones para gráficos de barras o líneas.

### Query Parameters

| Parámetro      | Tipo    | Requerido | Default | Descripción                        |
| -------------- | ------- | --------- | ------- | ---------------------------------- |
| `country_code` | string  | No        | null    | Filtrar por código de país         |
| `hours`        | integer | No        | 24      | Ventana de tiempo en horas (1-168) |

### Request Examples

**Últimas 24 horas (global):**

```bash
curl http://localhost:8000/api/analytics/transaction-volume-timeseries?hours=24
```

**Última semana en Colombia:**

```bash
curl http://localhost:8000/api/analytics/transaction-volume-timeseries?country_code=CO&hours=168
```

### Response Schema

```typescript
interface TransactionVolumeTimeSeriesResponse {
  country_code: string | null; // "CO" o null si es global
  hours: number; // Ventana de tiempo solicitada
  data_points: HourlyTransactionVolume[]; // Datos por hora
  total_transactions: number; // Total del período
  average_per_hour: number; // Promedio por hora
}

interface HourlyTransactionVolume {
  hour: string; // "2025-12-14T10:00:00Z"
  transaction_count: number; // Número de transacciones
}
```

### Response Example

```json
{
  "country_code": null,
  "hours": 24,
  "data_points": [
    {
      "hour": "2025-12-14T00:00:00Z",
      "transaction_count": 450
    },
    {
      "hour": "2025-12-14T01:00:00Z",
      "transaction_count": 380
    },
    {
      "hour": "2025-12-14T02:00:00Z",
      "transaction_count": 320
    },
    {
      "hour": "2025-12-14T03:00:00Z",
      "transaction_count": 290
    }
  ],
  "total_transactions": 10450,
  "average_per_hour": 435.42
}
```

### Casos de Uso Frontend

✅ **Gráfico de barras** mostrando volumen por hora  
✅ **Dashboard de tráfico** para identificar horas pico  
✅ **Comparación de volumen** entre países  
✅ **Predicciones de capacidad** basadas en tendencias

---

## 🛠️ Implementación en Frontend

### Paso 1: Servicios API

Crear servicios dedicados para los nuevos endpoints:

```typescript
// src/services/analyticsService.ts
import api from "./api";

export const analyticsService = {
  // Provider Status
  getProviderStatus: async (params?: {
    country_code?: string;
    hours?: number;
  }) => {
    const response = await api.get("/providers/status", { params });
    return response.data;
  },

  // Merchant Status
  getMerchantStatus: async (params?: {
    country_code?: string;
    hours?: number;
  }) => {
    const response = await api.get("/merchants/status", { params });
    return response.data;
  },

  // Error Rate Time Series
  getErrorRateTimeSeries: async (params?: {
    country_code?: string;
    hours?: number;
  }) => {
    const response = await api.get("/analytics/error-rate-timeseries", {
      params,
    });
    return response.data;
  },

  // Transaction Volume Time Series
  getTransactionVolumeTimeSeries: async (params?: {
    country_code?: string;
    hours?: number;
  }) => {
    const response = await api.get("/analytics/transaction-volume-timeseries", {
      params,
    });
    return response.data;
  },
};
```

### Paso 2: Custom Hooks

Hooks para manejo de estado y auto-refresh:

```typescript
// src/hooks/useProviderStatus.ts
import { useState, useEffect } from "react";
import { analyticsService } from "../services/analyticsService";

export const useProviderStatus = (
  countryCode?: string,
  hours: number = 24,
  autoRefresh = true
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await analyticsService.getProviderStatus({
        country_code: countryCode,
        hours,
      });
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error al cargar estado de proveedores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (autoRefresh) {
      const interval = setInterval(fetchData, 60000); // Refresh cada 60s
      return () => clearInterval(interval);
    }
  }, [countryCode, hours, autoRefresh]);

  return { data, loading, error, refetch: fetchData };
};
```

### Paso 3: Componente de Dashboard

Ejemplo de componente que usa los nuevos endpoints:

```tsx
// src/components/AnalyticsDashboard.tsx
import React, { useState } from "react";
import { useProviderStatus } from "../hooks/useProviderStatus";
import { useErrorRateTimeSeries } from "../hooks/useErrorRateTimeSeries";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export const AnalyticsDashboard: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(
    undefined
  );
  const [timeWindow, setTimeWindow] = useState(24);

  const { data: providers, loading: loadingProviders } = useProviderStatus(
    selectedCountry,
    timeWindow
  );

  const { data: errorRates, loading: loadingChart } = useErrorRateTimeSeries(
    selectedCountry,
    timeWindow
  );

  if (loadingProviders || loadingChart) {
    return <div>Cargando datos...</div>;
  }

  return (
    <div className="analytics-dashboard">
      {/* Filtros */}
      <div className="filters">
        <select
          value={selectedCountry || ""}
          onChange={(e) => setSelectedCountry(e.target.value || undefined)}
        >
          <option value="">Todos los países</option>
          <option value="MX">México</option>
          <option value="BR">Brasil</option>
          <option value="CO">Colombia</option>
        </select>

        <select
          value={timeWindow}
          onChange={(e) => setTimeWindow(Number(e.target.value))}
        >
          <option value={24}>Últimas 24 horas</option>
          <option value={48}>Últimas 48 horas</option>
          <option value={168}>Última semana</option>
        </select>
      </div>

      {/* Tabla de Proveedores */}
      <div className="providers-table">
        <h2>Estado de Proveedores</h2>
        <table>
          <thead>
            <tr>
              <th>Proveedor</th>
              <th>Transacciones</th>
              <th>Rechazadas</th>
              <th>Tasa de Error</th>
            </tr>
          </thead>
          <tbody>
            {providers?.providers.map((provider) => (
              <tr
                key={provider.provider_id}
                className={getRowClassName(provider.error_rate)}
              >
                <td>{provider.provider_id}</td>
                <td>{provider.total_transactions.toLocaleString()}</td>
                <td>{provider.declined_transactions.toLocaleString()}</td>
                <td>
                  <span
                    className={`badge ${getSeverityBadge(provider.error_rate)}`}
                  >
                    {provider.error_rate.toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Gráfico de Tasa de Error */}
      <div className="error-rate-chart">
        <h2>Tasa de Error en el Tiempo</h2>
        <LineChart width={800} height={400} data={errorRates?.data_points}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="hour"
            tickFormatter={(value) => new Date(value).toLocaleTimeString()}
          />
          <YAxis
            label={{
              value: "Error Rate (%)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleString()}
            formatter={(value: number) => [
              `${value.toFixed(2)}%`,
              "Error Rate",
            ]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="error_rate"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
        <p className="average">
          Promedio del período: {errorRates?.average_error_rate.toFixed(2)}%
        </p>
      </div>
    </div>
  );
};

// Helpers
const getRowClassName = (errorRate: number) => {
  if (errorRate > 15) return "critical";
  if (errorRate > 10) return "high";
  if (errorRate > 5) return "medium";
  return "normal";
};

const getSeverityBadge = (errorRate: number) => {
  if (errorRate > 15) return "badge-critical";
  if (errorRate > 10) return "badge-high";
  if (errorRate > 5) return "badge-medium";
  return "badge-normal";
};
```

### Paso 4: Estilos Recomendados

```css
/* src/styles/analytics.css */
.analytics-dashboard {
  padding: 20px;
}

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.filters select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.providers-table table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 40px;
}

.providers-table th {
  background: #f3f4f6;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #e5e7eb;
}

.providers-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #e5e7eb;
}

/* Row colors based on error rate */
.providers-table tr.critical {
  background: #fee2e2;
}

.providers-table tr.high {
  background: #fed7aa;
}

.providers-table tr.medium {
  background: #fef3c7;
}

/* Badge styles */
.badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.badge-critical {
  background: #dc2626;
  color: white;
}

.badge-high {
  background: #f59e0b;
  color: white;
}

.badge-medium {
  background: #fbbf24;
  color: #78350f;
}

.badge-normal {
  background: #10b981;
  color: white;
}

.error-rate-chart {
  margin-top: 40px;
}

.error-rate-chart .average {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #6b7280;
  margin-top: 10px;
}
```

---

## 📋 Casos de Uso Completos

### Dashboard Ejecutivo

```typescript
// Combinar múltiples endpoints para vista completa
const ExecutiveDashboard = () => {
  const { data: providers } = useProviderStatus(undefined, 24);
  const { data: merchants } = useMerchantStatus(undefined, 24);
  const { data: errorTrend } = useErrorRateTimeSeries(undefined, 168); // 1 semana
  const { data: volumeTrend } = useTransactionVolumeTimeSeries(undefined, 168);

  return (
    <div>
      <h1>Dashboard Ejecutivo</h1>

      {/* KPIs */}
      <div className="kpi-cards">
        <KPICard
          title="Proveedores Críticos"
          value={providers?.providers.filter((p) => p.error_rate > 15).length}
          color="red"
        />
        <KPICard
          title="Volumen Total (7d)"
          value={volumeTrend?.total_transactions.toLocaleString()}
          color="blue"
        />
        <KPICard
          title="Error Rate Promedio"
          value={`${errorTrend?.average_error_rate.toFixed(2)}%`}
          color="yellow"
        />
      </div>

      {/* Gráficos */}
      <div className="charts-grid">
        <ErrorRateChart data={errorTrend} />
        <VolumeChart data={volumeTrend} />
      </div>

      {/* Tablas */}
      <ProviderTable providers={providers?.providers} />
      <MerchantTable merchants={merchants?.merchants} />
    </div>
  );
};
```

### Comparación entre Países

```typescript
const CountryComparison = () => {
  const { data: mxData } = useErrorRateTimeSeries("MX", 24);
  const { data: brData } = useErrorRateTimeSeries("BR", 24);
  const { data: coData } = useErrorRateTimeSeries("CO", 24);

  // Combinar datos para gráfico multi-línea
  const combinedData = combineTimeSeriesData([
    { country: "México", data: mxData },
    { country: "Brasil", data: brData },
    { country: "Colombia", data: coData },
  ]);

  return (
    <LineChart data={combinedData}>
      <Line dataKey="MX" stroke="#dc2626" name="México" />
      <Line dataKey="BR" stroke="#16a34a" name="Brasil" />
      <Line dataKey="CO" stroke="#2563eb" name="Colombia" />
    </LineChart>
  );
};
```

### Alertas Automáticas

```typescript
const useAutoAlerts = () => {
  const { data: providers } = useProviderStatus(undefined, 1, true); // Refresh cada 60s

  useEffect(() => {
    if (!providers) return;

    providers.providers.forEach((provider) => {
      if (provider.error_rate > 15) {
        showNotification({
          type: "error",
          title: `🚨 ${provider.provider_id} en estado crítico`,
          message: `Tasa de error: ${provider.error_rate.toFixed(2)}%`,
          duration: 0, // No auto-close
        });
      }
    });
  }, [providers]);
};
```

---

## ✅ Checklist de Integración

### Backend

- [x] Endpoint de Provider Status creado
- [x] Endpoint de Merchant Status creado
- [x] Endpoint de Error Rate Time Series creado
- [x] Endpoint de Transaction Volume Time Series creado
- [x] Filtrado por país implementado
- [x] Manejo de NULL country_code
- [x] SQL optimizado con agregaciones por hora
- [x] Colección de Postman actualizada

### Frontend

- [ ] Crear `analyticsService.ts` con los 4 métodos
- [ ] Crear custom hooks para cada endpoint
- [ ] Implementar componente `AnalyticsDashboard`
- [ ] Agregar gráficos con Chart.js o Recharts
- [ ] Implementar filtros de país y tiempo
- [ ] Crear tabla de ranking de proveedores
- [ ] Crear tabla de ranking de merchants
- [ ] Agregar badges de severidad por color
- [ ] Implementar auto-refresh cada 60 segundos
- [ ] Agregar manejo de estados de loading/error
- [ ] Crear vista de comparación entre países
- [ ] Implementar alertas automáticas para umbrales críticos
- [ ] Agregar exportación de datos (CSV/Excel)
- [ ] Testing de integración con backend

---

## 🧪 Testing con Postman

La colección `Yuno_Alert_System.postman_collection.json` incluye una carpeta **"Analytics & Status"** con 8 requests:

1. **Provider Status** - General
2. **Provider Status by Country** - Filtrado por país
3. **Merchant Status** - General
4. **Merchant Status by Country** - Filtrado por país
5. **Error Rate Time Series** - General
6. **Error Rate Time Series by Country** - Filtrado por país
7. **Transaction Volume Time Series** - General
8. **Transaction Volume Time Series by Country** - Filtrado por país

### Ejemplo de Request en Postman

```http
GET http://localhost:8000/api/providers/status?country_code=MX&hours=48
```

---

## 🎨 Consideraciones de UX

### Colores Recomendados para Error Rates

| Rango  | Color    | Hex       | Descripción |
| ------ | -------- | --------- | ----------- |
| 0-5%   | Verde    | `#10b981` | Normal      |
| 5-10%  | Amarillo | `#fbbf24` | Atención    |
| 10-15% | Naranja  | `#f59e0b` | Alto        |
| >15%   | Rojo     | `#dc2626` | Crítico     |

### Actualización de Datos

- **Dashboard Principal**: Refresh cada 60 segundos
- **Gráficos de Tiempo Real**: Refresh cada 30 segundos
- **Tablas de Status**: Refresh cada 60 segundos
- **Vista de Detalle**: Refresh manual con botón

### Indicadores Visuales

- 🔴 Badge pulsante para providers críticos (>15%)
- 🟡 Badge estático para warnings (10-15%)
- 📊 Tooltip con detalles al pasar mouse sobre gráficos
- 📈 Indicador de tendencia (↑↓) comparado con período anterior
- ⏰ Timestamp de última actualización visible

---

## 🚀 Próximos Pasos Recomendados

1. **Implementar servicios API** en el frontend
2. **Crear custom hooks** para manejo de estado
3. **Desarrollar componente de dashboard** con gráficos
4. **Agregar filtros interactivos** por país y tiempo
5. **Implementar alertas en tiempo real** para umbrales críticos
6. **Crear vistas de comparación** entre países/proveedores
7. **Agregar exportación de datos** para reportes
8. **Testing end-to-end** del flujo completo

---

## 📞 Soporte

Para dudas sobre los endpoints o su uso:

- Revisar `FRONTEND_INTEGRATION.md` para contexto general del API
- Revisar colección de Postman para ejemplos de requests
- Consultar código fuente en `backend/api/routes.py` (líneas 460-762)
- Revisar schemas en `backend/api/schemas.py`

---

## 📝 Changelog

### 2025-12-14

- ✅ Agregados 4 nuevos endpoints de analytics
- ✅ Implementado filtrado por país opcional
- ✅ Agregada ventana de tiempo configurable
- ✅ Creada colección de Postman con 8 requests
- ✅ Documentación completa de integración
- ✅ Ejemplos de código para React/TypeScript

---

**🎯 Objetivo Final**: Proporcionar un dashboard completo de analytics en tiempo real para monitoreo de proveedores, merchants y tendencias de transacciones con visualizaciones claras y alertas automáticas.
