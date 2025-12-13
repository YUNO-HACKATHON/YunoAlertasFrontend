import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const providers = [
    { name: "Stripe", status: 98, errorRate: 2.0 },
    { name: "Adyen", status: 95, errorRate: 5.0 },
    { name: "dLocal", status: 100, errorRate: 0.0 },
    { name: "PayPal", status: 99, errorRate: 1.0 },
];

export function ProviderStatus() {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Provider Status</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {providers.map((provider) => (
                        <div key={provider.name} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="font-medium">{provider.name}</div>
                                <div className="text-muted-foreground">{provider.errorRate}% Error Rate</div>
                            </div>
                            <Progress value={provider.status} className="h-2" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
