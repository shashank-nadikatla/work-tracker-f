import React, { useState, useMemo } from "react";
import {
  ClockIcon,
  CalendarIcon,
  FunnelIcon,
  ArrowLeftIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useActivityStore } from "@/store/useActivityStore";
import {
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

interface TimelineProps {
  onBack: () => void;
  onGenerateSummary: (entries: any[]) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  onBack,
  onGenerateSummary,
}) => {
  const { entries, getEntriesByDateRange, updateEntry, deleteEntry } =
    useActivityStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editDate, setEditDate] = useState("2025-01-01");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  // Default to the last 7 days (inclusive of today)
  const [startDate, setStartDate] = useState(
    format(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredEntries = useMemo(() => {
    const rangeEntries = getEntriesByDateRange(
      parseISO(startDate),
      parseISO(endDate)
    );

    if (selectedTags.length === 0) return rangeEntries;

    return rangeEntries.filter((entry) =>
      entry.tags.some((tag) => selectedTags.includes(tag))
    );
  }, [startDate, endDate, selectedTags, entries, getEntriesByDateRange]);

  // master list ensures every tag appears even if not yet used
  const masterTags = [
    "dev",
    "testing",
    "analysis",
    "debugging",
    "monitoring",
    "deployment",
    "learning",
    "other-tasks",
  ];
  const allTags = useMemo(() => {
    const tags = new Set<string>(masterTags);
    entries.forEach((entry) => entry.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags);
  }, [entries]);

  const quickDateRanges = [
    {
      label: "This Day",
      start: format(new Date(), "yyyy-MM-dd"),
      end: format(new Date(), "yyyy-MM-dd"),
    },
    ,
    {
      label: "Yesterday",
      start: format(
        new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        "yyyy-MM-dd"
      ),
      end: format(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    },
    {
      label: "Last 3 Days",
      start: format(
        new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        "yyyy-MM-dd"
      ),
      end: format(new Date(), "yyyy-MM-dd"),
    },
    {
      label: "Last 7 Days",
      start: format(
        new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        "yyyy-MM-dd"
      ),
      end: format(new Date(), "yyyy-MM-dd"),
    },
    {
      label: "This Month",
      start: format(startOfMonth(new Date()), "yyyy-MM-dd"),
      end: format(endOfMonth(new Date()), "yyyy-MM-dd"),
    },
    {
      label: "Last 30 Days",
      start: format(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        "yyyy-MM-dd"
      ),
      end: format(new Date(), "yyyy-MM-dd"),
    },
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const getTagColor = (tag: string) => {
    const colors = {
      dev: "bg-orange-500/10 text-orange-500 border-orange-500/30",
      development: "bg-orange-500/10 text-orange-500 border-orange-500/30",
      testing: "bg-blue-500/10 text-blue-500 border-blue-500/30",
      analysis: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
      debugging: "bg-red-500/10 text-red-500 border-red-500/30",
      deployment: "bg-green-500/10 text-green-500 border-green-500/30",
      monitoring: "bg-purple-500/10 text-purple-500 border-purple-500/30",
      learning: "bg-purple-500/10 text-purple-500 border-purple-500/30",
      "other-tasks": "bg-pink-500/10 text-pink-500 border-pink-500/30",
    };
    return (
      colors[tag.toLowerCase() as keyof typeof colors] ||
      "bg-muted/10 text-muted-foreground border-muted/20"
    );
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
            <ClockIcon className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Activity Timeline
            </h2>
          </div>
        </div>

        {filteredEntries.length > 0 && (
          <Button
            onClick={() => onGenerateSummary(filteredEntries)}
            className="gap-2 btn-gaming"
          >
            Generate Summary
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="card-gaming p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FunnelIcon className="w-5 h-5" />
            Filters
          </h3>

          {/* Quick Date Ranges */}
          <div className="flex gap-2 flex-wrap">
            {quickDateRanges.map((range) => (
              <Button
                key={range.label}
                variant="outline"
                size="sm"
                onClick={() => {
                  setStartDate(range.start);
                  setEndDate(range.end);
                }}
                className="text-xs"
              >
                {range.label}
              </Button>
            ))}
          </div>

          {/* Date Range Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                End Date
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Tag Filters */}
          {allTags.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by Tags</label>
              <div className="flex gap-2 flex-wrap">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer transition-all ${
                      selectedTags.includes(tag)
                        ? getTagColor(tag)
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Timeline Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {filteredEntries.length} Activities Found
          </h3>
          <span className="text-sm text-muted-foreground">
            {format(parseISO(startDate), "MMM dd")} -{" "}
            {format(parseISO(endDate), "MMM dd, yyyy")}
          </span>
        </div>

        {filteredEntries.length === 0 ? (
          <Card className="card-gaming p-8 text-center">
            <div className="space-y-3">
              <ClockIcon className="w-12 h-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-semibold text-muted-foreground">
                No Activities Found
              </h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your date range or tag filters to see more
                activities.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4 overflow-y-auto scrollbar-hide max-h-[520px] md:max-h-[760px] pr-1 pt-1 pb-1">
            {filteredEntries.map((entry) => {
              const isEditing = editingId === entry.id;
              return (
                <Card
                  key={entry.id}
                  className="card-gaming p-4 animate-scale-in"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="flex gap-3 items-center">
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                        />
                        <XMarkIcon
                          className="w-5 h-5 cursor-pointer text-destructive ml-auto"
                          onClick={() => setEditingId(null)}
                        />
                      </div>
                      <textarea
                        className="w-full border rounded p-2 text-sm"
                        rows={3}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                      <div className="flex gap-2 flex-wrap">
                        {allTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant={
                              editTags.includes(tag) ? "default" : "outline"
                            }
                            className={`cursor-pointer text-xs ${
                              editTags.includes(tag) ? getTagColor(tag) : ""
                            }`}
                            onClick={() =>
                              setEditTags((prev) =>
                                prev.includes(tag)
                                  ? prev.filter((t) => t !== tag)
                                  : [...prev, tag]
                              )
                            }
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            updateEntry(entry.id, {
                              content: editContent,
                              date: editDate,
                              tags: editTags,
                            });
                            setEditingId(null);
                          }}
                          className="gap-1"
                        >
                          <CheckIcon className="w-4 h-4" /> Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-primary">
                            {format(parseISO(entry.date), "EEEE, MMM dd, yyyy")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(entry.timestamp), "h:mm a")}
                          </span>
                        </div>
                        <p className="text-foreground leading-relaxed">
                          {entry.content}
                        </p>
                        {entry.tags.length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {entry.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className={`text-xs ${getTagColor(tag)}`}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <PencilSquareIcon
                          className="w-5 h-5 cursor-pointer text-muted-foreground hover:text-primary"
                          onClick={() => {
                            setEditingId(entry.id);
                            setEditContent(entry.content);
                            setEditDate(entry.date);
                            setEditTags(entry.tags);
                          }}
                        />
                        {confirmDeleteId === entry.id ? (
                          <div className="flex gap-1">
                            <CheckIcon
                              className="w-5 h-5 cursor-pointer text-destructive"
                              onClick={() => {
                                deleteEntry(entry.id);
                                setConfirmDeleteId(null);
                              }}
                            />
                            <XMarkIcon
                              className="w-5 h-5 cursor-pointer text-muted-foreground"
                              onClick={() => setConfirmDeleteId(null)}
                            />
                          </div>
                        ) : (
                          <TrashIcon
                            className="w-5 h-5 cursor-pointer text-destructive hover:text-destructive-foreground"
                            onClick={() => setConfirmDeleteId(entry.id)}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
