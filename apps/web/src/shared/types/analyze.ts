import type { PLAYBACK_STEPS } from "@/shared/constants/playback-steps";

export type PlaybackStepType = (typeof PLAYBACK_STEPS)[number];

/** Matches `measureConnectedPhase` + route `mode` */
export type ConnectedStepData = {
  input: string;
  normalizedUrl: string;
  protocol: string;
  startedAt: number;
  mode: string;
  ms: number;
};

/** Matches `measureUrlParsedPhase` */
export type UrlParsedStepData = {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  startedAt: number;
  normalizedUrl: string;
  ms: number;
};

/** Matches `measureDnsLookup` */
export type DnsResolvedStepData = {
  ip: string;
  family: number;
  addresses: string[];
  ms: number;
};

/** Matches TCP `withMs` in analyze route */
export type TcpConnectedStepData = {
  host: string;
  port: number;
  localAddress: string;
  remoteAddress: string;
  ms: number;
};

/** Matches `measureTlsHandshake` payload + `withMs` */
export type TlsEstablishedStepData = {
  tlsVersion: string;
  cipher: string;
  issuer?: string;
  validTo?: string;
  ms: number;
};

/** Matches `measureHttpHead` + `withMs` */
export type HttpResponseStepData = {
  status: number;
  statusText: string;
  contentType?: string;
  server?: string;
  statusLine?: string;
  ms: number;
};

export type ErrorStepData = {
  message: string;
  ms: number;
};

export type StepPayloadByType = {
  connected: ConnectedStepData;
  url_parsed: UrlParsedStepData;
  dns_resolved: DnsResolvedStepData;
  tcp_connected: TcpConnectedStepData;
  tls_established: TlsEstablishedStepData;
  http_response_received: HttpResponseStepData;
};

export type AnalyzeStepType = PlaybackStepType | "error" | "done";

export type AnalyzeStepEvent =
  | { type: "connected"; data: ConnectedStepData }
  | { type: "url_parsed"; data: UrlParsedStepData }
  | { type: "dns_resolved"; data: DnsResolvedStepData }
  | { type: "tcp_connected"; data: TcpConnectedStepData }
  | { type: "tls_established"; data: TlsEstablishedStepData }
  | { type: "http_response_received"; data: HttpResponseStepData }
  | { type: "error"; data: ErrorStepData }
  | { type: "done"; data?: Record<string, never> };
