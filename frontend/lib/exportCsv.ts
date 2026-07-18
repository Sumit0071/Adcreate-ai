export const exportAnalyticsCSV = (
  adPerformance: any[]
) => {
  const rows = [
    [
      "Business",
      "Platform",
      "Impressions",
      "Clicks",
      "CTR",
      "Conversions",
    ],
  ];

  adPerformance.forEach((ad) => {
    rows.push([
      ad.businessName,
      ad.platform,
      ad.impressions,
      ad.clicks,
      ad.ctr,
      ad.conversions,
    ]);
  });

  const csv = rows
    .map((r) => r.join(","))
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "analytics.csv";
  a.click();

  URL.revokeObjectURL(url);
};