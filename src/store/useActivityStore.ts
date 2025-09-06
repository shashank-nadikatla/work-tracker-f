import { create } from "zustand";
import { persist } from "zustand/middleware";
import { format, startOfDay, differenceInDays, startOfWeek } from "date-fns";
import {
  upsertEntry,
  deleteEntry as deleteEntryApi,
  fetchEntries,
} from "@/api/entries";
import { toast } from "@/hooks/use-toast";

export interface ActivityEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  content: string;
  tags: string[];
  timestamp: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

interface ActivityState {
  entries: ActivityEntry[];
  achievements: Achievement[];
  currentStreak: number;
  longestStreak: number;

  // Actions
  addEntry: (content: string, tags: string[], date?: Date) => void;
  updateEntry: (id: string, updates: Partial<ActivityEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntriesByDateRange: (startDate: Date, endDate: Date) => ActivityEntry[];
  calculateStreak: () => void;
  unlockAchievement: (achievementId: string) => void;
  loadEntries: () => Promise<void>;
  recalculateAchievements: () => void;
}

const defaultAchievements: Achievement[] = [
  {
    id: "first-entry",
    title: "First Step",
    description: "Logged your first activity",
    icon: "🥇",
  },
  {
    id: "week-streak",
    title: "Week Warrior",
    description: "Maintained a 7-day streak",
    icon: "🔥",
  },
  {
    id: "month-streak",
    title: "Monthly Master",
    description: "Maintained a 30-day streak",
    icon: "🗓️",
  },
  {
    id: "coding-focus",
    title: "Code Ninja",
    description: "Logged 10 development activities",
    icon: "💻",
  },
  {
    id: "testing-pro",
    title: "Bug Hunter",
    description: "Logged 10 testing activities",
    icon: "🔬",
  },
  {
    id: "productive-week",
    title: "Productivity Beast",
    description: "Logged 20+ activities in a week",
    icon: "⚡",
  },
  {
    id: "diverse-learner",
    title: "Renaissance Dev",
    description: "Used all activity types",
    icon: "🌐",
  },
  {
    id: "consistent-logger",
    title: "Habit Master",
    description: "Logged activity 50 days total",
    icon: "📈",
  },
  {
    id: "bug-squasher",
    title: "Bug Squasher",
    description: "25 debugging activities",
    icon: "🛠️",
  },
  {
    id: "analyst",
    title: "Insight Seeker",
    description: "25 analysis activities",
    icon: "🔍",
  },
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Logged before 08:00 AM 10 times",
    icon: "🌅",
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Logged after 10:00 PM 10 times",
    icon: "🦉",
  },
  {
    id: "starter-10",
    title: "Getting Warmed Up",
    description: "Logged 10 total activities",
    icon: "💪",
  },
  {
    id: "prolific-50",
    title: "On a Roll",
    description: "Logged 50 total activities",
    icon: "🚴‍♂️",
  },
  {
    id: "century-100",
    title: "Century Club",
    description: "Logged 100 total activities",
    icon: "🏆",
  },
  {
    id: "two-week-streak",
    title: "Two-Week Streak",
    description: "Maintained a 14-day streak",
    icon: "📆",
  },
  {
    id: "hundred-streak",
    title: "100-Day Legend",
    description: "Maintained a 100-day streak",
    icon: "💯",
  },
];

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      entries: [],
      achievements: defaultAchievements,
      currentStreak: 0,
      longestStreak: 0,

      addEntry: (content: string, tags: string[], date = new Date()) => {
        const newEntry: ActivityEntry = {
          id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          date: format(startOfDay(date), "yyyy-MM-dd"),
          content: content.trim(),
          tags,
          timestamp: Date.now(),
        };

        set((state) => ({ ...state, entries: [...state.entries, newEntry] }));
        // sync with backend (fire and forget)
        upsertEntry(newEntry)
          .then(() => console.log("Activity saved"))
          .catch(() =>
            toast({
              title: "Save failed",
              description: "Couldn't save the new activity to the server.",
              variant: "destructive",
              
            })
          );
        // Update computed stats and achievements immediately
        get().calculateStreak();
        get().recalculateAchievements();
      },

      updateEntry: (id: string, updates: Partial<ActivityEntry>) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry
          ),
        }));
        const entry = get().entries.find((e) => e.id === id);
        if (entry)
          upsertEntry({ ...entry, ...updates })
            .then(() =>
              toast({
                title: "Updated",
                description: "Changes added to the server.",
                className:
                  "bg-gradient-primary text-primary-foreground border-none",
              })
            )
            .catch(() =>
              toast({
                title: "Save failed",
                description: "Couldn't save changes to the server. Try again.",
                variant: "destructive",
                
              })
            );
        // Update computed stats and achievements immediately
        get().calculateStreak();
        get().recalculateAchievements();
      },

      deleteEntry: (id: string) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }));
        deleteEntryApi(id)
          .then(() =>
            toast({
              title: "Deleted",
              description: "Activity removed from the server.",
              className:
                "bg-gradient-primary text-primary-foreground border-none",
            })
          )
          .catch(() =>
            toast({
              title: "Delete failed",
              description: "Couldn't delete entry on the server.",
              variant: "destructive",
             
            })
          );
        // Update computed stats and achievements immediately
        get().calculateStreak();
        get().recalculateAchievements();
      },

      getEntriesByDateRange: (startDate: Date, endDate: Date) => {
        const state = get();
        const startDateStr = format(startOfDay(startDate), "yyyy-MM-dd");
        const endDateStr = format(startOfDay(endDate), "yyyy-MM-dd");

        return state.entries
          .filter(
            (entry) => entry.date >= startDateStr && entry.date <= endDateStr
          )
          .sort((a, b) => b.timestamp - a.timestamp);
      },

      calculateStreak: () => {
        const state = get();
        const entries = state.entries;

        if (entries.length === 0) {
          set({ currentStreak: 0 });
          return;
        }

        // Unique entry dates, most-recent first
        const uniqueDates = Array.from(
          new Set(entries.map((e) => e.date))
        ).sort((a, b) => b.localeCompare(a));

        // ----- current streak (today/yesterday/etc.) -----
        let currentStreak = 0;
        let lastDateStr = format(startOfDay(new Date()), "yyyy-MM-dd");

        for (const dateStr of uniqueDates) {
          const diff = differenceInDays(
            new Date(lastDateStr),
            new Date(dateStr)
          );
          if (diff === 0 || diff === 1) {
            currentStreak++;
            lastDateStr = dateStr; // continue chain
          } else {
            break;
          }
        }

        // ----- longest streak overall -----
        let longestStreak = 1;
        let tempStreak = 1;
        for (let i = 1; i < uniqueDates.length; i++) {
          const prev = new Date(uniqueDates[i - 1]);
          const curr = new Date(uniqueDates[i]);
          if (differenceInDays(prev, curr) === 1) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
          } else {
            tempStreak = 1;
          }
        }

        set({ currentStreak, longestStreak });
      },

      unlockAchievement: (achievementId: string) => {
        set((state) => ({
          achievements: state.achievements.map((achievement) =>
            achievement.id === achievementId
              ? { ...achievement, unlockedAt: Date.now() }
              : achievement
          ),
        }));
      },

      recalculateAchievements: () => {
        const state = get();
        const { entries } = state;

        // Sort entries ascending by timestamp for historical computation
        const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp);
        const unlockedAtById = new Map<string, number>();

        if (sorted.length > 0) {
          // first-entry: timestamp of first ever entry
          unlockedAtById.set("first-entry", sorted[0].timestamp);
        }

        // Cumulative counters and helpers
        let totalCount = 0;
        let devCount = 0;
        let testingCount = 0;
        let debuggingCount = 0;
        let analysisCount = 0;
        let earlyCount = 0;
        let nightCount = 0;

        const requiredTags = [
          "dev",
          "testing",
          "analysis",
          "debugging",
          "learning",
          "work-items",
          "deployment",
        ];
        const seenTags = new Set<string>();

        // For consistent-logger (unique days)
        const seenDays = new Set<string>();

        // For productive-week (20+ in a week)
        const weekBuckets = new Map<string, { count: number; timestamps: number[] }>();

        // Walk through entries in chronological order
        for (const entry of sorted) {
          totalCount += 1;

          // total milestones
          if (totalCount === 10) unlockedAtById.set("starter-10", entry.timestamp);
          if (totalCount === 50) unlockedAtById.set("prolific-50", entry.timestamp);
          if (totalCount === 100) unlockedAtById.set("century-100", entry.timestamp);

          // per-tag counters
          if (entry.tags.includes("dev")) {
            devCount += 1;
            if (devCount === 10) unlockedAtById.set("coding-focus", entry.timestamp);
          }
          if (entry.tags.includes("testing")) {
            testingCount += 1;
            if (testingCount === 10) unlockedAtById.set("testing-pro", entry.timestamp);
          }
          if (entry.tags.includes("debugging")) {
            debuggingCount += 1;
            if (debuggingCount === 25) unlockedAtById.set("bug-squasher", entry.timestamp);
          }
          if (entry.tags.includes("analysis")) {
            analysisCount += 1;
            if (analysisCount === 25) unlockedAtById.set("analyst", entry.timestamp);
          }

          // time-of-day
          const hour = new Date(entry.timestamp).getHours();
          if (hour < 8) {
            earlyCount += 1;
            if (earlyCount === 10) unlockedAtById.set("early-bird", entry.timestamp);
          }
          if (hour >= 22) {
            nightCount += 1;
            if (nightCount === 10) unlockedAtById.set("night-owl", entry.timestamp);
          }

          // diverse-learner: accumulate required tags
          for (const tag of entry.tags) {
            if (requiredTags.includes(tag)) {
              seenTags.add(tag);
            }
          }
          if (
            requiredTags.every((t) => seenTags.has(t)) &&
            !unlockedAtById.has("diverse-learner")
          ) {
            unlockedAtById.set("diverse-learner", entry.timestamp);
          }

          // unique days for consistent-logger
          if (!seenDays.has(entry.date)) {
            seenDays.add(entry.date);
            if (seenDays.size === 50) {
              unlockedAtById.set("consistent-logger", entry.timestamp);
            }
          }

          // productive-week: bucket by startOfWeek
          const weekKey = format(startOfWeek(new Date(entry.date)), "yyyy-MM-dd");
          const bucket = weekBuckets.get(weekKey) || { count: 0, timestamps: [] };
          bucket.count += 1;
          bucket.timestamps.push(entry.timestamp);
          weekBuckets.set(weekKey, bucket);
        }

        // find earliest week reaching 20 entries
        for (const [, bucket] of weekBuckets) {
          if (bucket.count >= 20) {
            // use timestamp of the 20th entry in that week
            const sortedTs = bucket.timestamps.sort((a, b) => a - b);
            unlockedAtById.set("productive-week", sortedTs[19]);
            break;
          }
        }

        // Streak-based achievements: use current streak chain to compute historical timestamp
        const entriesByDateDesc = Array.from(new Set(sorted.map((e) => e.date))).sort(
          (a, b) => b.localeCompare(a)
        );
        let chain: string[] = [];
        let lastDateStr = format(startOfDay(new Date()), "yyyy-MM-dd");
        for (const dateStr of entriesByDateDesc) {
          const diff = differenceInDays(new Date(lastDateStr), new Date(dateStr));
          if (diff === 0 || diff === 1) {
            chain.push(dateStr);
            lastDateStr = dateStr;
          } else {
            break;
          }
        }
        const setUnlockAtForStreak = (id: string, threshold: number) => {
          if (chain.length >= threshold) {
            const thresholdDate = chain[threshold - 1]; // the day when threshold was first reached
            const ts = sorted.find((e) => e.date === thresholdDate)?.timestamp;
            if (ts) unlockedAtById.set(id, ts);
          }
        };
        setUnlockAtForStreak("week-streak", 7);
        setUnlockAtForStreak("two-week-streak", 14);
        setUnlockAtForStreak("month-streak", 30);
        setUnlockAtForStreak("hundred-streak", 100);

        // Build final list from defaults using computed unlockedAt
        const updated = defaultAchievements.map((def) => ({
          ...def,
          unlockedAt: unlockedAtById.get(def.id),
        }));

        set({ achievements: updated });
      },

      loadEntries: async () => {
        try {
          const entries = await fetchEntries();
          set((state) => ({ ...state, entries }));
          get().calculateStreak();
          get().recalculateAchievements();
        } catch (e) {
          console.error("Failed to load entries", e);
          toast({
            title: "Load failed",
            description: "Couldn't fetch activities from the server.",
            variant: "destructive",
          });
        }
      },
    }),
    {
      name: "work-tracker-storage",
      version: 3,
      partialize: (state) => ({ entries: state.entries }),
      migrate: (persisted: any) => {
        if (!persisted) return persisted;
        return { entries: persisted.entries || [] };
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Failed to rehydrate activity store", error);
          return;
        }
        try {
          state?.calculateStreak();
          state?.recalculateAchievements();
        } catch (e) {
          console.error("Post-hydration recompute failed", e);
        }
      },
    }
  )
);
