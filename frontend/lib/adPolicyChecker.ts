// Facebook/Meta Ad Policy Checker - Rule-based

export interface PolicyViolation {
  severity: "high" | "medium" | "low";
  category: string;
  matchedText: string;
  rule: string;
  suggestion: string;
}

export interface PolicyCheckResult {
  status: "safe" | "needs_review" | "risky";
  violations: PolicyViolation[];
  summary: string;
}

interface PolicyRule {
  pattern: RegExp;
  category: string;
  severity: "high" | "medium" | "low";
  rule: string;
  suggestion: string;
}

const POLICY_RULES: PolicyRule[] = [
  {
    pattern: /guarantee[ds]?\s+(result|success|outcome|income|weight\s*loss)/gi,
    category: "Unrealistic Claims",
    severity: "high",
    rule: "Ads cannot guarantee specific results",
    suggestion: "Use softer language like 'designed to help you...'",
  },
  {
    pattern: /100\s*%\s*(success|guaranteed|effective|results|cure)/gi,
    category: "Unrealistic Claims",
    severity: "high",
    rule: "Absolute claims (100%) are not allowed",
    suggestion: "Avoid absolute claims. Use testimonials instead.",
  },
  {
    pattern: /lose\s+\d+\s*(kg|lbs?|pounds?)\s*(in|within)\s*\d+\s*(days?|weeks?)/gi,
    category: "Unrealistic Health Claims",
    severity: "high",
    rule: "Specific weight loss claims with timeframes violate health ad policies",
    suggestion: "Use general language like 'start your fitness journey'",
  },
  {
    pattern: /become\s+(rich|wealthy|millionaire)\s*(overnight|fast|quickly)/gi,
    category: "Unrealistic Financial Claims",
    severity: "high",
    rule: "Get-rich-quick schemes violate advertising policies",
    suggestion: "Focus on skills, education, or gradual growth",
  },
  {
    pattern: /earn\s+\$?\d[\d,]*\s*(per|a|every)\s*(day|week|month)/gi,
    category: "Unrealistic Financial Claims",
    severity: "high",
    rule: "Specific income claims require evidence",
    suggestion: "Use ranges or 'potential' language",
  },
  {
    pattern: /cure[ds]?\s+(cancer|diabetes|depression|anxiety|covid)/gi,
    category: "Prohibited Health Claims",
    severity: "high",
    rule: "Claiming to cure diseases is strictly prohibited",
    suggestion: "Rephrase as 'may support your wellness routine'",
  },
  {
    pattern: /miracle\s+(cure|solution|product|formula)/gi,
    category: "Misleading Claims",
    severity: "high",
    rule: "Miracle claims are considered misleading",
    suggestion: "Use evidence-based language",
  },
  {
    pattern: /are\s+you\s+(overweight|fat|ugly|depressed|sad|lonely|poor|broke)/gi,
    category: "Sensitive Personal Attributes",
    severity: "high",
    rule: "Ads cannot assert negative personal attributes",
    suggestion: "Focus on aspirations: 'Want to feel more confident?'",
  },
  {
    pattern: /do\s+you\s+(suffer|struggle)\s+(from|with)/gi,
    category: "Sensitive Personal Attributes",
    severity: "medium",
    rule: "Implying personal suffering may violate targeting rules",
    suggestion: "Use 'Ready to overcome...' or 'Looking for a better way?'",
  },
  {
    pattern: /before\s*(&|and)\s*after/gi,
    category: "Before/After Content",
    severity: "medium",
    rule: "Before-and-after claims are restricted on Meta platforms",
    suggestion: "Use progress stories without dramatic comparisons",
  },
  {
    pattern: /(only|just)\s+\d+\s*(left|remaining|spots?)/gi,
    category: "Artificial Scarcity",
    severity: "low",
    rule: "False scarcity claims may be flagged",
    suggestion: "Ensure scarcity claims are truthful",
  },
  {
    pattern: /you\s+won['']?t\s+believe/gi,
    category: "Clickbait Language",
    severity: "medium",
    rule: "Clickbait headlines reduce ad quality",
    suggestion: "Use clear, honest headlines",
  },
  {
    pattern: /doctors?\s+(hate|don['']?t\s+want)/gi,
    category: "Clickbait / Misleading",
    severity: "high",
    rule: "Conspiratorial clickbait violates ad policies",
    suggestion: "Use factual, professional language",
  },
  {
    pattern: /[!]{3,}/g,
    category: "Excessive Formatting",
    severity: "low",
    rule: "Excessive exclamation marks may be flagged as spammy",
    suggestion: "Use a single exclamation mark",
  },
];

export function checkAdPolicy(adText: string): PolicyCheckResult {
  const violations: PolicyViolation[] = [];

  for (const rule of POLICY_RULES) {
    const matches = adText.match(rule.pattern);
    if (matches) {
      const unique = [...new Set(matches)];
      for (const match of unique) {
        violations.push({
          severity: rule.severity,
          category: rule.category,
          matchedText: match.trim(),
          rule: rule.rule,
          suggestion: rule.suggestion,
        });
      }
    }
  }

  const highCount = violations.filter(v => v.severity === "high").length;
  const mediumCount = violations.filter(v => v.severity === "medium").length;

  let status: PolicyCheckResult["status"];
  let summary: string;

  if (highCount > 0) {
    status = "risky";
    summary = `Found ${highCount} high-severity policy violation(s). This ad is likely to be rejected.`;
  } else if (mediumCount > 0) {
    status = "needs_review";
    summary = `Found ${mediumCount} medium-severity issue(s). Review before publishing.`;
  } else if (violations.length > 0) {
    status = "needs_review";
    summary = `Found ${violations.length} minor issue(s). Generally safe but could be improved.`;
  } else {
    status = "safe";
    summary = "No policy violations detected. Ad appears compliant with platform policies.";
  }

  return { status, violations, summary };
}
