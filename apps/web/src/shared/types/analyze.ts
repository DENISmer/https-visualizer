export type AnalyzeStepType =
  | "connected"
  | "url_parsed"
  | "dns_resolved"
  | "tcp_connected"
  | "tls_established"
  | "http_response_received"
  | "done";

export type AnalyzeStepEvent = {
  type: AnalyzeStepType;
  data?: Record<string, unknown>;
};
