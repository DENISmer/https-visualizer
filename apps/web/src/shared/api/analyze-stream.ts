import { API_ROUTES, apiUrl } from "@/shared/api/client";
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
    `${apiUrl(API_ROUTES.analyzeStream)}?url=` +
    encodeURIComponent(url) +
    `&mode=${encodeURIComponent(mode)}`;

  const eventSource = new EventSource(streamUrl);

  let suppressTransportError = false;

  eventSource.addEventListener(SSE_EVENTS.step, (event) => {
    const payload: AnalyzeStepEvent = JSON.parse(event.data);
    if (payload.type === "error") {
      suppressTransportError = true;
    }
    onStep(payload);
  });

  eventSource.addEventListener(SSE_EVENTS.done, () => {
    suppressTransportError = true;
    onDone?.();
    eventSource.close();
  });

  eventSource.onerror = () => {
    if (!suppressTransportError) {
      onError?.();
    }
    eventSource.close();
  };

  return eventSource;
};
