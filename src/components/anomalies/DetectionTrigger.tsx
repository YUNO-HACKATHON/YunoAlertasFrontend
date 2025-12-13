import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCheckAnomalies } from "@/hooks/useAnomalies";
import { Loader2, PlayCircle } from "lucide-react";
import { format } from "date-fns";

export function DetectionTrigger() {
    const [timeWindow, setTimeWindow] = useState("15");
    const checkAnomalies = useCheckAnomalies();

    const handleCheck = () => {
        checkAnomalies.mutate(parseInt(timeWindow));
    };

    return (
        <div className="flex items-center space-x-4 bg-card p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Time Window:</span>
                <Select value={timeWindow} onValueChange={setTimeWindow}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select window" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="15">Last 15 minutes</SelectItem>
                        <SelectItem value="30">Last 30 minutes</SelectItem>
                        <SelectItem value="60">Last 1 hour</SelectItem>
                        <SelectItem value="120">Last 2 hours</SelectItem>
                        <SelectItem value="1440">Last 24 hours</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button onClick={handleCheck} disabled={checkAnomalies.isPending}>
                {checkAnomalies.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <PlayCircle className="mr-2 h-4 w-4" />
                )}
                {checkAnomalies.isPending ? "Checking..." : "Check Now"}
            </Button>

            {checkAnomalies.data && (
                <span className="text-sm text-muted-foreground ml-auto">
                    Last check: {format(new Date(checkAnomalies.data.timestamp), "HH:mm:ss")}
                </span>
            )}
        </div>
    );
}
