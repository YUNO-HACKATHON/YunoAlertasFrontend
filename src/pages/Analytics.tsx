import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProviderStatus, useMerchantStatus, useErrorRateTimeSeries, useTransactionVolumeTimeSeries } from "@/hooks/useAnalytics";
import { BarChart3, TrendingUp, Activity, AlertTriangle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

export default function Analytics() {
    const [country, setCountry] = useState<string | undefined>(undefined);
    const [timeWindow, setTimeWindow] = useState(24);

    const { data: providers, isLoading: loadingProviders } = useProviderStatus({ country_code: country, hours: timeWindow });
    const { data: merchants, isLoading: loadingMerchants } = useMerchantStatus({ country_code: country, hours: timeWindow });
    const { data: errorRates, isLoading: loadingErrorRates } = useErrorRateTimeSeries({ country_code: country, hours: timeWindow });
    const { data: volumeData, isLoading: loadingVolume } = useTransactionVolumeTimeSeries({ country_code: country, hours: timeWindow });

    const getSeverityBadge = (errorRate: number) => {
        if (errorRate > 15) return "destructive";
        if (errorRate > 10) return "default";
        return "secondary";
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground mt-2">
                    Real-time metrics and trends for providers and merchants
                </p>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">Country:</label>
                            <Select value={country || "all"} onValueChange={(v) => setCountry(v === "all" ? undefined : v)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="All Countries" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Countries</SelectItem>
                                    <SelectItem value="MX">🇲🇽 Mexico</SelectItem>
                                    <SelectItem value="BR">🇧🇷 Brazil</SelectItem>
                                    <SelectItem value="CO">🇨🇴 Colombia</SelectItem>
                                    <SelectItem value="US">🇺🇸 United States</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">Time Window:</label>
                            <Select value={timeWindow.toString()} onValueChange={(v) => setTimeWindow(Number(v))}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="24">Last 24 hours</SelectItem>
                                    <SelectItem value="48">Last 48 hours</SelectItem>
                                    <SelectItem value="168">Last 7 days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Providers</p>
                                <p className="text-2xl font-bold mt-2">{providers?.total_providers || 0}</p>
                            </div>
                            <Activity className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Critical Providers</p>
                                <p className="text-2xl font-bold mt-2 text-red-600">
                                    {providers?.providers.filter(p => p.error_rate > 15).length || 0}
                                </p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-red-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Avg Error Rate</p>
                                <p className="text-2xl font-bold mt-2">{errorRates?.average_error_rate.toFixed(2)}%</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-amber-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                                <p className="text-2xl font-bold mt-2">{volumeData?.total_transactions.toLocaleString() || 0}</p>
                            </div>
                            <BarChart3 className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Error Rate Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Error Rate Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loadingErrorRates ? (
                            <div className="h-[300px] flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={errorRates?.data_points}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="hour"
                                        tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    />
                                    <YAxis label={{ value: 'Error Rate (%)', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip
                                        labelFormatter={(value) => new Date(value).toLocaleString()}
                                        formatter={(value: number) => [`${value.toFixed(2)}%`, 'Error Rate']}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="error_rate" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Error Rate" />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Transaction Volume Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Transaction Volume</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loadingVolume ? (
                            <div className="h-[300px] flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={volumeData?.data_points}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="hour"
                                        tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    />
                                    <YAxis label={{ value: 'Transactions', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip
                                        labelFormatter={(value) => new Date(value).toLocaleString()}
                                        formatter={(value: number) => [value.toLocaleString(), 'Transactions']}
                                    />
                                    <Legend />
                                    <Bar dataKey="transaction_count" fill="#3b82f6" name="Transactions" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Provider Status Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Provider Status</CardTitle>
                </CardHeader>
                <CardContent>
                    {loadingProviders ? (
                        <div className="h-32 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Provider</TableHead>
                                    <TableHead className="text-right">Total Transactions</TableHead>
                                    <TableHead className="text-right">Declined</TableHead>
                                    <TableHead className="text-right">Error Rate</TableHead>
                                    <TableHead>Last Updated</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {providers?.providers.map((provider) => (
                                    <TableRow key={provider.provider_id}>
                                        <TableCell className="font-medium">{provider.provider_id}</TableCell>
                                        <TableCell className="text-right">{provider.total_transactions.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">{provider.declined_transactions.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant={getSeverityBadge(provider.error_rate)}>
                                                {provider.error_rate.toFixed(2)}%
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatDistanceToNow(new Date(provider.last_updated), { addSuffix: true })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Merchant Status Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Merchant Status</CardTitle>
                </CardHeader>
                <CardContent>
                    {loadingMerchants ? (
                        <div className="h-32 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Merchant</TableHead>
                                    <TableHead className="text-right">Total Transactions</TableHead>
                                    <TableHead className="text-right">Declined</TableHead>
                                    <TableHead className="text-right">Error Rate</TableHead>
                                    <TableHead>Last Updated</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {merchants?.merchants.map((merchant) => (
                                    <TableRow key={merchant.merchant_id}>
                                        <TableCell className="font-medium">{merchant.merchant_id}</TableCell>
                                        <TableCell className="text-right">{merchant.total_transactions.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">{merchant.declined_transactions.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant={getSeverityBadge(merchant.error_rate)}>
                                                {merchant.error_rate.toFixed(2)}%
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatDistanceToNow(new Date(merchant.last_updated), { addSuffix: true })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
