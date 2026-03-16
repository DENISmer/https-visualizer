import { API_BASE_URL, API_ROUTES } from "@/shared/constants/api";
import { SSE_EVENTS } from "@/shared/constants/sse";
import type { AnalyzeStepEvent } from "@/shared/types/analyze";
import type { AnalyzeMode } from "@/shared/constants/analyze-mode";

export const connectAnalyzeStream = (
  url: string,
  mode: AnalyzeMode,
  onStep: (event: AnalyzeStepEvent) => void,
  onDone?: () => void,
  onError?: () => void,
) => {
  const streamUrl =
    `${API_BASE_URL}${API_ROUTES.analyzeStream}?url=` +
    encodeURIComponent(url) +
    `&mode=${encodeURIComponent(mode)}`;

  const eventSource = new EventSource(streamUrl);

  eventSource.addEventListener(SSE_EVENTS.step, (event) => {
    const payload: AnalyzeStepEvent = JSON.parse(event.data);
    onStep(payload);
  });

  eventSource.addEventListener(SSE_EVENTS.done, () => {
    onDone?.();
    eventSource.close();
  });

  eventSource.onerror = () => {
    onError?.();
    eventSource.close();
  };

  return eventSource;
};
