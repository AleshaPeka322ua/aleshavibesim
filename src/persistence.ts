// Хранилище состояния в localStorage + lastUpdate для оффлайн-симуляции
import type { GameState } from './core/types';

const KEY = 'aleshavibesim_save_v1';

export type PersistedData = {
  version: 1;
  lastUpdate: number; // timestamp (ms)
  state: GameState;
};

export function save(state: GameState, lastUpdate: number): void {
  const data: PersistedData = { version: 1 as const, lastUpdate, state };
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    // игнорируем ошибки квоты и т.п.
    console.warn('Не удалось сохранить игру:', e);
  }
}

export function load(): { state: GameState; lastUpdate: number } | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PersistedData;
    if (!data || data.version !== 1) return null;
    return { state: data.state, lastUpdate: data.lastUpdate };
  } catch (e) {
    console.warn('Не удалось загрузить игру:', e);
    return null;
  }
}

export function clear(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
