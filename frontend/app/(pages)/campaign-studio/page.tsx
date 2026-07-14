"use client";

import { useState } from "react";
import { CampaignBrief, generateAllFrameworkAds, FrameworkAd } from "@/lib/marketingFrameworks";
import { generateNurturingSequence, NurturingMessage } from "@/lib/leadNurturingGenerator";
import { scoreAd } from "@/lib/adQualityScorer";
import { checkAdPolicy } from "@/lib/adPolicyChecker";
import { useThemeStore } from "@/store/useThemeStore";
import CampaignBriefForm from "@/components/campaign-brief-form";
import CampaignResults from "@/components/campaign-results";
import LeadNurturingSequence from "@/components/lead-nurturing-sequence";
import CampaignOutputTemplate from "@/components/campaign-output-template";
import BeforeAfterComparison from "@/components/before-after-comparison";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function CampaignStudioPage() {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [brief, setBrief] = useState<CampaignBrief | null>(null);
  const [ads, setAds] = useState<FrameworkAd[]>([]);
  const [nurturing, setNurturing] = useState<NurturingMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (b: CampaignBrief) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/business/generate-campaign-brief`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(b),
      });
      const data = await response.json();
      if (data.success && Array.isArray(data.ads)) {
        setBrief(b);
        setAds(data.ads);
        const messages = generateNurturingSequence(b);
        setNurturing(messages);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        console.warn("API returned error, using fallback generation");
        setBrief(b);
        const generatedAds = generateAllFrameworkAds(b);
        setAds(generatedAds);
        const messages = generateNurturingSequence(b);
        setNurturing(messages);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (error) {
      console.error("Failed to fetch from backend API, using fallback:", error);
      setBrief(b);
      const generatedAds = generateAllFrameworkAds(b);
      setAds(generatedAds);
      const messages = generateNurturingSequence(b);
      setNurturing(messages);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setBrief(null);
    setAds([]);
    setNurturing([]);
  };

  // Get best ad for campaign template
  const getBestAd = () => {
    if (ads.length === 0) return ads[0];
    let bestIdx = 0;
    let bestScore = 0;
    ads.forEach((ad, idx) => {
      const s = scoreAd({
        headline: ad.headline, body: ad.body, cta: ad.cta,
        targetAudience: brief?.targetAudience, offer: brief?.offer,
        painPoint: brief?.painPoint, businessName: brief?.businessName,
      });
      if (s.percentage > bestScore) {
        bestScore = s.percentage;
        bestIdx = idx;
      }
    });
    return ads[bestIdx];
  };

  return (
    <div className={`min-h-screen ${isDark
      ? "bg-gradient-to-bl from-gray-800 via-gray-900 to-slate-950 text-white"
      : "bg-gradient-to-bl from-slate-50 via-blue-50 to-indigo-50 text-gray-900"
    }`}>
      {/* Header */}
      <div className={`border-b ${isDark ? "border-gray-800 bg-gray-900/80" : "border-gray-200 bg-white/80"} backdrop-blur-sm sticky top-0 z-20`}>
        <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Home</Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight">Campaign Studio</h1>
                <p className="text-xs text-gray-500">Framework-Powered Ad Generation</p>
              </div>
            </div>
          </div>
          {brief && (
            <Link href="/dashboard">
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/30 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full border-t-4 border-indigo-600 animate-spin"></div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-tight animate-pulse text-indigo-500">Generating with Gemini AI...</h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Analyzing your brief, mapping to marketing frameworks (AIDA, PAS, BAB), and writing conversion-focused copy.
              </p>
            </div>
          </div>
        ) : !brief ? (
          <div className="space-y-8">
            {/* Before-After at top for impact */}
            <BeforeAfterComparison />

            {/* Brief Form */}
            <CampaignBriefForm onSubmit={handleSubmit} />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Campaign Output Template */}
            {ads.length > 0 && (
              <CampaignOutputTemplate
                brief={brief}
                bestAd={getBestAd()}
                score={scoreAd({
                  headline: getBestAd().headline, body: getBestAd().body, cta: getBestAd().cta,
                  targetAudience: brief.targetAudience, offer: brief.offer,
                  painPoint: brief.painPoint, businessName: brief.businessName,
                })}
                policy={checkAdPolicy(`${getBestAd().headline} ${getBestAd().body} ${getBestAd().cta}`)}
                followUpCount={nurturing.length}
              />
            )}

            {/* Ad Variations with Scoring & Policy */}
            <CampaignResults brief={brief} ads={ads} onBack={handleBack} />

            {/* Lead Nurturing Sequence */}
            <LeadNurturingSequence messages={nurturing} brief={brief} />

            {/* Before-After at bottom */}
            <BeforeAfterComparison />
          </div>
        )}
      </div>
    </div>
  );
}
