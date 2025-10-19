// Типы состояния игры
// В комментариях используем русский, технические термины оставляем англ.

export type Resources = {
  energy: number; // накопленная энергия
  money: number; // деньги игрока
};

export type Player = {
  name: string; // имя игрока
};

export type Generator = {
  count: number; // количество построенных генераторов
  level: number; // уровень апгрейда генераторов (общий для всех)
};

export type GameState = {
  player: Player;
  resources: Resources;
  generator: Generator;
};

export type GameModel = {
  // Базовая производительность одного генератора (energy/sec)
  baseProductionPerGenerator: number;
  // Мультипликатор к производству за каждый уровень апгрейда
  upgradeProdMultiplier: number;
  // Стоимость постройки первого генератора (money)
  buildBaseCost: number;
  // Мультипликатор роста стоимости построек по мере увеличения count
  buildCostGrowth: number;
  // Стоимость первого апгрейда (money)
  upgradeBaseCost: number;
  // Рост стоимости апгрейдов по уровням
  upgradeCostGrowth: number;
  // Цена продажи 1 единицы energy -> money (фиксированный курс)
  energySellPrice: number;
  // Включена ли автопродажа (пассивный доход в money)
  autoSellEnergy: boolean;
  // Период автосохранения, мс
  autosaveIntervalMs: number;
  // Ограничение на оффлайн-сдвиг во времени, мс (защита от overflow)
  maxOfflineMs: number;
};
