import { Link, useLocation } from "react-router-dom";
import { AlertTriangle, Activity, BookOpen, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Analytics", href: "/", icon: BarChart3 },
    { name: "Alerts", href: "/alerts", icon: AlertTriangle },
    { name: "Anomalies", href: "/anomalies", icon: Activity },
    { name: "Incidents", href: "/incidents", icon: BookOpen },
];

export function Sidebar() {
    const location = useLocation();

    return (
        <div className="flex h-full w-64 flex-col bg-card border-r">
            <div className="flex h-16 items-center px-6 border-b">
                <span className="text-xl font-bold text-primary">Yuno Alerts</span>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 flex-shrink-0",
                                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                )}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
