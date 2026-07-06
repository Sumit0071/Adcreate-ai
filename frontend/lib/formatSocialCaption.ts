/**
 * Formats raw ad content (which may contain labels like "Option 1:", "Headline:", "Body Text:", "CTA:")
 * into a clean social media caption suitable for publishing.
 */
export function formatSocialCaption(raw: string | undefined): string {
  if (!raw || typeof raw !== "string") return "";

  let text = raw
    // Remove markdown bold markers
    .replace(/\*\*/g, "")
    .trim();

  // Remove "Option N:" prefix
  text = text.replace(/^Option\s*\d+\s*:\s*/i, "").trim();

  // Extract labeled parts
  const headlineMatch = text.match(/Headline\s*:\s*(.*?)(?=\n|$)/is);
  const bodyMatch = text.match(/Body\s*Text\s*:\s*([\s\S]*?)(?=\n\s*CTA\s*:|$)/i);
  const ctaMatch = text.match(/CTA\s*:\s*(.*?)(?=\n|$)/i);

  const headline = headlineMatch ? headlineMatch[1].trim() : "";
  const body = bodyMatch ? bodyMatch[1].trim() : "";
  const cta = ctaMatch ? ctaMatch[1].trim() : "";

  // If we found labeled parts, compose a clean caption
  if (headline || body) {
    const parts: string[] = [];
    if (headline) parts.push(headline);
    if (body) parts.push(body);
    if (cta && cta.toLowerCase() !== "learn more") parts.push(`👉 ${cta}`);
    return parts.join("\n\n");
  }

  // If no labels found, return the cleaned text as-is
  return text;
}
