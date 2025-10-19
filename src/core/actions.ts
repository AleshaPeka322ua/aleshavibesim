// Игровые действия: постройка, апгрейд, продажа (если нужно)
import type { GameModel, GameState } from './types';
import { getBuildCost, getUpgradeCost } from './game_model';

export function canBuild(state: GameState, model: GameModel): boolean {
  const cost = getBuildCost(state.generator.count + 1, model);
  return state.resources.money >= cost;
}

export function buildGenerator(state: GameState, model: GameModel): boolean {
  const cost = getBuildCost(state.generator.count + 1, model);
  if (state.resources.money < cost) return false;
  state.resources.money -= cost;
  state.generator.count += 1;
  return true;
}

export function canUpgrade(state: GameState, model: GameModel): boolean {
  const cost = getUpgradeCost(state.generator.level + 1, model);
  return state.resources.money >= cost && state.generator.count > 0;
}

export function upgradeGenerator(state: GameState, model: GameModel): boolean {
  const cost = getUpgradeCost(state.generator.level + 1, model);
  if (state.resources.money < cost || state.generator.count <= 0) return false;
  state.resources.money -= cost;
  state.generator.level += 1;
  return true;
}

export function sellEnergy(state: GameState, model: GameModel, amount?: number): number {
  // Если amount не задан, продаем всё
  const sell = amount == null ? state.resources.energy : Math.max(0, Math.min(amount, state.resources.energy));
  if (sell <= 0) return 0;
  state.resources.energy -= sell;
  const gained = sell * model.energySellPrice;
  state.resources.money += gained;
  return gained;
}

export function setPlayerName(state: GameState, name: string): void {
  state.player.name = name.trim();
}

export function resetGame(state: GameState): void {
  state.player.name = '';
  state.resources.energy = 0;
  state.resources.money = 0;
  state.generator.count = 0;
  state.generator.level = 0;
}
