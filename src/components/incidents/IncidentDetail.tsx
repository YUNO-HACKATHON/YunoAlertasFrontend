import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import type { Incident } from "@/api/types";
import { CheckCircle2, Clock, User } from "lucide-react";
import { format } from "date-fns";

interface IncidentDetailProps {
    incident: Incident | null;
    isOpen: boolean;
    onClose: () => void;
}

export function IncidentDetail({ incident, isOpen, onClose }: IncidentDetailProps) {
    if (!incident) return null;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Incident #{incident.incident_id}</SheetTitle>
                    <SheetDescription>
                        Resolved on {format(new Date(incident.created_at), "PPP p")}
                    </SheetDescription>
                </SheetHeader>

                <div className="grid gap-6 py-6">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">{incident.provider_id}</Badge>
                        <Badge variant="outline">{incident.country_code}</Badge>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Error Description</h4>
                        <p className="text-sm bg-muted p-3 rounded-md">{incident.error_description}</p>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Root Cause</h4>
                        <p className="text-sm font-medium">{incident.root_cause}</p>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Resolution Steps</h4>
                        <div className="space-y-2">
                            {incident.resolution_steps.map((step: string, i: number) => (
                                <div key={i} className="flex items-start gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                    <span>{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>Resolved by {incident.resolved_by}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{incident.resolution_time_minutes} mins to resolve</span>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
