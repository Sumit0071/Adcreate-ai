"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Upload, Sparkles, Download, Copy, RefreshCw, ImageIcon,
  Share2, ArrowLeft, Loader2, Video, Play, Check, Globe,
  Facebook, Instagram, Linkedin, Twitter, X, Calendar
} from "lucide-react";
import {
  generateAdsForProfile,
  getBusinessProfileById,
  generateVideoAdForProfile,
  getAvatarOptions,
  publishAdToSocial,
} from "@/app/api/businessProfile";
import { parseAdContent } from "@/lib/parseAdContent";
import { useThemeStore } from "@/store/useThemeStore";
import { toast } from "react-toastify";
import {
  Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem,
  SidebarMenuButton, SidebarProvider, SidebarInset, SidebarTrigger, SidebarFooter
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BusinessProfile {
  id: number;
  businessName: string;
  niche: string;
  productService: string;
  targetAudience: string;
  adGoal: string;
}

interface AdSequence {
  id: number;
  title: string;
  headline: string;
  description: string;
  cta: string;
  imageUrl: string;
  style: string;
  ctr?: string;
  content?: string;
}

interface AvatarOption {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  style: string;
}

interface VideoAd {
  id: number;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  avatarId: string;
  content: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "";
const PLATFORMS = [
  { id: "Facebook", label: "Facebook", icon: Facebook, color: "bg-blue-600" },
  { id: "Instagram", label: "Instagram", icon: Instagram, color: "bg-gradient-to-r from-purple-500 to-pink-500" },
  { id: "LinkedIn", label: "LinkedIn", icon: Linkedin, color: "bg-blue-700" },
  { id: "Twitter", label: "Twitter/X", icon: Twitter, color: "bg-black" },
];

function normalizeResponse(res: any): any[] {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (res.ads && Array.isArray(res.ads)) return res.ads;
  return [res];
}

function GenerateAdsPage() {
  const searchParams = useSearchParams();
  const profileIdParam = searchParams.get("profileId");
  const { theme } = useThemeStore();
  const { user, isLoggedIn, loading, fetchUser, logout } = useAuthStore();
  const isDark = theme === "dark";

  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [contextImage, setContextImage] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState("1:1");

  // Image Ads
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAds, setGeneratedAds] = useState<AdSequence[]>([]);
  const [activeTab, setActiveTab] = useState<"image" | "video">("image");

  // Video Ads
  const [avatars, setAvatars] = useState<AvatarOption[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<VideoAd[]>([]);
  const [selectedAdForVideo, setSelectedAdForVideo] = useState<AdSequence | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Publish Modal
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishingAd, setPublishingAd] = useState<AdSequence | null>(null);
  const [publishingVideo, setPublishingVideo] = useState<VideoAd | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduleTime, setScheduleTime] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const loadProfile = useCallback(async () => {
    const id = profileIdParam ? parseInt(profileIdParam, 10) : NaN;
    if (!id || isNaN(id)) { setLoadingProfile(false); return; }
    try {
      const data = await getBusinessProfileById(id);
      setProfile((data?.businessProfile ?? data) as BusinessProfile);
    } catch {
      setProfile(null);
    } finally {
      setLoadingProfile(false);
    }
  }, [profileIdParam]);

  useEffect(() => { loadProfile(); }, [loadProfile]);
  useEffect(() => { fetchUser(); }, [fetchUser]);

  useEffect(() => {
    getAvatarOptions()
      .then((data) => {
        setAvatars(data?.avatars || []);
        if (data?.avatars?.length > 0) setSelectedAvatar(data.avatars[0].id);
      })
      .catch(() => {
        // Fallback avatars
        const fallback: AvatarOption[] = [
          { id: "amber", name: "Amber", description: "Professional female presenter", thumbnail: "", style: "professional" },
          { id: "jade", name: "Jade", description: "Friendly female narrator", thumbnail: "", style: "friendly" },
          { id: "alex", name: "Alex", description: "Dynamic male presenter", thumbnail: "", style: "dynamic" },
          { id: "marcus", name: "Marcus", description: "Corporate male spokesman", thumbnail: "", style: "corporate" },
        ];
        setAvatars(fallback);
        setSelectedAvatar("amber");
      });
  }, []);

  const generateAds = async () => {
    if (!profile) return;
    setIsGenerating(true);
    try {
      const payload: Record<string, string> = {
        businessName: profile.businessName,
        niche: profile.niche,
        productService: profile.productService,
        targetAudience: profile.targetAudience,
        adGoal: profile.adGoal,
      };
      if (specialInstructions.trim()) payload.specialInstructions = specialInstructions.trim();

      let response: any;
      if (contextImage) {
        const formData = new FormData();
        Object.entries(payload).forEach(([k, v]) => formData.append(k, v));
        formData.append("file", contextImage);
        response = await generateAdsForProfile(profile.id, formData);
      } else {
        response = await generateAdsForProfile(profile.id, payload);
      }

      const adsArray = normalizeResponse(response);
      const parsed: AdSequence[] = adsArray.map((ad: any, idx: number) => {
        const { headline, body, cta } = parseAdContent(ad.content);
        return {
          id: ad.id,
          title: `Ad Creative ${idx + 1}`,
          headline,
          description: body,
          cta,
          imageUrl: ad.imageUrl || "/placeholder.svg",
          style: "AI Generated",
          ctr: ad.ctr,
          content: ad.content,
        };
      });
      setGeneratedAds(parsed);
      toast.success(`Generated ${parsed.length} ad creatives!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate ads. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateVideoAd = async () => {
    if (!profile || !selectedAvatar) return;
    setIsGeneratingVideo(true);
    try {
      const adCopyText = selectedAdForVideo?.content || undefined;
      const response = await generateVideoAdForProfile(profile.id, selectedAvatar, adCopyText);
      const videoData = response?.videoAd;
      if (videoData) {
        setGeneratedVideos((prev) => [...prev, {
          id: videoData.id,
          videoUrl: videoData.videoUrl,
          thumbnailUrl: videoData.thumbnailUrl,
          duration: videoData.duration,
          avatarId: videoData.avatarId,
          content: videoData.content || "Video Ad",
        }]);
        toast.success("Video ad generated successfully!");
        setShowVideoModal(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate video ad.");
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handlePublish = async () => {
    if (selectedPlatforms.length === 0) {
      toast.error("Select at least one platform");
      return;
    }
    setIsPublishing(true);
    try {
      const adId = publishingAd?.id || publishingVideo?.id;
      if (!adId) throw new Error("No ad selected");
      const content = publishingAd?.content || publishingVideo?.content;
      await publishAdToSocial(adId, selectedPlatforms, content, scheduleTime || undefined);
      toast.success(`Published to ${selectedPlatforms.join(", ")}!`);
      setShowPublishModal(false);
      setSelectedPlatforms([]);
      setScheduleTime("");
    } catch (err) {
      toast.error("Failed to publish. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const openPublishModal = (ad?: AdSequence, video?: VideoAd) => {
    setPublishingAd(ad || null);
    setPublishingVideo(video || null);
    setShowPublishModal(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const fullUrl = imageUrl.startsWith("http") ? imageUrl : `${BACKEND_URL}${imageUrl}`;
      const response = await fetch(fullUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.png`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Downloaded!");
    } catch {
      toast.error("Failed to download image.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setContextImage(file);
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((p) => p !== platformId) : [...prev, platformId]
    );
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p>No business profile selected.</p>
        <Link href="/dashboard"><Button>Go to Dashboard</Button></Link>
      </div>
    );
  }

  if (!loading && !isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg">You must be logged in to generate ads.</p>
        <Link href="/"><Button>Go Home</Button></Link>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <SidebarHeader className="p-4 font-semibold text-lg border-b">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            AdCreate AI
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="p-2 space-y-1">
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent">
                  🏠 Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/generate-ads" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-medium">
                  ✨ Generate Ads
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/social" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent">
                  🌐 Social Media
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/analytics" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent">
                  📊 Analytics
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t">
          {user && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="flex flex-col text-sm">
                  <span className="font-medium">{user.username || "User"}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate w-28">{user.email}</span>
                </div>
              </div>
              <button onClick={async () => { await logout(); window.location.href = "/"; }}
                className="text-xs text-red-500 hover:text-red-600">
                Logout
              </button>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <div className={`min-h-screen ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
          <div className="p-4 border-b flex items-center gap-3">
            <SidebarTrigger />
            <span className="text-sm text-gray-500">
              Generating for: <span className="font-semibold text-indigo-600">{profile.businessName}</span>
            </span>
          </div>

          <div className="container max-w-6xl mx-auto px-4 py-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 mb-6 text-sm font-medium text-indigo-600 hover:text-indigo-800">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>

            {/* Profile Summary Card */}
            <Card className={`mb-8 border-indigo-200 ${isDark ? "bg-indigo-950/40 border-indigo-800" : "bg-indigo-50/60"}`}>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><span className="text-gray-500 block">Business</span><span className="font-semibold">{profile.businessName}</span></div>
                  <div><span className="text-gray-500 block">Niche</span><span className="font-semibold">{profile.niche}</span></div>
                  <div><span className="text-gray-500 block">Target</span><span className="font-semibold">{profile.targetAudience}</span></div>
                  <div><span className="text-gray-500 block">Goal</span><span className="font-semibold">{profile.adGoal}</span></div>
                </div>
              </CardContent>
            </Card>

            {/* Main Tabs: Image Ads vs Video Ads */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="mb-6 grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="image" className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Image Ads
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Video Ads
                </TabsTrigger>
              </TabsList>

              {/* ── IMAGE ADS TAB ── */}
              <TabsContent value="image" className="space-y-6">
                {/* Config Panel */}
                <Card className={isDark ? "bg-gray-800 border-gray-700" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-500" />
                      Configure & Generate Image Ads
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Special Instructions (Optional)</Label>
                      <Textarea
                        placeholder="E.g. Use a festive tone, emphasize discount, target mobile users..."
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <ImageIcon className="w-4 h-4" /> Upload Context Image (Optional)
                      </Label>
                      <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                        ${isDark ? "border-gray-600 hover:border-indigo-500" : "border-gray-300 hover:border-indigo-400"}`}>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                        <label htmlFor="image-upload" className="cursor-pointer block">
                          <Upload className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                          {contextImage ? (
                            <p className="text-sm font-medium text-indigo-500">{contextImage.name}</p>
                          ) : (
                            <p className="text-sm text-gray-500">Click to upload or drag an image for ad inspiration</p>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Choose Ad Aspect Ratio</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { ratio: "1:1", label: "Instagram", w: "w-16", h: "h-16" },
                          { ratio: "4:5", label: "Instagram Feed", w: "w-14", h: "h-20" },
                          { ratio: "16:9", label: "YouTube / Display", w: "w-20", h: "h-12" },
                        ].map(({ ratio, label, w, h }) => (
                          <button key={ratio} onClick={() => setAspectRatio(ratio)}
                            className={`border rounded-lg p-3 flex flex-col items-center transition text-sm
                            ${aspectRatio === ratio ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30" : "border-gray-300 dark:border-gray-600"}`}>
                            <div className={`${w} ${h} bg-gray-300 dark:bg-gray-600 rounded mb-2`} />
                            <span className="font-medium">{ratio}</span>
                            <span className="text-xs text-gray-500">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={generateAds}
                      disabled={isGenerating}
                      className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                    >
                      {isGenerating ? (
                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Generating ads (this may take 1-2 min)...</>
                      ) : (
                        <><Sparkles className="w-5 h-5 mr-2" />Generate 3 Image Ad Creatives</>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Generated Image Ads */}
                {generatedAds.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      Generated Ad Creatives ({generatedAds.length})
                    </h2>
                    {generatedAds.map((ad, idx) => (
                      <Card key={ad.id} className={`overflow-hidden ${isDark ? "bg-gray-800 border-gray-700" : ""}`}>
                        <div className={`px-6 pt-6 pb-2 border-b ${isDark ? "border-gray-700" : "border-gray-100"}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-bold">{ad.title}</h3>
                              <Badge variant="secondary" className="mt-1 text-xs">{ad.style}</Badge>
                              {ad.ctr && <Badge variant="outline" className="mt-1 ml-2 text-xs">CTR: {ad.ctr}</Badge>}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline"
                                onClick={() => copyToClipboard(`${ad.headline}\n\n${ad.description}\n\n${ad.cta}`)}>
                                <Copy className="w-4 h-4 mr-1" />Copy
                              </Button>
                              <Button size="sm" variant="outline"
                                onClick={() => downloadImage(ad.imageUrl, `${profile.businessName}-ad-${idx + 1}`)}>
                                <Download className="w-4 h-4 mr-1" />Download
                              </Button>
                              <Button size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => openPublishModal(ad)}>
                                <Share2 className="w-4 h-4 mr-1" />Publish
                              </Button>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="grid lg:grid-cols-2 gap-6">
                            {/* Image Preview */}
                            <div className="space-y-3">
                              <div className="relative rounded-xl overflow-hidden border shadow-sm bg-white">
                                <img
                                  src={ad.imageUrl.startsWith("http") ? ad.imageUrl : `${BACKEND_URL}${ad.imageUrl}`}
                                  alt={ad.headline}
                                  className="w-full object-cover"
                                  style={{ aspectRatio: aspectRatio.replace(":", "/") }}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/1200x628/6366f1/fff?text=${encodeURIComponent(ad.headline)}`;
                                  }}
                                />
                                <div className="absolute top-2 left-2">
                                  <Badge className="bg-black/70 text-white text-xs">{aspectRatio}</Badge>
                                </div>
                              </div>
                              <Button size="sm" variant="outline" className="w-full"
                                onClick={() => { setSelectedAdForVideo(ad); setShowVideoModal(true); }}>
                                <Video className="w-4 h-4 mr-2" />Create Video Version
                              </Button>
                            </div>

                            {/* Copy Details */}
                            <div className="space-y-4">
                              <div>
                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Headline</Label>
                                <div className={`mt-1 p-3 rounded-lg border text-sm font-semibold ${isDark ? "bg-gray-700 border-gray-600" : "bg-gray-50"}`}>
                                  {ad.headline}
                                </div>
                              </div>
                              <div>
                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Body Copy</Label>
                                <div className={`mt-1 p-3 rounded-lg border text-sm ${isDark ? "bg-gray-700 border-gray-600" : "bg-gray-50"}`}>
                                  {ad.description}
                                </div>
                              </div>
                              <div>
                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Call to Action</Label>
                                <div className={`mt-1 p-3 rounded-lg border text-sm font-semibold text-indigo-600 ${isDark ? "bg-gray-700 border-gray-600" : "bg-indigo-50 border-indigo-200"}`}>
                                  {ad.cta}
                                </div>
                              </div>
                              {ad.ctr && (
                                <div className={`p-3 rounded-lg border ${isDark ? "bg-green-900/30 border-green-700" : "bg-green-50 border-green-200"}`}>
                                  <h4 className="font-medium text-green-700 dark:text-green-300 text-sm mb-2">Predicted Performance</h4>
                                  <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div><span className="text-green-600 dark:text-green-400">CTR:</span> <span className="font-semibold">{ad.ctr}</span></div>
                                    <div><span className="text-green-600 dark:text-green-400">Engagement:</span> <span className="font-semibold">High</span></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button onClick={generateAds} disabled={isGenerating} variant="outline" className="w-full">
                      <RefreshCw className="w-4 h-4 mr-2" />Regenerate New Variations
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* ── VIDEO ADS TAB ── */}
              <TabsContent value="video" className="space-y-6">
                <Card className={isDark ? "bg-gray-800 border-gray-700" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="w-5 h-5 text-purple-500" />
                      Generate Video Ads with AI Avatars
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-sm text-gray-500">
                      Choose an AI avatar to present your ad with realistic talking-head video generation.
                    </p>

                    {/* Avatar Selection */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Select Avatar</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {avatars.map((avatar) => (
                          <button key={avatar.id} onClick={() => setSelectedAvatar(avatar.id)}
                            className={`border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all
                            ${selectedAvatar === avatar.id
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                                : "border-gray-200 dark:border-gray-700 hover:border-purple-300"}`}>
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                              {avatar.thumbnail ? (
                                <img src={avatar.thumbnail} alt={avatar.name} className="w-full h-full object-cover"
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                              ) : (
                                avatar.name.charAt(0)
                              )}
                            </div>
                            <div className="text-center">
                              <p className="font-semibold text-sm">{avatar.name}</p>
                              <p className="text-xs text-gray-500">{avatar.style}</p>
                            </div>
                            {selectedAvatar === avatar.id && (
                              <Check className="w-4 h-4 text-purple-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Use custom ad copy or auto-generate */}
                    {generatedAds.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          Use Ad Copy From (Optional)
                        </Label>
                        <div className="space-y-2">
                          <button
                            onClick={() => setSelectedAdForVideo(null)}
                            className={`w-full text-left p-3 border rounded-lg text-sm
                            ${!selectedAdForVideo ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30" : "border-gray-200 dark:border-gray-700"}`}>
                            🤖 Auto-generate script for {profile.businessName}
                          </button>
                          {generatedAds.map((ad) => (
                            <button key={ad.id}
                              onClick={() => setSelectedAdForVideo(ad)}
                              className={`w-full text-left p-3 border rounded-lg text-sm
                              ${selectedAdForVideo?.id === ad.id ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30" : "border-gray-200 dark:border-gray-700"}`}>
                              <span className="font-medium">{ad.title}:</span> {ad.headline}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={generateVideoAd}
                      disabled={isGeneratingVideo || !selectedAvatar}
                      className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      {isGeneratingVideo ? (
                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Generating video (2-3 min)...</>
                      ) : (
                        <><Video className="w-5 h-5 mr-2" />Generate Video Ad</>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Generated Videos */}
                {generatedVideos.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      Generated Video Ads ({generatedVideos.length})
                    </h2>
                    {generatedVideos.map((video, idx) => (
                      <Card key={video.id} className={isDark ? "bg-gray-800 border-gray-700" : ""}>
                        <CardContent className="p-6">
                          <div className="grid lg:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <div className="rounded-xl overflow-hidden bg-black aspect-video">
                                <video
                                  src={video.videoUrl}
                                  poster={video.thumbnailUrl}
                                  controls
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="flex-1" asChild>
                                  <a href={video.videoUrl} download={`video-ad-${idx + 1}.mp4`}>
                                    <Download className="w-4 h-4 mr-1" />Download
                                  </a>
                                </Button>
                                <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => openPublishModal(undefined, video)}>
                                  <Share2 className="w-4 h-4 mr-1" />Publish
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <Label className="text-xs font-semibold text-gray-500 uppercase">Avatar</Label>
                                <p className="text-sm font-medium mt-1 capitalize">{video.avatarId}</p>
                              </div>
                              <div>
                                <Label className="text-xs font-semibold text-gray-500 uppercase">Script</Label>
                                <div className={`mt-1 p-3 rounded-lg border text-sm ${isDark ? "bg-gray-700 border-gray-600" : "bg-gray-50"}`}>
                                  {video.content.replace("[VIDEO] ", "").substring(0, 200)}...
                                </div>
                              </div>
                              {video.duration && (
                                <Badge variant="outline">Duration: ~{video.duration}s</Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>

      {/* Publish Modal */}
      <Dialog open={showPublishModal} onOpenChange={setShowPublishModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-600" />
              Publish to Social Media
            </DialogTitle>
            <DialogDescription>
              Choose the platforms you want to publish this ad to.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Platforms</Label>
              <div className="grid grid-cols-2 gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all
                    ${selectedPlatforms.includes(p.id)
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                        : "border-gray-200 dark:border-gray-700"}`}
                  >
                    <div className={`p-1.5 rounded-lg ${p.color} text-white`}>
                      <p.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{p.label}</span>
                    {selectedPlatforms.includes(p.id) && <Check className="w-4 h-4 text-indigo-500 ml-auto" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4" />Schedule (Optional)
              </Label>
              <Input type="datetime-local" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
              <p className="text-xs text-gray-500 mt-1">Leave empty to publish immediately</p>
            </div>

            {publishingAd && (
              <div className={`p-3 rounded-lg text-sm ${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
                <span className="font-medium">{publishingAd.title}:</span> {publishingAd.headline}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowPublishModal(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={handlePublish}
                disabled={isPublishing || selectedPlatforms.length === 0}
              >
                {isPublishing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
                {scheduleTime ? "Schedule Post" : "Publish Now"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Generation Modal (from image ads tab) */}
      <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-600" />
              Create Video Version
            </DialogTitle>
            <DialogDescription>
              Turn this image ad into a video with an AI avatar presenter.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {selectedAdForVideo && (
              <div className={`p-3 rounded-lg text-sm ${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
                Using: <span className="font-medium">{selectedAdForVideo.headline}</span>
              </div>
            )}
            <div>
              <Label className="text-sm font-medium mb-2 block">Select Avatar</Label>
              <div className="grid grid-cols-4 gap-2">
                {avatars.map((avatar) => (
                  <button key={avatar.id} onClick={() => setSelectedAvatar(avatar.id)}
                    className={`border-2 rounded-lg p-2 flex flex-col items-center gap-1 transition-all
                    ${selectedAvatar === avatar.id ? "border-purple-500" : "border-gray-200 dark:border-gray-700"}`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                      {avatar.name.charAt(0)}
                    </div>
                    <span className="text-xs font-medium">{avatar.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowVideoModal(false)}>Cancel</Button>
              <Button
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                onClick={async () => { setActiveTab("video"); setShowVideoModal(false); await generateVideoAd(); }}
                disabled={isGeneratingVideo}
              >
                {isGeneratingVideo ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                Generate Video
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}

export default function GenerateAdsPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>}>
      <GenerateAdsPage />
    </Suspense>
  );
}