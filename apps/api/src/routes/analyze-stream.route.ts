import type { FastifyInstance } from "fastify";
import { sleep } from "@/lib/sleep";
import { API_ROUTES } from "@/constants/routes";
import { SSE_EVENTS } from "@/constants/sse";
import { ANALYZE_STEP_DELAY_MS } from "@/constants/timings";

type StepEvent = {
  type: string;
  data?: Record<string, unknown>;
};

const writeSseEvent = (reply: any, event: string, payload: StepEvent) => {
  reply.raw.write(`event: ${event}\n`);
  reply.raw.write(`data: ${JSON.stringify(payload)}\n\n`);
};

export const registerAnalyzeStreamRoute = (app: FastifyInstance) => {
  app.get(API_ROUTES.analyzeStream, async (request, reply) => {
    const { url } = request.query as { url?: string };

    reply.raw.setHeader("Content-Type", "text/event-stream");
    reply.raw.setHeader("Cache-Control", "no-cache");
    reply.raw.setHeader("Connection", "keep-alive");
    reply.raw.setHeader("Access-Control-Allow-Origin", "*");

    reply.raw.flushHeaders?.();

    writeSseEvent(reply, SSE_EVENTS.step, {
      type: "connected",
      data: { url },
    });

    await sleep(ANALYZE_STEP_DELAY_MS.urlParsed);
    writeSseEvent(reply, SSE_EVENTS.step, {
      type: "url_parsed",
      data: { url },
    });

    await sleep(ANALYZE_STEP_DELAY_MS.dnsResolved);
    writeSseEvent(reply, SSE_EVENTS.step, {
      type: "dns_resolved",
      data: { ip: "93.184.216.34" },
    });

    await sleep(ANALYZE_STEP_DELAY_MS.tcpConnected);
    writeSseEvent(reply, SSE_EVENTS.step, {
      type: "tcp_connected",
      data: {},
    });

    await sleep(ANALYZE_STEP_DELAY_MS.tlsEstablished);
    writeSseEvent(reply, SSE_EVENTS.step, {
      type: "tls_established",
      data: {
        version: "TLSv1.3",
      },
    });

    await sleep(ANALYZE_STEP_DELAY_MS.httpResponseReceived);
    writeSseEvent(reply, SSE_EVENTS.step, {
      type: "http_response_received",
      data: {
        status: 200,
      },
    });

    await sleep(ANALYZE_STEP_DELAY_MS.done);
    writeSseEvent(reply, SSE_EVENTS.done, {
      type: "done",
      data: {},
    });

    reply.raw.end();
  });
};
