"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Building2,
  Calendar,
  Globe,
  Target,
  Users,
  Briefcase,
  Image as ImageIcon,
  Video,
  Sparkles,
  CheckCircle2,
  X,
} from "lucide-react";

export interface AdPreviewData {
  id: number;
  content: string;
  imageUrl: string | null;
  generatedAt: string;
  isVideo: boolean;

  businessProfile: {
    id: number;
    businessName: string;
    niche: string;
    productService: string;
    targetAudience: string;
    adGoal: string;
  };

  publishedPosts: {
    id: number;
    platform: string;
    status: string;
    publishedAt: string | null;
  }[];
}

interface Props {
  open: boolean;
  onOpenChange: ( open: boolean ) => void;
  ad: AdPreviewData | null;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function AdPreview( {
  open,
  onOpenChange,
  ad,
}: Props ) {

  if ( !ad ) return null;

  const image =
    ad.imageUrl &&
    ( ad.imageUrl.startsWith( "http" )
      ? ad.imageUrl
      : `${BACKEND_URL}${ad.imageUrl}` );

  if ( !open ) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4">
      <div className="relative w-full max-w-7xl h-[95dvh] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl sm:h-[92vh]">
        <button
          type="button"
          onClick={() => onOpenChange( false )}
          className="absolute right-4 top-4 z-30 rounded-full border border-border bg-background/95 p-2 text-foreground shadow-lg transition hover:bg-background"
          aria-label="Close preview"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid h-full grid-rows-[auto_minmax(0,1fr)] lg:grid-cols-[65%_35%] lg:grid-rows-none">

          {/* LEFT PANEL */}

          <div className="flex min-h-[220px] max-h-[44vh] items-center justify-center overflow-hidden border-b bg-slate-100 p-3 sm:min-h-[260px] sm:max-h-[50vh] sm:p-6 lg:max-h-none lg:min-h-0 lg:border-b-0 lg:border-r lg:p-10 dark:bg-slate-950">

            {image ? (

              <img
                src={image}
                alt="Generated Ad"
                className="max-h-[36vh] w-full max-w-full object-contain rounded-2xl border bg-white shadow-2xl sm:max-h-[42vh] lg:max-h-full"
              />

            ) : (

              <div className="flex flex-col items-center gap-4">

                {ad.isVideo ? (
                  <Video className="h-20 w-20 text-muted-foreground" />
                ) : (
                  <ImageIcon className="h-20 w-20 text-muted-foreground" />
                )}

                <p className="text-muted-foreground">
                  No preview available
                </p>

              </div>

            )}

          </div>

          {/* RIGHT PANEL */}

          <div className="min-h-0 overflow-y-auto bg-background">

            {/* Header */}

            <div className="sticky top-0 z-20 border-b bg-background p-4 sm:p-6">

              <div className="flex justify-between items-start">

                <div>

                  <div className="flex items-center gap-2">

                    <Sparkles className="w-5 h-5 text-indigo-600" />

                    <h2 className="text-2xl font-bold">
                      Ad Preview
                    </h2>

                  </div>

                  <p className="text-sm text-muted-foreground mt-1">
                    AI Generated Advertisement
                  </p>

                </div>

                <Badge
                  className="rounded-full px-4 py-1"
                >
                  {ad.isVideo ? "Video Ad" : "Image Ad"}
                </Badge>

              </div>

            </div>

            <div className="space-y-4 p-4 sm:p-6 sm:space-y-6">
              {/* Business Overview */}

              <Card className="p-5 rounded-xl shadow-sm">

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <h3 className="text-xl font-bold">
                      {ad.businessProfile.businessName}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {ad.businessProfile.niche}
                    </p>

                  </div>

                  <Building2 className="w-10 h-10 text-indigo-600" />

                </div>

              </Card>

              {/* Ad Copy */}

              <Card className="p-5 rounded-xl shadow-sm">

                <div className="flex items-center gap-2 mb-4">

                  <Sparkles className="w-5 h-5 text-indigo-600" />

                  <h3 className="font-semibold text-lg">
                    AI Generated Ad Copy
                  </h3>

                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-5 leading-8 whitespace-pre-wrap text-[15px] border">
                  {ad.content}
                </div>

              </Card>

              {/* Campaign Details */}

              <Card className="p-5 rounded-xl shadow-sm">

                <h3 className="font-semibold text-lg mb-5">
                  Campaign Details
                </h3>

                <div className="space-y-5">

                  <div className="flex items-start gap-4">

                    <Briefcase className="w-5 h-5 text-indigo-600 mt-1" />

                    <div>

                      <p className="text-sm text-muted-foreground">
                        Product / Service
                      </p>

                      <p className="font-medium">
                        {ad.businessProfile.productService}
                      </p>

                    </div>

                  </div>

                  <div className="flex items-start gap-4">

                    <Users className="w-5 h-5 text-indigo-600 mt-1" />

                    <div>

                      <p className="text-sm text-muted-foreground">
                        Target Audience
                      </p>

                      <p className="font-medium">
                        {ad.businessProfile.targetAudience}
                      </p>

                    </div>

                  </div>

                  <div className="flex items-start gap-4">

                    <Target className="w-5 h-5 text-indigo-600 mt-1" />

                    <div>

                      <p className="text-sm text-muted-foreground">
                        Campaign Goal
                      </p>

                      <p className="font-medium capitalize">
                        {ad.businessProfile.adGoal}
                      </p>

                    </div>

                  </div>

                  <div className="flex items-start gap-4">

                    <Calendar className="w-5 h-5 text-indigo-600 mt-1" />

                    <div>

                      <p className="text-sm text-muted-foreground">
                        Generated On
                      </p>

                      <p className="font-medium">
                        {new Date( ad.generatedAt ).toLocaleString()}
                      </p>

                    </div>

                  </div>

                </div>

              </Card>

              {/* Summary Cards */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <Card className="p-4 text-center">

                  <p className="text-3xl font-bold text-indigo-600">
                    #{ad.id}
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    Ad ID
                  </p>

                </Card>

                <Card className="p-4 text-center">

                  <p className="text-3xl font-bold text-green-600">
                    {ad.publishedPosts.length}
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    Published
                  </p>

                </Card>

                <Card className="p-4 text-center">

                  <p className="text-lg font-bold text-purple-600">
                    {ad.isVideo ? "VIDEO" : "IMAGE"}
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    Type
                  </p>

                </Card>

              </div>
              {/* Published Platforms */}

              <Card className="p-5 rounded-xl shadow-sm">

                <div className="flex items-center gap-2 mb-4">

                  <Globe className="w-5 h-5 text-green-600" />

                  <h3 className="font-semibold text-lg">
                    Published Platforms
                  </h3>

                </div>

                {ad.publishedPosts.length === 0 ? (

                  <div className="border border-dashed rounded-xl p-8 text-center bg-slate-50 dark:bg-slate-900">

                    <Globe className="mx-auto h-12 w-12 text-muted-foreground mb-3" />

                    <h4 className="font-semibold text-lg">
                      Not Published Yet
                    </h4>

                    <p className="text-sm text-muted-foreground mt-2">
                      This advertisement hasn't been published to any social media platform.
                    </p>

                  </div>

                ) : (

                  <div className="space-y-3">

                    {ad.publishedPosts.map( ( post ) => (

                      <div
                        key={post.id}
                        className="flex items-center justify-between rounded-xl border p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                      >

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">

                            <Globe className="w-5 h-5 text-green-600" />

                          </div>

                          <div>

                            <p className="font-semibold capitalize">
                              {post.platform}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {post.publishedAt
                                ? new Date( post.publishedAt ).toLocaleString()
                                : "Not Scheduled"}
                            </p>

                          </div>

                        </div>

                        <Badge
                          className={
                            post.status === "PUBLISHED"
                              ? "bg-green-600"
                              : post.status === "FAILED"
                                ? "bg-red-600"
                                : "bg-yellow-500"
                          }
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />

                          {post.status}

                        </Badge>

                      </div>

                    ) )}

                  </div>

                )}

              </Card>

              {/* Footer */}

              <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="text-sm text-muted-foreground">

                  Advertisement ID

                  <span className="font-semibold ml-2 text-foreground">
                    #{ad.id}
                  </span>

                </div>

                <Badge
                  variant="secondary"
                  className="rounded-full px-4 py-1"
                >
                  AI Generated
                </Badge>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>

  );

}