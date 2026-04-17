"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Plus, Search, Eye, Edit, Trash2, Download, Share2,
  TrendingUp, Target, Sparkles, DollarSign, Loader2,
  Building2, BarChart3, Video, Globe
} from "lucide-react"
import { BusinessProfileForm } from "./business-profile-form"
import { getBusinessProfiles } from "@/app/api/businessProfile"
import Link from "next/link"
import { toast } from "react-toastify"

interface BusinessProfile {
  id: number
  businessName: string
  niche: string
  productService: string
  targetAudience: string
  adGoal: string
  createdAt: string
  ads?: any[]
}

export function UserDashboard() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateProfile, setShowCreateProfile] = useState(false)
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("profiles")

  const loadProfiles = async () => {
    setIsLoading(true)
    try {
      const data = await getBusinessProfiles()
      setBusinessProfiles(data?.businessProfiles ?? data?.profiles ?? [])
    } catch (err) {
      console.error("Failed to load profiles:", err)
      setBusinessProfiles([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProfiles()
  }, [])

  // After profile is created via BusinessProfileForm, redirect to generate-ads
  const handleProfileSubmit = async (profile: any) => {
    setShowCreateProfile(false)
    const id = profile?.id
    if (id != null) {
      toast.success(`Profile "${profile.businessName}" created! Redirecting to generate ads...`)
      router.push(`/generate-ads?profileId=${id}`)
    } else {
      // Profile created but no id — just refresh the list
      await loadProfiles()
      setActiveTab("profiles")
    }
  }

  const filteredProfiles = businessProfiles.filter((p) =>
    p.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.niche?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Aggregate stats from real data
  const totalAds = businessProfiles.reduce((sum, p) => sum + (p.ads?.length ?? 0), 0)

  // Show the full-screen BusinessProfileForm (same as landing page Get Started flow)
  if (showCreateProfile) {
    return (
      <BusinessProfileForm
        onSubmitData={handleProfileSubmit}
        onBack={() => setShowCreateProfile(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => setShowCreateProfile(true)}
          className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
            <Building2 className="w-5 h-5 text-indigo-600" />
          </div>
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">New Business Profile</span>
        </button>

        <Link href="/generate-ads" className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all group">
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Generate Image Ads</span>
        </Link>

        <Link href="/generate-ads" className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-pink-300 hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-all group">
          <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center group-hover:bg-pink-200 transition-colors">
            <Video className="w-5 h-5 text-pink-600" />
          </div>
          <span className="text-sm font-medium text-pink-700 dark:text-pink-300">Generate Video Ads</span>
        </Link>

        <Link href="/analytics" className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-green-300 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/30 transition-all group">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center group-hover:bg-green-200 transition-colors">
            <BarChart3 className="w-5 h-5 text-green-600" />
          </div>
          <span className="text-sm font-medium text-green-700 dark:text-green-300">View Analytics</span>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business Profiles</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessProfiles.length}</div>
            <p className="text-xs text-muted-foreground">Total created</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ads</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAds}</div>
            <p className="text-xs text-muted-foreground">Generated so far</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Social Posts</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Link href="/social" className="hover:text-indigo-600 transition-colors">View →</Link>
            </div>
            <p className="text-xs text-muted-foreground">Published & scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analytics</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Link href="/analytics" className="hover:text-indigo-600 transition-colors">View →</Link>
            </div>
            <p className="text-xs text-muted-foreground">Impressions & CTR</p>
          </CardContent>
        </Card>
      </div>

      {/* Business Profiles */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Your Business Profiles</h2>
            <p className="text-sm text-gray-500">Select a profile to generate ads for it</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search profiles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-48"
              />
            </div>
            <Button
              onClick={() => setShowCreateProfile(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Profile
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="ml-3 text-gray-500">Loading your profiles...</span>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto">
                <Building2 className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">No business profiles yet</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Create your first profile to start generating AI-powered ads
                </p>
              </div>
              <Button
                onClick={() => setShowCreateProfile(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Profile
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProfiles.map((profile) => (
              <Card key={profile.id} className="group hover:shadow-lg transition-all hover:border-indigo-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base font-bold group-hover:text-indigo-700 transition-colors">
                        {profile.businessName}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-1 text-xs capitalize">{profile.niche}</Badge>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-indigo-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div>
                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Product/Service</Label>
                    <p className="text-sm mt-0.5 line-clamp-2">{profile.productService}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-500 uppercase tracking-wide">Audience</Label>
                      <p className="text-xs mt-0.5 line-clamp-1">{profile.targetAudience}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase tracking-wide">Goal</Label>
                      <p className="text-xs mt-0.5 line-clamp-1 capitalize">{profile.adGoal.replace(/-/g, " ")}</p>
                    </div>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                      onClick={() => router.push(`/generate-ads?profileId=${profile.id}`)}
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Generate Ads
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() => router.push(`/generate-ads?profileId=${profile.id}`)}
                    >
                      <Video className="w-3 h-3 mr-1" />
                      Video Ads
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add New Profile Card */}
            <button
              onClick={() => setShowCreateProfile(true)}
              className="min-h-[200px] rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all flex flex-col items-center justify-center gap-3 group"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                <Plus className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-500 group-hover:text-indigo-700 transition-colors text-sm">Add New Profile</p>
                <p className="text-xs text-gray-400 mt-0.5">Create a new business profile</p>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Cards */}
      <div className="grid md:grid-cols-3 gap-4 pt-2">
        <Link href="/social">
          <Card className="hover:shadow-md hover:border-green-300 transition-all cursor-pointer group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Social Media</h3>
                <p className="text-xs text-gray-500">View published & scheduled posts</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/analytics">
          <Card className="hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Analytics</h3>
                <p className="text-xs text-gray-500">Track ad performance & CTR</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/generate-ads">
          <Card className="hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Ad Generator</h3>
                <p className="text-xs text-gray-500">Create image & video ads with AI</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
