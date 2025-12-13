import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Alert, AlertStatus } from "@/api/types";
import { useUpdateAlertStatus } from "@/hooks/useAlerts";
import { CheckCircle, Search, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AlertDetailProps {
    alert: Alert | null;
    isOpen: boolean;
    onClose: () => void;
}

export function AlertDetail({ alert, isOpen, onClose }: AlertDetailProps) {
    const updateStatus = useUpdateAlertStatus();

    if (!alert) return null;

    const handleStatusChange = (status: AlertStatus) => {
        updateStatus.mutate({ id: alert.alert_id, status });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl">Alert #{alert.alert_id}</DialogTitle>
                        <Badge
                            variant={
                                alert.severity === "critical"
                                    ? "destructive"
                                    : alert.severity === "high"
                                        ? "default"
                                        : "secondary"
                            }
                            className={
                                alert.severity === "high" ? "bg-amber-500 hover:bg-amber-600" : ""
                            }
                        >
                            {alert.severity}
                        </Badge>
                    </div>
                    <DialogDescription>
                        Detected {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Error Pattern</h4>
                            <p className="font-medium">{alert.error_pattern}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Entity</h4>
                            <p className="font-medium">{alert.entity_id} ({alert.entity_type})</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Error Rate</h4>
                            <p className="font-medium text-red-500">{alert.error_rate}%</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Affected Transactions</h4>
                            <p className="font-medium">{alert.affected_transactions}</p>
                        </div>
                    </div>

                    {alert.rag_recommendation && (
                        <div className="rounded-lg border bg-muted/50 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Search className="h-5 w-5 text-primary" />
                                <h3 className="font-semibold">AI Analysis</h3>
                                <Badge variant="outline" className="ml-auto">
                                    {alert.rag_recommendation.confidence} confidence
                                </Badge>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium mb-1">Root Cause Hypothesis</h4>
                                    <p className="text-sm">{alert.rag_recommendation.root_cause_hypothesis}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium mb-1">Recommended Actions</h4>
                                    <ul className="list-disc list-inside text-sm space-y-1">
                                        {alert.rag_recommendation.recommended_actions.map((action, i) => (
                                            <li key={i}>{action}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>Est. resolution: {alert.rag_recommendation.estimated_resolution_minutes} mins</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <div className="flex gap-2 w-full justify-end">
                        {alert.status !== "investigating" && alert.status !== "resolved" && (
                            <Button
                                variant="outline"
                                onClick={() => handleStatusChange("investigating")}
                                disabled={updateStatus.isPending}
                            >
                                <Search className="mr-2 h-4 w-4" />
                                Investigate
                            </Button>
                        )}
                        {alert.status !== "resolved" && (
                            <Button
                                onClick={() => handleStatusChange("resolved")}
                                disabled={updateStatus.isPending}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Resolve
                            </Button>
                        )}
                        <Button variant="secondary" onClick={onClose}>Close</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
