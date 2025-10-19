<script lang="ts">
  // Панель ресурсов и действий (build/upgrade)
  import type { GameModel, GameState } from '../core/types';
  import { getBuildCost, getUpgradeCost, getProductionPerSecond } from '../core/game_model';

  export let state: GameState;
  export let model: GameModel;
  export let onBuild: () => void;
  export let onUpgrade: () => void;

  // Вычисляемые значения для UI
  $: nextBuildCost = getBuildCost(state.generator.count + 1, model);
  $: nextUpgradeCost = getUpgradeCost(state.generator.level + 1, model);
  $: prodPerSec = getProductionPerSecond(state.generator.count, state.generator.level, model);
</script>

<div class="space-y-4">
  <h2 class="text-base font-semibold">Ресурсы и действия</h2>

  <div class="grid grid-cols-2 gap-4">
    <div class="p-3 rounded bg-slate-800/80 border border-slate-700">
      <div class="text-xs text-slate-400">Energy</div>
      <div class="text-lg font-semibold">{state.resources.energy.toFixed(2)}</div>
    </div>
    <div class="p-3 rounded bg-slate-800/80 border border-slate-700">
      <div class="text-xs text-slate-400">Money</div>
      <div class="text-lg font-semibold">{state.resources.money.toFixed(2)}</div>
    </div>
  </div>

  <div class="p-3 rounded bg-slate-800/80 border border-slate-700 space-y-2">
    <div class="flex items-center justify-between">
      <div class="font-medium">Генератор энергии</div>
      <div class="text-xs text-slate-400">{prodPerSec.toFixed(2)} energy/sec</div>
    </div>
    <div class="text-sm text-slate-300">
      <div>Построено: <span class="font-medium">{state.generator.count}</span></div>
      <div>Уровень: <span class="font-medium">{state.generator.level}</span></div>
    </div>
    <div class="flex gap-2 mt-2">
      <button
        class="px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50"
        disabled={state.resources.money < nextBuildCost}
        on:click={onBuild}
      >
        Построить (стоимость {nextBuildCost.toFixed(2)})
      </button>
      <button
        class="px-3 py-2 rounded bg-amber-600 hover:bg-amber-500 active:bg-amber-700 disabled:opacity-50"
        disabled={state.generator.count <= 0 || state.resources.money < nextUpgradeCost}
        on:click={onUpgrade}
      >
        Улучшить (стоимость {nextUpgradeCost.toFixed(2)})
      </button>
    </div>
  </div>

  <p class="text-xs text-slate-400">
    Примечание: включена автопродажа energy → money по фиксированному курсу, поэтому пассивный доход начисляется автоматически.
  </p>
</div>
