import apiClient from "./client";
import type {
    Alert,
    Anomaly,
    Incident,
    DashboardMetrics,
    PaginatedAlertsResponse,
    PaginatedIncidentsResponse,
    ProviderStatusListResponse,
    MerchantStatusListResponse,
    ErrorRateTimeSeriesResponse,
    TransactionVolumeTimeSeriesResponse,
    ResolveAlertRequest
} from "./types";

export const alertsAPI = {
    getAll: (params?: any) => apiClient.get<any, PaginatedAlertsResponse<Alert>>("/anomalies", { params }),
    getById: (id: number) => apiClient.get<any, Alert>(`/anomalies/${id}`),
    // Note: The backend currently only supports resolving incidents via POST /incidents/resolve
    // We might need to adjust the UI to use that instead of a generic status update
    updateStatus: (id: number, status: string) =>
        apiClient.patch<any, { message: string; alert: Alert }>(`/anomalies/${id}/status`, { status }),
    assign: (alertId: number, userId: number) =>
        apiClient.post<any, { message: string }>(`/anomalies/${alertId}/assign`, { user_id: userId }),
};

export const anomaliesAPI = {
    check: (timeWindow: number) =>
        apiClient.post<any, { anomalies: Anomaly[]; timestamp: string }>("/anomalies/check", {
            time_window_minutes: timeWindow,
        }),
};

export const incidentsAPI = {
    getAll: (params?: any) =>
        apiClient.get<any, PaginatedIncidentsResponse<Incident>>("/incidents", { params }),
    getById: (id: number) => apiClient.get<any, Incident>(`/incidents/${id}`),
    resolve: (data: ResolveAlertRequest) =>
        apiClient.post<any, { incident_id: number; message: string }>("/incidents/resolve", data),
};

export const dashboardAPI = {
    getMetrics: () => apiClient.get<any, DashboardMetrics>("/dashboard/metrics"),
    getHealth: () => apiClient.get<any, { status: string; timestamp: string; database_connected: boolean }>("/health"),
};

export const analyticsAPI = {
    getProviderStatus: (params?: { country_code?: string; hours?: number }) =>
        apiClient.get<any, ProviderStatusListResponse>("/providers/status", { params }),

    getMerchantStatus: (params?: { country_code?: string; hours?: number }) =>
        apiClient.get<any, MerchantStatusListResponse>("/merchants/status", { params }),

    getErrorRateTimeSeries: (params?: { country_code?: string; hours?: number }) =>
        apiClient.get<any, ErrorRateTimeSeriesResponse>("/analytics/error-rate-timeseries", { params }),

    getTransactionVolumeTimeSeries: (params?: { country_code?: string; hours?: number }) =>
        apiClient.get<any, TransactionVolumeTimeSeriesResponse>("/analytics/transaction-volume-timeseries", { params }),
};

