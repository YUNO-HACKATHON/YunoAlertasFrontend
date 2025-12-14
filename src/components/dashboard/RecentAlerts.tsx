import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAlerts } from "@/hooks/useAlerts";
import { formatDistanceToNow } from "date-fns";

export function RecentAlerts() {
    const { data, isLoading } = useAlerts({ page: 1, page_size: 5 });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Card className="col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Alerts</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                    <Link to="/alerts">
                        View All <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data?.alerts?.map((alert) => (
                        <div
                            key={alert.alert_id}
                            className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/20">
                                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {alert.error_pattern.length > 50
                                            ? `${alert.error_pattern.substring(0, 50)}...`
                                            : alert.error_pattern}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {alert.entity_id} • {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                            <Badge
                                variant={
                                    alert.severity === "critical"
                                        ? "destructive"
                                        : alert.severity === "high"
                                            ? "default" // Map high to default or custom style
                                            : "secondary"
                                }
                                className={
                                    alert.severity === "high" ? "bg-amber-500 hover:bg-amber-600" : ""
                                }
                            >
                                {alert.severity}
                            </Badge>
                        </div>
                    ))}
                    {(!data?.alerts || data.alerts.length === 0) && (
                        <div className="text-center text-muted-foreground py-4">No recent alerts</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
