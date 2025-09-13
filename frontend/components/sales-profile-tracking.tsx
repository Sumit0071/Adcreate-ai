"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, DollarSign, Target, Eye, ShoppingCart, BarChart3, Download, RefreshCw } from "lucide-react"

interface SalesMetrics {
  totalRevenue: number
  totalConversions: number
  conversionRate: number
  averageOrderValue: number
  returnOnAdSpend: number
  costPerAcquisition: number
  lifetimeValue: number
  revenueGrowth: number
}

interface AdPerformance {
  adId: string
  adTitle: string
  businessName: string
  impressions: number
  clicks: number
  conversions: number
  revenue: number
  spend: number
  roi: number
  ctr: number
  conversionRate: number
  platform: string
  dateRange: string
}

interface SalesFunnel {
  stage: string
  visitors: number
  conversionRate: number
  dropOffRate: number
}

export function SalesProfileTracking() {
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedMetric, setSelectedMetric] = useState("revenue")

  // Mock sales data
  const salesMetrics: SalesMetrics = {
    totalRevenue: 45250.0,
    totalConversions: 342,
    conversionRate: 3.2,
    averageOrderValue: 132.31,
    returnOnAdSpend: 4.2,
    costPerAcquisition: 28.5,
    lifetimeValue: 485.0,
    revenueGrowth: 18.5,
  }

  const adPerformance: AdPerformance[] = [
    {
      adId: "1",
      adTitle: "Transform Your Business Today",
      businessName: "Tech Startup Inc",
      impressions: 12500,
      clicks: 350,
      conversions: 45,
      revenue: 5940.0,
      spend: 1250.0,
      roi: 375.2,
      ctr: 2.8,
      conversionRate: 12.9,
      platform: "Facebook",
      dateRange: "Last 30 days",
    },
    {
      adId: "2",
      adTitle: "Sustainable Fashion Revolution",
      businessName: "Green Fashion Co",
      impressions: 8200,
      clicks: 164,
      conversions: 22,
      revenue: 2860.0,
      spend: 820.0,
      roi: 248.8,
      ctr: 2.0,
      conversionRate: 13.4,
      platform: "Instagram",
      dateRange: "Last 30 days",
    },
    {
      adId: "3",
      adTitle: "Project Management Made Simple",
      businessName: "SaaS Platform",
      impressions: 15600,
      clicks: 468,
      conversions: 78,
      revenue: 9360.0,
      spend: 1560.0,
      roi: 500.0,
      ctr: 3.0,
      conversionRate: 16.7,
      platform: "LinkedIn",
      dateRange: "Last 30 days",
    },
  ]

  const salesFunnel: SalesFunnel[] = [
    { stage: "Ad Impressions", visitors: 36300, conversionRate: 100, dropOffRate: 0 },
    { stage: "Ad Clicks", visitors: 982, conversionRate: 2.7, dropOffRate: 97.3 },
    { stage: "Landing Page Views", visitors: 856, conversionRate: 87.2, dropOffRate: 12.8 },
    { stage: "Product Interest", visitors: 423, conversionRate: 49.4, dropOffRate: 50.6 },
    { stage: "Add to Cart", visitors: 198, conversionRate: 46.8, dropOffRate: 53.2 },
    { stage: "Purchase", visitors: 145, conversionRate: 73.2, dropOffRate: 26.8 },
  ]

  const topPerformingAds = adPerformance.sort((a, b) => b.roi - a.roi).slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sales Analytics</h2>
          <p className="text-gray-600">Track revenue, conversions, and ad performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${salesMetrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />+{salesMetrics.revenueGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesMetrics.totalConversions}</div>
            <p className="text-xs text-muted-foreground">{salesMetrics.conversionRate}% conversion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROAS</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesMetrics.returnOnAdSpend}x</div>
            <p className="text-xs text-muted-foreground">Return on ad spend</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${salesMetrics.averageOrderValue}</div>
            <p className="text-xs text-muted-foreground">Per customer purchase</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Ad Performance</TabsTrigger>
          <TabsTrigger value="funnel">Sales Funnel</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Ad Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ad Performance Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adPerformance.map((ad) => (
                  <div key={ad.adId} className="border rounded-lg p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{ad.adTitle}</h3>
                          <Badge variant="outline">{ad.platform}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{ad.businessName}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Revenue:</span>
                            <div className="font-medium text-green-600">${ad.revenue.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">ROI:</span>
                            <div className="font-medium">{ad.roi}%</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Conversions:</span>
                            <div className="font-medium">{ad.conversions}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">CTR:</span>
                            <div className="font-medium">{ad.ctr}%</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Conv Rate:</span>
                            <div className="font-medium">{ad.conversionRate}%</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Spend:</span>
                            <div className="font-medium">${ad.spend}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={ad.roi > 300 ? "default" : ad.roi > 200 ? "secondary" : "outline"}>
                          {ad.roi > 300 ? "High Performer" : ad.roi > 200 ? "Good" : "Needs Optimization"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sales Funnel Tab */}
        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Funnel Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {salesFunnel.map((stage, index) => (
                  <div key={stage.stage} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <h3 className="font-medium">{stage.stage}</h3>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{stage.visitors.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{stage.conversionRate}%</div>
                      </div>
                    </div>

                    <div className="ml-11">
                      <Progress value={stage.conversionRate} className="h-2 mb-2" />
                      {stage.dropOffRate > 0 && (
                        <p className="text-xs text-red-600">{stage.dropOffRate}% drop-off rate</p>
                      )}
                    </div>

                    {index < salesFunnel.length - 1 && (
                      <div className="ml-15 mt-2 mb-2">
                        <div className="w-px h-4 bg-gray-300 ml-4"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Ads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformingAds.map((ad, index) => (
                    <div key={ad.adId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{ad.adTitle}</h4>
                        <p className="text-xs text-gray-600">{ad.platform}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">{ad.roi}% ROI</div>
                        <div className="text-xs text-gray-500">${ad.revenue}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800">Strong Performance</span>
                    </div>
                    <p className="text-sm text-green-700">
                      LinkedIn ads are showing 67% higher conversion rates than other platforms
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Optimization Opportunity</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Cart abandonment rate is 26.8% - consider retargeting campaigns
                    </p>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Revenue Growth</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Monthly revenue increased by 18.5% with improved ad targeting
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">${salesMetrics.costPerAcquisition}</div>
                  <div className="text-sm text-gray-600">Cost Per Acquisition</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">${salesMetrics.lifetimeValue}</div>
                  <div className="text-sm text-gray-600">Customer Lifetime Value</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {(salesMetrics.lifetimeValue / salesMetrics.costPerAcquisition).toFixed(1)}x
                  </div>
                  <div className="text-sm text-gray-600">LTV:CAC Ratio</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
