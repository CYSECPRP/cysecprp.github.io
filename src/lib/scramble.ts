const GLYPHS = "!<>-_\\/[]{}=+*^?#%$&01";

/**
 * Flickers random glyphs through `nodes`, settling them left to right on their data-final
 * character. Returns a cancel function that restores the final text.
 */
export function scramble(nodes: readonly HTMLElement[], duration = 0.55) {
  const total = nodes.length;
  const start = performance.now();
  const settleAt = nodes.map(
    (_, index) =>
      (index / Math.max(1, total - 1)) * duration * 0.65 +
      Math.random() * duration * 0.35,
  );
  const finalOf = (node: HTMLElement) => node.dataset.final ?? "";
  let frame = 0;
  let lastSwap = 0;

  const step = (now: number) => {
    const elapsed = (now - start) / 1000;
    const swap = now - lastSwap > 40;
    if (swap) lastSwap = now;
    let done = true;
    for (let i = 0; i < total; i++) {
      const node = nodes[i];
      const final = finalOf(node);
      if (final.trim() === "") continue;
      if (elapsed >= settleAt[i]) {
        if (node.textContent !== final) node.textContent = final;
      } else {
        done = false;
        if (swap)
          node.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
    }
    if (!done) frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);

  return () => {
    cancelAnimationFrame(frame);
    for (const node of nodes) node.textContent = finalOf(node);
  };
}
