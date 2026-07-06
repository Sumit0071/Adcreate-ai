"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Facebook, Instagram, Linkedin, Twitter, Settings, Calendar,
  Clock, Send, Plus, CheckCircle, RefreshCw, BarChart3, Globe, Loader2, ExternalLink, Link2
} from "lucide-react";
import { getPublishedPosts, getConnectedAccounts, getZernioConnectUrl } from "@/app/api/businessProfile";
import Link from "next/link";
import { toast } from "react-toastify";

interface PublishedPost {
  id: number;
  platform: string;
  content: string;
  status: string;
  scheduledTime?: string;
  publishedAt?: string;
  createdAt: string;
  externalPostId?: string;
  zernioPostId?: string;
  platformPostUrl?: string;
  ad?: { businessProfile?: { businessName: string } };
}

interface ZernioAccount {
  _id: string;
  platform: string;
  username?: string;
  displayName?: string;
  profileUrl?: string;
  isActive: boolean;
}

// Platform config keyed by lowercase platform name (matching Zernio convention)
const PLATFORM_CONFIG: Record<string, { icon: any; label: string; color: string; bg: string }> = {
  facebook: { icon: Facebook, label: "Facebook", color: "text-blue-600", bg: "bg-blue-600" },
  instagram: { icon: Instagram, label: "Instagram", color: "text-pink-600", bg: "bg-gradient-to-r from-purple-500 to-pink-500" },
  linkedin: { icon: Linkedin, label: "LinkedIn", color: "text-blue-700", bg: "bg-blue-700" },
  twitter: { icon: Twitter, label: "Twitter/X", color: "text-sky-500", bg: "bg-black" },
  tiktok: { icon: Globe, label: "TikTok", color: "text-gray-800", bg: "bg-gray-800" },
  youtube: { icon: Globe, label: "YouTube", color: "text-red-600", bg: "bg-red-600" },
  pinterest: { icon: Globe, label: "Pinterest", color: "text-red-500", bg: "bg-red-600" },
  bluesky: { icon: Globe, label: "Bluesky", color: "text-blue-500", bg: "bg-blue-500" },
  threads: { icon: Globe, label: "Threads", color: "text-gray-800", bg: "bg-gray-800" },
};

/** Normalize platform name for PLATFORM_CONFIG lookup (handles UPPERCASE from DB, PascalCase, lowercase) */
function normalizePlatform(platform: string): string {
  return platform.toLowerCase();
}

export default function SocialPage() {
  const [posts, setPosts] = useState<PublishedPost[]>([]);
  const [connectedAccounts, setConnectedAccounts] = useState<ZernioAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const data = await getPublishedPosts();
      if (data?.success) {
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAccounts = async () => {
    setIsLoadingAccounts(true);
    try {
      const data = await getConnectedAccounts();
      if (data?.success) {
        setConnectedAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error("Error loading connected accounts:", error);
      setConnectedAccounts([]);
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  useEffect(() => {
    loadPosts();
    loadAccounts();
  }, []);

  const handleConnectPlatform = async (platform: string) => {
    setConnectingPlatform(platform);
    try {
      // For now, we need a profileId. In a full implementation, the user would select
      // or create a Zernio profile first. Here we use a placeholder prompt.
      const profileId = prompt("Enter your Zernio Profile ID (from /social/profiles):");
      if (!profileId) {
        setConnectingPlatform(null);
        return;
      }

      const data = await getZernioConnectUrl(platform, profileId, window.location.href);
      if (data?.success && data.authUrl) {
        window.open(data.authUrl, "_blank");
        toast.info(`Redirecting to ${platform} for authorization...`);
      } else {
        toast.error("Failed to get connect URL");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to connect");
    } finally {
      setConnectingPlatform(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">✓ Published</Badge>;
      case "SCHEDULED":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">⏰ Scheduled</Badge>;
      case "FAILED":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">✗ Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Check if a platform has a connected Zernio account
  const isConnected = (platform: string): boolean => {
    return connectedAccounts.some(
      (acc) => acc.platform.toLowerCase() === platform.toLowerCase() && acc.isActive
    );
  };

  // Get account info for a platform
  const getAccountInfo = (platform: string): ZernioAccount | undefined => {
    return connectedAccounts.find(
      (acc) => acc.platform.toLowerCase() === platform.toLowerCase() && acc.isActive
    );
  };

  const publishedPosts = posts.filter((p) => p.status === "PUBLISHED");
  const scheduledPosts = posts.filter((p) => p.status === "SCHEDULED");

  // Get unique platforms from connected accounts + core platforms
  const allPlatforms = ["facebook", "instagram", "linkedin", "twitter"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="w-6 h-6 text-green-600" />
              Social Media Publishing
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your ad posts across all platforms via Zernio
              {connectedAccounts.length > 0 && (
                <span className="ml-2 text-green-600 font-medium">
                  • {connectedAccounts.length} account{connectedAccounts.length !== 1 ? "s" : ""} connected
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => { loadPosts(); loadAccounts(); }}>
              <RefreshCw className="w-4 h-4 mr-2" />Refresh
            </Button>
            <Link href="/generate-ads">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Send className="w-4 h-4 mr-2" />Generate & Publish Ads
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        {/* Platform Connection Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />Connected Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingAccounts ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600 mr-2" />
                <span className="text-sm text-gray-500">Loading connected accounts...</span>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {allPlatforms.map((platform) => {
                  const config = PLATFORM_CONFIG[platform];
                  if (!config) return null;
                  const connected = isConnected(platform);
                  const account = getAccountInfo(platform);
                  const postCount = posts.filter(
                    (p) => normalizePlatform(p.platform) === platform
                  ).length;

                  return (
                    <div key={platform} className="flex items-center justify-between p-4 border rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${config.bg} text-white`}>
                          <config.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{config.label}</p>
                          <p className="text-xs text-gray-500">
                            {connected
                              ? account?.username || account?.displayName || `${postCount} posts`
                              : "Not connected"
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {connected ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleConnectPlatform(platform)}
                            disabled={connectingPlatform === platform}
                          >
                            {connectingPlatform === platform ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <><Link2 className="w-3 h-3 mr-1" />Connect</>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Campaign Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Posts", value: posts.length, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Published", value: publishedPosts.length, color: "text-green-600", bg: "bg-green-50" },
            { label: "Scheduled", value: scheduledPosts.length, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Platforms", value: new Set(posts.map(p => normalizePlatform(p.platform))).size, color: "text-purple-600", bg: "bg-purple-50" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} rounded-xl p-4 border`}>
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-sm text-gray-600 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Posts Tabs */}
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Posts ({posts.length})</TabsTrigger>
            <TabsTrigger value="published">Published ({publishedPosts.length})</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled ({scheduledPosts.length})</TabsTrigger>
          </TabsList>

          {["all", "published", "scheduled"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                </div>
              ) : (
                <div className="space-y-3">
                  {(tab === "all" ? posts : tab === "published" ? publishedPosts : scheduledPosts).length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center space-y-3">
                        <Globe className="w-12 h-12 text-gray-300 mx-auto" />
                        <p className="text-gray-500 font-medium">No {tab !== "all" ? tab : ""} posts yet</p>
                        <p className="text-gray-400 text-sm">Generate ads and publish them to see your posts here.</p>
                        <Link href="/generate-ads">
                          <Button size="sm" className="mt-2">Generate Ads</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ) : (
                    (tab === "all" ? posts : tab === "published" ? publishedPosts : scheduledPosts).map((post) => {
                      const normalizedPlatform = normalizePlatform(post.platform);
                      const platformCfg = PLATFORM_CONFIG[normalizedPlatform];
                      return (
                        <Card key={post.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                              <div className={`p-2.5 rounded-xl ${platformCfg?.bg || "bg-gray-500"} text-white flex-shrink-0`}>
                                {platformCfg ? <platformCfg.icon className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className="font-semibold">{platformCfg?.label || post.platform}</span>
                                  {getStatusBadge(post.status)}
                                  {post.ad?.businessProfile?.businessName && (
                                    <Badge variant="outline" className="text-xs">{post.ad.businessProfile.businessName}</Badge>
                                  )}
                                  {post.externalPostId && (
                                    <Badge variant="outline" className="text-xs font-mono">
                                      Zernio: {post.externalPostId.slice(0, 8)}...
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                  {post.content}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {post.status === "SCHEDULED" && post.scheduledTime
                                      ? `Scheduled: ${new Date(post.scheduledTime).toLocaleString()}`
                                      : `Posted: ${new Date(post.createdAt).toLocaleString()}`}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
                                <Link href="/analytics">
                                  <Button size="sm" variant="outline">
                                    <BarChart3 className="w-4 h-4 mr-1" />Analytics
                                  </Button>
                                </Link>
                                {post.platformPostUrl && (
                                  <a href={post.platformPostUrl} target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" variant="outline">
                                      <ExternalLink className="w-4 h-4" />
                                    </Button>
                                  </a>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
