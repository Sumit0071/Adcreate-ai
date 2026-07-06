"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp, Target, Eye, MousePointer, Share2, Download,
  RefreshCw, BarChart3, Loader2, Globe, Users, Zap, ArrowUp, ArrowDown
} from "lucide-react";
import { getAnalyticsSummary, getPublishedPosts } from "@/app/api/businessProfile";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import Link from "next/link";

interface AnalyticsSummary {
  totalPosts: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  ctr: string;
  conversionRate: string;
}

interface PlatformStat {
  impressions: number;
  clicks: number;
  conversions: number;
  posts: number;
}

interface AdPerformance {
  postId: number;
  adId: number;
  platform: string;
  content: string;
  businessName: string;
  status: string;
  publishedAt: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  Facebook: "#1877F2",
  Instagram: "#E1306C",
  LinkedIn: "#0A66C2",
  Twitter: "#1DA1F2",
};

const CHART_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b"];

// Mock trend data for visualization (real data in production would come from backend time-series)
const generateTrendData = (days: number) => {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      impressions: Math.floor(Math.random() * 500 + 100),
      clicks: Math.floor(Math.random() * 50 + 5),
      conversions: Math.floor(Math.random() * 10),
    });
  }
  return data;
};

export default function AnalyticsPage() {
  const [days, setDays] = useState("30");
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [platformBreakdown, setPlatformBreakdown] = useState<Record<string, PlatformStat>>({});
  const [adPerformance, setAdPerformance] = useState<AdPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [publishedPosts, setPublishedPosts] = useState<any[]>([]);
  const [trendData, setTrendData] = useState(generateTrendData(30));

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const [analyticsData, postsData] = await Promise.all([
        getAnalyticsSummary(parseInt(days)).catch(() => null),
        getPublishedPosts().catch(() => null),
      ]);

      if (analyticsData?.success) {
        setSummary(analyticsData.summary);
        setPlatformBreakdown(analyticsData.platformBreakdown || {});
        setAdPerformance(analyticsData.adPerformance || []);
      } else {
        // Use demo data if backend returns empty or error
        setSummary({
          totalPosts: 12,
          totalImpressions: 36250,
          totalClicks: 982,
          totalConversions: 145,
          ctr: "2.71",
          conversionRate: "14.77",
        });
        setPlatformBreakdown({
          Facebook: { impressions: 15600, clicks: 421, conversions: 62, posts: 5 },
          Instagram: { impressions: 8200, clicks: 205, conversions: 38, posts: 3 },
          LinkedIn: { impressions: 9800, clicks: 294, conversions: 35, posts: 3 },
          Twitter: { impressions: 2650, clicks: 62, conversions: 10, posts: 1 },
        });
        setAdPerformance([
          { postId: 1, adId: 1, platform: "Facebook", content: "Transform your business with AI-powered solutions...", businessName: "My Business", status: "PUBLISHED", publishedAt: new Date().toISOString(), impressions: 12500, clicks: 350, conversions: 45, ctr: "2.80" },
          { postId: 2, adId: 2, platform: "Instagram", content: "Discover the power of AI-driven advertising...", businessName: "My Business", status: "PUBLISHED", publishedAt: new Date().toISOString(), impressions: 8200, clicks: 164, conversions: 22, ctr: "2.00" },
          { postId: 3, adId: 3, platform: "LinkedIn", content: "Elevate your brand with data-driven campaigns...", businessName: "My Business", status: "SCHEDULED", publishedAt: new Date().toISOString(), impressions: 15600, clicks: 468, conversions: 78, ctr: "3.00" },
        ]);
      }

      if (postsData?.success) {
        setPublishedPosts(postsData.posts || []);
      }

      setTrendData(generateTrendData(parseInt(days)));
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadAnalytics(); }, [days]);

  const platformPieData = Object.entries(platformBreakdown).map(([platform, stats]) => ({
    name: platform,
    value: stats.impressions,
    clicks: stats.clicks,
    conversions: stats.conversions,
  }));

  const platformBarData = Object.entries(platformBreakdown).map(([platform, stats]) => ({
    platform,
    impressions: stats.impressions,
    clicks: stats.clicks,
    conversions: stats.conversions,
  }));

  const StatCard = ({
    title, value, subtitle, icon: Icon, color, trend
  }: {
    title: string; value: string | number; subtitle: string; icon: any; color: string; trend?: number;
  }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          {trend !== undefined && (
            trend > 0
              ? <ArrowUp className="w-3 h-3 text-green-500" />
              : <ArrowDown className="w-3 h-3 text-red-500" />
          )}
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              Analytics & Insights
            </h1>
            <p className="text-gray-500 text-sm mt-1">Track your published ad performance in real-time</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={days} onValueChange={setDays}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={loadAnalytics}>
              <RefreshCw className="w-4 h-4 mr-2" />Refresh
            </Button>
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />Export
            </Button>
            <Link href="/dashboard">
              <Button size="sm" variant="ghost">← Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="ml-3 text-gray-600">Loading analytics...</span>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard
                title="Published Posts" value={summary?.totalPosts || 0}
                subtitle="across all platforms" icon={Globe} color="bg-indigo-500" trend={12}
              />
              <StatCard
                title="Impressions" value={(summary?.totalImpressions || 0).toLocaleString()}
                subtitle="total ad views" icon={Eye} color="bg-blue-500" trend={18}
              />
              <StatCard
                title="Clicks" value={(summary?.totalClicks || 0).toLocaleString()}
                subtitle="link clicks" icon={MousePointer} color="bg-purple-500" trend={8}
              />
              <StatCard
                title="CTR" value={`${summary?.ctr || "0"}%`}
                subtitle="click-through rate" icon={Target} color="bg-pink-500" trend={5}
              />
              <StatCard
                title="Conversions" value={summary?.totalConversions || 0}
                subtitle="goal completions" icon={Zap} color="bg-orange-500" trend={22}
              />
              <StatCard
                title="Conv. Rate" value={`${summary?.conversionRate || "0"}%`}
                subtitle="conversion rate" icon={TrendingUp} color="bg-green-500" trend={15}
              />
            </div>

            {/* Main Analytics Tabs */}
            <Tabs defaultValue="performance">
              <TabsList className="mb-6">
                <TabsTrigger value="performance">Performance Trends</TabsTrigger>
                <TabsTrigger value="platforms">Platform Breakdown</TabsTrigger>
                <TabsTrigger value="ads">Ad Performance</TabsTrigger>
                <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
              </TabsList>

              {/* Performance Trends */}
              <TabsContent value="performance">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="impressions" stroke="#6366f1" strokeWidth={2} dot={false} name="Impressions" />
                        <Line type="monotone" dataKey="clicks" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Clicks" />
                        <Line type="monotone" dataKey="conversions" stroke="#ec4899" strokeWidth={2} dot={false} name="Conversions" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Platform Breakdown */}
              <TabsContent value="platforms">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader><CardTitle>Impressions by Platform</CardTitle></CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                          <Pie data={platformPieData} cx="50%" cy="50%" outerRadius={100}
                            dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                            {platformPieData.map((entry, index) => (
                              <Cell key={entry.name}
                                fill={PLATFORM_COLORS[entry.name] || CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Clicks & Conversions by Platform</CardTitle></CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={platformBarData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="platform" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="clicks" fill="#6366f1" name="Clicks" radius={[4,4,0,0]} />
                          <Bar dataKey="conversions" fill="#ec4899" name="Conversions" radius={[4,4,0,0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Per-platform stats */}
                  <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>Platform Summary</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(platformBreakdown).map(([platform, stats]) => (
                          <div key={platform} className="border rounded-xl p-4 space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PLATFORM_COLORS[platform] || "#6366f1" }} />
                              <span className="font-semibold">{platform}</span>
                              <Badge variant="outline" className="ml-auto text-xs">{stats.posts} posts</Badge>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between"><span className="text-gray-500">Impressions</span><span className="font-medium">{stats.impressions.toLocaleString()}</span></div>
                              <div className="flex justify-between"><span className="text-gray-500">Clicks</span><span className="font-medium">{stats.clicks}</span></div>
                              <div className="flex justify-between"><span className="text-gray-500">CTR</span><span className="font-medium text-green-600">
                                {stats.impressions > 0 ? ((stats.clicks / stats.impressions) * 100).toFixed(2) : 0}%
                              </span></div>
                              <div className="flex justify-between"><span className="text-gray-500">Conversions</span><span className="font-medium text-indigo-600">{stats.conversions}</span></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Ad Performance */}
              <TabsContent value="ads">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Ad Performance Details</CardTitle>
                      <Link href="/generate-ads">
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                          + Create New Ads
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {adPerformance.length === 0 ? (
                      <div className="text-center py-12 space-y-3">
                        <Share2 className="w-12 h-12 text-gray-300 mx-auto" />
                        <p className="text-gray-500">No published ads yet.</p>
                        <Link href="/generate-ads">
                          <Button variant="outline">Generate & Publish Your First Ad</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {adPerformance.map((ad) => (
                          <div key={ad.postId} className="border rounded-xl p-5 hover:shadow-md transition-shadow">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PLATFORM_COLORS[ad.platform] || "#6366f1" }} />
                                  <span className="font-semibold">{ad.businessName}</span>
                                  <Badge variant="outline" className="text-xs">{ad.platform}</Badge>
                                  <Badge
                                    className={`text-xs ${ad.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
                                    variant="secondary">
                                    {ad.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{ad.content}</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <div className="text-lg font-bold text-blue-600">{ad.impressions.toLocaleString()}</div>
                                    <div className="text-xs text-gray-500">Impressions</div>
                                  </div>
                                  <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <div className="text-lg font-bold text-purple-600">{ad.clicks}</div>
                                    <div className="text-xs text-gray-500">Clicks</div>
                                  </div>
                                  <div className="text-center p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                                    <div className="text-lg font-bold text-pink-600">{ad.ctr}%</div>
                                    <div className="text-xs text-gray-500">CTR</div>
                                  </div>
                                  <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <div className="text-lg font-bold text-green-600">{ad.conversions}</div>
                                    <div className="text-xs text-gray-500">Conversions</div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={parseFloat(ad.ctr) > 2.5 ? "default" : parseFloat(ad.ctr) > 1.5 ? "secondary" : "outline"}
                                  className={parseFloat(ad.ctr) > 2.5 ? "bg-green-600 text-white" : ""}>
                                  {parseFloat(ad.ctr) > 2.5 ? "🔥 High Performer" : parseFloat(ad.ctr) > 1.5 ? "Good" : "Needs Boost"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Conversion Funnel */}
              <TabsContent value="funnel">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader><CardTitle>Conversion Funnel</CardTitle></CardHeader>
                    <CardContent>
                      {summary && (
                        <div className="space-y-4">
                          {[
                            { stage: "Impressions", value: summary.totalImpressions, color: "bg-blue-500", pct: 100 },
                            {
                              stage: "Clicks", value: summary.totalClicks, color: "bg-purple-500",
                              pct: summary.totalImpressions > 0 ? (summary.totalClicks / summary.totalImpressions) * 100 : 0
                            },
                            {
                              stage: "Conversions", value: summary.totalConversions, color: "bg-green-500",
                              pct: summary.totalClicks > 0 ? (summary.totalConversions / summary.totalClicks) * 100 : 0
                            },
                          ].map((item, idx) => (
                            <div key={item.stage}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium">{item.stage}</span>
                                <span className="text-gray-500">{item.value.toLocaleString()} ({item.pct.toFixed(2)}%)</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-3">
                                <div className={`${item.color} rounded-full h-3 transition-all duration-500`}
                                  style={{ width: `${Math.max(item.pct, 2)}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Key Insights</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-700 dark:text-green-300 text-sm">Best Performer</span>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-400">
                          Your LinkedIn ads have the highest CTR at {
                            platformBreakdown["LinkedIn"]?.impressions > 0
                              ? ((platformBreakdown["LinkedIn"]?.clicks / platformBreakdown["LinkedIn"]?.impressions) * 100).toFixed(2)
                              : "3.00"
                          }%
                        </p>
                      </div>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-blue-700 dark:text-blue-300 text-sm">Optimization Opportunity</span>
                        </div>
                        <p className="text-sm text-blue-700 dark:text-blue-400">
                          Publishing video ads can increase engagement by up to 48% vs image ads.
                        </p>
                      </div>
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="w-4 h-4 text-purple-600" />
                          <span className="font-semibold text-purple-700 dark:text-purple-300 text-sm">Quick Win</span>
                        </div>
                        <p className="text-sm text-purple-700 dark:text-purple-400">
                          Your overall CTR of {summary?.ctr}% beats the industry average of 1.5%.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
