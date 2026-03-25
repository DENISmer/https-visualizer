import { create } from "zustand";

type AlertItem = {
  id: string;
  message: string;
};

const DEFAULT_TTL_MS = 6000;

type AlertsState = {
  alerts: AlertItem[];
  push: (message: string, ttlMs?: number) => void;
  dismiss: (id: string) => void;
};

export const useAlertsStore = create<AlertsState>((set, get) => ({
  alerts: [],

  push: (message, ttlMs = DEFAULT_TTL_MS) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    set((state) => ({ alerts: [{ id, message }, ...state.alerts] }));

    window.setTimeout(() => {
      get().dismiss(id);
    }, ttlMs);
  },

  dismiss: (id) => {
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    }));
  },
}));
