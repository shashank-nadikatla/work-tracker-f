import React, { useState } from "react";
import {
  DocumentTextIcon,
  ArrowLeftIcon,
  SparklesIcon,
  ClipboardDocumentIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
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
      // For now, use local summary generation
      // In a real app, you could try OpenAI API first then fallback to local
      const localSummary = generateLocalSummary();
      setSummary(localSummary);

      toast({
        title: "Summary generated! ✨",
        description: "Your work summary is ready for review and export.",
        className: "bg-success/10 border-success text-success-foreground",
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

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      toast({
        title: "Copied to clipboard! 📋",
        description: "Summary has been copied to your clipboard.",
        className: "bg-accent/10 border-accent text-accent-foreground",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
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
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <SparklesIcon className="w-5 h-5" />
              AI-Powered Summary
            </h3>
            <Button
              onClick={handleGenerateSummary}
              disabled={isGenerating || entries.length === 0}
              className="gap-2 btn-gaming"
            >
              {isGenerating ? (
                <>
                  <SparklesIcon className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-4 h-4" />
                  Generate Summary
                </>
              )}
            </Button>
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
