import { ANALYZE_MODES, type AnalyzeMode } from "@/constants/analyze-modes";

export const ANALYZE_TIMINGS_MS: Record<
  AnalyzeMode,
  {
    connected: number;
    urlParsed: number;
    dnsResolved: number;
    tcpConnected: number;
    tlsEstablished: number;
    httpResponseReceived: number;
    done: number;
  }
> = {
  [ANALYZE_MODES.real]: {
    connected: 30,
    urlParsed: 30,
    dnsResolved: 60,
    tcpConnected: 80,
    tlsEstablished: 100,
    httpResponseReceived: 80,
    done: 20,
  },

  [ANALYZE_MODES.slowed]: {
    connected: 400,
    urlParsed: 400,
    dnsResolved: 700,
    tcpConnected: 700,
    tlsEstablished: 1000,
    httpResponseReceived: 700,
    done: 300,
  },

  [ANALYZE_MODES.verySlowed]: {
    connected: 800,
    urlParsed: 800,
    dnsResolved: 1200,
    tcpConnected: 1200,
    tlsEstablished: 1600,
    httpResponseReceived: 1200,
    done: 500,
  },
};
