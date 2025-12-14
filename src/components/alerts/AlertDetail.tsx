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
import { Card, CardContent } from "@/components/ui/card";
import type { Alert, AlertStatus } from "@/api/types";
import { useUpdateAlertStatus } from "@/hooks/useAlerts";
import { CheckCircle, Search, Clock, AlertTriangle, TrendingUp, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AlertDetailProps {
    alert: Alert | null;
    isOpen: boolean;
    onClose: () => void;
}

function FormattedErrorPattern({ text }: { text: string }) {
    // Check if the text follows the specific format
    if (!text.includes("CORRELATED INCIDENT:") && !text.includes("ROOT CAUSE ANALYSIS:")) {
        return <p className="text-lg font-semibold">{text}</p>;
    }

    const sections = [
        { key: "CORRELATED INCIDENT", label: "Incident Type" },
        { key: "Severity", label: "Severity" },
        { key: "ROOT CAUSE ANALYSIS", label: "Root Cause Analysis" },
        { key: "IMPACT SUMMARY", label: "Impact Summary" },
        { key: "DETAILED BREAKDOWN", label: "Detailed Breakdown" },
        { key: "ERROR CODE DISTRIBUTION", label: "Error Code Distribution" },
        { key: "AFFECTED ANOMALIES", label: "Affected Anomalies" },
        { key: "CORRELATION METHOD", label: "Correlation Method" }
    ];

    const parsedData: Record<string, string> = {};
    let currentText = text;

    // Extract sections
    const indices: { key: string, index: number }[] = [];
    sections.forEach(section => {
        const index = currentText.indexOf(section.key + ":");
        if (index !== -1) {
            indices.push({ key: section.key, index });
        }
    });

    indices.sort((a, b) => a.index - b.index);

    indices.forEach((item, i) => {
        const nextItem = indices[i + 1];
        const content = currentText.substring(
            item.index + item.key.length + 1,
            nextItem ? nextItem.index : currentText.length
        ).trim();
        parsedData[item.key] = content;
    });

    return (
        <div className="space-y-4 text-sm">
            {parsedData["CORRELATED INCIDENT"] && (
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{parsedData["CORRELATED INCIDENT"]}</span>
                    {parsedData["Severity"] && (
                        <Badge variant={parsedData["Severity"].toUpperCase() === "HIGH" ? "destructive" : "secondary"}>
                            {parsedData["Severity"]}
                        </Badge>
                    )}
                </div>
            )}

            {parsedData["ROOT CAUSE ANALYSIS"] && (
                <div>
                    <h5 className="font-semibold text-primary mb-1">Root Cause Analysis</h5>
                    <p className="text-muted-foreground">{parsedData["ROOT CAUSE ANALYSIS"]}</p>
                </div>
            )}

            {parsedData["IMPACT SUMMARY"] && (
                <div className="bg-muted/30 p-3 rounded-md">
                    <h5 className="font-semibold text-primary mb-2">Impact Summary</h5>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {parsedData["IMPACT SUMMARY"].split("•").filter(i => i.trim()).map((item, i) => (
                            <li key={i} className="ml-2">
                                {item.split("-").map((subItem, j) => (
                                    j === 0 ? <span key={j}>{subItem.trim()}</span> :
                                        <div key={j} className="ml-4 text-xs mt-1">• {subItem.trim()}</div>
                                ))}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {parsedData["DETAILED BREAKDOWN"] && (
                <div>
                    <h5 className="font-semibold text-primary mb-2">Detailed Breakdown</h5>
                    <div className="grid grid-cols-2 gap-2">
                        {parsedData["DETAILED BREAKDOWN"].split("|").map((item, i) => {
                            const [key, value] = item.split(":").map(s => s.trim());
                            if (!value) return null;
                            return (
                                <div key={i} className="bg-muted/20 p-2 rounded border">
                                    <span className="font-semibold text-xs block text-muted-foreground">{key}</span>
                                    <span className="font-medium">{value}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {parsedData["ERROR CODE DISTRIBUTION"] && (
                <div>
                    <h5 className="font-semibold text-primary mb-1">Error Codes</h5>
                    <div className="flex flex-wrap gap-2">
                        {parsedData["ERROR CODE DISTRIBUTION"].split(",").map((item, i) => (
                            <Badge key={i} variant="outline" className="font-mono">
                                {item.trim()}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {parsedData["AFFECTED ANOMALIES"] && (
                <div>
                    <h5 className="font-semibold text-primary mb-1">Affected Anomalies</h5>
                    <ul className="list-disc list-inside text-muted-foreground">
                        {parsedData["AFFECTED ANOMALIES"].split(";").map((item, i) => (
                            <li key={i}>{item.trim()}</li>
                        ))}
                    </ul>
                </div>
            )}

            {parsedData["CORRELATION METHOD"] && (
                <div className="text-xs text-muted-foreground italic border-t pt-2 mt-2">
                    <span className="font-semibold">Method:</span> {parsedData["CORRELATION METHOD"]}
                </div>
            )}
        </div>
    );
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
            <DialogContent className="max-w-4xl">
                <DialogHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <DialogTitle className="text-2xl font-bold">Alert #{alert.alert_id}</DialogTitle>
                            <DialogDescription className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Detected {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                            </DialogDescription>
                        </div>
                        <div className="flex gap-2">
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
                                {alert.severity.toUpperCase()}
                            </Badge>
                            <Badge
                                variant="outline"
                                className={
                                    alert.status === "active" ? "border-red-500 text-red-500" :
                                        alert.status === "investigating" ? "border-amber-500 text-amber-500" :
                                            "border-green-500 text-green-500"
                                }
                            >
                                {alert.status}
                            </Badge>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                    {/* Error Pattern Card */}
                    <Card className="border-l-4 border-l-red-500">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Error Pattern Analysis</h4>
                                    <FormattedErrorPattern text={alert.error_pattern} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Entity</p>
                                        <p className="text-lg font-bold mt-1">{alert.entity_id}</p>
                                        <p className="text-xs text-muted-foreground">{alert.entity_type}</p>
                                    </div>
                                    <Activity className="h-8 w-8 text-muted-foreground opacity-50" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
                                        <p className="text-2xl font-bold text-red-600 mt-1">{alert.error_rate}%</p>
                                    </div>
                                    <TrendingUp className="h-8 w-8 text-red-600 opacity-50" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Affected Txns</p>
                                        <p className="text-2xl font-bold mt-1">{alert.affected_transactions.toLocaleString()}</p>
                                    </div>
                                    <AlertTriangle className="h-8 w-8 text-amber-600 opacity-50" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* AI Analysis */}
                    {alert.rag_recommendation && (
                        <Card className="border-2 border-primary/20 bg-primary/5">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Search className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-bold">AI Analysis</h3>
                                    <Badge variant="outline" className="ml-auto">
                                        {alert.rag_recommendation.confidence} confidence
                                    </Badge>
                                </div>

                                <div className="space-y-4">
                                    <div className="rounded-lg bg-background p-4">
                                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                            Root Cause Hypothesis
                                        </h4>
                                        <p className="text-sm leading-relaxed">{alert.rag_recommendation.root_cause_hypothesis}</p>
                                    </div>

                                    <div className="rounded-lg bg-background p-4">
                                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                            Recommended Actions
                                        </h4>
                                        <ul className="space-y-2">
                                            {alert.rag_recommendation.recommended_actions.map((action, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm">
                                                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                    <span>{action}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm bg-background rounded-lg p-3">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Estimated resolution time:</span>
                                        <span className="text-primary font-semibold">{alert.rag_recommendation.estimated_resolution_minutes} minutes</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    {alert.status !== "investigating" && alert.status !== "resolved" && (
                        <Button
                            variant="outline"
                            onClick={() => handleStatusChange("investigating")}
                            disabled={updateStatus.isPending}
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Start Investigation
                        </Button>
                    )}
                    {alert.status !== "resolved" && (
                        <Button
                            onClick={() => handleStatusChange("resolved")}
                            disabled={updateStatus.isPending}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Resolved
                        </Button>
                    )}
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
