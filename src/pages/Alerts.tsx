import { AlertsTable } from "@/components/alerts/AlertsTable";
import { Card, CardContent } from "@/components/ui/card";
import { useAlerts } from "@/hooks/useAlerts";
import { AlertTriangle, CheckCircle, Clock, Activity } from "lucide-react";

export default function Alerts() {
    const { data } = useAlerts({ page: 1, page_size: 100 });

    const stats = {
        total: data?.total || 0,
        active: data?.alerts?.filter((a) => a.status === "active").length || 0,
        investigating: data?.alerts?.filter((a) => a.status === "investigating").length || 0,
        resolved: data?.alerts?.filter((a) => a.status === "resolved").length || 0,
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
                <p className="text-muted-foreground mt-2">
                    Monitor and manage system alerts in real-time
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Alerts</p>
                                <p className="text-2xl font-bold mt-2">{stats.total}</p>
                            </div>
                            <Activity className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active</p>
                                <p className="text-2xl font-bold mt-2 text-red-600">{stats.active}</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-red-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Investigating</p>
                                <p className="text-2xl font-bold mt-2 text-amber-600">{stats.investigating}</p>
                            </div>
                            <Clock className="h-8 w-8 text-amber-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                                <p className="text-2xl font-bold mt-2 text-green-600">{stats.resolved}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <AlertsTable />
        </div>
    );
}
