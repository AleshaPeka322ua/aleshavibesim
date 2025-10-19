// Детеминированная ленивая симуляция на интервале времени
import type { GameModel, GameState } from './types';
import { getProductionPerSecond } from './game_model';

/**
 * Продвигаем состояние на deltaMs миллисекунд. Возвращаем то же состояние (мутабельно).
 * Алгоритм простой: генераторы произвели energy, после чего (опционально) продаем energy -> money.
 */
export function advanceBy(state: GameState, model: GameModel, deltaMs: number): GameState {
  const clamped = Math.max(0, Math.min(deltaMs, model.maxOfflineMs));
  if (clamped === 0) return state;

  const deltaSec = clamped / 1000;
  const produced = getProductionPerSecond(state.generator.count, state.generator.level, model) * deltaSec;

  // Накопим энергию
  state.resources.energy += produced;

  // Автопродажа: конвертируем всю накопленную энергию в деньги
  if (model.autoSellEnergy && state.resources.energy > 0) {
    state.resources.money += state.resources.energy * model.energySellPrice;
    state.resources.energy = 0;
  }

  return state;
}
