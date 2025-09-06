import React, { useMemo } from "react";
import {
  ChartBarIcon,
  ArrowLeftIcon,
  FireIcon,
  TrophyIcon,
  CalendarIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useActivityStore } from "@/store/useActivityStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  Sector,
} from "recharts";
import {
  format,
  parseISO,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
} from "date-fns";

interface AnalyticsProps {
  onBack: () => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({ onBack }) => {
  const { entries, currentStreak, longestStreak, achievements } =
    useActivityStore();

  const analyticsData = useMemo(() => {
    // Tag distribution
    const tagCounts: Record<string, number> = {};
    entries.forEach((entry) => {
      entry.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Fixed color mapping per tag
    const tagColorMap: Record<string, string> = {
      dev: "hsl(25, 95%, 55%)", // orange
      testing: "hsl(210, 100%, 60%)", // blue
      analysis: "hsl(45, 100%, 60%)", // yellow
      debugging: "hsl(0, 80%, 60%)", // red
      monitoring: "hsl(280, 100%, 70%)", // purple
      deployment: "hsl(145, 80%, 50%)", // green
      "other-tasks": "hsl(330, 80%, 65%)", // pink
    };

    const defaultColor = "hsl(200, 10%, 60%)"; // fallback gray-blue

    const tagData = Object.entries(tagCounts)
      .map(([tag, count]) => {
        const key = tag.toLowerCase();
        return {
          name: tag,
          value: count,
          color: tagColorMap[key] || defaultColor,
        };
      })
      .sort((a, b) => (b.value - a.value) || a.name.localeCompare(b.name));

    // Weekly activity
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const weeklyData = weekDays.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayEntries = entries.filter((entry) => entry.date === dayStr);
      return {
        day: format(day, "EEE"),
        activities: dayEntries.length,
        date: dayStr,
      };
    });

    // Monthly trend (last 30 days)
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date;
    });

    const monthlyData = last30Days.map((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const dayEntries = entries.filter((entry) => entry.date === dateStr);
      return {
        date: format(date, "MMM dd"),
        activities: dayEntries.length,
        fullDate: dateStr,
      };
    });

    // Productivity stats
    const totalActivities = entries.length;
    const uniqueDays = new Set(entries.map((entry) => entry.date)).size;
    const avgPerDay =
      uniqueDays > 0 ? (totalActivities / uniqueDays).toFixed(1) : "0";
    const unlockedAchievements = achievements.filter(
      (a) => a.unlockedAt
    ).length;

    return {
      tagData,
      weeklyData,
      monthlyData,
      stats: {
        totalActivities,
        uniqueDays,
        avgPerDay,
        currentStreak,
        longestStreak,
        unlockedAchievements,
        totalAchievements: achievements.length,
      },
    };
  }, [entries, currentStreak, longestStreak, achievements]);

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    color = "primary",
  }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: "primary" | "success" | "accent";
  }) => {
    const colorClass = {
      primary: "text-primary",
      success: "text-success",
      accent: "text-accent",
    }[color];

    return (
      <Card className="card-gaming p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <Icon className={`w-8 h-8 ${colorClass}`} />
        </div>
      </Card>
    );
  };

  const [activeTagIndex, setActiveTagIndex] = React.useState<number | null>(
    null
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <ChartBarIcon className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            Analytics Dashboard
          </h2>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={CalendarIcon}
          title="Total Activities"
          value={analyticsData.stats.totalActivities}
          subtitle="All time"
        />
        <StatCard
          icon={FireIcon}
          title="Current Streak"
          value={`${analyticsData.stats.currentStreak} days`}
          color="success"
        />
        <StatCard
          icon={TrophyIcon}
          title="Achievements"
          value={`${analyticsData.stats.unlockedAchievements}/${analyticsData.stats.totalAchievements}`}
          subtitle="Unlocked"
          color="accent"
        />
        <StatCard
          icon={ChartBarIcon}
          title="Daily Average"
          value={analyticsData.stats.avgPerDay}
          subtitle="Activities per day"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card className="card-gaming p-6 h-[360px] flex flex-col">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">This Week's Activity</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="day"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--card-foreground))",
                    }}
                  />
                  <Bar
                    dataKey="activities"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Tag Distribution */}
        <Card className="card-gaming p-6 ">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TagIcon className="w-5 h-5" />
              Activity Types
            </h3>
            <div className="h-48">
              {analyticsData.tagData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.tagData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      // @ts-ignore property exists in runtime types
                      activeIndex={activeTagIndex ?? -1}
                      activeShape={(props: any) => (
                        <Sector {...props} innerRadius={40} outerRadius={90} />
                      )}
                      onClick={(_, index) =>
                        setActiveTagIndex(
                          index === activeTagIndex ? null : index
                        )
                      }
                      stroke="none"
                    >
                      {analyticsData.tagData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--card-foreground))",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center space-y-2">
                    <TagIcon className="w-12 h-12 mx-auto opacity-50" />
                    <p>No activity data available</p>
                  </div>
                </div>
              )}
            </div>
            {analyticsData.tagData.length > 0 && (
              <div className="space-y-2">
                {analyticsData.tagData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="capitalize">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* 30-Day Trend */}
        <Card className="card-gaming p-6 lg:col-span-2">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">30-Day Activity Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="date"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--card-foreground))",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="activities"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>

      {/* Achievement Progress */}
      <Card className="card-gaming p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrophyIcon className="w-5 h-5" />
            Achievement Progress
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto scrollbar-hide max-h-[420px] md:max-h-[500px] pr-1 pt-1">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border transition-all ${
                  achievement.unlockedAt
                    ? "bg-success/10 border-success/30 text-orange-500"
                    : "bg-muted/30 border-muted text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">
                      {achievement.title}
                    </h4>
                    <p className="text-xs opacity-80">
                      {achievement.description}
                    </p>
                    {achievement.unlockedAt && (
                      <p className="text-xs opacity-60 mt-1">
                        Unlocked{" "}
                        {format(
                          new Date(achievement.unlockedAt),
                          "MMM dd, yyyy"
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;