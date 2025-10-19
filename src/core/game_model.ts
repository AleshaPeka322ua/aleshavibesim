// Параметры баланса и вспомогательные формулы
import type { GameModel } from './types';

export const DEFAULT_MODEL: GameModel = {
  baseProductionPerGenerator: 1, // 1 energy/sec с одного генератора
  upgradeProdMultiplier: 1.5, // каждый уровень усиливает производство на x1.5
  buildBaseCost: 10,
  buildCostGrowth: 1.15,
  upgradeBaseCost: 25,
  upgradeCostGrowth: 2.0,
  energySellPrice: 0.5, // 1 energy = 0.5 money
  autoSellEnergy: true, // включаем пассивную автопродажу
  autosaveIntervalMs: 5000,
  maxOfflineMs: 1000 * 60 * 60 * 24, // не более суток оффлайн-сдвига
};

export function getProductionPerSecond(count: number, level: number, model: GameModel): number {
  if (count <= 0) return 0;
  const perGenerator = model.baseProductionPerGenerator * Math.pow(model.upgradeProdMultiplier, level);
  return perGenerator * count;
}

export function getBuildCost(nextCount: number, model: GameModel): number {
  // nextCount — это целевое количество после постройки (count + 1)
  // Цена растет геометрически: base * growth^(nextCount-1)
  return model.buildBaseCost * Math.pow(model.buildCostGrowth, Math.max(0, nextCount - 1));
}

export function getUpgradeCost(nextLevel: number, model: GameModel): number {
  // nextLevel — целевой уровень (level + 1)
  return model.upgradeBaseCost * Math.pow(model.upgradeCostGrowth, Math.max(0, nextLevel - 1));
}
