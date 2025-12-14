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
import { Card, CardContent } from "@/components/ui/card";
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
import { Search, Filter } from "lucide-react";

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
            {/* Filters Card */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-semibold">Filters</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[300px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by error pattern, entity..."
                                value={search}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select
                            value={severity}
                            onValueChange={(value: string) => setSeverity(value as Severity | "all")}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Severity" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Severities</SelectItem>
                                <SelectItem value="critical">🔴 Critical</SelectItem>
                                <SelectItem value="high">🟠 High</SelectItem>
                                <SelectItem value="medium">🟡 Medium</SelectItem>
                                <SelectItem value="low">🔵 Low</SelectItem>
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
                                <SelectItem value="active">⚠️ Active</SelectItem>
                                <SelectItem value="investigating">🔍 Investigating</SelectItem>
                                <SelectItem value="resolved">✅ Resolved</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Alerts Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">ID</TableHead>
                                <TableHead className="w-[120px]">Severity</TableHead>
                                <TableHead className="w-[200px]">Entity</TableHead>
                                <TableHead className="w-[120px]">Error Rate</TableHead>
                                <TableHead className="w-[140px]">Status</TableHead>
                                <TableHead className="w-[160px]">Created</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-32">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : data?.alerts?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-32">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <Search className="h-12 w-12 mb-2 opacity-50" />
                                            <p className="font-medium">No alerts found</p>
                                            <p className="text-sm">Try adjusting your filters</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data?.alerts?.map((alert) => (
                                    <TableRow
                                        key={alert.alert_id}
                                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => handleRowClick(alert)}
                                    >
                                        <TableCell className="font-mono text-sm">#{alert.alert_id}</TableCell>
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
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{alert.entity_id}</span>
                                                <span className="text-xs text-muted-foreground">{alert.entity_type}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold text-red-600">{alert.error_rate}%</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={
                                                alert.status === "active" ? "border-red-500 text-red-500" :
                                                    alert.status === "investigating" ? "border-amber-500 text-amber-500" :
                                                        "border-green-500 text-green-500"
                                            }>
                                                {alert.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {data?.total ? `Showing ${((page - 1) * 20) + 1}-${Math.min(page * 20, data.total)} of ${data.total} alerts` : 'No alerts'}
                </p>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <div className="flex items-center gap-1">
                        <span className="text-sm font-medium px-3 py-1 rounded-md bg-muted">
                            Page {page}
                        </span>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={!data || data?.alerts?.length < 20}
                    >
                        Next
                    </Button>
                </div>
            </div>

            <AlertDetail
                alert={selectedAlert}
                isOpen={!!selectedAlert}
                onClose={() => setSelectedAlert(null)}
            />
        </div>
    );
}
