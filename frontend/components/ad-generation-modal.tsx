"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Sparkles, Download, Copy, RefreshCw, ImageIcon, Share2, Eye } from "lucide-react"

interface BusinessProfile {
  businessName: string
  niche: string
  productService: string
  targetAudience: string
  adGoal: string
}

interface AdSequence {
  id: number
  title: string
  headline: string
  description: string
  cta: string
  imageUrl: string
  style: string
}

interface AdGenerationModalProps {
  businessProfile: BusinessProfile
  onClose: () => void
}

export function AdGenerationModal({ businessProfile, onClose }: AdGenerationModalProps) {
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [contextImage, setContextImage] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAds, setGeneratedAds] = useState<AdSequence[]>([])
  const [showResults, setShowResults] = useState(false)
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")
  const [showSocialShare, setShowSocialShare] = useState(false)

  const generateAds = async () => {
    setIsGenerating(true)

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mockAds: AdSequence[] = [
      {
        id: 1,
        title: "Conversion-Focused Ad",
        headline: `Transform Your ${businessProfile.niche} Business Today`,
        description: `Join thousands who've discovered ${businessProfile.productService}. Perfect for ${businessProfile.targetAudience.split(" ").slice(0, 5).join(" ")}...`,
        cta: "Get Started Now",
        imageUrl: `/placeholder.svg?height=400&width=600&query=${businessProfile.niche} business success`,
        style: "Direct & Action-Oriented",
      },
      {
        id: 2,
        title: "Emotional Connection Ad",
        headline: `Finally, A Solution That Understands You`,
        description: `We know how challenging it can be for ${businessProfile.targetAudience.split(" ").slice(0, 8).join(" ")}. That's why we created ${businessProfile.productService}.`,
        cta: "Learn More",
        imageUrl: `/placeholder.svg?height=400&width=600&query=${businessProfile.niche} customer satisfaction`,
        style: "Empathetic & Relatable",
      },
      {
        id: 3,
        title: "Social Proof Ad",
        headline: `Why 10,000+ Customers Choose ${businessProfile.businessName}`,
        description: `"${businessProfile.productService} changed everything for my business. The results speak for themselves." - Verified Customer`,
        cta: "See Success Stories",
        imageUrl: `/placeholder.svg?height=400&width=600&query=${businessProfile.niche} testimonials success`,
        style: "Trust & Authority",
      },
    ]

    setGeneratedAds(mockAds)
    setIsGenerating(false)
    setShowResults(true)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setContextImage(file)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleSocialShare = (ad: AdSequence, platform: string) => {
    console.log(`Sharing ad ${ad.id} to ${platform}`)
    alert(`Ad scheduled for ${platform}!`)
  }

  if (showResults) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-screen max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              Your Generated Ad Campaigns
            </DialogTitle>
            <div className="flex items-center gap-2 mt-2">
              <Button
                variant={previewMode === "desktop" ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewMode("desktop")}
              >
                Desktop
              </Button>
              <Button
                variant={previewMode === "mobile" ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewMode("mobile")}
              >
                Mobile
              </Button>
            </div>
          </DialogHeader>

          <Tabs defaultValue="0" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {generatedAds.map((ad, index) => (
                <TabsTrigger key={ad.id} value={index.toString()}>
                  {ad.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {generatedAds.map((ad, index) => (
              <TabsContent key={ad.id} value={index.toString()}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{ad.title}</CardTitle>
                        <Badge variant="secondary" className="mt-2">
                          {ad.style}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(`${ad.headline}\n\n${ad.description}\n\n${ad.cta}`)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Text
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setShowSocialShare(!showSocialShare)}>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div
                          className={`border rounded-lg p-4 bg-white shadow-sm transition-all ${
                            previewMode === "mobile" ? "max-w-sm mx-auto" : "w-full"
                          }`}
                        >
                          <div className="relative">
                            <img
                              src={ad.imageUrl || "/placeholder.svg"}
                              alt="Generated ad image"
                              className="w-full h-48 object-cover rounded-md mb-4"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-black/70 text-white">
                                <Eye className="w-3 h-3 mr-1" />
                                {previewMode}
                              </Badge>
                            </div>
                          </div>
                          <h3 className="font-bold text-lg mb-2 text-balance">{ad.headline}</h3>
                          <p className="text-gray-600 mb-4 text-pretty">{ad.description}</p>
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">{ad.cta}</Button>
                        </div>

                        {showSocialShare && (
                          <Card className="bg-gray-50">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm">Share to Social Media</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSocialShare(ad, "Facebook")}
                                  className="bg-blue-600 text-white hover:bg-blue-700"
                                >
                                  Facebook
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSocialShare(ad, "Instagram")}
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                                >
                                  Instagram
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSocialShare(ad, "LinkedIn")}
                                  className="bg-blue-700 text-white hover:bg-blue-800"
                                >
                                  LinkedIn
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSocialShare(ad, "Twitter")}
                                  className="bg-black text-white hover:bg-gray-800"
                                >
                                  Twitter
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Headline</Label>
                          <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                            <p className="font-medium text-balance">{ad.headline}</p>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">Description</Label>
                          <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                            <p className="text-pretty">{ad.description}</p>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700">Call to Action</Label>
                          <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                            <p className="font-medium">{ad.cta}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <Button variant="outline" className="bg-transparent">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline" className="bg-transparent">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Regenerate
                          </Button>
                        </div>

                        <Card className="bg-green-50 border-green-200">
                          <CardContent className="pt-4">
                            <h4 className="font-medium text-green-800 mb-2">Predicted Performance</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-green-600">CTR:</span>
                                <span className="font-medium ml-1">2.8%</span>
                              </div>
                              <div>
                                <span className="text-green-600">Engagement:</span>
                                <span className="font-medium ml-1">High</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setShowResults(false)}>
              Generate New Ads
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">Save to Dashboard</Button>
              <Button onClick={onClose}>Done</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            Customize Your Ad Generation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Business Profile Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Business:</span> {businessProfile.businessName}
                </div>
                <div>
                  <span className="font-medium">Niche:</span> {businessProfile.niche}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Goal:</span> {businessProfile.adGoal}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="instructions" className="text-sm font-medium">
              Special Instructions (Optional)
            </Label>
            <Textarea
              id="instructions"
              placeholder="Any specific requirements, tone, or messaging you'd like to include in your ads..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Context Image (Optional)
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {contextImage ? contextImage.name : "Upload an image to provide visual context for your ads"}
                </p>
              </label>
            </div>
          </div>

          <Button
            onClick={generateAds}
            disabled={isGenerating}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Generating Your Ads...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate 3 Ad Sequences
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
