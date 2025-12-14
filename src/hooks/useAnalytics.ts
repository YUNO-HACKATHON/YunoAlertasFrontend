import { useQuery } from "@tanstack/react-query";
import { analyticsAPI } from "@/api/endpoints";

interface AnalyticsParams {
    country_code?: string;
    hours?: number;
}

export const useProviderStatus = (params?: AnalyticsParams) => {
    return useQuery({
        queryKey: ["providerStatus", params],
        queryFn: () => analyticsAPI.getProviderStatus(params),
        refetchInterval: 60000, // Auto-refresh every 60 seconds
    });
};

export const useMerchantStatus = (params?: AnalyticsParams) => {
    return useQuery({
        queryKey: ["merchantStatus", params],
        queryFn: () => analyticsAPI.getMerchantStatus(params),
        refetchInterval: 60000,
    });
};

export const useErrorRateTimeSeries = (params?: AnalyticsParams) => {
    return useQuery({
        queryKey: ["errorRateTimeSeries", params],
        queryFn: () => analyticsAPI.getErrorRateTimeSeries(params),
        refetchInterval: 60000,
    });
};

export const useTransactionVolumeTimeSeries = (params?: AnalyticsParams) => {
    return useQuery({
        queryKey: ["transactionVolumeTimeSeries", params],
        queryFn: () => analyticsAPI.getTransactionVolumeTimeSeries(params),
        refetchInterval: 60000,
    });
};
