import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAlerts } from "@/hooks/useAlerts";
import type { Alert, AlertStatus, Severity } from "@/api/types";
import { formatDistanceToNow } from "date-fns";
import { AlertDetail } from "./AlertDetail";

export function AlertsTable() {
    const [page, setPage] = useState(1);
    const [severity, setSeverity] = useState<Severity | "all">("all");
    const [status, setStatus] = useState<AlertStatus | "all">("all");
    const [search, setSearch] = useState("");
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

    const { data, isLoading } = useAlerts({
        page,
        page_size: 20,
        severity: severity !== "all" ? [severity] : undefined,
        status: status !== "all" ? status : undefined,
        search: search || undefined,
    });

    const handleRowClick = (alert: Alert) => {
        setSelectedAlert(alert);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Input
                        placeholder="Search alerts..."
                        value={search}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                        className="w-[300px]"
                    />
                    <Select
                        value={severity}
                        onValueChange={(value: string) => setSeverity(value as Severity | "all")}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Severity" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Severities</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={status}
                        onValueChange={(value: string) => setStatus(value as AlertStatus | "all")}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="investigating">Investigating</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead>Error Pattern</TableHead>
                            <TableHead>Entity</TableHead>
                            <TableHead>Error Rate</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : data?.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    No alerts found
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.data.map((alert) => (
                                <TableRow
                                    key={alert.alert_id}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => handleRowClick(alert)}
                                >
                                    <TableCell className="font-mono">{alert.alert_id}</TableCell>
                                    <TableCell>
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
                                    </TableCell>
                                    <TableCell>{alert.error_pattern}</TableCell>
                                    <TableCell>
                                        {alert.entity_id} <span className="text-xs text-muted-foreground">({alert.entity_type})</span>
                                    </TableCell>
                                    <TableCell>{alert.error_rate}%</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={
                                            alert.status === "active" ? "border-red-500 text-red-500" :
                                                alert.status === "investigating" ? "border-amber-500 text-amber-500" :
                                                    "border-green-500 text-green-500"
                                        }>
                                            {alert.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!data || data.data.length < 20}
                >
                    Next
                </Button>
            </div>

            <AlertDetail
                alert={selectedAlert}
                isOpen={!!selectedAlert}
                onClose={() => setSelectedAlert(null)}
            />
        </div>
    );
}
