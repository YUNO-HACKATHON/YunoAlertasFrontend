import { IncidentsTable } from "@/components/incidents/IncidentsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Incidents() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Incident Knowledge Base</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Incident
                </Button>
            </div>
            <IncidentsTable />
        </div>
    );
}
