type ParsedAd = {
  headline: string;
  body: string;
  cta: string;
};

export function parseAdContent(content: string): ParsedAd {
  const headlineMatch = content.match(/Headline:\s*(.*)/i);
  const bodyMatch = content.match(/Body Text:\s*([\s\S]*?)\n\nCTA:/i);
  const ctaMatch = content.match(/CTA:\s*(.*)/i);

  return {
    headline: headlineMatch ? headlineMatch[1].trim() : "",
    body: bodyMatch ? bodyMatch[1].trim() : "",
    cta: ctaMatch ? ctaMatch[1].trim() : "",
  };
}
