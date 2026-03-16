import { create } from "zustand";
import { connectAnalyzeStream } from "@/shared/api/analyze-stream";
import type { AnalyzeStepEvent } from "@/shared/types/analyze";
import { usePlaybackStore } from "@/shared/model/playback/playback.store";
import {
  ANALYZE_MODES,
  type AnalyzeMode,
} from "@/shared/constants/analyze-mode";

type AnalysisState = {
  isRunning: boolean;
  error: string | null;
  mode: AnalyzeMode;

  setMode: (mode: AnalyzeMode) => void;
  start: (url: string) => void;
  reset: () => void;
};

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  isRunning: false,
  error: null,
  mode: ANALYZE_MODES.slowed,

  setMode: (mode) => {
    set({ mode });
  },

  start: (url) => {
    const playback = usePlaybackStore.getState();
    const { mode } = get();

    playback.reset();

    set({
      isRunning: true,
      error: null,
    });

    connectAnalyzeStream(
      url,
      mode,
      (event: AnalyzeStepEvent) => {
        const playbackState = usePlaybackStore.getState();
        playbackState.pushEvent(event);
        playbackState.startPlayback();
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
    const playback = usePlaybackStore.getState();

    playback.reset();

    set({
      isRunning: false,
      error: null,
    });
  },
}));
