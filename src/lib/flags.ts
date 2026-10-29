import { createStore, useStore } from "./store";
import { showToast } from "./toast";

export type FlagId = "hero" | "contact" | "terminal";
export type Mode = "default" | "redteam";

export const FLAG_IDS: readonly FlagId[] = ["hero", "contact", "terminal"];

export const FLAG_CODES: Record<FlagId, string> = {
  hero: "PRP{h1dd3n_1n_pl41n_s1ght}",
  contact: "PRP{n3w_m3ss4g3_1nt3rc3pt3d}",
  terminal: "PRP{d0tf1l3s_t3ll_t4l3s}",
};

export const FLAG_HINTS: Record<FlagId, string> = {
  hero: "Hint: somebody keeps an eye on the clock.",
  contact: "Hint: every new message starts somewhere.",
  terminal: "Hint: some files hide from a plain ls.",
};

const FLAG_KEY = "prp:flags";
const MODE_KEY = "prp:mode";

function read(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private mode); progress then lasts for the session only.
  }
}

function readFlags(): FlagId[] {
  try {
    const parsed: unknown = JSON.parse(read(FLAG_KEY) ?? "[]");
    return Array.isArray(parsed)
      ? FLAG_IDS.filter((id) => parsed.includes(id))
      : [];
  } catch {
    return [];
  }
}

const flagStore = createStore<readonly FlagId[]>(readFlags());
const modeStore = createStore<Mode>(
  read(MODE_KEY) === "redteam" && readFlags().length === FLAG_IDS.length
    ? "redteam"
    : "default",
);

export const useFlags = () => useStore(flagStore);
export const useMode = () => useStore(modeStore);
export const getFlags = () => flagStore.get();
export const allFlagsCaptured = () =>
  flagStore.get().length === FLAG_IDS.length;

export function applyMode() {
  document.documentElement.dataset.mode = modeStore.get();
}

export function setMode(mode: Mode) {
  if (mode === "redteam" && !allFlagsCaptured()) return false;
  document.documentElement.dataset.mode = mode;
  modeStore.set(mode);
  write(MODE_KEY, mode);
  return true;
}

export function captureFlag(id: FlagId) {
  if (flagStore.get().includes(id)) {
    showToast("Flag already captured", FLAG_CODES[id]);
    return false;
  }
  const next = [...flagStore.get(), id];
  flagStore.set(next);
  write(FLAG_KEY, JSON.stringify(next));
  showToast(
    `Flag captured · ${next.length} / ${FLAG_IDS.length}`,
    FLAG_CODES[id],
  );
  if (next.length === FLAG_IDS.length) {
    showToast(
      "All flags captured",
      "Red-team mode unlocked — type 'theme red' in the terminal.",
      7000,
    );
  }
  return true;
}

export function submitFlag(code: string): FlagId | null {
  return FLAG_IDS.find((id) => FLAG_CODES[id] === code.trim()) ?? null;
}
