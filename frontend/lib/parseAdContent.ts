type ParsedAd = {
  headline: string;
  body: string;
  cta: string;
};

export function parseAdContent(content: string): ParsedAd {
  if (!content || typeof content !== "string") {
    return { headline: "", body: "", cta: "Learn More" };
  }
  const cleanContent = content.replace(/\*\*/g, "").trim();

  const headlineMatch = cleanContent.match(/Headline\s*:?\s*(.*?)(?=\n|$)/is);
  const bodyMatch = cleanContent.match(/Body Text\s*:?\s*([\s\S]*?)(?=\n\s*CTA\s|$)/i);
  const ctaMatch = cleanContent.match(/CTA\s*:?\s*(.*?)(?=\n|$)/i);

  let headline = headlineMatch ? headlineMatch[1].trim() : "";
  let body = bodyMatch ? bodyMatch[1].trim() : "";
  let cta = ctaMatch ? ctaMatch[1].trim() : "";

  if (!headline && !body && !cta) {
    const lines = cleanContent.split(/\n+/).map((s) => s.trim()).filter(Boolean);
    headline = lines[0] || "";
    body = lines.slice(1).join("\n") || cleanContent;
    cta = "Learn More";
  }
  if (!cta) cta = "Learn More";

  return { headline, body, cta };
}
