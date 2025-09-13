"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Download,
  Share2,
  TrendingUp,
  Target,
  Sparkles,
  DollarSign,
} from "lucide-react"
import { SalesProfileTracking } from "./sales-profile-tracking"

interface GeneratedAd {
  id: string
  title: string
  headline: string
  description: string
  imageUrl: string
  businessProfile: string
  createdAt: string
  status: "active" | "paused" | "draft"
  performance: {
    impressions: number
    clicks: number
    ctr: number
    conversions: number
  }
  platforms: string[]
}

interface BusinessProfile {
  id: string
  businessName: string
  niche: string
  productService: string
  targetAudience: string
  adGoal: string
  createdAt: string
  totalAds: number
}

export function UserDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showCreateProfile, setShowCreateProfile] = useState(false)

  // Mock data
  const [generatedAds] = useState<GeneratedAd[]>([
    {
      id: "1",
      title: "Conversion-Focused Ad",
      headline: "Transform Your Business Today",
      description: "Join thousands who've discovered our solution...",
      imageUrl: "/business-success.png",
      businessProfile: "Tech Startup",
      createdAt: "2024-01-15",
      status: "active",
      performance: {
        impressions: 12500,
        clicks: 350,
        ctr: 2.8,
        conversions: 45,
      },
      platforms: ["Facebook", "Instagram"],
    },
    {
      id: "2",
      title: "Emotional Connection Ad",
      headline: "Finally, A Solution That Understands You",
      description: "We know how challenging it can be...",
      imageUrl: "/customer-satisfaction.png",
      businessProfile: "E-commerce Store",
      createdAt: "2024-01-14",
      status: "paused",
      performance: {
        impressions: 8200,
        clicks: 164,
        ctr: 2.0,
        conversions: 22,
      },
      platforms: ["LinkedIn", "Twitter"],
    },
    {
      id: "3",
      title: "Social Proof Ad",
      headline: "Why 10,000+ Customers Choose Us",
      description: "Customer testimonials and success stories...",
      imageUrl: "/testimonials-success.jpg",
      businessProfile: "SaaS Platform",
      createdAt: "2024-01-13",
      status: "draft",
      performance: {
        impressions: 0,
        clicks: 0,
        ctr: 0,
        conversions: 0,
      },
      platforms: [],
    },
  ])

  const [businessProfiles] = useState<BusinessProfile[]>([
    {
      id: "1",
      businessName: "Tech Startup",
      niche: "Technology",
      productService: "AI-powered analytics platform",
      targetAudience: "Small to medium businesses",
      adGoal: "Increase sign-ups",
      createdAt: "2024-01-10",
      totalAds: 5,
    },
    {
      id: "2",
      businessName: "E-commerce Store",
      niche: "Retail",
      productService: "Sustainable fashion products",
      targetAudience: "Environmentally conscious consumers",
      adGoal: "Drive sales",
      createdAt: "2024-01-08",
      totalAds: 3,
    },
    {
      id: "3",
      businessName: "SaaS Platform",
      niche: "Software",
      productService: "Project management tool",
      targetAudience: "Remote teams and freelancers",
      adGoal: "Increase trial conversions",
      createdAt: "2024-01-05",
      totalAds: 7,
    },
  ])

  const filteredAds = generatedAds.filter((ad) => {
    const matchesSearch =
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.businessProfile.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || ad.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const totalImpressions = generatedAds.reduce((sum, ad) => sum + ad.performance.impressions, 0)
  const totalClicks = generatedAds.reduce((sum, ad) => sum + ad.performance.clicks, 0)
  const totalConversions = generatedAds.reduce((sum, ad) => sum + ad.performance.conversions, 0)
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ads</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{generatedAds.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCTR.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">+0.3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions}</div>
            <p className="text-xs text-muted-foreground">+8 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="ads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ads">Generated Ads</TabsTrigger>
          <TabsTrigger value="profiles">Business Profiles</TabsTrigger>
          <TabsTrigger value="analytics">Sales Analytics</TabsTrigger>
        </TabsList>

        {/* Generated Ads Tab */}
        <TabsContent value="ads" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search ads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New Ad
            </Button>
          </div>

          <div className="grid gap-6">
            {filteredAds.map((ad) => (
              <Card key={ad.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={ad.imageUrl || "/placeholder.svg"}
                        alt={ad.title}
                        className="w-full lg:w-48 h-32 object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{ad.title}</h3>
                          <p className="text-sm text-gray-600">{ad.businessProfile}</p>
                        </div>
                        <Badge
                          variant={
                            ad.status === "active" ? "default" : ad.status === "paused" ? "secondary" : "outline"
                          }
                        >
                          {ad.status}
                        </Badge>
                      </div>

                      <p className="text-gray-700 line-clamp-2">{ad.headline}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Impressions:</span>
                          <div className="font-medium">{ad.performance.impressions.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Clicks:</span>
                          <div className="font-medium">{ad.performance.clicks}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">CTR:</span>
                          <div className="font-medium">{ad.performance.ctr}%</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Conversions:</span>
                          <div className="font-medium">{ad.performance.conversions}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {ad.platforms.map((platform) => (
                            <Badge key={platform} variant="outline" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Business Profiles Tab */}
        <TabsContent value="profiles" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Business Profiles</h2>
            <Dialog open={showCreateProfile} onOpenChange={setShowCreateProfile}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Business Profile</DialogTitle>
                </DialogHeader>
                <CreateProfileForm onClose={() => setShowCreateProfile(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessProfiles.map((profile) => (
              <Card key={profile.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{profile.businessName}</CardTitle>
                  <Badge variant="secondary">{profile.niche}</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm text-gray-600">Product/Service</Label>
                    <p className="text-sm">{profile.productService}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Target Audience</Label>
                    <p className="text-sm">{profile.targetAudience}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Ad Goal</Label>
                    <p className="text-sm">{profile.adGoal}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-gray-500">{profile.totalAds} ads created</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <SalesProfileTracking />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CreateProfileForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    businessName: "",
    niche: "",
    productService: "",
    targetAudience: "",
    adGoal: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Creating profile:", formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="businessName">Business Name</Label>
        <Input
          id="businessName"
          value={formData.businessName}
          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
          placeholder="Enter your business name"
        />
      </div>

      <div>
        <Label htmlFor="niche">Niche</Label>
        <Input
          id="niche"
          value={formData.niche}
          onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
          placeholder="e.g., Technology, Healthcare, E-commerce"
        />
      </div>

      <div>
        <Label htmlFor="productService">Product/Service</Label>
        <Input
          id="productService"
          value={formData.productService}
          onChange={(e) => setFormData({ ...formData, productService: e.target.value })}
          placeholder="Describe your main product or service"
        />
      </div>

      <div>
        <Label htmlFor="targetAudience">Target Audience</Label>
        <Input
          id="targetAudience"
          value={formData.targetAudience}
          onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
          placeholder="Who is your ideal customer?"
        />
      </div>

      <div>
        <Label htmlFor="adGoal">Advertising Goal</Label>
        <Input
          id="adGoal"
          value={formData.adGoal}
          onChange={(e) => setFormData({ ...formData, adGoal: e.target.value })}
          placeholder="e.g., Increase sales, Generate leads, Build awareness"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          Create Profile
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
