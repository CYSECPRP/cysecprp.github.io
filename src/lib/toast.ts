import { createStore, useStore } from "./store";

export type Toast = { id: number; title: string; body?: string };

const toastStore = createStore<readonly Toast[]>([]);
let sequence = 0;

export function showToast(title: string, body?: string, duration = 4800) {
  const id = ++sequence;
  toastStore.set((list) => [...list, { id, title, body }].slice(-3));
  window.setTimeout(() => dismissToast(id), duration);
}

export function dismissToast(id: number) {
  toastStore.set((list) =>
    list.some((toast) => toast.id === id)
      ? list.filter((toast) => toast.id !== id)
      : list,
  );
}

export const useToasts = () => useStore(toastStore);
