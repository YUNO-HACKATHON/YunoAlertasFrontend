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
