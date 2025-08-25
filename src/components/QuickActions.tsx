import React from "react";
import {
  ClockIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface QuickActionsProps {
  onViewTimeline: () => void;
  onGenerateSummary: () => void;
  onViewAnalytics: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onViewTimeline,
  onGenerateSummary,
  onViewAnalytics,
}) => {
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Export options available! 📄",
      description:
        "Use the Summary page to export your work as PDF or Markdown.",
      className: "bg-accent/10 border-accent text-accent-foreground",
    });
  };

  const actions = [
    {
      id: "timeline",
      title: "View Timeline",
      description: "Browse your activity history",
      icon: ClockIcon,
      onClick: onViewTimeline,
      variant: "outline" as const,
      className: "hover:bg-primary hover:border-primary",
    },
    {
      id: "summary",
      title: "Generate Summary",
      description: "Create work summaries",
      icon: DocumentTextIcon,
      onClick: onGenerateSummary,
      variant: "outline" as const,
      className: "hover:bg-primary hover:border-primary",
    },
    {
      id: "export",
      title: "Export Data",
      description: "Download as PDF/Markdown",
      icon: ArrowDownTrayIcon,
      onClick: handleExport,
      variant: "outline" as const,
      className: "hover:bg-primary hover:border-primary",
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "View insights & charts",
      icon: ChartBarIcon,
      onClick: onViewAnalytics,
      variant: "outline" as const,
      className: "hover:bg-primary hover:border-primary",
    },
  ];

  return (
    <Card className="card-gaming p-6 animate-scale-in">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-gradient-to-r from-accent to-primary rounded-full"></div>
          <h3 className="text-lg font-bold text-foreground">Quick Actions</h3>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Button
                key={action.id}
                variant={action.variant}
                onClick={action.onClick}
                className={`
                  h-auto p-4 flex flex-col items-start gap-2 
                  border-2 transition-all duration-200
                  ${action.className}
                `}
              >
                <div className="flex items-center gap-3 w-full">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div className="text-left flex-1">
                    <p className="font-semibold text-sm">{action.title}</p>
                    <p className="text-xs opacity-70 font-normal">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default QuickActions;
