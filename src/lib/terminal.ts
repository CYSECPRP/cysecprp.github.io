import { createStore, useStore } from "./store";

type TerminalState = { open: boolean; command: string | null; nonce: number };

const terminalStore = createStore<TerminalState>({
  open: false,
  command: null,
  nonce: 0,
});

export function openTerminal(command?: string) {
  terminalStore.set((state) => ({
    open: true,
    command: command ?? null,
    nonce: state.nonce + 1,
  }));
}

export function closeTerminal() {
  terminalStore.set((state) =>
    state.open ? { ...state, open: false } : state,
  );
}

export function toggleTerminal() {
  if (terminalStore.get().open) closeTerminal();
  else openTerminal();
}

export const useTerminal = () => useStore(terminalStore);
