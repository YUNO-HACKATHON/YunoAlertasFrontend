import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Anomaly } from "@/api/types";
import { Activity, ArrowUpRight, BrainCircuit } from "lucide-react";

interface AnomalyCardProps {
    anomaly: Anomaly;
}

export function AnomalyCard({ anomaly }: AnomalyCardProps) {
    const increase = ((anomaly.error_rate - anomaly.baseline) / anomaly.baseline) * 100;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">
                    {anomaly.provider_id} <span className="text-muted-foreground">/ {anomaly.country_code}</span>
                </CardTitle>
                <Badge variant="destructive" className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    Anomaly
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-red-500">{anomaly.error_rate}%</span>
                                <span className="text-sm text-muted-foreground">baseline: {anomaly.baseline}%</span>
                            </div>
                        </div>
                        <div className="flex items-center text-red-500 bg-red-500/10 px-2 py-1 rounded">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            <span className="font-bold">+{increase.toFixed(1)}%</span>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Top Error Codes</p>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(anomaly.error_codes).map(([code, count]) => (
                                <Badge key={code} variant="secondary">
                                    {code}: {count}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button className="w-full" variant="outline">
                            <BrainCircuit className="mr-2 h-4 w-4" />
                            Analyze with AI
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
