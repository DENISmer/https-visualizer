import { create } from "zustand";
import { PLAYBACK_STEPS } from "@/shared/constants/playback-steps";
import type {
  AnalyzeStepEvent,
  PlaybackStepType,
  StepPayloadByType,
} from "@/shared/types/analyze";

const isPlaybackStepType = (t: AnalyzeStepEvent["type"]): t is PlaybackStepType =>
  (PLAYBACK_STEPS as readonly string[]).includes(t);

const mergeStepPayload = (
  prev: Partial<StepPayloadByType>,
  event: AnalyzeStepEvent,
): Partial<StepPayloadByType> => {
  switch (event.type) {
    case "connected":
      return { ...prev, connected: event.data };
    case "url_parsed":
      return { ...prev, url_parsed: event.data };
    case "dns_resolved":
      return { ...prev, dns_resolved: event.data };
    case "tcp_connected":
      return { ...prev, tcp_connected: event.data };
    case "tls_established":
      return { ...prev, tls_established: event.data };
    case "http_response_received":
      return { ...prev, http_response_received: event.data };
    default:
      return prev;
  }
};

type PlaybackState = {
  queue: AnalyzeStepEvent[];
  currentStep: AnalyzeStepEvent | null;
  isPlaying: boolean;
  isProcessing: boolean;
  stepPayloads: Partial<StepPayloadByType>;

  pushEvent: (event: AnalyzeStepEvent) => void;
  startPlayback: () => Promise<void>;
  reset: () => void;
};

export const usePlaybackStore = create<PlaybackState>((set, get) => ({
  queue: [],
  currentStep: null,
  isPlaying: false,
  isProcessing: false,
  stepPayloads: {},

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
        stepPayloads: isPlaybackStepType(next.type)
          ? mergeStepPayload(state.stepPayloads, next)
          : state.stepPayloads,
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
      stepPayloads: {},
    });
  },
}));
