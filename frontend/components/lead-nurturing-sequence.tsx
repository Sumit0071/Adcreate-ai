"use client";

import { NurturingMessage } from "@/lib/leadNurturingGenerator";
import { CampaignBrief } from "@/lib/marketingFrameworks";
import { useThemeStore } from "@/store/useThemeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, MessageSquare, Mail, Smartphone } from "lucide-react";
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

  const exportSequence = () => {
    let text = `Lead Nurturing Sequence — ${brief.businessName}\n${"=".repeat(50)}\n\n`;
    messages.forEach(msg => {
      text += `Day ${msg.day} — ${msg.label} (${msg.channel})\n`;
      if (msg.subject) text += `Subject: ${msg.subject}\n`;
      text += `${msg.message}\n\n---\n\n`;
    });
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${brief.businessName}_nurturing_sequence.txt`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Sequence exported!");
  };

  return (
    <Card className={isDark ? "bg-gray-800/50 border-gray-700" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="w-5 h-5 text-green-500" />
            Lead Nurturing Sequence
          </CardTitle>
          <Button variant="outline" size="sm" onClick={exportSequence}>Export</Button>
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
