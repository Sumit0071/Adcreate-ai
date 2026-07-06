"use client";

import { useThemeStore } from "@/store/useThemeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, CheckCircle2, ArrowRight } from "lucide-react";

export default function BeforeAfterComparison() {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  const manualSteps = [
    "Think of ad idea",
    "Write copy manually",
    "Create headline variations",
    "Write follow-up messages",
    "Check ad policies manually",
    "Save in document",
  ];

  const aiSteps = [
    "Enter business details",
    "Generate 7 ad variations (frameworks)",
    "Get follow-up sequence (6 messages)",
    "Score copy automatically",
    "Check policy compliance",
    "Export campaign content",
  ];

  return (
    <Card className={isDark ? "bg-gray-800/50 border-gray-700" : ""}>
      <CardHeader>
        <CardTitle className="text-lg text-center">Manual Process vs AdCreate AI</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Manual Process */}
          <div className={`p-5 rounded-xl border-2 ${isDark ? "border-red-900/50 bg-red-950/20" : "border-red-200 bg-red-50/50"}`}>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-red-600 dark:text-red-400">Manual Process</h3>
            </div>
            <ul className="space-y-2 mb-4">
              {manualSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ul>
            <Badge className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 text-sm px-3 py-1">
              ⏱ Takes 30–60 minutes
            </Badge>
          </div>

          {/* AdCreate AI */}
          <div className={`p-5 rounded-xl border-2 ${isDark ? "border-green-900/50 bg-green-950/20" : "border-green-200 bg-green-50/50"}`}>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-green-500" />
              <h3 className="font-bold text-green-600 dark:text-green-400">AdCreate AI Process</h3>
            </div>
            <ul className="space-y-2 mb-4">
              {aiSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  {step}
                </li>
              ))}
            </ul>
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 text-sm px-3 py-1">
              ⚡ Takes 1–2 minutes
            </Badge>
          </div>
        </div>

        {/* Summary */}
        <div className={`mt-6 p-4 rounded-xl text-center ${isDark ? "bg-indigo-950/30 border border-indigo-800" : "bg-indigo-50 border border-indigo-200"}`}>
          <p className="font-semibold text-indigo-600 dark:text-indigo-300">
            AdCreate AI saves up to <span className="text-2xl font-bold">85%</span> of time and effort
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Structured prompts + marketing frameworks + rule-based scoring = professional output without premium API
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
