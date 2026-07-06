"use client";

import { useState } from "react";
import { CampaignBrief } from "@/lib/marketingFrameworks";
import { SAMPLE_CATEGORIES, BusinessCategory } from "@/lib/sampleBusinessCategories";
import { useThemeStore } from "@/store/useThemeStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2, Target, Package, Users, MapPin, Gift, Frown, Star,
  Megaphone, Palette, MousePointerClick, ArrowRight, Sparkles, LayoutTemplate
} from "lucide-react";

interface CampaignBriefFormProps {
  onSubmit: (brief: CampaignBrief) => void;
}

const EMPTY_BRIEF: CampaignBrief = {
  businessName: "", industry: "", productService: "", targetAudience: "",
  location: "", offer: "", painPoint: "", desire: "",
  campaignGoal: "", tone: "", cta: "",
};

export default function CampaignBriefForm({ onSubmit }: CampaignBriefFormProps) {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [brief, setBrief] = useState<CampaignBrief>(EMPTY_BRIEF);
  const [showCategories, setShowCategories] = useState(true);

  const updateField = (field: keyof CampaignBrief, value: string) => {
    setBrief(prev => ({ ...prev, [field]: value }));
  };

  const loadCategory = (cat: BusinessCategory) => {
    setBrief(cat.brief);
    setShowCategories(false);
  };

  const isValid = Object.values(brief).every(v => v.trim() !== "");

  const fields: { key: keyof CampaignBrief; label: string; icon: any; placeholder: string; type: "input" | "textarea" | "select"; options?: { value: string; label: string }[] }[] = [
    { key: "businessName", label: "Business Name", icon: Building2, placeholder: "e.g. ABC Fitness Studio", type: "input" },
    { key: "industry", label: "Industry", icon: Target, placeholder: "Select industry", type: "select", options: [
      { value: "Fitness", label: "Fitness" }, { value: "Food & Beverage", label: "Food & Beverage" },
      { value: "Beauty & Wellness", label: "Beauty & Wellness" }, { value: "Education", label: "Education" },
      { value: "Real Estate", label: "Real Estate" }, { value: "Healthcare", label: "Healthcare" },
      { value: "E-commerce", label: "E-commerce" }, { value: "Technology", label: "Technology" },
      { value: "Finance", label: "Finance" }, { value: "Consulting", label: "Consulting" },
      { value: "Other", label: "Other" },
    ]},
    { key: "productService", label: "Product / Service", icon: Package, placeholder: "e.g. Weight Loss Program", type: "input" },
    { key: "targetAudience", label: "Target Audience", icon: Users, placeholder: "e.g. Women aged 25-45", type: "input" },
    { key: "location", label: "Location", icon: MapPin, placeholder: "e.g. Kolkata", type: "input" },
    { key: "offer", label: "Offer", icon: Gift, placeholder: "e.g. 7-day free trial", type: "input" },
    { key: "painPoint", label: "Pain Point", icon: Frown, placeholder: "e.g. Unable to lose weight", type: "textarea" },
    { key: "desire", label: "Desire / Aspiration", icon: Star, placeholder: "e.g. Look fit and confident", type: "textarea" },
    { key: "campaignGoal", label: "Campaign Goal", icon: Megaphone, placeholder: "Select goal", type: "select", options: [
      { value: "Lead generation", label: "Lead Generation" }, { value: "Brand awareness", label: "Brand Awareness" },
      { value: "Sales conversion", label: "Sales Conversion" }, { value: "Foot traffic", label: "Foot Traffic" },
      { value: "App downloads", label: "App Downloads" }, { value: "Website traffic", label: "Website Traffic" },
      { value: "Appointments", label: "Appointments" }, { value: "Enrollment", label: "Enrollment" },
      { value: "Online sales", label: "Online Sales" },
    ]},
    { key: "tone", label: "Tone", icon: Palette, placeholder: "Select tone", type: "select", options: [
      { value: "Friendly", label: "Friendly" }, { value: "Premium", label: "Premium" },
      { value: "Urgent", label: "Urgent" }, { value: "Warm", label: "Warm" },
      { value: "Motivational", label: "Motivational" }, { value: "Professional", label: "Professional" },
      { value: "Caring", label: "Caring" }, { value: "Bold", label: "Bold" },
    ]},
    { key: "cta", label: "Call to Action (CTA)", icon: MousePointerClick, placeholder: "e.g. Book Free Trial", type: "input" },
  ];

  return (
    <div className="space-y-6">
      {/* Category Selector */}
      {showCategories && (
        <Card className={isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <LayoutTemplate className="w-5 h-5 text-indigo-500" />
              Quick Start — Choose a Business Category
            </CardTitle>
            <CardDescription>Select a category to auto-fill the form with sample data for demo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {SAMPLE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => loadCategory(cat)}
                  className={`p-4 rounded-xl border-2 text-center transition-all hover:scale-[1.02]
                    ${isDark ? "border-gray-600 hover:border-indigo-500 hover:bg-indigo-900/20" : "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50"}`}
                >
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <p className="text-sm font-semibold">{cat.name}</p>
                </button>
              ))}
            </div>
            <Button variant="ghost" className="mt-3 text-sm" onClick={() => setShowCategories(false)}>
              Or fill manually →
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Campaign Brief Form */}
      <Card className={isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Campaign Brief
          </CardTitle>
          <CardDescription>
            Fill in detailed business info for better AI-generated ad copy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fields.map(field => {
              const Icon = field.icon;
              return (
                <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                  <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-indigo-500" />
                    {field.label}
                  </Label>
                  {field.type === "select" ? (
                    <Select value={brief[field.key]} onValueChange={v => updateField(field.key, v)}>
                      <SelectTrigger className="h-11"><SelectValue placeholder={field.placeholder} /></SelectTrigger>
                      <SelectContent>
                        {field.options!.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === "textarea" ? (
                    <Textarea
                      placeholder={field.placeholder}
                      value={brief[field.key]}
                      onChange={e => updateField(field.key, e.target.value)}
                      className="min-h-[70px] resize-none"
                    />
                  ) : (
                    <Input
                      placeholder={field.placeholder}
                      value={brief[field.key]}
                      onChange={e => updateField(field.key, e.target.value)}
                      className="h-11"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {!showCategories && (
            <Button variant="ghost" className="mt-3 text-xs" onClick={() => setShowCategories(true)}>
              ← Show sample categories
            </Button>
          )}

          <Button
            onClick={() => onSubmit(brief)}
            disabled={!isValid}
            className="w-full mt-6 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-base"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Campaign
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
