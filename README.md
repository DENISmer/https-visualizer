# HTTPS Request Visualizer

**An interactive step-by-step visualization of how an HTTPS request actually works** — from DNS resolution and TCP/TLS handshake to the final HTTP response.

Built as a teaching aid for developers and learners who want to see what really happens when a browser makes a secure request.

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-httpsvisualizer.org-blue?style=for-the-badge)](https://httpsvisualizer.org)

</div>

---

## Demo

<div align="center">
  <a href="https://httpsvisualizer.org">
    <img src="https://github.com/user-attachments/assets/29adfff4-ad1b-4c54-bb2a-22ec89621562" alt="HTTPS Visualizer Demo" width="100%" />
  </a>
</div>

---

## What it does

Type any HTTPS URL and watch the full request lifecycle play out in real time:

| Step | What happens |
|------|-------------|
| **URL parsing** | Hostname, port (default 443), path extracted |
| **DNS** | Hostname resolved to an IP address |
| **TCP** | Connection established to host:443 |
| **TLS** | Handshake completed — protocol, cipher, issuer shown |
| **HTTP** | Request sent, response status + headers received |

Each stage runs as **real work on the server**. Playback speed can be slowed in the UI so every step is easy to follow — making this a **teaching tool**, not a packet analyzer.

> The model is intentionally high-level: the same broad phases you see in textbook diagrams ("DNS → TCP → TLS → HTTP"). It doesn't aim to be a byte-level TLS 1.3 trace. Think **mental model + measured delays**.

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React, TypeScript, Vite, SCSS Modules, Zustand |
| **Backend** | Node.js, Fastify, TypeScript |
| **Monorepo** | pnpm workspaces |

---

## Running locally

Start the backend API:

```bash
pnpm --filter api dev
```

Then start the frontend:

```bash
pnpm --filter web dev
```

---

## Feedback

If something feels wrong, unclear, or you have ideas to extend the flow — open an issue or reach out. Questions and suggestions are welcome.
