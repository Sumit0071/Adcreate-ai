"use client";

import { CampaignBrief, FrameworkAd } from "@/lib/marketingFrameworks";
import { AdScoreResult } from "@/lib/adQualityScorer";
import { PolicyCheckResult } from "@/lib/adPolicyChecker";
import { useThemeStore } from "@/store/useThemeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, FileText, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { toast } from "react-toastify";

interface CampaignTemplateProps {
  brief: CampaignBrief;
  bestAd: FrameworkAd;
  score: AdScoreResult;
  policy: PolicyCheckResult;
  followUpCount: number;
}

export default function CampaignOutputTemplate({ brief, bestAd, score, policy, followUpCount }: CampaignTemplateProps) {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  const policyIcon = policy.status === "safe" ? <CheckCircle2 className="w-4 h-4 text-green-500" /> :
    policy.status === "needs_review" ? <AlertTriangle className="w-4 h-4 text-yellow-500" /> :
    <XCircle className="w-4 h-4 text-red-500" />;

  const rows = [
    { label: "Campaign Name", value: `${brief.businessName} ${brief.campaignGoal} Campaign` },
    { label: "Objective", value: brief.campaignGoal },
    { label: "Target Audience", value: `${brief.targetAudience} in ${brief.location}` },
    { label: "Primary Text", value: bestAd.body.substring(0, 120) + "..." },
    { label: "Headline", value: bestAd.headline },
    { label: "CTA", value: bestAd.cta },
    { label: "Offer", value: brief.offer },
    { label: "Framework Used", value: `${bestAd.framework} — ${bestAd.angle}` },
    { label: "Follow-up Messages", value: `${followUpCount} messages (Day 0 to Day 7)` },
    { label: "Ad Score", value: `${score.overall}/${score.maxOverall} (${score.grade})` },
    { label: "Policy Status", value: policy.status.charAt(0).toUpperCase() + policy.status.slice(1).replace(/_/g, " ") },
  ];

  const copyTemplate = () => {
    const text = rows.map(r => `${r.label}: ${r.value}`).join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Template copied!");
  };

  return (
    <Card className={`border-2 ${isDark ? "bg-gradient-to-br from-gray-800 to-gray-900 border-indigo-800" : "bg-gradient-to-br from-white to-indigo-50 border-indigo-200"}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-indigo-500" />
            Campaign-Ready Output
          </CardTitle>
          <Button variant="outline" size="sm" onClick={copyTemplate}>
            <Copy className="w-4 h-4 mr-1" /> Copy
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rows.map((row, i) => (
            <div key={i} className={`flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2 border-b last:border-0 ${isDark ? "border-gray-700" : "border-gray-100"}`}>
              <span className="text-sm font-semibold text-gray-500 sm:w-44 shrink-0">{row.label}</span>
              <span className="text-sm font-medium flex items-center gap-2">
                {row.label === "Policy Status" && policyIcon}
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
