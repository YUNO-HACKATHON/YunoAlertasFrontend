import { mockAlerts, mockAnomalies, mockIncidents, mockDashboardMetrics, mockHealth } from "./mockData";
import type { Alert, Incident, DashboardMetrics, PaginatedResponse } from "./types";

// Helper to simulate network delay
const delay = <T>(data: T, ms = 500): Promise<T> =>
    new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const alertsAPI = {
    getAll: (params?: any) => delay<PaginatedResponse<Alert>>({
        data: mockAlerts,
        total: mockAlerts.length,
        page: params?.page || 1,
        page_size: params?.page_size || 20
    }),
    getById: (id: number) => delay<Alert>(mockAlerts.find(a => a.alert_id === id) || mockAlerts[0]),
    updateStatus: (id: number, status: string) => {
        const alert = mockAlerts.find(a => a.alert_id === id);
        if (alert) alert.status = status as any;
        return delay({ message: "Status updated", alert: alert! });
    },
};

export const anomaliesAPI = {
    check: (_timeWindow: number) => delay({
        anomalies: mockAnomalies,
        timestamp: new Date().toISOString()
    }),
};

export const incidentsAPI = {
    getAll: (params?: any) => delay<PaginatedResponse<Incident>>({
        data: mockIncidents,
        total: mockIncidents.length,
        page: params?.page || 1,
        page_size: params?.page_size || 20
    }),
    getById: (id: number) => delay<Incident>(mockIncidents.find(i => i.incident_id === id) || mockIncidents[0]),
};

export const dashboardAPI = {
    getMetrics: () => delay<DashboardMetrics>(mockDashboardMetrics),
    getHealth: () => delay(mockHealth),
};
