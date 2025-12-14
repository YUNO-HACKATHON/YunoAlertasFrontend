import { AlertTriangle, CheckCircle, Activity, CreditCard } from "lucide-react";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { ErrorRateChart } from "@/components/dashboard/ErrorRateChart";
import { RecentAlerts } from "@/components/dashboard/RecentAlerts";
import { ProviderStatus } from "@/components/dashboard/ProviderStatus";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";

export default function Dashboard() {
    const { data: metrics, isLoading } = useDashboardMetrics();

    if (isLoading) {
        return <div className="p-8">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Last updated: Just now</span>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricsCard
                    title="Total Alerts"
                    value={metrics?.total_alerts || 0}
                    icon={AlertTriangle}
                    description="Total alerts in last 24h"
                />
                <MetricsCard
                    title="Active Alerts"
                    value={metrics?.active_alerts || 0}
                    icon={Activity}
                    description="Since last 24 hours"
                />
                <MetricsCard
                    title="Avg Error Rate"
                    value={`${metrics?.average_error_rate || 0}%`}
                    icon={CheckCircle}
                    description="Global error rate"
                />
                <MetricsCard
                    title="Transactions"
                    value={metrics?.total_transactions_24h || 0}
                    icon={CreditCard}
                    description="Processed in last 24h"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <ErrorRateChart />
                <div className="col-span-3 grid gap-4">
                    <RecentAlerts />
                    <ProviderStatus />
                </div>
            </div>
        </div>
    );
}
