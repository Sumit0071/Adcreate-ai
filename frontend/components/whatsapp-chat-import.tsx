"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Upload, MessageSquare, Sparkles, ArrowRight, FileText, Zap } from "lucide-react"

interface BusinessProfile {
  businessName: string
  niche: string
  productService: string
  targetAudience: string
  adGoal: string
}

interface WhatsAppChatImportProps {
  onProfileGenerated: (profile: BusinessProfile) => void
  onBack: () => void
}

export function WhatsAppChatImport({ onProfileGenerated, onBack }: WhatsAppChatImportProps) {
  const [chatText, setChatText] = useState("")
  const [chatFile, setChatFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<BusinessProfile | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setChatFile(file)
      // Mock reading file content
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setChatText(content.slice(0, 2000)) // Limit for demo
      }
      reader.readAsText(file)
    }
  }

  const analyzeChat = async () => {
    if (!chatText.trim()) return

    setIsAnalyzing(true)

    // Mock AI analysis delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock analysis result based on chat content
    const mockProfile: BusinessProfile = {
      businessName: extractBusinessName(chatText),
      niche: extractNiche(chatText),
      productService: extractProductService(chatText),
      targetAudience: extractTargetAudience(chatText),
      adGoal: extractAdGoal(chatText),
    }

    setAnalysisResult(mockProfile)
    setIsAnalyzing(false)
  }

  // Mock extraction functions (in real app, these would use AI)
  const extractBusinessName = (text: string): string => {
    // Simple pattern matching for demo
    if (text.toLowerCase().includes("restaurant") || text.toLowerCase().includes("food")) {
      return "Bella's Italian Restaurant"
    }
    if (text.toLowerCase().includes("fitness") || text.toLowerCase().includes("gym")) {
      return "FitLife Gym"
    }
    if (text.toLowerCase().includes("shop") || text.toLowerCase().includes("store")) {
      return "TechGear Store"
    }
    return "Your Business"
  }

  const extractNiche = (text: string): string => {
    if (text.toLowerCase().includes("restaurant") || text.toLowerCase().includes("food")) {
      return "Food & Dining"
    }
    if (text.toLowerCase().includes("fitness") || text.toLowerCase().includes("gym")) {
      return "Health & Fitness"
    }
    if (text.toLowerCase().includes("tech") || text.toLowerCase().includes("gadget")) {
      return "Technology"
    }
    return "General Business"
  }

  const extractProductService = (text: string): string => {
    if (text.toLowerCase().includes("restaurant")) {
      return "Authentic Italian cuisine with fresh ingredients and traditional recipes"
    }
    if (text.toLowerCase().includes("fitness")) {
      return "Personal training and fitness programs for all skill levels"
    }
    if (text.toLowerCase().includes("tech")) {
      return "Latest technology gadgets and electronics"
    }
    return "Quality products and services"
  }

  const extractTargetAudience = (text: string): string => {
    if (text.toLowerCase().includes("family") || text.toLowerCase().includes("kids")) {
      return "Families with children looking for quality dining experiences"
    }
    if (text.toLowerCase().includes("young") || text.toLowerCase().includes("student")) {
      return "Young professionals and students aged 18-35"
    }
    if (text.toLowerCase().includes("business") || text.toLowerCase().includes("professional")) {
      return "Business professionals and entrepreneurs"
    }
    return "General consumers interested in quality products"
  }

  const extractAdGoal = (text: string): string => {
    if (text.toLowerCase().includes("more customers") || text.toLowerCase().includes("busy")) {
      return "Increase foot traffic and customer visits"
    }
    if (text.toLowerCase().includes("sales") || text.toLowerCase().includes("revenue")) {
      return "Boost sales and revenue"
    }
    if (text.toLowerCase().includes("awareness") || text.toLowerCase().includes("know")) {
      return "Build brand awareness and recognition"
    }
    return "Generate leads and conversions"
  }

  const handleUseProfile = () => {
    if (analysisResult) {
      onProfileGenerated(analysisResult)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            ← Back to Home
          </Button>
          <div className="text-center">
            <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">
              <MessageSquare className="w-4 h-4 mr-1" />
              WhatsApp Chat Analysis
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Import Your WhatsApp Chats</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload your WhatsApp business conversations and let AI analyze them to create targeted ad campaigns
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Chat Import Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-green-600" />
                Import Chat Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Upload WhatsApp Chat Export</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept=".txt,.zip"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="chat-upload"
                  />
                  <label htmlFor="chat-upload" className="cursor-pointer">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {chatFile ? chatFile.name : "Upload WhatsApp chat export (.txt or .zip)"}
                    </p>
                  </label>
                </div>
              </div>

              <div className="text-center text-gray-500">or</div>

              {/* Manual Text Input */}
              <div className="space-y-2">
                <Label htmlFor="chat-text" className="text-sm font-medium">
                  Paste Chat Content
                </Label>
                <Textarea
                  id="chat-text"
                  placeholder="Paste your WhatsApp business conversations here...

Example:
[10/15/2024, 2:30 PM] Customer: Hi, do you have tables available for tonight?
[10/15/2024, 2:31 PM] Restaurant: Yes! We have availability. How many people?
[10/15/2024, 2:32 PM] Customer: Party of 4, around 7 PM
[10/15/2024, 2:33 PM] Restaurant: Perfect! I'll reserve a table for you..."
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
              </div>

              <Button
                onClick={analyzeChat}
                disabled={!chatText.trim() || isAnalyzing}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                {isAnalyzing ? (
                  <>
                    <Zap className="w-5 h-5 mr-2 animate-pulse" />
                    Analyzing Conversations...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyze Chat & Generate Profile
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                AI Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!analysisResult && !isAnalyzing && (
                <div className="text-center py-12 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Upload or paste your WhatsApp chats to see AI analysis results</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Analyzing your conversations...</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Extracting business insights, customer preferences, and communication patterns
                  </p>
                </div>
              )}

              {analysisResult && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">Business Profile Generated</h3>
                    <p className="text-sm text-green-700">
                      AI has analyzed your conversations and extracted key business information
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Business Name</Label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                        <p className="font-medium">{analysisResult.businessName}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Niche</Label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                        <p>{analysisResult.niche}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Product/Service</Label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                        <p className="text-sm">{analysisResult.productService}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Target Audience</Label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                        <p className="text-sm">{analysisResult.targetAudience}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Ad Goal</Label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                        <p className="text-sm">{analysisResult.adGoal}</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleUseProfile}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    Generate Ads from This Profile
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-center">How WhatsApp Analysis Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  1
                </div>
                <h3 className="font-semibold mb-2">Upload Chats</h3>
                <p className="text-sm text-gray-600">
                  Import your WhatsApp business conversations or paste chat content
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  2
                </div>
                <h3 className="font-semibold mb-2">AI Analysis</h3>
                <p className="text-sm text-gray-600">
                  AI extracts business insights, customer needs, and communication patterns
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  3
                </div>
                <h3 className="font-semibold mb-2">Generate Ads</h3>
                <p className="text-sm text-gray-600">
                  Create targeted ad campaigns based on real customer conversations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
