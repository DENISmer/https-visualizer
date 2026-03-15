export const ANALYZE_STEP_DELAY_MS = {
  connected: 400,
  urlParsed: 400,
  dnsResolved: 700,
  tcpConnected: 700,
  tlsEstablished: 1000,
  httpResponseReceived: 700,
  done: 300,
} as const;
