export type Spring = { value: number; velocity: number };

export const createSpring = (value = 0): Spring => ({ value, velocity: 0 });

/** Advances a damped spring toward `target`; sub-steps keep it stable when frames are slow. */
export function stepSpring(
  spring: Spring,
  target: number,
  seconds: number,
  stiffness: number,
  damping: number,
) {
  const steps = Math.max(1, Math.ceil(seconds / 0.008));
  const h = seconds / steps;
  for (let i = 0; i < steps; i++) {
    spring.velocity +=
      (stiffness * (target - spring.value) - damping * spring.velocity) * h;
    spring.value += spring.velocity * h;
  }
  return spring.value;
}

export const isSettled = (spring: Spring, target: number, epsilon = 0.001) =>
  Math.abs(spring.value - target) < epsilon &&
  Math.abs(spring.velocity) < epsilon;
