import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useIncidents } from "@/hooks/useIncidents";
import type { Incident } from "@/api/types";
import { format } from "date-fns";
import { IncidentDetail } from "./IncidentDetail";

export function IncidentsTable() {
    const [search, setSearch] = useState("");
    const [provider, setProvider] = useState<string | "all">("all");
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

    const { data, isLoading } = useIncidents({
        search: search || undefined,
        provider_id: provider !== "all" ? provider : undefined,
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Input
                        placeholder="Search incidents..."
                        value={search}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                        className="w-[300px]"
                    />
                    <Select
                        value={provider}
                        onValueChange={(value: string) => setProvider(value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Provider" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Providers</SelectItem>
                            <SelectItem value="Stripe">Stripe</SelectItem>
                            <SelectItem value="Adyen">Adyen</SelectItem>
                            <SelectItem value="dLocal">dLocal</SelectItem>
                            <SelectItem value="PayPal">PayPal</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Provider</TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead>Root Cause</TableHead>
                            <TableHead>Resolution Time</TableHead>
                            <TableHead>Resolved By</TableHead>
                            <TableHead>Date</TableHead>
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
                                    No incidents found
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.data.map((incident) => (
                                <TableRow
                                    key={incident.incident_id}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => setSelectedIncident(incident)}
                                >
                                    <TableCell className="font-mono">{incident.incident_id}</TableCell>
                                    <TableCell>{incident.provider_id}</TableCell>
                                    <TableCell>{incident.country_code}</TableCell>
                                    <TableCell className="max-w-[300px] truncate">
                                        {incident.root_cause}
                                    </TableCell>
                                    <TableCell>{incident.resolution_time_minutes} mins</TableCell>
                                    <TableCell>{incident.resolved_by}</TableCell>
                                    <TableCell>
                                        {format(new Date(incident.created_at), "MMM d, yyyy")}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <IncidentDetail
                incident={selectedIncident}
                isOpen={!!selectedIncident}
                onClose={() => setSelectedIncident(null)}
            />
        </div>
    );
}
