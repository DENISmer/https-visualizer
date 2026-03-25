import dns from "node:dns/promises";
import net from "node:net";
import tls from "node:tls";
import { performance } from "node:perf_hooks";
import { assertPublicAddress } from "@/lib/is-public-ip";

const HEADER_READ_TIMEOUT_MS = 15_000;
const MAX_HEADER_BYTES = 65_536;
const TCP_TLS_TIMEOUT_MS = 20_000;

const elapsedMs = (start: number) =>
  Math.max(0, Math.round(performance.now() - start));

export class AnalyzeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AnalyzeError";
  }
}

const rejectNonHttpsInput = (trimmed: string) => {
  if (trimmed.toLowerCase().startsWith("http://")) {
    throw new AnalyzeError("Only HTTPS URLs are allowed");
  }
};

const assertHostnameAllowed = (hostname: string) => {
  if (!hostname) {
    throw new AnalyzeError("Invalid URL: missing hostname");
  }
  const lower = hostname.toLowerCase();
  if (lower === "localhost" || lower.endsWith(".localhost")) {
    throw new AnalyzeError("Hostname not allowed");
  }
};

/**
 * Phase 1: trim / scheme rules / string to parse (no URL object yet).
 */
export const measureConnectedPhase = (
  rawInput: string,
): {
  ms: number;
  data: Record<string, unknown>;
  toParse: string;
  startedAt: number;
} => {
  const startedAt = Date.now();
  const t0 = performance.now();
  const trimmed = rawInput.trim();
  if (!trimmed) {
    throw new AnalyzeError("URL is required");
  }
  rejectNonHttpsInput(trimmed);
  const toParse = trimmed.toLowerCase().startsWith("https://")
    ? trimmed
    : `https://${trimmed}`;

  return {
    ms: elapsedMs(t0),
    data: {
      input: trimmed,
      normalizedUrl: toParse,
      protocol: "https:",
      startedAt,
    },
    toParse,
    startedAt,
  };
};

/**
 * Phase 2: URL parse, HTTPS check, host/port/path for next steps.
 */
export const measureUrlParsedPhase = (
  toParse: string,
  startedAt: number,
): { ms: number; data: Record<string, unknown>; url: URL } => {
  const t0 = performance.now();
  const url = new URL(toParse);
  if (url.protocol !== "https:") {
    throw new AnalyzeError("Only HTTPS URLs are allowed");
  }
  assertHostnameAllowed(url.hostname);

  const port = url.port || "443";
  const pathname = url.pathname || "/";

  return {
    ms: elapsedMs(t0),
    data: {
      protocol: url.protocol,
      hostname: url.hostname,
      port,
      pathname,
      startedAt,
      normalizedUrl: url.href,
    },
    url,
  };
};

export const measureDnsLookup = async (
  hostname: string,
): Promise<{ ms: number; data: Record<string, unknown> }> => {
  const t0 = performance.now();
  const r = await dns.lookup(hostname, { verbatim: false });
  const ms = elapsedMs(t0);
  const family = r.family === 6 ? 6 : 4;
  assertPublicAddress(r.address, family);

  return {
    ms,
    data: {
      ip: r.address,
      family,
      addresses: [r.address],
    },
  };
};

export const measureTcpConnect = (
  address: string,
  port: number,
  family: 4 | 6,
): Promise<{ ms: number; socket: net.Socket }> =>
  new Promise((resolve, reject) => {
    const t0 = performance.now();
    const socket = net.connect(
      {
        host: address,
        port,
        family,
      },
      () => {
        resolve({ ms: elapsedMs(t0), socket });
      },
    );

    socket.setTimeout(TCP_TLS_TIMEOUT_MS, () => {
      socket.destroy();
      reject(new AnalyzeError("TCP connection timeout"));
    });

    socket.once("error", (err) => {
      socket.destroy();
      reject(
        err instanceof Error ? err : new AnalyzeError("TCP connection failed"),
      );
    });
  });

export const measureTlsHandshake = (
  socket: net.Socket,
  servername: string,
): Promise<{
  ms: number;
  tlsSocket: tls.TLSSocket;
  data: Record<string, unknown>;
}> =>
  new Promise((resolve, reject) => {
    const t0 = performance.now();
    const tlsSocket = tls.connect(
      {
        socket,
        servername,
        rejectUnauthorized: true,
      },
      () => {
        const cert = tlsSocket.getPeerCertificate();
        const ms = elapsedMs(t0);
        resolve({
          ms,
          tlsSocket,
          data: {
            tlsVersion: tlsSocket.getProtocol() ?? "unknown",
            cipher: tlsSocket.getCipher()?.name ?? "unknown",
            issuer: cert?.issuer?.O
              ? String(cert.issuer.O)
              : cert?.issuer?.CN
                ? String(cert.issuer.CN)
                : undefined,
            validTo: cert?.valid_to ? String(cert.valid_to) : undefined,
          },
        });
      },
    );

    tlsSocket.setTimeout(TCP_TLS_TIMEOUT_MS, () => {
      tlsSocket.destroy();
      reject(new AnalyzeError("TLS handshake timeout"));
    });

    tlsSocket.once("error", (err) => {
      tlsSocket.destroy();
      reject(
        err instanceof Error ? err : new AnalyzeError("TLS handshake failed"),
      );
    });
  });

const readUntilHeaders = (
  sock: tls.TLSSocket,
): Promise<{ headersRaw: string; statusLine: string; status: number }> =>
  new Promise((resolve, reject) => {
    let buf = Buffer.alloc(0);

    const fail = (err: Error) => {
      cleanup();
      sock.destroy();
      reject(err);
    };

    const timer = setTimeout(() => {
      fail(new AnalyzeError("HTTP response header timeout"));
    }, HEADER_READ_TIMEOUT_MS);

    const cleanup = () => {
      clearTimeout(timer);
      sock.off("data", onData);
      sock.off("error", onError);
      sock.off("end", onEnd);
    };

    const onError = (err: Error) => fail(err);

    const onEnd = () => {
      cleanup();
      if (buf.length === 0) {
        reject(new AnalyzeError("Connection closed before headers"));
      } else {
        const headersRaw = buf.toString("latin1");
        const statusLine = headersRaw.split("\r\n")[0] ?? "";
        const m = /^HTTP\/\d(?:\.\d)? (\d{3})/.exec(statusLine);
        resolve({
          headersRaw,
          statusLine,
          status: m ? Number(m[1]) : 0,
        });
      }
    };

    const onData = (chunk: Buffer) => {
      buf = Buffer.concat([buf, chunk]);
      if (buf.length > MAX_HEADER_BYTES) {
        fail(new AnalyzeError("HTTP response headers too large"));
        return;
      }
      const idx = buf.indexOf("\r\n\r\n");
      if (idx !== -1) {
        cleanup();
        const headersRaw = buf.subarray(0, idx + 4).toString("latin1");
        const statusLine = headersRaw.split("\r\n")[0] ?? "";
        const m = /^HTTP\/\d(?:\.\d)? (\d{3})/.exec(statusLine);
        resolve({
          headersRaw,
          statusLine,
          status: m ? Number(m[1]) : 0,
        });
      }
    };

    sock.on("data", onData);
    sock.once("error", onError);
    sock.once("end", onEnd);
  });

const parseHeaderValue = (
  headersBlock: string,
  name: string,
): string | undefined => {
  const re = new RegExp(`^${name}:\\s*(.+)$`, "im");
  const m = re.exec(headersBlock);
  return m ? m[1].trim() : undefined;
};

export const measureHttpHead = async (
  tlsSocket: tls.TLSSocket,
  url: URL,
): Promise<{ ms: number; data: Record<string, unknown> }> => {
  const hostname = url.hostname;
  const port = url.port || "443";
  const hostHeader = port === "443" ? hostname : `${hostname}:${port}`;
  const pathAndQuery = `${url.pathname || "/"}${url.search}`;

  const raw =
    `GET ${pathAndQuery} HTTP/1.1\r\n` +
    `Host: ${hostHeader}\r\n` +
    `Connection: close\r\n` +
    `Accept: */*\r\n` +
    `User-Agent: https-visualizer-api/0.1\r\n` +
    `\r\n`;

  const t0 = performance.now();
  tlsSocket.write(raw);

  const { headersRaw, statusLine, status } = await readUntilHeaders(tlsSocket);
  const ms = elapsedMs(t0);

  const lines = headersRaw.split("\r\n");
  const statusText =
    lines.length > 0
      ? /^HTTP\/\d(?:\.\d)? \d{3} (.+)/.exec(lines[0])?.[1]
      : undefined;

  return {
    ms,
    data: {
      status,
      statusText: statusText ?? "",
      contentType: parseHeaderValue(headersRaw, "Content-Type"),
      server: parseHeaderValue(headersRaw, "Server"),
      statusLine,
    },
  };
};

export const destroySocketQuiet = (sock: net.Socket | tls.TLSSocket) => {
  try {
    sock.destroy();
  } catch {
    /* ignore */
  }
};
