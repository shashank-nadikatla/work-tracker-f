import { create } from "zustand";
import { persist } from "zustand/middleware";
import { format, startOfDay, differenceInDays } from "date-fns";
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
    icon: "🚀",
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
    icon: "👑",
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
    icon: "🐛",
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
    icon: "🎭",
  },
  {
    id: "marathon-coder",
    title: "Marathon Coder",
    description: "Logged 100 total activities",
    icon: "🏃‍♂️",
  },
  {
    id: "consistent-logger",
    title: "Habit Master",
    description: "Logged activity 50 days total",
    icon: "📅",
  },
  {
    id: "bug-squasher",
    title: "Bug Squasher",
    description: "25 debugging activities",
    icon: "🐞",
  },
  {
    id: "analyst",
    title: "Insight Seeker",
    description: "25 analysis activities",
    icon: "🔎",
  },
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Logged before 08:00 AM 10 times",
    icon: "☀️",
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Logged after 10:00 PM 10 times",
    icon: "🌙",
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

        set((state) => {
          const updatedEntries = [...state.entries, newEntry];
          const newState = { ...state, entries: updatedEntries };

          // Check for achievements
          if (state.entries.length === 0) {
            newState.achievements = state.achievements.map((a) =>
              a.id === "first-entry" ? { ...a, unlockedAt: Date.now() } : a
            );
          }

          // Tag-based achievements
          const debugCount = updatedEntries.filter((e) =>
            e.tags.includes("debugging")
          ).length;
          if (
            debugCount >= 25 &&
            !state.achievements.find((a) => a.id === "bug-squasher")?.unlockedAt
          ) {
            newState.achievements = state.achievements.map((a) =>
              a.id === "bug-squasher" ? { ...a, unlockedAt: Date.now() } : a
            );
          }
          const analysisCount = updatedEntries.filter((e) =>
            e.tags.includes("analysis")
          ).length;
          if (
            analysisCount >= 25 &&
            !state.achievements.find((a) => a.id === "analyst")?.unlockedAt
          ) {
            newState.achievements = state.achievements.map((a) =>
              a.id === "analyst" ? { ...a, unlockedAt: Date.now() } : a
            );
          }
          // time-of-day achievements
          const entryHour = new Date(newEntry.timestamp).getHours();
          if (entryHour < 8) {
            const earlyCount = updatedEntries.filter(
              (e) => new Date(e.timestamp).getHours() < 8
            ).length;
            if (
              earlyCount >= 10 &&
              !state.achievements.find((a) => a.id === "early-bird")?.unlockedAt
            ) {
              newState.achievements = state.achievements.map((a) =>
                a.id === "early-bird" ? { ...a, unlockedAt: Date.now() } : a
              );
            }
          }
          if (entryHour >= 22) {
            const nightCount = updatedEntries.filter(
              (e) => new Date(e.timestamp).getHours() >= 22
            ).length;
            if (
              nightCount >= 10 &&
              !state.achievements.find((a) => a.id === "night-owl")?.unlockedAt
            ) {
              newState.achievements = state.achievements.map((a) =>
                a.id === "night-owl" ? { ...a, unlockedAt: Date.now() } : a
              );
            }
          }

          return newState;
        });
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
        // Recalculate streak after adding entry
        get().calculateStreak();
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
        get().calculateStreak();
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

        set((state) => {
          const newState = { ...state, currentStreak, longestStreak };

          // Check streak achievements
          if (
            currentStreak >= 7 &&
            !state.achievements.find((a) => a.id === "week-streak")?.unlockedAt
          ) {
            newState.achievements = state.achievements.map((a) =>
              a.id === "week-streak" ? { ...a, unlockedAt: Date.now() } : a
            );
          }

          if (
            currentStreak >= 30 &&
            !state.achievements.find((a) => a.id === "month-streak")?.unlockedAt
          ) {
            newState.achievements = state.achievements.map((a) =>
              a.id === "month-streak" ? { ...a, unlockedAt: Date.now() } : a
            );
          }

          if (
            entries.length >= 10 &&
            !state.achievements.find((a) => a.id === "starter-10")?.unlockedAt
          ) {
            newState.achievements = state.achievements.map((a) =>
              a.id === "starter-10" ? { ...a, unlockedAt: Date.now() } : a
            );
          }
          if (
            entries.length >= 50 &&
            !state.achievements.find((a) => a.id === "prolific-50")?.unlockedAt
          ) {
            newState.achievements = state.achievements.map((a) =>
              a.id === "prolific-50" ? { ...a, unlockedAt: Date.now() } : a
            );
          }
          if (
            entries.length >= 100 &&
            !state.achievements.find((a) => a.id === "century-100")?.unlockedAt
          ) {
            newState.achievements = state.achievements.map((a) =>
              a.id === "century-100" ? { ...a, unlockedAt: Date.now() } : a
            );
          }
          if (
            currentStreak >= 14 &&
            !state.achievements.find((a) => a.id === "two-week-streak")
              ?.unlockedAt
          ) {
            newState.achievements = state.achievements.map((a) =>
              a.id === "two-week-streak" ? { ...a, unlockedAt: Date.now() } : a
            );
          }
          if (
            currentStreak >= 100 &&
            !state.achievements.find((a) => a.id === "hundred-streak")
              ?.unlockedAt
          ) {
            newState.achievements = state.achievements.map((a) =>
              a.id === "hundred-streak" ? { ...a, unlockedAt: Date.now() } : a
            );
          }

          return newState;
        });
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
        let updated = [...state.achievements];

        const unlock = (id: string) => {
          updated = updated.map((a) =>
            a.id === id && !a.unlockedAt ? { ...a, unlockedAt: Date.now() } : a
          );
        };

        if (entries.length > 0) unlock("first-entry");

        const debugCount = entries.filter((e) =>
          e.tags.includes("debugging")
        ).length;
        if (debugCount >= 25) unlock("bug-squasher");

        const analysisCount = entries.filter((e) =>
          e.tags.includes("analysis")
        ).length;
        if (analysisCount >= 25) unlock("analyst");

        const earlyCount = entries.filter(
          (e) => new Date(e.timestamp).getHours() < 8
        ).length;
        if (earlyCount >= 10) unlock("early-bird");

        const nightCount = entries.filter(
          (e) => new Date(e.timestamp).getHours() >= 22
        ).length;
        if (nightCount >= 10) unlock("night-owl");

        if (entries.length >= 10) unlock("starter-10");
        if (entries.length >= 50) unlock("prolific-50");
        if (entries.length >= 100) unlock("century-100");

        const streakInfo = get();
        if (streakInfo.currentStreak >= 14) unlock("two-week-streak");
        if (streakInfo.currentStreak >= 100) unlock("hundred-streak");

        // Rebuild list from default definitions so any icon/text updates propagate,
        // while preserving unlockedAt status from current state.
        const unlockedMap = new Map<string, number | undefined>(
          updated.map((a) => [a.id, a.unlockedAt])
        );
        updated = defaultAchievements.map((def) => ({
          ...def,
          unlockedAt: unlockedMap.get(def.id),
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
      name: "dev-diary-quest-storage",
      version: 2,
      migrate: (persisted: any, version: number) => {
        // when upgrading from v1 -> v2 ensure new achievements exist
        if (version === 1 && persisted) {
          const existingIds = new Set(
            persisted.achievements?.map((a: any) => a.id) || []
          );
          const merged = [
            ...(persisted.achievements || []),
            ...defaultAchievements.filter((a) => !existingIds.has(a.id)),
          ];
          return { ...persisted, achievements: merged };
        }
        return persisted;
      },
    }
  )
);
