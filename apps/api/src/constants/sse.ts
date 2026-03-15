export const SSE_EVENTS = {
  step: "step",
  done: "done",
  error: "error",
} as const;

export const ANALYZE_STEP_TYPES = {
  connected: "connected",
  urlParsed: "url_parsed",
  dnsResolved: "dns_resolved",
  tcpConnected: "tcp_connected",
  tlsEstablished: "tls_established",
  httpResponseReceived: "http_response_received",
  done: "done",
} as const;
