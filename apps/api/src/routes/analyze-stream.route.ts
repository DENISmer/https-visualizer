import type { FastifyInstance } from "fastify";
import { sleep } from "@/lib/sleep";
import { ANALYZE_MODES, type AnalyzeMode } from "@/constants/analyze-modes";
import { ANALYZE_TIMINGS_MS } from "@/constants/timings";

type StepEvent = {
  type: string;
  data?: Record<string, unknown>;
};

const writeSseEvent = (reply: any, event: string, payload: StepEvent) => {
  reply.raw.write(`event: ${event}\n`);
  reply.raw.write(`data: ${JSON.stringify(payload)}\n\n`);
};

export const registerAnalyzeStreamRoute = (app: FastifyInstance) => {
  app.get("/api/analyze/stream", async (request, reply) => {
    const { url, mode } = request.query as { url?: string; mode?: AnalyzeMode };

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

    writeSseEvent(reply, "step", {
      type: "connected",
      data: { url, mode: selectedMode },
    });

    await sleep(timings.connected);
    writeSseEvent(reply, "step", {
      type: "url_parsed",
      data: { url },
    });

    await sleep(timings.urlParsed);
    writeSseEvent(reply, "step", {
      type: "dns_resolved",
      data: { ip: "93.184.216.34" },
    });

    await sleep(timings.dnsResolved);
    writeSseEvent(reply, "step", {
      type: "tcp_connected",
      data: {},
    });

    await sleep(timings.tcpConnected);
    writeSseEvent(reply, "step", {
      type: "tls_established",
      data: { version: "TLSv1.3" },
    });

    await sleep(timings.tlsEstablished);
    writeSseEvent(reply, "step", {
      type: "http_response_received",
      data: { status: 200 },
    });

    await sleep(timings.httpResponseReceived);
    writeSseEvent(reply, "done", {
      type: "done",
      data: {},
    });

    await sleep(timings.done);
    reply.raw.end();
  });
};
