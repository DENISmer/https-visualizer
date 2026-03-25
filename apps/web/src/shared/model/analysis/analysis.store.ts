import { create } from "zustand";
import { connectAnalyzeStream } from "@/shared/api/analyze-stream";
import type { AnalyzeStepEvent } from "@/shared/types/analyze";
import { usePlaybackStore } from "@/shared/model/playback/playback.store";
import { useAlertsStore } from "@/shared/model/alerts/alerts.store";
import {
  ANALYZE_MODES,
  type AnalyzeMode,
} from "@/shared/constants/analyze-mode";

type AnalysisState = {
  isRunning: boolean;
  mode: AnalyzeMode;

  setMode: (mode: AnalyzeMode) => void;
  start: (url: string) => void;
  reset: () => void;
};

const errorMessageFromPayload = (data: Record<string, unknown> | undefined) => {
  const message = data?.message;
  return typeof message === "string" && message.trim()
    ? message.trim()
    : "Something went wrong";
};

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  isRunning: false,
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
    });

    connectAnalyzeStream(
      url,
      mode,
      (event: AnalyzeStepEvent) => {
        if (event.type === "error") {
          useAlertsStore.getState().push(errorMessageFromPayload(event.data));
          set({ isRunning: false });
          return;
        }

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
        useAlertsStore.getState().push("Connection error");
        set({
          isRunning: false,
        });
      },
    );
  },

  reset: () => {
    const playback = usePlaybackStore.getState();

    playback.reset();

    set({
      isRunning: false,
    });
  },
}));
