"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Building2, Target, Package, Users, Fullscreen as Bullseye } from "lucide-react"
import { createBusinessProfile } from "@/app/api/businessProfile"
export interface BusinessProfile {
  businessName: string
  niche: string
  productService: string
  targetAudience: string
  adGoal: string
}

interface BusinessProfileFormProps {
  onBack: () => void
}

export function BusinessProfileCard({ onBack }: BusinessProfileFormProps) {
  const [formData, setFormData] = useState<BusinessProfile>({
    businessName: "",
    niche: "",
    productService: "",
    targetAudience: "",
    adGoal: "",
  })
  const [loading, setLoading] = useState( false )
  
  
  const handleInputChange = (field: keyof BusinessProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isFormValid = Object.values(formData).every((value) => value.trim() !== "")
  const handleSubmit = async( e: React.FormEvent ) => {
    e.preventDefault()
    if ( !isFormValid ) return;
    try {
      setLoading( true )
      const result = await createBusinessProfile( formData )
      console.log( "✅ Business profile created:", result )
    }
    catch ( error ) {
      console.error( "❌ Error creating business profile:", error )
    }
  finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <Button variant="ghost" onClick={onBack} className="mb-6 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gray-900">Create Your Business Profile</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Tell us about your business to generate targeted ads that convert
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Name */}
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-sm font-medium flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Business Name
                </Label>
                <Input
                  id="businessName"
                  placeholder="Enter your business name"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange("businessName", e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Niche */}
              <div className="space-y-2">
                <Label htmlFor="niche" className="text-sm font-medium flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-600" />
                  Business Niche
                </Label>
                <Select value={formData.niche} onValueChange={(value) => handleInputChange("niche", value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select your business niche" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="saas">SaaS/Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="fitness">Fitness & Wellness</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="realestate">Real Estate</SelectItem>
                    <SelectItem value="food">Food & Beverage</SelectItem>
                    <SelectItem value="fashion">Fashion & Beauty</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Product/Service */}
              <div className="space-y-2">
                <Label htmlFor="productService" className="text-sm font-medium flex items-center gap-2">
                  <Package className="w-4 h-4 text-purple-600" />
                  Product/Service Description
                </Label>
                <Textarea
                  id="productService"
                  placeholder="Describe what you offer (e.g., 'Online fitness coaching platform with personalized workout plans')"
                  value={formData.productService}
                  onChange={(e) => handleInputChange("productService", e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>

              {/* Target Audience */}
              <div className="space-y-2">
                <Label htmlFor="targetAudience" className="text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-600" />
                  Target Audience
                </Label>
                <Textarea
                  id="targetAudience"
                  placeholder="Describe your ideal customers (e.g., 'Busy professionals aged 25-40 who want to stay fit but lack time for gym')"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>

              {/* Ad Goal */}
              <div className="space-y-2">
                <Label htmlFor="adGoal" className="text-sm font-medium flex items-center gap-2">
                  <Bullseye className="w-4 h-4 text-orange-600" />
                  Advertising Goal
                </Label>
                <Select value={formData.adGoal} onValueChange={(value) => handleInputChange("adGoal", value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="What's your primary advertising goal?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                    <SelectItem value="lead-generation">Lead Generation</SelectItem>
                    <SelectItem value="sales-conversion">Sales Conversion</SelectItem>
                    <SelectItem value="app-downloads">App Downloads</SelectItem>
                    <SelectItem value="website-traffic">Website Traffic</SelectItem>
                    <SelectItem value="engagement">Social Media Engagement</SelectItem>
                    <SelectItem value="retargeting">Customer Retargeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
                disabled={!isFormValid || loading}
              >
                Continue to Ad Generation
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
