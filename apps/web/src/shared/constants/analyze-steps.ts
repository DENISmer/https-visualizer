export const ANALYZE_STEPS = {
  connected: "connected",
  urlParsed: "url_parsed",
  dnsResolved: "dns_resolved",
  tcpConnected: "tcp_connected",
  tlsEstablished: "tls_established",
  httpResponseReceived: "http_response_received",
  done: "done",
} as const;
