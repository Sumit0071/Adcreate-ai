// Rule-based Ad Quality Scorer
// Evaluates ad copy quality without needing AI — purely heuristic

export interface QualityScore {
  parameter: string;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface AdScoreResult {
  scores: QualityScore[];
  overall: number;
  maxOverall: number;
  percentage: number;
  grade: "A+" | "A" | "B+" | "B" | "C" | "D";
}

interface ScoringInput {
  headline: string;
  body: string;
  cta: string;
  targetAudience?: string;
  offer?: string;
  painPoint?: string;
  businessName?: string;
}

// ─── Scoring Rules ─────────────────────────────────────────────────────────────

function scoreCTAStrength(cta: string): QualityScore {
  let score = 0;
  const feedback: string[] = [];

  if (cta && cta.trim().length > 0) {
    score += 3;
    feedback.push("CTA is present");
  } else {
    return { parameter: "CTA Strength", score: 0, maxScore: 10, feedback: "No CTA found" };
  }

  // Action verbs
  const actionVerbs = ["book", "get", "start", "claim", "try", "join", "register", "sign up", "buy", "order", "download", "call", "schedule", "discover", "learn", "explore", "apply"];
  if (actionVerbs.some(v => cta.toLowerCase().includes(v))) {
    score += 3;
    feedback.push("Contains action verb");
  }

  // Urgency words
  const urgencyWords = ["now", "today", "limited", "hurry", "last", "free", "instant", "immediately"];
  if (urgencyWords.some(w => cta.toLowerCase().includes(w))) {
    score += 2;
    feedback.push("Contains urgency element");
  }

  // Length check (ideal: 2-5 words)
  const wordCount = cta.trim().split(/\s+/).length;
  if (wordCount >= 2 && wordCount <= 6) {
    score += 2;
    feedback.push("Good CTA length");
  }

  return { parameter: "CTA Strength", score: Math.min(score, 10), maxScore: 10, feedback: feedback.join("; ") };
}

function scoreClarity(headline: string, body: string): QualityScore {
  let score = 0;
  const feedback: string[] = [];

  // Headline exists and is concise
  if (headline && headline.length > 0) {
    score += 2;
    feedback.push("Headline present");
    if (headline.length <= 60) {
      score += 2;
      feedback.push("Headline is concise");
    }
  }

  // Body text length (ideal: 50-250 chars)
  if (body && body.length > 0) {
    score += 2;
    if (body.length >= 30 && body.length <= 500) {
      score += 2;
      feedback.push("Body length is optimal");
    }
  }

  // Readable — no excessive caps
  const capsRatio = (body.match(/[A-Z]/g)?.length || 0) / (body.length || 1);
  if (capsRatio < 0.4) {
    score += 2;
    feedback.push("Good readability");
  } else {
    feedback.push("Too many capital letters");
  }

  return { parameter: "Clarity", score: Math.min(score, 10), maxScore: 10, feedback: feedback.join("; ") };
}

function scoreAudienceRelevance(body: string, headline: string, targetAudience?: string): QualityScore {
  let score = 0;
  const feedback: string[] = [];
  const combined = `${headline} ${body}`.toLowerCase();

  // If target audience keywords are mentioned
  if (targetAudience) {
    const audienceWords = targetAudience.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const matched = audienceWords.filter(w => combined.includes(w));
    if (matched.length > 0) {
      score += 4;
      feedback.push(`Mentions audience keywords: ${matched.join(", ")}`);
    } else {
      feedback.push("Consider mentioning target audience directly");
    }
  } else {
    score += 2; // No audience to check against
  }

  // "You" / "Your" usage (addresses reader)
  if (combined.includes("you") || combined.includes("your")) {
    score += 3;
    feedback.push("Addresses the reader directly");
  }

  // Question engagement
  if (combined.includes("?")) {
    score += 2;
    feedback.push("Uses questions for engagement");
  }

  // Specific numbers/data
  if (/\d/.test(combined)) {
    score += 1;
    feedback.push("Includes specific data/numbers");
  }

  return { parameter: "Audience Relevance", score: Math.min(score, 10), maxScore: 10, feedback: feedback.join("; ") };
}

function scoreEmotionalAppeal(body: string, headline: string, painPoint?: string, desire?: string): QualityScore {
  let score = 0;
  const feedback: string[] = [];
  const combined = `${headline} ${body}`.toLowerCase();

  // Emotional words
  const emotionalWords = [
    "imagine", "transform", "dream", "struggle", "frustrated", "confident", "happy",
    "love", "amazing", "incredible", "powerful", "proven", "exclusive", "breakthrough",
    "life-changing", "freedom", "success", "joy", "fear", "worry", "stress", "relief",
    "deserve", "journey", "believe"
  ];
  const found = emotionalWords.filter(w => combined.includes(w));
  if (found.length > 0) {
    score += Math.min(found.length * 2, 4);
    feedback.push(`Emotional words: ${found.slice(0, 3).join(", ")}`);
  }

  // Pain point mention
  if (painPoint && combined.includes(painPoint.toLowerCase().substring(0, 10))) {
    score += 3;
    feedback.push("Addresses pain point");
  }

  // Desire/aspiration mention
  if (desire && combined.includes(desire.toLowerCase().substring(0, 10))) {
    score += 3;
    feedback.push("Mentions desired outcome");
  }

  // Emojis (adds visual engagement)
  if (/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|⭐|🎁|⏰|🔥/u.test(combined)) {
    score += 1;
    feedback.push("Uses emojis for engagement");
  }

  return { parameter: "Emotional Appeal", score: Math.min(score, 10), maxScore: 10, feedback: feedback.join("; ") };
}

function scoreOfferPresence(body: string, headline: string, offer?: string): QualityScore {
  let score = 0;
  const feedback: string[] = [];
  const combined = `${headline} ${body}`.toLowerCase();

  // Offer keywords
  const offerWords = ["free", "discount", "offer", "deal", "save", "trial", "bonus", "off", "%", "gift", "complimentary"];
  const found = offerWords.filter(w => combined.includes(w));

  if (found.length > 0) {
    score += 5;
    feedback.push(`Offer keywords: ${found.join(", ")}`);
  }

  // Specific offer mentioned
  if (offer && combined.includes(offer.toLowerCase().substring(0, 8))) {
    score += 5;
    feedback.push("Specific offer clearly stated");
  } else if (found.length > 0) {
    score += 2;
    feedback.push("Has offer indicators but could be more specific");
  }

  if (score === 0) {
    feedback.push("Consider adding a clear offer or incentive");
  }

  return { parameter: "Offer Clarity", score: Math.min(score, 10), maxScore: 10, feedback: feedback.join("; ") };
}

function scoreCopyLength(body: string): QualityScore {
  let score = 0;
  const feedback: string[] = [];
  const wordCount = body.trim().split(/\s+/).length;

  if (wordCount >= 20 && wordCount <= 80) {
    score = 10;
    feedback.push(`Optimal length (${wordCount} words)`);
  } else if (wordCount >= 10 && wordCount <= 120) {
    score = 7;
    feedback.push(`Acceptable length (${wordCount} words)`);
  } else if (wordCount < 10) {
    score = 3;
    feedback.push(`Too short (${wordCount} words) — add more detail`);
  } else {
    score = 5;
    feedback.push(`Too long (${wordCount} words) — consider trimming`);
  }

  return { parameter: "Copy Length", score, maxScore: 10, feedback: feedback.join("; ") };
}

// ─── Master Scorer ─────────────────────────────────────────────────────────────

export function scoreAd(input: ScoringInput): AdScoreResult {
  const scores: QualityScore[] = [
    scoreClarity(input.headline, input.body),
    scoreCTAStrength(input.cta),
    scoreAudienceRelevance(input.body, input.headline, input.targetAudience),
    scoreEmotionalAppeal(input.body, input.headline, input.painPoint),
    scoreOfferPresence(input.body, input.headline, input.offer),
    scoreCopyLength(input.body),
  ];

  const overall = scores.reduce((sum, s) => sum + s.score, 0);
  const maxOverall = scores.reduce((sum, s) => sum + s.maxScore, 0);
  const percentage = Math.round((overall / maxOverall) * 100);

  let grade: AdScoreResult["grade"];
  if (percentage >= 90) grade = "A+";
  else if (percentage >= 80) grade = "A";
  else if (percentage >= 70) grade = "B+";
  else if (percentage >= 60) grade = "B";
  else if (percentage >= 45) grade = "C";
  else grade = "D";

  return { scores, overall, maxOverall, percentage, grade };
}
