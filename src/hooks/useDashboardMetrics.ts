import { useQuery } from "@tanstack/react-query";
import { dashboardAPI } from "../api/endpoints";

export const useDashboardMetrics = () => {
    return useQuery({
        queryKey: ["dashboard-metrics"],
        queryFn: dashboardAPI.getMetrics,
        refetchInterval: 30000, // Auto-refresh every 30s
    });
};

export const useHealth = () => {
    return useQuery({
        queryKey: ["health"],
        queryFn: dashboardAPI.getHealth,
        refetchInterval: 60000,
    });
};
