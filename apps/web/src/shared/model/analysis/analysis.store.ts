import { create } from "zustand";
import { connectAnalyzeStream } from "@/shared/api/analyze-stream";
import type { AnalyzeStepEvent } from "@/shared/types/analyze";
import { usePlaybackStore } from "@/shared/model/playback/playback.store";

type AnalysisState = {
  isRunning: boolean;
  error: string | null;

  start: (url: string) => void;
  reset: () => void;
};

export const useAnalysisStore = create<AnalysisState>((set) => ({
  isRunning: false,
  error: null,

  start: (url) => {
    const playback = usePlaybackStore.getState();

    playback.reset();

    set({
      isRunning: true,
      error: null,
    });

    connectAnalyzeStream(
      url,

      (event: AnalyzeStepEvent) => {
        const playback = usePlaybackStore.getState();

        playback.pushEvent(event);
        playback.startPlayback();
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
