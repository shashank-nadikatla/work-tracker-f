import React, { useState } from "react";
import {
  DocumentTextIcon,
  ArrowLeftIcon,
  SparklesIcon,
  ClipboardDocumentIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { Input } from "@/components/ui/input";
import { ActivityEntry } from "@/store/useActivityStore";

interface SummaryGeneratorProps {
  entries: ActivityEntry[];
  onBack: () => void;
  onExportPDF: (summary: string) => void;
}

export const SummaryGenerator: React.FC<SummaryGeneratorProps> = ({
  entries,
  onBack,
  onExportPDF,
}) => {
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [lastAiSummary, setLastAiSummary] = useState("");
  const { toast } = useToast();

  const generateLocalSummary = () => {
    if (entries.length === 0) return "No activities to summarize.";

    const dateRange = {
      start: entries[entries.length - 1]?.date,
      end: entries[0]?.date,
    };

    let summaryText = `## Work Summary\n`;
    summaryText += `**Period:** ${format(
      parseISO(dateRange.start),
      "MMM dd"
    )} - ${format(parseISO(dateRange.end), "MMM dd, yyyy")}\n`;
    summaryText += `**Total Activities:** ${entries.length}\n\n`;

    // List activities newest first grouped by date
    const byDate: Record<string, ActivityEntry[]> = {};
    entries.forEach((e) => {
      if (!byDate[e.date]) byDate[e.date] = [];
      byDate[e.date].push(e);
    });

    Object.keys(byDate)
      .sort((a, b) => (a < b ? 1 : -1))
      .forEach((date) => {
        summaryText += `### ${format(parseISO(date), "EEE, MMM dd, yyyy")}\n`;
        byDate[date].forEach((e) => {
          summaryText += `- ${e.content}`;
          if (e.tags.length) summaryText += ` [${e.tags.join(", ")}]`;
          summaryText += "\n";
        });
        summaryText += "\n";
      });

    return summaryText;
  };

  const handleGenerateSummary = async () => {
    setIsGenerating(true);

    try {
      const localSummary = generateLocalSummary();
      setSummary(localSummary);

      toast({
        title: "Summary generated! ✨",
        description: "Your work summary is ready for review and export.",
        className: "bg-gradient-primary text-primary-foreground border-none",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Using local summary generation instead.",
        variant: "destructive",
      });

      // Fallback to local generation
      const localSummary = generateLocalSummary();
      setSummary(localSummary);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAISummary = async () => {
    const localText = generateLocalSummary();
    setSummary(localText); // always display fresh local summary first

    setAiLoading(true);
    try {
      const res = await fetch(import.meta.env.VITE_PPLX_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_PPLX_API_KEY}`,
        },
        body: JSON.stringify({
          model: import.meta.env.VITE_PPLX_MODEL || "sonar-pro",
          temperature: 0.7,
          max_tokens: 400,
          messages: [
            {
              role: "user",
              content:
                (prompt ||
                  "Summarize the following developer work log in concise bullet points in simple english.") +
                "\n\n" +
                localText,
            },
          ],
        }),
      });

      if (!res.ok) throw new Error("Perplexity request failed");
      const data = await res.json();
      const aiText = data.choices?.[0]?.message?.content || localText;
      setSummary(aiText);
      setLastAiSummary(aiText);
      toast({
        title: "AI summary ready! ✨",
        description: "AI generated an enhanced summary.",
        className: "bg-gradient-gaming text-primary-foreground border-none",
      });
    } catch (e) {
      toast({
        title: "AI summarization failed",
        description: "Showing local summary instead.",
        variant: "destructive",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      toast({
        title: "Copied to clipboard! 📋",
        description: "Summary has been copied to your clipboard.",
        className: "bg-gradient-primary text-primary-foreground border-none",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleRetry = async () => {
    if (!lastAiSummary) return;
    setAiLoading(true);
    try {
      const res = await fetch(import.meta.env.VITE_PPLX_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_PPLX_API_KEY}`,
        },
        body: JSON.stringify({
          model: import.meta.env.VITE_PPLX_MODEL || "sonar-pro",
          temperature: 0.7,
          max_tokens: 400,
          messages: [
            {
              role: "user",
              content:
                "Improve the following summary further in concise bullet points.\n\n" +
                lastAiSummary,
            },
          ],
        }),
      });
      if (!res.ok) throw new Error("AI Summary retry failed");
      const data = await res.json();
      const improved = data.choices?.[0]?.message?.content || lastAiSummary;
      setSummary(improved);
      setLastAiSummary(improved);
      toast({
        title: "AI summary improved!",
        className: "bg-gradient-gaming text-primary-foreground",
      });
    } catch {
      toast({ title: "Retry failed", variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  const formatEntriesForDisplay = () => {
    return entries.map((entry) => ({
      date: format(parseISO(entry.date), "MMM dd, yyyy"),
      content: entry.content,
      tags: entry.tags,
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <DocumentTextIcon className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Work Summary</h2>
          </div>
        </div>
      </div>

      {/* Source Data */}
      <Card className="card-gaming p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Source Activities ({entries.length})
          </h3>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {formatEntriesForDisplay().map((entry, index) => (
              <div
                key={index}
                className="text-sm border-l-2 border-primary/20 pl-3 py-1"
              >
                <div className="font-medium text-primary">{entry.date}</div>
                <div className="text-foreground">{entry.content}</div>
                {entry.tags.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Tags: {entry.tags.join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Generate Summary */}
      <Card className="card-gaming p-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <DocumentTextIcon className="w-5 h-5" /> Summary Tools
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleGenerateSummary}
                  disabled={isGenerating || aiLoading || entries.length === 0}
                >
                  Generate Summary
                </Button>
                <Button
                  className="gap-1 btn-gaming"
                  onClick={handleAISummary}
                  disabled={entries.length === 0 || aiLoading}
                >
                  {aiLoading ? (
                    <SparklesIcon className="w-4 h-4 animate-spin" />
                  ) : (
                    <SparklesIcon className="w-4 h-4" />
                  )}
                  AI-Powered Summary
                </Button>
              </div>
            </div>
            <Input
              placeholder="Optional prompt for AI (e.g., 'Summarise for my stand-up')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={aiLoading}
            />
          </div>

          {summary && (
            <div className="space-y-4">
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Your generated summary will appear here..."
                className="min-h-[300px] font-mono text-sm"
              />

              <div className="flex gap-2 flex-wrap">
                {lastAiSummary && !aiLoading && (
                  <Button
                    variant="outline"
                    onClick={handleRetry}
                    className="gap-1"
                  >
                    <ArrowPathIcon className="w-4 h-4" /> Retry
                  </Button>
                )}
                <Button
                  onClick={handleCopyToClipboard}
                  variant="outline"
                  className="gap-2"
                >
                  <ClipboardDocumentIcon className="w-4 h-4" />
                  Copy to Clipboard
                </Button>
                <Button
                  onClick={() => onExportPDF(summary)}
                  variant="outline"
                  className="gap-2"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  Export as PDF
                </Button>
              </div>
            </div>
          )}

          {!summary && (
            <div className="text-center py-8 space-y-3">
              <SparklesIcon className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">
                Click "Generate Summary" to create an intelligent summary of
                your selected activities.
              </p>
              <p className="text-xs text-muted-foreground">
                Perfect for performance reviews, sprint summaries, and resume
                updates!
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SummaryGenerator;
