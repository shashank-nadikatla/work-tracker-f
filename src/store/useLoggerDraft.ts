import { create } from "zustand";
import { persist } from "zustand/middleware";
import { format, startOfDay } from "date-fns";

interface DraftState {
  content: string;
  date: string; // yyyy-MM-dd
  tags: string[];
  setContent: (c: string) => void;
  setDate: (d: string) => void;
  toggleTag: (t: string) => void;
  clear: () => void;
}

export const useLoggerDraft = create<DraftState>()(
  persist(
    (set, get) => ({
      content: "",
      date: format(startOfDay(new Date()), "yyyy-MM-dd"),
      tags: [],
      setContent: (c) => set({ content: c }),
      setDate: (d) => set({ date: d }),
      toggleTag: (t) => {
        const tags = get().tags;
        set({
          tags: tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t],
        });
      },
      clear: () =>
        set({
          content: "",
          date: format(startOfDay(new Date()), "yyyy-MM-dd"),
          tags: [],
        }),
    }),
    { name: "logger-draft" }
  )
);
