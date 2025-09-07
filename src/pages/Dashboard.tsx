import React, { useState, useEffect } from "react";
import GameHeader from "@/components/GameHeader";
import ActivityLogger from "@/components/ActivityLogger";
import StreakTracker from "@/components/StreakTracker";
import QuickActions from "@/components/QuickActions";
import Timeline from "@/components/Timeline";
import SummaryGenerator from "@/components/SummaryGenerator";
import Analytics from "@/components/Analytics";
import { useToast } from "@/hooks/use-toast";
import { useActivityStore, ActivityEntry } from "@/store/useActivityStore";
import { exportToPDF, exportToMarkdown } from "@/utils/exportUtils";

export const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "timeline" | "summary" | "analytics"
  >("dashboard");
  const [summaryEntries, setSummaryEntries] = useState<ActivityEntry[]>([]);
  const { toast } = useToast();
  const { entries, loadEntries } = useActivityStore();

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleViewTimeline = () => {
    setCurrentView("timeline");
  };

  const handleGenerateSummary = (entries?: ActivityEntry[]) => {
    setSummaryEntries(entries || []);
    setCurrentView("summary");
  };

  const handleViewAnalytics = () => {
    setCurrentView("analytics");
  };

  const handleExportPDF = (summary: string) => {
    exportToPDF(summary, summaryEntries);
    toast({
      title: "PDF exported! 📄",
      description: "Your summary has been downloaded as a PDF file.",
      className: "bg-success/10 border-success text-success-foreground",
    });
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSummaryEntries([]);
  };

  // Render different views based on current state
  if (currentView === "timeline") {
    return (
      <div className="min-h-screen bg-background">
        <GameHeader />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <Timeline
            onBack={handleBackToDashboard}
            onGenerateSummary={handleGenerateSummary}
          />
        </main>
      </div>
    );
  }

  if (currentView === "summary") {
    return (
      <div className="min-h-screen bg-background">
        <GameHeader />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <SummaryGenerator
            entries={summaryEntries}
            onBack={handleBackToDashboard}
            onExportPDF={handleExportPDF}
          />
        </main>
      </div>
    );
  }

  if (currentView === "analytics") {
    return (
      <div className="min-h-screen bg-background">
        <GameHeader />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <Analytics onBack={handleBackToDashboard} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GameHeader />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="stack-responsive">
          {/* Welcome Section */}
          <div className="text-center space-y-2 animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground">
              Welcome back, Engineer! 👋
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Track your daily coding journey, build amazing streaks, and level
              up your productivity with gamified work logging.
            </p>
          </div>

          {/* Streak Tracker */}
          <StreakTracker />

          {/* Main Content Grid */}
          <div className="grid grid-responsive lg:grid-cols-2">
            {/* Activity Logger */}
            <div className="stack-responsive">
              <ActivityLogger />
            </div>

            {/* Quick Actions & Progress */}
            <div className="stack-responsive">
              <QuickActions
                onViewTimeline={handleViewTimeline}
                onGenerateSummary={() => handleGenerateSummary(entries)}
                onViewAnalytics={handleViewAnalytics}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
