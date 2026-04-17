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
  Clock, Send, Plus, CheckCircle, RefreshCw, BarChart3, Globe, Loader2, ExternalLink
} from "lucide-react";
import { getPublishedPosts } from "@/app/api/businessProfile";
import Link from "next/link";

interface PublishedPost {
  id: number;
  platform: string;
  content: string;
  status: string;
  scheduledTime?: string;
  publishedAt?: string;
  createdAt: string;
  ad?: { businessProfile?: { businessName: string } };
}

const PLATFORM_CONFIG: Record<string, { icon: any; color: string; bg: string }> = {
  Facebook: { icon: Facebook, color: "text-blue-600", bg: "bg-blue-600" },
  Instagram: { icon: Instagram, color: "text-pink-600", bg: "bg-gradient-to-r from-purple-500 to-pink-500" },
  LinkedIn: { icon: Linkedin, color: "text-blue-700", bg: "bg-blue-700" },
  Twitter: { icon: Twitter, color: "text-sky-500", bg: "bg-black" },
};

export default function SocialPage() {
  const [posts, setPosts] = useState<PublishedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [manualPost, setManualPost] = useState({ platform: "Facebook", content: "", scheduledTime: "" });
  const [autoPost, setAutoPost] = useState<Record<string, boolean>>({
    Facebook: true, Instagram: true, LinkedIn: false, Twitter: false
  });

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const data = await getPublishedPosts();
      if (data?.success) {
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
      // Fallback demo data
      setPosts([
        {
          id: 1, platform: "Facebook",
          content: "Transform Your Business Today - Join thousands who've discovered our AI-powered solution...",
          status: "PUBLISHED",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          ad: { businessProfile: { businessName: "My Business" } }
        },
        {
          id: 2, platform: "Instagram",
          content: "Finally, A Solution That Understands You - We know how challenging it can be...",
          status: "SCHEDULED",
          scheduledTime: new Date(Date.now() + 3600000 * 3).toISOString(),
          createdAt: new Date().toISOString(),
          ad: { businessProfile: { businessName: "My Business" } }
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadPosts(); }, []);

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

  const publishedPosts = posts.filter((p) => p.status === "PUBLISHED");
  const scheduledPosts = posts.filter((p) => p.status === "SCHEDULED");

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
            <p className="text-gray-500 text-sm mt-1">Manage your ad posts across all platforms</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={loadPosts}>
              <RefreshCw className="w-4 h-4 mr-2" />Refresh
            </Button>
            <Button size="sm" onClick={() => setShowScheduleDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />Schedule Post
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(PLATFORM_CONFIG).map(([platform, config]) => (
                <div key={platform} className="flex items-center justify-between p-4 border rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${config.bg} text-white`}>
                      <config.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{platform}</p>
                      <p className="text-xs text-gray-500">
                        {posts.filter((p) => p.platform === platform).length} posts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">Auto</span>
                      <Switch
                        checked={autoPost[platform]}
                        onCheckedChange={(val) => setAutoPost((prev) => ({ ...prev, [platform]: val }))}
                      />
                    </div>
                    {autoPost[platform]
                      ? <CheckCircle className="w-4 h-4 text-green-500" />
                      : <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                    }
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Campaign Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Posts", value: posts.length, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Published", value: publishedPosts.length, color: "text-green-600", bg: "bg-green-50" },
            { label: "Scheduled", value: scheduledPosts.length, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Platforms", value: new Set(posts.map(p => p.platform)).size, color: "text-purple-600", bg: "bg-purple-50" },
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
                      const platformCfg = PLATFORM_CONFIG[post.platform];
                      return (
                        <Card key={post.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                              <div className={`p-2.5 rounded-xl ${platformCfg?.bg || "bg-gray-500"} text-white flex-shrink-0`}>
                                {platformCfg ? <platformCfg.icon className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className="font-semibold">{post.platform}</span>
                                  {getStatusBadge(post.status)}
                                  {post.ad?.businessProfile?.businessName && (
                                    <Badge variant="outline" className="text-xs">{post.ad.businessProfile.businessName}</Badge>
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
                                {post.status === "SCHEDULED" && (
                                  <Button size="sm" variant="outline">
                                    <Send className="w-4 h-4" />
                                  </Button>
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

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule a Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label className="text-sm font-medium">Platform</Label>
              <select
                value={manualPost.platform}
                onChange={(e) => setManualPost((p) => ({ ...p, platform: e.target.value }))}
                className="w-full mt-1 p-2 border rounded-lg text-sm">
                {Object.keys(PLATFORM_CONFIG).map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-sm font-medium">Post Content</Label>
              <Textarea
                value={manualPost.content}
                onChange={(e) => setManualPost((p) => ({ ...p, content: e.target.value }))}
                placeholder="Write your post content..."
                className="mt-1"
                rows={4}
              />
            </div>
            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />Schedule Time
              </Label>
              <Input
                type="datetime-local"
                value={manualPost.scheduledTime}
                onChange={(e) => setManualPost((p) => ({ ...p, scheduledTime: e.target.value }))}
                className="mt-1"
              />
            </div>
            <p className="text-xs text-gray-500 text-center">
              To publish ad creatives, go to{" "}
              <Link href="/generate-ads" className="text-indigo-600 hover:underline">Generate Ads</Link>{" "}
              and use the Publish button on any generated ad.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowScheduleDialog(false)}>Cancel</Button>
              <Button className="flex-1" onClick={() => {
                setShowScheduleDialog(false);
                alert("Manual scheduling coming soon! Use the Publish button from generated ads.");
              }}>
                Schedule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
