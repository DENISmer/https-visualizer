export type AnalyzeStepType =
  | "connected"
  | "url_parsed"
  | "dns_resolved"
  | "tcp_connected"
  | "tls_established"
  | "http_response_received"
  | "error"
  | "done";

export type AnalyzeStepEvent = {
  type: AnalyzeStepType;
  data?: Record<string, unknown>;
};
