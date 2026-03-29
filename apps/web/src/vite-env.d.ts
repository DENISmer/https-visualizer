/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional. If unset, requests use same-origin `/api/...`. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
