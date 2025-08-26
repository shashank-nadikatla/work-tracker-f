import React from "react";
import { format, startOfDay } from "date-fns";
import {
  CheckIcon,
  CodeBracketIcon,
  BeakerIcon,
  UsersIcon,
  BookOpenIcon,
  MagnifyingGlassIcon,
  WrenchIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/solid";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useActivityStore } from "@/store/useActivityStore";
import { useLoggerDraft } from "@/store/useLoggerDraft";
import { useToast } from "@/hooks/use-toast";

const activityTags = [
  {
    id: "dev",
    label: "Development",
    icon: CodeBracketIcon,
    color: "text-blue-500",
  },
  {
    id: "testing",
    label: "Testing",
    icon: BeakerIcon,
    color: "text-green-500",
  },
  {
    id: "analysis",
    label: "Analysis",
    icon: MagnifyingGlassIcon,
    color: "text-indigo-500",
  },
  {
    id: "debugging",
    label: "Debugging",
    icon: WrenchIcon,
    color: "text-red-500",
  },
  {
    id: "learning",
    label: "Learning",
    icon: BookOpenIcon,
    color: "text-yellow-500",
  },
  {
    id: "work-items",
    label: "Work Items",
    icon: UsersIcon,
    color: "text-teal-500",
  },
  {
    id: "deployment",
    label: "Deployment",
    icon: RocketLaunchIcon,
    color: "text-cyan-500",
  },
];

export const ActivityLogger: React.FC = () => {
  const draft = useLoggerDraft();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { addEntry } = useActivityStore();
  const { toast } = useToast();

  React.useEffect(() => {
    if (
      !draft.content &&
      draft.date !== format(startOfDay(new Date()), "yyyy-MM-dd")
    ) {
      draft.setDate(format(startOfDay(new Date()), "yyyy-MM-dd"));
    }
  }, []);

  // tag toggle now handled in draft.toggleTag

  const handleSubmit = async () => {
    if (!draft.content.trim()) {
      toast({
        title: "Please add some activity details",
        description: "Your work log can't be empty!",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      addEntry(draft.content, draft.tags, new Date(draft.date));

      // Success animation and reset
      draft.clear();

      toast({
        title: "Activity logged! 🎉",
        description: "Great work! Keep building that streak.",
        className: "bg-gradient-primary text-primary-foreground border-none",
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Failed to save your activity. Please try again.",
        className:
          "bg-destructive/10 text-destructive-foreground border-destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="card-gaming p-6 animate-scale-in">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-gradient-primary rounded-full glow-primary"></div>
          <h2 className="text-xl font-bold text-foreground">
            Daily Activity Log
          </h2>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <CalendarIcon className="w-4 h-4" />
          <label htmlFor="log-date">Logging for:</label>
          <input
            id="log-date"
            type="date"
            value={draft.date}
            onChange={(e) => draft.setDate(e.target.value)}
            className="border rounded px-2 py-1 bg-background text-foreground focus:outline-primary"
          />
          <span className="ml-2">
            {format(new Date(draft.date), "EEEE, MMMM d, yyyy")}
          </span>
        </div>

        {/* Activity Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            What did you work on today?
          </label>
          <Textarea
            value={draft.content}
            onChange={(e) => draft.setContent(e.target.value)}
            placeholder="e.g., Implemented user authentication, fixed critical bugs in payment system, attended sprint planning..."
            className="min-h-[120px] resize-none border-2 focus:border-primary transition-colors"
            disabled={isSubmitting}
          />
        </div>

        {/* Tag Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Tags</label>
          <div className="flex flex-wrap gap-2">
            {activityTags.map((tag) => {
              const Icon = tag.icon;
              const isSelected = draft.tags.includes(tag.id);

              return (
                <button
                  key={tag.id}
                  onClick={() => draft.toggleTag(tag.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-200
                    ${
                      isSelected
                        ? "bg-primary/10 border-primary text-primary font-medium glow-primary"
                        : "border-border hover:border-primary/50 hover:bg-primary/5"
                    }
                  `}
                  disabled={isSubmitting}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isSelected ? "text-primary" : tag.color
                    }`}
                  />
                  <span className="text-sm">{tag.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !draft.content.trim()}
          className="w-full text-lg py-6 font-semibold"
          variant="gaming"
        >
          <CheckIcon className="w-5 h-5 mr-2" />
          {isSubmitting ? "Saving..." : "Log Activity"}
        </Button>
      </div>
    </Card>
  );
};

export default ActivityLogger;
