import React, { useEffect } from "react";
import { FireIcon, TrophyIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useActivityStore } from "@/store/useActivityStore";
import { format, startOfDay } from "date-fns";

export const StreakTracker: React.FC = () => {
  const {
    currentStreak,
    longestStreak,
    achievements,
    calculateStreak,
    entries,
  } = useActivityStore();

  useEffect(() => {
    calculateStreak();
  }, [calculateStreak]);

  const unlockedAchievements = achievements.filter((a) => a.unlockedAt);
  const nextMilestone =
    currentStreak < 7
      ? 7
      : currentStreak < 30
      ? 30
      : currentStreak < 100
      ? 100
      : 365;
  const progressToNext = Math.min((currentStreak / nextMilestone) * 100, 100);

  const todayStr = format(startOfDay(new Date()), "yyyy-MM-dd");
  const hasEntryToday = entries.some((e) => e.date === todayStr);

  const getStreakMessage = () => {
    if (currentStreak === 0) return "Start your journey today! 🚀";
    if (currentStreak === 1) return "Great start! Keep it going! 💪";
    if (currentStreak < 7)
      return `${currentStreak} days strong! Almost at a week! 🔥`;
    if (currentStreak < 30)
      return `${currentStreak} days! You're on fire! 🔥🔥`;
    if (currentStreak < 100)
      return `${currentStreak} days! Absolute legend! 👑`;
    return `${currentStreak} days! You're unstoppable! 🌟`;
  };

  const getStreakColor = () => {
    if (currentStreak === 0) return "text-muted-foreground";
    if (currentStreak < 7) return "text-primary";
    if (currentStreak < 30) return "text-orange-500";
    return "text-success";
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Main Streak Card */}
      <Card className="card-gaming p-6 animate-scale-in">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <FireIcon className={`w-8 h-8 ${getStreakColor()}`} />
              {currentStreak > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Current Streak
              </h3>
              <p className="text-sm text-muted-foreground">Days in a row</p>
            </div>
          </div>

          {/* Reminder to log today */}
          {!hasEntryToday && currentStreak > 0 && (
            <p className="text-sm text-orange-500 text-center">
              Log an activity today to keep the streak!
            </p>
          )}

          {/* Streak Counter */}
          <div className="text-center py-4">
            <div
              className={`text-6xl font-bold ${getStreakColor()} glow-primary`}
            >
              {currentStreak}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {getStreakMessage()}
            </p>
          </div>

          {/* Progress to Next Milestone */}
          {currentStreak < nextMilestone && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Progress to {nextMilestone} days
                </span>
                <span className="text-primary font-medium">
                  {currentStreak}/{nextMilestone}
                </span>
              </div>
              <Progress value={progressToNext} className="h-2" />
            </div>
          )}
        </div>
      </Card>

      {/* Stats & Achievements Card */}
      <Card className="card-gaming p-6 animate-scale-in">
        <div className="space-y-4">
          {/* Stats Header */}
          <div className="flex items-center gap-3">
            <TrophyIcon className="w-6 h-6 text-accent" />
            <h3 className="text-lg font-bold text-foreground">
              Stats & Achievements
            </h3>
          </div>

          {/* Personal Best */}
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Personal Best</p>
              <p className="text-2xl font-bold text-accent">{longestStreak}</p>
            </div>
            <SparklesIcon className="w-8 h-8 text-accent" />
          </div>

          {/* Recent Achievements */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              Recent Achievements
            </p>
            {unlockedAchievements.length > 0 ? (
              <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-hide">
                {unlockedAchievements
                  .sort((a, b) => (b.unlockedAt || 0) - (a.unlockedAt || 0))
                  .slice(0, 3)
                  .map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-3 p-2 bg-success/10 border border-success/20 rounded-lg animate-bounce-in"
                    >
                      <span className="text-lg">{achievement.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {achievement.title}
                        </p>
                        <p className="text-xs text-orange-500 truncate">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Complete activities to unlock achievements! 🏆
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StreakTracker;
