import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { time: "00:00", value: 12 },
    { time: "04:00", value: 15 },
    { time: "08:00", value: 45 },
    { time: "12:00", value: 30 },
    { time: "16:00", value: 25 },
    { time: "20:00", value: 10 },
    { time: "23:59", value: 8 },
];

export function ErrorRateChart() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Error Rate (24h)</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="time"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value: number) => `${value}%`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
                                labelStyle={{ color: "var(--foreground)" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#000000"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
