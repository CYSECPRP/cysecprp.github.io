import { createStore, useStore } from "./store";
import { setScrollLocked } from "./scroll";

export type BootPhase = "booting" | "revealing" | "ready";

const BOOT_KEY = "prp:booted";

function shouldBoot() {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return false;
    return window.sessionStorage.getItem(BOOT_KEY) !== "1";
  } catch {
    return false;
  }
}

const bootStore = createStore<BootPhase>(shouldBoot() ? "booting" : "ready");
if (bootStore.get() === "booting")
  document.documentElement.classList.add("is-booting");

export function revealBoot() {
  if (bootStore.get() === "booting") bootStore.set("revealing");
}

export function finishBoot() {
  try {
    window.sessionStorage.setItem(BOOT_KEY, "1");
  } catch {
    // Without session storage the boot sequence simply replays on the next visit.
  }
  document.documentElement.classList.remove("is-booting");
  setScrollLocked(false);
  bootStore.set("ready");
}

export const useBootPhase = () => useStore(bootStore);
