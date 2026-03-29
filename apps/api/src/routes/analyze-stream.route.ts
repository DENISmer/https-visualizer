import type { FastifyInstance } from "fastify";
import type { TLSSocket } from "node:tls";
import type { Socket } from "node:net";
import { sleep } from "@/lib/sleep";
import { ANALYZE_MODES, type AnalyzeMode } from "@/constants/analyze-modes";
import { ANALYZE_TIMINGS_MS } from "@/constants/timings";
import {
  measureConnectedPhase,
  measureUrlParsedPhase,
  measureDnsLookup,
  measureTcpConnect,
  measureTlsHandshake,
  measureHttpHead,
  destroySocketQuiet,
  AnalyzeError,
} from "@/lib/https-analyze";
import { AnalyzeAddressError } from "@/lib/is-public-ip";
import { extractHostnameForLog, logAnalyzeOutcome } from "@/lib/request-log";

type StepEvent = {
  type: string;
  data?: Record<string, unknown>;
};

const writeSseEvent = (reply: unknown, event: string, payload: StepEvent) => {
  const raw = reply as { raw: { write: (s: string) => void } };
  raw.raw.write(`event: ${event}\n`);
  raw.raw.write(`data: ${JSON.stringify(payload)}\n\n`);
};

const withMs = (data: Record<string, unknown>, ms: number) => ({
  ...data,
  ms,
});

export const registerAnalyzeStreamRoute = (app: FastifyInstance) => {
  app.get("/api/analyze/stream", async (request, reply) => {
    const logOutcome = (ok: boolean, domain: string) => {
      void logAnalyzeOutcome({
        requestId: request.id,
        ok,
        domain,
      }).catch((err) => {
        app.log.warn({ err }, "request_logs insert failed");
      });
    };
    const { url: urlParam, mode } = request.query as {
      url?: string;
      mode?: AnalyzeMode;
    };

    const selectedMode =
      mode && Object.values(ANALYZE_MODES).includes(mode)
        ? mode
        : ANALYZE_MODES.slowed;

    const timings = ANALYZE_TIMINGS_MS[selectedMode];

    reply.raw.setHeader("Content-Type", "text/event-stream");
    reply.raw.setHeader("Cache-Control", "no-cache");
    reply.raw.setHeader("Connection", "keep-alive");
    reply.raw.setHeader("Access-Control-Allow-Origin", "*");

    reply.raw.flushHeaders?.();

    let tcpSocket: Socket | null = null;
    let tlsSocket: TLSSocket | null = null;

    const cleanupSockets = () => {
      if (tlsSocket) {
        destroySocketQuiet(tlsSocket);
        tlsSocket = null;
      }
      if (tcpSocket) {
        destroySocketQuiet(tcpSocket);
        tcpSocket = null;
      }
    };

    let hostnameForLog: string | undefined;

    try {
      if (!urlParam?.trim()) {
        throw new AnalyzeError("URL is required");
      }

      const connected = measureConnectedPhase(urlParam);
      writeSseEvent(reply, "step", {
        type: "connected",
        data: withMs({ ...connected.data, mode: selectedMode }, connected.ms),
      });

      await sleep(timings.connected);

      const urlParsed = measureUrlParsedPhase(
        connected.toParse,
        connected.startedAt,
      );
      const { url } = urlParsed;
      hostnameForLog = url.hostname;
      writeSseEvent(reply, "step", {
        type: "url_parsed",
        data: withMs(urlParsed.data, urlParsed.ms),
      });

      await sleep(timings.urlParsed);

      const dnsResult = await measureDnsLookup(url.hostname);
      writeSseEvent(reply, "step", {
        type: "dns_resolved",
        data: withMs(dnsResult.data, dnsResult.ms),
      });

      await sleep(timings.dnsResolved);

      const portNum = Number(url.port || 443);
      const dnsFamily = dnsResult.data.family as 4 | 6;
      const dnsIp = dnsResult.data.ip as string;

      const tcpResult = await measureTcpConnect(dnsIp, portNum, dnsFamily);
      tcpSocket = tcpResult.socket;
      writeSseEvent(reply, "step", {
        type: "tcp_connected",
        data: withMs(
          {
            host: url.hostname,
            port: portNum,
            localAddress: tcpSocket.localAddress ?? "",
            remoteAddress: tcpSocket.remoteAddress ?? dnsIp,
          },
          tcpResult.ms,
        ),
      });

      await sleep(timings.tcpConnected);

      const tlsResult = await measureTlsHandshake(tcpSocket, url.hostname);
      tlsSocket = tlsResult.tlsSocket;
      tcpSocket = null;

      writeSseEvent(reply, "step", {
        type: "tls_established",
        data: withMs(
          {
            tlsVersion: tlsResult.data.tlsVersion,
            cipher: tlsResult.data.cipher,
            issuer: tlsResult.data.issuer,
            validTo: tlsResult.data.validTo,
          },
          tlsResult.ms,
        ),
      });

      await sleep(timings.tlsEstablished);

      const httpResult = await measureHttpHead(tlsSocket, url);
      destroySocketQuiet(tlsSocket);
      tlsSocket = null;

      writeSseEvent(reply, "step", {
        type: "http_response_received",
        data: withMs(httpResult.data, httpResult.ms),
      });

      await sleep(timings.httpResponseReceived);
      writeSseEvent(reply, "done", {
        type: "done",
        data: {},
      });

      logOutcome(true, url.hostname);

      await sleep(timings.done);
    } catch (e) {
      cleanupSockets();

      const message =
        e instanceof AnalyzeError || e instanceof AnalyzeAddressError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Analysis failed";

      writeSseEvent(reply, "step", {
        type: "error",
        data: { message, ms: 0 },
      });

      logOutcome(false, hostnameForLog ?? extractHostnameForLog(urlParam));
    } finally {
      reply.raw.end();
    }
  });
};
