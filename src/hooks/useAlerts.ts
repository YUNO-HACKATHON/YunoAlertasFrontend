import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { alertsAPI, incidentsAPI } from "../api/endpoints";
import type { AlertStatus, Severity } from "../api/types";
import toast from "react-hot-toast";

interface UseAlertsParams {
    page?: number;
    page_size?: number;
    severity?: Severity[];
    status?: AlertStatus;
    provider_id?: string;
    search?: string;
}

export const useAlerts = (params: UseAlertsParams) => {
    return useQuery({
        queryKey: ["alerts", params],
        queryFn: () => alertsAPI.getAll(params),
        refetchInterval: 30000, // Auto-refresh every 30s
    });
};

export const useAlert = (id: number) => {
    return useQuery({
        queryKey: ["alert", id],
        queryFn: () => alertsAPI.getById(id),
        enabled: !!id,
    });
};

export const useUpdateAlertStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: AlertStatus }) =>
            alertsAPI.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["alerts"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
        },
    });
};

export const useResolveAlert = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: incidentsAPI.resolve,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["alerts"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
        },
    });
};

export const useAssignAlert = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ alertId, userId }: { alertId: number; userId: number }) =>
            alertsAPI.assign(alertId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["alerts"] });
            toast.success("Investigation started and assigned successfully");
        },
    });
};
