// Вспомогательные утилиты времени
export function nowMs(): number {
  return Date.now();
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}
