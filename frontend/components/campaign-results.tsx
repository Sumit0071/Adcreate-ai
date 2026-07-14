"use client";

import { useState } from "react";
import { FrameworkAd } from "@/lib/marketingFrameworks";
import { CampaignBrief } from "@/lib/marketingFrameworks";
import { scoreAd, AdScoreResult } from "@/lib/adQualityScorer";
import { checkAdPolicy, PolicyCheckResult } from "@/lib/adPolicyChecker";
import { useThemeStore } from "@/store/useThemeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Copy, Edit3, RotateCcw, Shield, BarChart3, AlertTriangle,
  CheckCircle2, XCircle, ChevronDown, ChevronUp, FileText,
} from "lucide-react";
import { toast } from "react-toastify";

interface CampaignResultsProps {
  brief: CampaignBrief;
  ads: FrameworkAd[];
  onBack: () => void;
}

export default function CampaignResults({ brief, ads, onBack }: CampaignResultsProps) {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editedAds, setEditedAds] = useState<FrameworkAd[]>(ads);
  const [expandedScores, setExpandedScores] = useState<Record<number, boolean>>({});
  const [expandedPolicy, setExpandedPolicy] = useState<Record<number, boolean>>({});

  const getScore = (ad: FrameworkAd): AdScoreResult =>
    scoreAd({
      headline: ad.headline,
      body: ad.body,
      cta: ad.cta,
      targetAudience: brief.targetAudience,
      offer: brief.offer,
      painPoint: brief.painPoint,
      businessName: brief.businessName,
    });

  const getPolicy = (ad: FrameworkAd): PolicyCheckResult =>
    checkAdPolicy(`${ad.headline} ${ad.body} ${ad.cta}`);

  const copyAd = (ad: FrameworkAd) => {
    const text = `Headline: ${ad.headline}\n\n${ad.body}\n\nCTA: ${ad.cta}`;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleEdit = (idx: number, field: keyof FrameworkAd, value: string) => {
    setEditedAds(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const regenerateField = (idx: number, field: "headline" | "body" | "cta") => {
    const original = ads[idx];
    setEditedAds(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: original[field] };
      return copy;
    });
    toast.info(`Reset ${field} to original`);
  };

  const exportAll = () => {
    let text = `Campaign: ${brief.businessName} — ${brief.campaignGoal}\n`;
    text += `Target: ${brief.targetAudience} | Location: ${brief.location}\n`;
    text += `${"=".repeat(60)}\n\n`;

    editedAds.forEach((ad, i) => {
      const score = getScore(ad);
      const policy = getPolicy(ad);
      text += `VARIATION ${i + 1}: ${ad.angle} (${ad.framework})\n`;
      text += `-`.repeat(40) + "\n";
      text += `Headline: ${ad.headline}\n\n`;
      text += `${ad.body}\n\n`;
      text += `CTA: ${ad.cta}\n`;
      text += `Ad Score: ${score.overall}/${score.maxOverall} (${score.grade})\n`;
      text += `Policy: ${policy.status.toUpperCase()}\n\n`;
    });

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brief.businessName.replace(/\s+/g, "_")}_campaign.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Campaign exported!");
  };

  const gradeColor = (grade: string) => {
    if (grade === "A+" || grade === "A") return "text-green-500";
    if (grade === "B+" || grade === "B") return "text-yellow-500";
    return "text-red-500";
  };

  const policyColor = (status: string) => {
    if (status === "safe") return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
    if (status === "needs_review") return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";
    return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
  };

  return (
    <div className="space-y-6">
      {/* Campaign Summary Header */}
      <Card className={`border-2 ${isDark ? "bg-indigo-950/30 border-indigo-800" : "bg-indigo-50/70 border-indigo-200"}`}>
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">{brief.businessName} Campaign</h2>
              <p className="text-sm text-gray-500 mt-1">
                {brief.campaignGoal} • {brief.targetAudience} • {brief.location}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onBack}>← Edit Brief</Button>
              <Button size="sm" onClick={exportAll} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <FileText className="w-4 h-4 mr-1" /> Export All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* A/B Variation Overview Table */}
      <Card className={isDark ? "bg-gray-800/50 border-gray-700" : ""}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">A/B Variations Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={isDark ? "border-gray-700" : "border-gray-200"}>
                  <th className="text-left py-2 px-3 font-semibold">Variation</th>
                  <th className="text-left py-2 px-3 font-semibold">Framework</th>
                  <th className="text-left py-2 px-3 font-semibold">Angle</th>
                  <th className="text-center py-2 px-3 font-semibold">Score</th>
                  <th className="text-center py-2 px-3 font-semibold">Policy</th>
                </tr>
              </thead>
              <tbody>
                {editedAds.map((ad, i) => {
                  const score = getScore(ad);
                  const policy = getPolicy(ad);
                  return (
                    <tr key={i} className={`border-t ${isDark ? "border-gray-700" : "border-gray-100"}`}>
                      <td className="py-2 px-3 font-medium">Ad Copy {i + 1}</td>
                      <td className="py-2 px-3"><Badge variant="outline" className="text-xs">{ad.framework}</Badge></td>
                      <td className="py-2 px-3">{ad.angle}</td>
                      <td className="py-2 px-3 text-center">
                        <span className={`font-bold ${gradeColor(score.grade)}`}>{score.grade}</span>
                        <span className="text-xs text-gray-500 ml-1">{score.percentage}%</span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <Badge className={policyColor(policy.status)}>{policy.status === "safe" ? "✓ Safe" : policy.status === "needs_review" ? "⚠ Review" : "✗ Risky"}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Individual Ad Cards */}
      {editedAds.map((ad, idx) => {
        const score = getScore(ad);
        const policy = getPolicy(ad);
        const isEditing = editingIdx === idx;
        const showScore = expandedScores[idx];
        const showPolicy = expandedPolicy[idx];

        return (
          <Card key={idx} className={`overflow-hidden ${isDark ? "bg-gray-800/50 border-gray-700" : ""}`}>
            {/* Card Header */}
            <div className={`px-5 py-4 border-b flex items-center justify-between ${isDark ? "border-gray-700" : "border-gray-100"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                  idx % 3 === 0 ? "bg-indigo-600" : idx % 3 === 1 ? "bg-purple-600" : "bg-pink-600"
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-bold">Variation {idx + 1}: {ad.angle}</h3>
                  <p className="text-xs text-gray-500">{ad.frameworkLabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={policyColor(policy.status)}>
                  {policy.status === "safe" ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                  {policy.status}
                </Badge>
                <span className={`font-bold text-lg ${gradeColor(score.grade)}`}>{score.grade}</span>
              </div>
            </div>

            <CardContent className="p-5 space-y-4">
              {/* Ad Content (view or edit mode) */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs font-semibold text-gray-500 uppercase">Headline</Label>
                    {isEditing && (
                      <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => regenerateField(idx, "headline")}>
                        <RotateCcw className="w-3 h-3 mr-1" /> Reset
                      </Button>
                    )}
                  </div>
                  {isEditing ? (
                    <Input value={ad.headline} onChange={e => handleEdit(idx, "headline", e.target.value)} className="font-semibold" />
                  ) : (
                    <div className={`p-3 rounded-lg border font-semibold ${isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50"}`}>
                      {ad.headline}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs font-semibold text-gray-500 uppercase">Body Copy</Label>
                    {isEditing && (
                      <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => regenerateField(idx, "body")}>
                        <RotateCcw className="w-3 h-3 mr-1" /> Reset
                      </Button>
                    )}
                  </div>
                  {isEditing ? (
                    <Textarea value={ad.body} onChange={e => handleEdit(idx, "body", e.target.value)} className="min-h-[120px]" />
                  ) : (
                    <div className={`p-3 rounded-lg border whitespace-pre-line text-sm ${isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50"}`}>
                      {ad.body}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs font-semibold text-gray-500 uppercase">CTA</Label>
                    {isEditing && (
                      <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => regenerateField(idx, "cta")}>
                        <RotateCcw className="w-3 h-3 mr-1" /> Reset
                      </Button>
                    )}
                  </div>
                  {isEditing ? (
                    <Input value={ad.cta} onChange={e => handleEdit(idx, "cta", e.target.value)} />
                  ) : (
                    <div className={`p-3 rounded-lg border font-semibold text-indigo-600 ${isDark ? "bg-indigo-950/30 border-indigo-800" : "bg-indigo-50 border-indigo-200"}`}>
                      {ad.cta}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => copyAd(ad)}>
                  <Copy className="w-4 h-4 mr-1" /> Copy
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditingIdx(isEditing ? null : idx)}>
                  <Edit3 className="w-4 h-4 mr-1" /> {isEditing ? "Done" : "Edit"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setExpandedScores(p => ({ ...p, [idx]: !p[idx] }))}>
                  <BarChart3 className="w-4 h-4 mr-1" /> Score {showScore ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setExpandedPolicy(p => ({ ...p, [idx]: !p[idx] }))}>
                  <Shield className="w-4 h-4 mr-1" /> Policy {showPolicy ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                </Button>
              </div>

              {/* Expanded Quality Score */}
              {showScore && (
                <div className={`p-4 rounded-xl border ${isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-500" />
                    Ad Quality Score: <span className={`text-lg ${gradeColor(score.grade)}`}>{score.overall}/{score.maxOverall} ({score.grade})</span>
                  </h4>
                  <div className="space-y-2">
                    {score.scores.map((s, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{s.parameter}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-2 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
                            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${(s.score / s.maxScore) * 100}%` }} />
                          </div>
                          <span className="font-bold w-10 text-right">{s.score}/{s.maxScore}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expanded Policy Check */}
              {showPolicy && (
                <div className={`p-4 rounded-xl border ${isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-500" />
                    Platform Policy Check
                  </h4>
                  <p className="text-sm mb-3">{policy.summary}</p>
                  {policy.violations.length > 0 ? (
                    <div className="space-y-2">
                      {policy.violations.map((v, i) => (
                        <div key={i} className={`p-3 rounded-lg border text-sm ${
                          v.severity === "high" ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800" :
                          v.severity === "medium" ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800" :
                          "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            {v.severity === "high" ? <XCircle className="w-4 h-4 text-red-500" /> :
                             v.severity === "medium" ? <AlertTriangle className="w-4 h-4 text-yellow-500" /> :
                             <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                            <span className="font-semibold">{v.category}</span>
                            <Badge variant="outline" className="text-xs">{v.severity}</Badge>
                          </div>
                          <p className="text-xs mt-1">Matched: "<em>{v.matchedText}</em>"</p>
                          <p className="text-xs mt-1">💡 {v.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-medium">All clear! No policy issues detected.</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
