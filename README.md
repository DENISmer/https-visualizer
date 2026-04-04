# HTTPS Request Visualizer

An interactive web application that visualizes how an HTTPS request works step-by-step — from DNS resolution and TCP/TLS handshake to the final HTTP response.

The goal of this project is to help developers and learners better understand what happens behind the scenes when a browser makes a request to a website.

## Features (planned)

- URL parsing
- DNS resolution visualization
- TCP handshake simulation
- TLS handshake visualization
- HTTP request & response flow
- Network timeline and metrics
- Interactive step-by-step playback

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- SCSS Modules
- Zustand

### Backend

- Node.js
- Fastify
- TypeScript

### Monorepo

- pnpm workspaces

## Development

To run the project locally in development mode you need to start the backend and frontend separately.

First start the backend API:

```bash
pnpm --filter api dev
```

Then start the frontend application:

```bash
pnpm --filter web dev
```

## What the project does (in more detail)

The app is a **small monorepo**: a React (Vite) UI and a **Fastify** API. You type an **HTTPS** URL; the UI walks through a **fixed sequence of stages** that matches how people usually explain a secure request end-to-end:

1. **Connect** — input is normalized to `https://…` (plain HTTP URLs are rejected on the server).
2. **URL parsed** — hostname, port (default 443), path.
3. **DNS** — the API resolves the hostname to an address (public IPs only by default, to reduce SSRF risk toward internal networks).
4. **TCP** — a TCP connection to the resolved host:443.
5. **TLS** — a TLS handshake; the UI shows high-level info (e.g. protocol, cipher, issuer hints where available).
6. **HTTP** — a minimal request over that socket and reading the **response status line and headers** (not a full browser navigation; no rendering of the page body as in a real tab).

The timeline is **real work** on the server, but playback can be **slowed down** in the UI so each step is easy to follow. That makes it a **teaching aid**, not a packet analyzer.

### How detailed is the HTTPS model?

It is **intentionally high-level and shared** across the industry narrative: same broad phases you see in diagrams (“DNS → TCP → TLS → HTTP”). It does **not** aim to be a spec-accurate, byte-level or version-complete picture of TLS 1.3, certificate chains, ALPN, HTTP/2 frames, QUIC, etc. Think **mental model + measured delays**, not Wireshark-in-the-browser.

Deployment-friendly pieces (static build + API, optional Supabase for authors/analytics, nginx-style same-origin `/api`) are there so the demo can run in production; they don’t change the fact that the **visualization is pedagogical**.

## Feedback

If something is unclear, feels wrong, or you have ideas to extend the flow (within the same educational spirit), **questions and suggestions are welcome** — open an issue or reach out however you prefer to collaborate on the repo.