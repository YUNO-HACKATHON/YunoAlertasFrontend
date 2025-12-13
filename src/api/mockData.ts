import type { Alert, Anomaly, Incident, DashboardMetrics } from "./types";

export const mockAlerts: Alert[] = [
    {
        alert_id: 101,
        error_pattern: "High Decline Rate - Insufficient Funds",
        entity_type: "provider",
        entity_id: "Stripe",
        severity: "critical",
        error_rate: 15.5,
        affected_transactions: 450,
        rag_recommendation: {
            confidence: "high",
            is_known_issue: true,
            root_cause_hypothesis: "Provider gateway instability in region US-EAST",
            recommended_actions: ["Reroute traffic to Adyen", "Notify DevOps team"],
            notify_roles: ["devops", "support"],
            estimated_resolution_minutes: 30
        },
        similar_incident_id: 45,
        notified_users: ["admin@yuno.com"],
        status: "active",
        created_at: new Date().toISOString()
    },
    {
        alert_id: 102,
        error_pattern: "Timeout on Payment Authorization",
        entity_type: "merchant",
        entity_id: "Merchant_XYZ",
        severity: "high",
        error_rate: 8.2,
        affected_transactions: 120,
        rag_recommendation: null,
        similar_incident_id: null,
        notified_users: [],
        status: "investigating",
        created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
        alert_id: 103,
        error_pattern: "Invalid API Key",
        entity_type: "provider",
        entity_id: "PayPal",
        severity: "medium",
        error_rate: 2.1,
        affected_transactions: 15,
        rag_recommendation: null,
        similar_incident_id: null,
        notified_users: [],
        status: "resolved",
        created_at: new Date(Date.now() - 86400000).toISOString()
    }
];

export const mockAnomalies: Anomaly[] = [
    {
        provider_id: "Stripe",
        country_code: "US",
        error_rate: 12.5,
        baseline: 2.0,
        affected_transactions: 200,
        error_codes: { "500": 150, "402": 50 },
        time_window: "last_hour"
    }
];

export const mockIncidents: Incident[] = [
    {
        incident_id: 45,
        error_description: "Stripe US Gateway Outage",
        provider_id: "Stripe",
        country_code: "US",
        root_cause: "Upstream provider DNS failure",
        resolution_steps: ["Switched to backup DNS", "Rerouted traffic"],
        resolved_by: "Jane Doe",
        resolution_time_minutes: 45,
        created_at: "2023-10-25T10:00:00Z"
    }
];

export const mockDashboardMetrics: DashboardMetrics = {
    total_alerts: 12,
    active_alerts: 3,
    critical_alerts: 1,
    avg_error_rate: 3.5,
    total_transactions_24h: 15000,
    alerts_by_severity: {
        critical: 1,
        high: 2,
        medium: 5,
        low: 4
    },
    top_providers_with_issues: [
        { provider_id: "Stripe", error_rate: 12.5, affected_transactions: 200 },
        { provider_id: "Adyen", error_rate: 5.2, affected_transactions: 80 }
    ]
};

export const mockHealth = {
    status: "ok",
    timestamp: new Date().toISOString(),
    database: "connected"
};
