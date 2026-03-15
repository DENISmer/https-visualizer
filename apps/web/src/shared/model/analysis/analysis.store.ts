import { create } from "zustand";
import { connectAnalyzeStream } from "@/shared/api/analyze-stream";
import type { AnalyzeStepEvent } from "@/shared/types/analyze";

type AnalysisState = {
  steps: AnalyzeStepEvent[];
  isRunning: boolean;
  error: string | null;

  start: (url: string) => void;
  reset: () => void;
};

export const useAnalysisStore = create<AnalysisState>((set) => ({
  steps: [],
  isRunning: false,
  error: null,

  start: (url: string) => {
    set({
      steps: [],
      isRunning: true,
      error: null,
    });

    connectAnalyzeStream(
      url,

      (event) => {
        set((state) => ({
          steps: [...state.steps, event],
        }));
      },

      () => {
        set({
          isRunning: false,
        });
      },

      () => {
        set({
          isRunning: false,
          error: "Stream error",
        });
      },
    );
  },

  reset: () => {
    set({
      steps: [],
      isRunning: false,
      error: null,
    });
  },
}));
