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
  Plus, Search, Sparkles, Loader2,
  Building2, BarChart3, Video, Globe,
  Calendar, ExternalLink, ImageIcon, Clock,
  ChevronRight
} from "lucide-react"
import { BusinessProfileForm } from "./business-profile-form"
import { getBusinessProfiles, getPublishedPosts, getUserAds } from "@/app/api/businessProfile"
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
  _count?: { ads: number }
}

interface AdHistoryItem {
  id: number
  imageUrl: string | null
  isVideo: boolean
  generatedAt: string
  businessProfile: { id: number; businessName: string }
  _count?: { publishedPosts: number }
}

export function UserDashboard() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateProfile, setShowCreateProfile] = useState(false)
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("profiles")
  const [publishedCount, setPublishedCount] = useState(0)
  const [adHistory, setAdHistory] = useState<AdHistoryItem[]>([])
  const [adsLoading, setAdsLoading] = useState(false)
  const [adPage, setAdPage] = useState(1)
  const [adTotalPages, setAdTotalPages] = useState(1)
  const [adsLoaded, setAdsLoaded] = useState(false)

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || ""

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

  const loadPublishedCount = async () => {
    try {
      const data = await getPublishedPosts()
      if (data?.success) {
        setPublishedCount(data.posts?.length || 0)
      }
    } catch {
      setPublishedCount(0)
    }
  }

  const loadAds = async (page: number = 1, append: boolean = false) => {
    setAdsLoading(true)
    try {
      const data = await getUserAds(page, 18)
      if (data?.success) {
        setAdHistory(prev => append ? [...prev, ...(data.ads || [])] : (data.ads || []))
        setAdPage(data.pagination?.page || 1)
        setAdTotalPages(data.pagination?.totalPages || 1)
      }
      setAdsLoaded(true)
    } catch (err) {
      console.error("Failed to load ads:", err)
    } finally {
      setAdsLoading(false)
    }
  }

  useEffect(() => {
    loadProfiles()
    loadPublishedCount()
  }, [])

  // Load ads when the user switches to the Ad History tab
  useEffect(() => {
    if (activeTab === "ads" && !adsLoaded) {
      loadAds(1)
    }
  }, [activeTab])

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

  // Aggregate stats from real data — use _count.ads for accurate total
  const totalAds = businessProfiles.reduce((sum, p) => sum + (p._count?.ads ?? 0), 0)

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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profiles</CardTitle>
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
            <div className="text-2xl font-bold text-indigo-600">{totalAds}</div>
            <p className="text-xs text-muted-foreground">Generated so far</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
            <p className="text-xs text-muted-foreground">Social posts</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs: Profiles & Ad History */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profiles" className="gap-1.5">
            <Building2 className="w-3.5 h-3.5" />Profiles ({businessProfiles.length})
          </TabsTrigger>
          <TabsTrigger value="ads" className="gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />Ad History
          </TabsTrigger>
        </TabsList>

        {/* ── Profiles Tab ────────────────────────────────── */}
        <TabsContent value="profiles" className="space-y-4 pt-2">
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
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs capitalize">{profile.niche}</Badge>
                          <Badge variant="outline" className="text-xs">
                            {profile._count?.ads  || 0} ads
                          </Badge>
                        </div>
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
        </TabsContent>

        {/* ── Ad History Tab ─────────────────────────────── */}
        <TabsContent value="ads" className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Generated Ad History</h2>
              <p className="text-sm text-gray-500">All your AI-generated ads across profiles</p>
            </div>
            <Link href="/generate-ads">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" size="sm">
                <Sparkles className="w-4 h-4 mr-2" />Generate New Ads
              </Button>
            </Link>
          </div>

          {adsLoading && adHistory.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <span className="ml-3 text-gray-500">Loading your ads...</span>
            </div>
          ) : adHistory.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">No ads generated yet</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Create a business profile and generate your first AI-powered ad
                  </p>
                </div>
                <Link href="/generate-ads">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Sparkles className="w-4 h-4 mr-2" />Generate Ads
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {adHistory.map((ad) => {
                  const publishCount = ad._count?.publishedPosts ?? 0
                  const adLabel = ad.isVideo ? "Video Ad" : "Image Ad"
                  return (
                    <Card key={ad.id} className="overflow-hidden hover:shadow-lg transition-all group">
                      {/* Ad Image Thumbnail */}
                      {ad.imageUrl ? (
                        <div className="w-full h-44 bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                          <img
                            src={ad.imageUrl.startsWith("http") ? ad.imageUrl : `${BACKEND_URL}${ad.imageUrl}`}
                            alt={adLabel}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                          />
                          <div className="absolute top-2 left-2 flex gap-1.5">
                            <Badge className={`text-[10px] ${ad.isVideo ? "bg-pink-600" : "bg-purple-600"} text-white border-0`}>
                              {ad.isVideo ? <><Video className="w-2.5 h-2.5 mr-0.5" />Video</> : <><ImageIcon className="w-2.5 h-2.5 mr-0.5" />Image</>}
                            </Badge>
                            {publishCount > 0 && (
                              <Badge className="text-[10px] bg-green-600 text-white border-0">
                                <Globe className="w-2.5 h-2.5 mr-0.5" />{publishCount} published
                              </Badge>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-28 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center relative">
                          {ad.isVideo
                            ? <Video className="w-10 h-10 text-pink-400" />
                            : <ImageIcon className="w-10 h-10 text-indigo-400" />
                          }
                          <div className="absolute top-2 left-2 flex gap-1.5">
                            <Badge className={`text-[10px] ${ad.isVideo ? "bg-pink-600" : "bg-purple-600"} text-white border-0`}>
                              {ad.isVideo ? "Video" : "Image"}
                            </Badge>
                            {publishCount > 0 && (
                              <Badge className="text-[10px] bg-green-600 text-white border-0">
                                <Globe className="w-2.5 h-2.5 mr-0.5" />{publishCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <CardContent className="p-4 space-y-2">
                        <h3 className="font-semibold text-sm">
                          {adLabel} #{ad.id}
                        </h3>

                        {/* Meta row */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] capitalize">
                              {ad.businessProfile?.businessName}
                            </Badge>
                            <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {new Date(ad.generatedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-xs"
                            onClick={() => router.push(`/generate-ads?profileId=${ad.businessProfile?.id}`)}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Load More pagination */}
              {adPage < adTotalPages && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => loadAds(adPage + 1, true)}
                    disabled={adsLoading}
                    className="gap-2"
                  >
                    {adsLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

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
