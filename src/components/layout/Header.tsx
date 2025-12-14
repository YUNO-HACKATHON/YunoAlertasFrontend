import { UserButton } from "@clerk/clerk-react";
import { useHealth } from "@/hooks/useDashboardMetrics";
import { cn } from "@/lib/utils";

export function Header() {
    const { data: health } = useHealth();

    return (
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <div
                        className={cn(
                            "h-2.5 w-2.5 rounded-full",
                            health?.status === "ok" ? "bg-green-500" : "bg-red-500"
                        )}
                    />
                    <span className="text-sm text-muted-foreground">
                        System Status: {health?.status === "ok" ? "Operational" : "Issues Detected"}
                    </span>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <UserButton />
            </div>
        </header>
    );
}
