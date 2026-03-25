import { isIPv4, isIPv6 } from "node:net";

/** Returns whether an IPv4 string is invalid or falls in a blocked range
 * (private LAN, loopback, link-local, CGNAT, multicast/reserved)
 * treating malformed input as blocked */
const ipv4Private = (ip: string): boolean => {
  const parts = ip.split(".").map((x) => Number(x));
  if (
    parts.length !== 4 ||
    parts.some((p) => !Number.isInteger(p) || p < 0 || p > 255)
  ) {
    return true;
  }
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 0) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  if (a >= 224) return true;
  return false;
};

/** Returns whether an IPv6 string is loopback,
 * link-local, ULA (fc/fd),
 * multicast,
 * or an IPv4-mapped address that would be blocked as private
 */
const ipv6Private = (ip: string): boolean => {
  const norm = ip.toLowerCase();
  if (norm === "::1") return true;
  if (norm.startsWith("fe80:")) return true;
  if (norm.startsWith("fc") || norm.startsWith("fd")) return true;
  if (norm.startsWith("ff")) return true;
  const embedded = norm.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (embedded) return ipv4Private(embedded[1]);
  return false;
};

/** Throws if the resolved address must not be connected to (SSRF guard). */
export const assertPublicAddress = (address: string, family: 4 | 6) => {
  if (family === 4) {
    if (!isIPv4(address) || ipv4Private(address)) {
      throw new AnalyzeAddressError("Resolved address is not allowed");
    }
    return;
  }
  if (!isIPv6(address) || ipv6Private(address)) {
    throw new AnalyzeAddressError("Resolved address is not allowed");
  }
};

export class AnalyzeAddressError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AnalyzeAddressError";
  }
}
