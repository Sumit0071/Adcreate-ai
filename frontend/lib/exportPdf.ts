import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportAnalyticsPDF = (
  summary: any,
  platformBreakdown: any,
  adPerformance: any[]
) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("AdCreate AI", 14, 18);

  doc.setFontSize(12);
  doc.text("Analytics Report", 14, 28);

  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    36
  );

  autoTable(doc, {
    startY: 45,
    head: [["Metric", "Value"]],
    body: [
      ["Published Posts", summary.totalPosts],
      ["Impressions", summary.totalImpressions],
      ["Clicks", summary.totalClicks],
      ["Conversions", summary.totalConversions],
      ["CTR", `${summary.ctr}%`],
      ["Conversion Rate", `${summary.conversionRate}%`],
    ],
  });

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
    head: [["Platform", "Impressions", "Clicks", "Conversions"]],
    body: Object.entries(platformBreakdown).map(
      ([platform, stat]: any) => [
        platform,
        stat.impressions,
        stat.clicks,
        stat.conversions,
      ]
    ),
  });

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
    head: [
      [
        "Business",
        "Platform",
        "CTR",
        "Conversions",
      ],
    ],
    body: adPerformance.map((ad) => [
      ad.businessName,
      ad.platform,
      `${ad.ctr}%`,
      ad.conversions,
    ]),
  });

  doc.save("analytics-report.pdf");
};