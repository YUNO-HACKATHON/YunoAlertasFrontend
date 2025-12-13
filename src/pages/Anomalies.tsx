import { DetectionTrigger } from "@/components/anomalies/DetectionTrigger";
import { AnomalyCard } from "@/components/anomalies/AnomalyCard";
import { useCheckAnomalies } from "@/hooks/useAnomalies";
import { CheckCircle } from "lucide-react";

export default function Anomalies() {
    const { data } = useCheckAnomalies();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Anomaly Detection</h1>
            </div>

            <DetectionTrigger />

            <div className="space-y-4">
                {data?.anomalies && data.anomalies.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {data.anomalies.map((anomaly, index) => (
                            <AnomalyCard key={index} anomaly={anomaly} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/10">
                        <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20 mb-4">
                            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold">All Systems Normal</h3>
                        <p className="text-muted-foreground max-w-sm mt-2">
                            No anomalies detected in the selected time window. Run a new check to verify system status.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
