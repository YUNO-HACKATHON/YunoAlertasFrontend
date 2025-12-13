import { useMutation } from "@tanstack/react-query";
import { anomaliesAPI } from "../api/endpoints";
import toast from "react-hot-toast";

export const useCheckAnomalies = () => {
    return useMutation({
        mutationFn: (timeWindow: number) => anomaliesAPI.check(timeWindow),
        onSuccess: (data) => {
            if (data.anomalies.length > 0) {
                toast.error(`${data.anomalies.length} anomalies detected!`);
            } else {
                toast.success("No anomalies detected");
            }
        },
        onError: () => {
            toast.error("Failed to check for anomalies");
        },
    });
};
