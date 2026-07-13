"use client";

import { NurturingMessage } from "@/lib/leadNurturingGenerator";
import { CampaignBrief } from "@/lib/marketingFrameworks";
import { useThemeStore } from "@/store/useThemeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, MessageSquare, Mail, Smartphone, Download, FileText, Sheet, File } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";

interface LeadNurturingProps {
  messages: NurturingMessage[];
  brief: CampaignBrief;
}

const channelConfig: Record<string, { icon: any; color: string }> = {
  WhatsApp: { icon: MessageSquare, color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
  Email: { icon: Mail, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  SMS: { icon: Smartphone, color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
};

export default function LeadNurturingSequence({ messages, brief }: LeadNurturingProps) {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  const copyMessage = (msg: NurturingMessage) => {
    const text = msg.subject ? `Subject: ${msg.subject}\n\n${msg.message}` : msg.message;
    navigator.clipboard.writeText(text);
    toast.success("Message copied!");
  };

  // Export as TXT
  const exportSequenceAsText = () => {
    let text = `LEAD NURTURING SEQUENCE\n`;
    text += `${"=".repeat(70)}\n`;
    text += `Business: ${brief.businessName}\n`;
    text += `Generated: ${new Date().toLocaleDateString()}\n`;
    text += `${"=".repeat(70)}\n\n`;

    messages.forEach(msg => {
      text += `DAY ${msg.day} — ${msg.label}\n`;
      text += `${"-".repeat(70)}\n`;
      text += `Purpose: ${msg.purpose}\n`;
      text += `Channel: ${msg.channel}\n`;
      if (msg.subject) text += `Subject: ${msg.subject}\n`;
      text += `\nMessage:\n${msg.message}\n`;
      text += `\n${"=".repeat(70)}\n\n`;
    });

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brief.businessName.replace(/\s+/g, "_")}_nurturing_sequence_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Sequence exported as TXT!");
  };

  // Export as CSV
  const exportSequenceAsCSV = () => {
    let csv = "Lead Nurturing Sequence\n";
    csv += `Business,Generated Date\n`;
    csv += `"${brief.businessName}","${new Date().toLocaleDateString()}"\n\n`;

    csv += "Day,Label,Purpose,Channel,Subject,Message\n";
    messages.forEach(msg => {
      const message = msg.message.replace(/"/g, '""').replace(/\n/g, " ");
      const subject = msg.subject ? msg.subject.replace(/"/g, '""') : "";
      csv += `${msg.day},"${msg.label}","${msg.purpose}","${msg.channel}","${subject}","${message}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brief.businessName.replace(/\s+/g, "_")}_nurturing_sequence_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Sequence exported as CSV!");
  };

  // Export as PDF
  const exportSequenceAsPDF = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      let yPosition = 10;

      // Title
      doc.setFontSize(16);
      doc.text("Lead Nurturing Sequence", 10, yPosition);
      yPosition += 10;

      // Business info
      doc.setFontSize(10);
      doc.text(`Business: ${brief.businessName}`, 10, yPosition);
      yPosition += 5;
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 10, yPosition);
      yPosition += 10;

      // Messages table
      const messagesData = [
        ["Day", "Label", "Purpose", "Channel", "Subject"],
        ...messages.map(msg => [
          `Day ${msg.day}`,
          msg.label,
          msg.purpose.substring(0, 20),
          msg.channel,
          msg.subject ? msg.subject.substring(0, 20) : "—"
        ])
      ];

      doc.autoTable({
        head: [messagesData[0]],
        body: messagesData.slice(1),
        startY: yPosition,
        margin: { left: 10, right: 10 },
      });

      // Add detailed messages
      messages.forEach((msg, idx) => {
        yPosition = (doc as any).lastAutoTable.finalY + 12;

        if (yPosition > 250) {
          doc.addPage();
          yPosition = 10;
        }

        doc.setFontSize(11);
        doc.text(`Day ${msg.day}: ${msg.label}`, 10, yPosition);
        yPosition += 6;

        doc.setFontSize(9);
        doc.text(`Purpose: ${msg.purpose}`, 10, yPosition);
        yPosition += 4;
        doc.text(`Channel: ${msg.channel}`, 10, yPosition);
        yPosition += 4;

        if (msg.subject) {
          doc.text(`Subject: ${msg.subject}`, 10, yPosition);
          yPosition += 4;
        }

        // Message content
        const messageLines = doc.splitTextToSize(msg.message, 180);
        messageLines.forEach((line: string) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 10;
          }
          doc.text(line, 10, yPosition);
          yPosition += 4;
        });

        yPosition += 2;
        doc.setDrawColor(200);
        doc.line(10, yPosition, 200, yPosition);
      });

      doc.save(`${brief.businessName.replace(/\s+/g, "_")}_nurturing_sequence_${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("Sequence exported as PDF!");
    } catch (error) {
      toast.error("PDF export requires jsPDF library. Please install it.");
      console.error("PDF export error:", error);
    }
  };

  return (
    <Card className={isDark ? "bg-gray-800/50 border-gray-700" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="w-5 h-5 text-green-500" />
            Lead Nurturing Sequence
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportSequenceAsText} className="cursor-pointer">
                <FileText className="w-4 h-4 mr-2" />
                Export as TXT
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportSequenceAsCSV} className="cursor-pointer">
                <Sheet className="w-4 h-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportSequenceAsPDF} className="cursor-pointer">
                <File className="w-4 h-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {/* Timeline Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                <th className="text-left py-2 px-3">Day</th>
                <th className="text-left py-2 px-3">Purpose</th>
                <th className="text-left py-2 px-3">Channel</th>
                <th className="text-right py-2 px-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg, i) => {
                const cfg = channelConfig[msg.channel] || channelConfig.WhatsApp;
                const Icon = cfg.icon;
                return (
                  <tr key={i} className={`border-b ${isDark ? "border-gray-700" : "border-gray-100"}`}>
                    <td className="py-3 px-3 font-bold text-indigo-600">Day {msg.day}</td>
                    <td className="py-3 px-3">
                      <span className="font-medium">{msg.label}</span>
                      <span className="block text-xs text-gray-500">{msg.purpose}</span>
                    </td>
                    <td className="py-3 px-3">
                      <Badge className={cfg.color}>
                        <Icon className="w-3 h-3 mr-1" /> {msg.channel}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => copyMessage(msg)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Message Details */}
        <div className="space-y-4">
          {messages.map((msg, i) => {
            const cfg = channelConfig[msg.channel] || channelConfig.WhatsApp;
            const Icon = cfg.icon;
            return (
              <div key={i} className={`p-4 rounded-xl border ${isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50/50 border-gray-200"}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-600">Day {msg.day}</span>
                    <Badge variant="outline" className="text-xs">{msg.label}</Badge>
                    <Badge className={`${cfg.color} text-xs`}><Icon className="w-3 h-3 mr-1" />{msg.channel}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyMessage(msg)}>
                    <Copy className="w-4 h-4 mr-1" /> Copy
                  </Button>
                </div>
                {msg.subject && (
                  <p className="text-xs font-semibold text-gray-500 mb-1">Subject: {msg.subject}</p>
                )}
                <div className={`text-sm whitespace-pre-line ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  {msg.message}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
