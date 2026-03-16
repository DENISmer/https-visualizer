import { create } from "zustand";
import type { AnalyzeStepEvent } from "@/shared/types/analyze";

type PlaybackState = {
  queue: AnalyzeStepEvent[];
  currentStep: AnalyzeStepEvent | null;
  isPlaying: boolean;
  isProcessing: boolean;

  pushEvent: (event: AnalyzeStepEvent) => void;
  startPlayback: () => Promise<void>;
  reset: () => void;
};

export const usePlaybackStore = create<PlaybackState>((set, get) => ({
  queue: [],
  currentStep: null,
  isPlaying: false,
  isProcessing: false,

  pushEvent: (event) => {
    set((state) => ({
      queue: [...state.queue, event],
    }));
  },

  startPlayback: async () => {
    if (get().isProcessing) return;

    set({
      isPlaying: true,
      isProcessing: true,
    });

    while (get().queue.length > 0) {
      const next = get().queue[0];

      set((state) => ({
        currentStep: next,
        queue: state.queue.slice(1),
      }));

      await Promise.resolve();
    }

    set({
      isProcessing: false,
      isPlaying: false,
    });
  },

  reset: () => {
    set({
      queue: [],
      currentStep: null,
      isPlaying: false,
      isProcessing: false,
    });
  },
}));
