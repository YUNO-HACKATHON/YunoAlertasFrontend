import { useQuery } from "@tanstack/react-query";
import { incidentsAPI } from "../api/endpoints";

interface UseIncidentsParams {
    provider_id?: string;
    country_code?: string;
    search?: string;
}

export const useIncidents = (params: UseIncidentsParams) => {
    return useQuery({
        queryKey: ["incidents", params],
        queryFn: () => incidentsAPI.getAll(params),
    });
};

export const useIncident = (id: number) => {
    return useQuery({
        queryKey: ["incident", id],
        queryFn: () => incidentsAPI.getById(id),
        enabled: !!id,
    });
};
