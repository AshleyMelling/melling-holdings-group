import type React from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  ArrowUpRight,
  Bolt,
  Building2,
  Download,
  ExternalLink,
  HardDrive,
  Plus,
  RefreshCw,
  Shield,
  Wallet,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

import data from "./data.json";

// ----------------------------------
// Example Rebranded Data
// ----------------------------------

// Example "Total Holdings" data card
function TotalHoldingsCard() {
  // Replace these with your real totals
  const totalHoldings = "2.24"; // Could be total BTC or total in some base currency
  const totalUsdValue = "$134,400";

  return (
    <Card className="overflow-hidden border-none shadow-md">
      <CardHeader className="border-b bg-muted/30 pb-3">
        <CardTitle>Total Holdings</CardTitle>
        <CardDescription>
          An overview of all Melling Holdings Group accounts
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-4 p-4">
        <div>
          <p className="text-2xl font-bold">{totalHoldings} BTC</p>
          <p className="text-sm text-muted-foreground">{totalUsdValue}</p>
        </div>
        <Button variant="ghost" size="sm">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}

const walletBreakdownData = [
  {
    type: "Cold Storage",
    amount: "1.45 BTC",
    value: "$87,000",
    percentage: 65,
    icon: HardDrive,
    color: "from-blue-500 to-blue-700",
    change: "+3.2%",
    lastUpdated: "2h ago",
  },
  {
    type: "Exchange",
    amount: "0.58 BTC",
    value: "$34,800",
    percentage: 26,
    icon: Building2,
    color: "from-purple-500 to-purple-700",
    change: "+1.4%",
    lastUpdated: "1h ago",
  },
  {
    type: "Lightning",
    amount: "0.21 BTC",
    value: "$12,600",
    percentage: 9,
    icon: Bolt,
    color: "from-amber-500 to-amber-700",
    change: "+5.7%",
    lastUpdated: "30m ago",
  },
];

const recentHoldingsData = [
  {
    name: "Ledger Nano X",
    type: "Cold Storage",
    amount: "0.85 BTC",
    value: "$51,000",
    change: "+2.3%",
    icon: HardDrive,
    lastUpdated: "2 hours ago",
    status: "secure",
  },
  {
    name: "Trezor Model T",
    type: "Cold Storage",
    amount: "0.60 BTC",
    value: "$36,000",
    change: "+1.8%",
    icon: HardDrive,
    lastUpdated: "5 hours ago",
    status: "secure",
  },
  {
    name: "Coinbase",
    type: "Exchange",
    amount: "0.32 BTC",
    value: "$19,200",
    change: "-0.5%",
    icon: Building2,
    lastUpdated: "1 hour ago",
    status: "warning",
  },
  {
    name: "Kraken",
    type: "Exchange",
    amount: "0.26 BTC",
    value: "$15,600",
    change: "+0.7%",
    icon: Building2,
    lastUpdated: "3 hours ago",
    status: "secure",
  },
  {
    name: "Lightning Node",
    type: "Lightning",
    amount: "0.21 BTC",
    value: "$12,600",
    change: "+4.2%",
    icon: Bolt,
    lastUpdated: "30 minutes ago",
    status: "active",
  },
];

const governanceEventsData = [
  {
    title: "Melling Board Vote",
    description: "Review of Q1 performance metrics and expansions",
    status: "completed",
    timestamp: "Mar 15, 2025",
    icon: Shield,
    participants: 154,
  },
  {
    title: "Holdings Structure Revision",
    description: "Proposal to restructure cold storage policy",
    status: "in progress",
    timestamp: "Apr 07, 2025",
    icon: Shield,
    participants: 46,
  },
  {
    title: "Security Protocol Update",
    description: "Implementation of new multi-sig requirements",
    status: "pending",
    timestamp: "May 02, 2025",
    icon: Shield,
    participants: 5,
  },
];

const marketStats = [
  { label: "BTC Price", value: "$60,123.45", change: "+2.4%", trend: "up" },
  { label: "24h Volume", value: "$42.8B", change: "+5.7%", trend: "up" },
  { label: "Market Cap", value: "$1.17T", change: "-0.3%", trend: "down" },
  { label: "Dominance", value: "52.3%", change: "+0.8%", trend: "up" },
];

// ----------------------------------
// Helper Components
// ----------------------------------

function WalletTypeBadge({ type }: { type: string }) {
  const getIcon = () => {
    switch (type) {
      case "Cold Storage":
        return <HardDrive className="h-3 w-3" />;
      case "Exchange":
        return <Building2 className="h-3 w-3" />;
      case "Lightning":
        return <Bolt className="h-3 w-3" />;
      default:
        return <Wallet className="h-3 w-3" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case "Cold Storage":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
      case "Exchange":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300";
      case "Lightning":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getColor()}`}
    >
      {getIcon()}
      {type}
    </span>
  );
}

function ChangeIndicator({ value }: { value: string }) {
  const isPositive = value.startsWith("+");
  return (
    <div
      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        isPositive
          ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
          : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
      }`}
    >
      {isPositive ? "↑" : "↓"} {value}
    </div>
  );
}

function StatusIndicator({ status }: { status: string }) {
  const getStatusConfig = () => {
    switch (status) {
      case "secure":
        return {
          icon: Shield,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
          label: "Secure",
        };
      case "warning":
        return {
          icon: AlertCircle,
          color: "text-amber-500",
          bgColor: "bg-amber-500/10",
          label: "Attention needed",
        };
      case "active":
        return {
          icon: Zap,
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
          label: "Active",
        };
      default:
        return {
          icon: Clock,
          color: "text-gray-500",
          bgColor: "bg-gray-500/10",
          label: "Unknown",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={`flex items-center gap-1.5 rounded-full px-2 py-1 ${config.bgColor}`}
    >
      <config.icon className={`h-3 w-3 ${config.color}`} />
      <span className={`text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    </div>
  );
}

function StatCard({
  label,
  value,
  change,
  trend,
}: {
  label: string;
  value: string;
  change: string;
  trend: string;
}) {
  return (
    <div className="flex flex-col rounded-xl bg-card p-3 shadow-sm transition-all hover:shadow-md">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-baseline justify-between">
        <div className="text-xl font-bold">{value}</div>
        <div
          className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium ${
            trend === "up"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          }`}
        >
          {trend === "up" ? "↑" : "↓"} {change}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------
// Main Page Component
// ----------------------------------
export default async function MellingHoldingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Hero section with quick stats */}
              <div className="relative overflow-hidden px-4 lg:px-6">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20" />
                <div className="relative z-10 flex flex-col gap-6 rounded-2xl border bg-card/80 p-6 backdrop-blur-sm">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 shadow-inner">
                        {/* You could replace this with a custom Melling Holdings Group logo */}
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                          Melling Holdings Group Dashboard
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Welcome back! Your portfolio is performing well today.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button className="shadow-sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Holding
                      </Button>
                      <Button variant="outline" className="shadow-sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync Data
                      </Button>
                      <Button variant="outline" className="shadow-sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>

                  {/* Market stats row */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {marketStats.map((stat) => (
                      <StatCard
                        key={stat.label}
                        label={stat.label}
                        value={stat.value}
                        change={stat.change}
                        trend={stat.trend}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick action cards */}
              <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
                <Card className="group overflow-hidden border-none bg-gradient-to-br from-primary to-primary-foreground/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-white/20 p-2 shadow-inner">
                        <Plus className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">New Holding</p>
                        <p className="text-xs opacity-80">Add a new account</p>
                      </div>
                    </div>
                    <div className="rounded-full bg-white/10 p-1.5 transition-all group-hover:bg-white/20">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="group overflow-hidden border-none bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-white/20 p-2 shadow-inner">
                        <HardDrive className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Cold Storage</p>
                        <p className="text-xs opacity-80">
                          Manage hardware wallets
                        </p>
                      </div>
                    </div>
                    <div className="rounded-full bg-white/10 p-1.5 transition-all group-hover:bg-white/20">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="group overflow-hidden border-none bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg shadow-purple-500/20 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/30">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-white/20 p-2 shadow-inner">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Exchanges</p>
                        <p className="text-xs opacity-80">
                          Manage exchange accounts
                        </p>
                      </div>
                    </div>
                    <div className="rounded-full bg-white/10 p-1.5 transition-all group-hover:bg-white/20">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="group overflow-hidden border-none bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/30">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-white/20 p-2 shadow-inner">
                        <Bolt className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Lightning</p>
                        <p className="text-xs opacity-80">
                          Manage Lightning nodes
                        </p>
                      </div>
                    </div>
                    <div className="rounded-full bg-white/10 p-1.5 transition-all group-hover:bg-white/20">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Total Holdings Card */}
              <div className="px-4 lg:px-6">
                <TotalHoldingsCard />
              </div>

              {/* Wallet Breakdown Cards */}
              <div className="px-4 lg:px-6">
                <Tabs defaultValue="breakdown" className="w-full">
                  <div className="flex items-center justify-between">
                    <TabsList className="mb-4">
                      <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                      <TabsTrigger value="performance">Performance</TabsTrigger>
                      <TabsTrigger value="security">Security</TabsTrigger>
                    </TabsList>
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                      Detailed Report <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>

                  <TabsContent value="breakdown" className="mt-0">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {walletBreakdownData.map((wallet) => (
                        <Card
                          key={wallet.type}
                          className="group overflow-hidden border-none shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
                        >
                          <div
                            className={`h-1.5 w-full bg-gradient-to-r ${wallet.color}`}
                          />
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`rounded-full bg-gradient-to-br ${wallet.color} p-1.5 text-white shadow-md`}
                                >
                                  <wallet.icon className="h-4 w-4" />
                                </div>
                                <CardTitle className="text-base">
                                  {wallet.type}
                                </CardTitle>
                              </div>
                              <ChangeIndicator value={wallet.change} />
                            </div>
                            <CardDescription className="flex items-center justify-between">
                              <span>
                                {wallet.percentage}% of total holdings
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Updated {wallet.lastUpdated}
                              </span>
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-baseline justify-between">
                              <div className="text-2xl font-bold">
                                {wallet.amount}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {wallet.value}
                              </div>
                            </div>
                            <div className="mt-4 space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">
                                  Allocation
                                </span>
                                <span className="font-medium">
                                  {wallet.percentage}%
                                </span>
                              </div>
                              <Progress
                                value={wallet.percentage}
                                className={`h-2 bg-muted [&>div]:bg-gradient-to-r ${wallet.color}`}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="performance" className="mt-0">
                    <Card className="border-none shadow-md">
                      <CardContent className="p-6">
                        <div className="flex h-40 flex-col items-center justify-center gap-2">
                          <Sparkles className="h-10 w-10 text-muted-foreground/50" />
                          <p className="text-center text-muted-foreground">
                            Performance metrics will appear here
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="security" className="mt-0">
                    <Card className="border-none shadow-md">
                      <CardContent className="p-6">
                        <div className="flex h-40 flex-col items-center justify-center gap-2">
                          <Shield className="h-10 w-10 text-muted-foreground/50" />
                          <p className="text-center text-muted-foreground">
                            Security metrics will appear here
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Chart Area */}
              <div className="px-4 lg:px-6">
                <Card className="overflow-hidden border-none shadow-md">
                  <CardHeader className="border-b bg-muted/30 pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Portfolio Performance</CardTitle>
                        <CardDescription>
                          Holdings value over time
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1">
                          <TrendingUp className="h-3 w-3" /> +12.4% YTD
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-8 gap-1">
                          <ExternalLink className="h-3 w-3" /> Expand
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ChartAreaInteractive />
                  </CardContent>
                </Card>
              </div>

              {/* Recent Holdings Table */}
              <div className="px-4 lg:px-6">
                <Card className="overflow-hidden border-none shadow-md">
                  <CardHeader className="border-b bg-muted/30 pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Recent Holdings</CardTitle>
                        <CardDescription>
                          Your 5 largest Melling Holdings accounts
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        View All <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/30 text-left text-xs font-medium text-muted-foreground">
                            <th className="px-4 py-3">Account</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3 text-right">Amount</th>
                            <th className="px-4 py-3 text-right">Value</th>
                            <th className="px-4 py-3 text-right">Change</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">
                              Last Updated
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentHoldingsData.map((holding, index) => (
                            <tr
                              key={holding.name}
                              className={`group border-b transition-colors hover:bg-muted/50 ${
                                index === recentHoldingsData.length - 1
                                  ? "border-none"
                                  : ""
                              }`}
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                      holding.type === "Cold Storage"
                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                        : holding.type === "Exchange"
                                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                                    } transition-colors group-hover:bg-gradient-to-br ${
                                      holding.type === "Cold Storage"
                                        ? "group-hover:from-blue-500 group-hover:to-blue-700"
                                        : holding.type === "Exchange"
                                        ? "group-hover:from-purple-500 group-hover:to-purple-700"
                                        : "group-hover:from-amber-500 group-hover:to-amber-700"
                                    } group-hover:text-white`}
                                  >
                                    <holding.icon className="h-4 w-4" />
                                  </div>
                                  <span className="font-medium">
                                    {holding.name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <WalletTypeBadge type={holding.type} />
                              </td>
                              <td className="px-4 py-3 text-right font-medium">
                                {holding.amount}
                              </td>
                              <td className="px-4 py-3 text-right text-muted-foreground">
                                {holding.value}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <ChangeIndicator value={holding.change} />
                              </td>
                              <td className="px-4 py-3">
                                <StatusIndicator status={holding.status} />
                              </td>
                              <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                                {holding.lastUpdated}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Governance Timeline and Data Table */}
              <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-3 lg:px-6">
                <div className="md:col-span-1">
                  <Card className="overflow-hidden border-none shadow-md">
                    <CardHeader className="border-b bg-muted/30 pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Governance Timeline</CardTitle>
                          <CardDescription>
                            Recent governance events
                          </CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="flex flex-col">
                        {governanceEventsData.map((event, index) => {
                          // Decide border color by status
                          let borderColor = "border-amber-500";
                          let bgColor = "bg-amber-500";
                          if (event.status === "completed") {
                            borderColor = "border-green-500";
                            bgColor = "bg-green-500";
                          } else if (event.status === "in progress") {
                            borderColor = "border-blue-500";
                            bgColor = "bg-blue-500";
                          }

                          return (
                            <div
                              key={index}
                              className={`group relative border-l-2 px-4 py-4 transition-colors hover:bg-muted/50 ${borderColor} ${
                                index === governanceEventsData.length - 1
                                  ? ""
                                  : "border-b"
                              }`}
                            >
                              <div
                                className={`absolute -left-[9px] top-5 h-4 w-4 rounded-full border-2 border-background ${bgColor} transition-transform group-hover:scale-125`}
                              />
                              <div className="flex flex-col gap-2">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-medium">
                                      {event.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {event.description}
                                    </p>
                                  </div>
                                  <Badge
                                    variant={
                                      event.status === "completed"
                                        ? "default"
                                        : event.status === "in progress"
                                        ? "secondary"
                                        : "outline"
                                    }
                                    className={`ml-2 ${
                                      event.status === "completed"
                                        ? "bg-green-500 hover:bg-green-600"
                                        : event.status === "in progress"
                                        ? "bg-blue-500 hover:bg-blue-600"
                                        : ""
                                    }`}
                                  >
                                    {event.status}
                                  </Badge>
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Avatar className="h-4 w-4">
                                      <event.icon className="h-2 w-2" />
                                    </Avatar>
                                    {event.participants.toLocaleString()}{" "}
                                    participants
                                  </div>
                                  <time className="text-muted-foreground">
                                    {event.timestamp}
                                  </time>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="md:col-span-2">
                  <Card className="overflow-hidden border-none shadow-md">
                    <CardHeader className="border-b bg-muted/30 pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Transaction History</CardTitle>
                          <CardDescription>
                            Recent Melling Holdings activity
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="h-8">
                            Filter
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1"
                          >
                            <ExternalLink className="h-3 w-3" /> Expand
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {/* Example DataTable usage with the same data.json */}
                      <DataTable data={data} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
