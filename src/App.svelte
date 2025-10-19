<script lang="ts">
  // Корневой компонент: инициализация, загрузка/сохранение, оффлайн-симуляция
  import { onDestroy, onMount } from 'svelte';
  import PlayerProfile from './components/PlayerProfile.svelte';
  import Dashboard from './components/Dashboard.svelte';

  import type { GameState } from './core/types';
  import { DEFAULT_MODEL } from './core/game_model';
  import { advanceBy } from './core/sim';
  import { buildGenerator, canBuild, canUpgrade, resetGame, setPlayerName, upgradeGenerator } from './core/actions';
  import * as persist from './persistence';
  import { nowMs } from './utils/time';

  const model = DEFAULT_MODEL;

  // Начальное состояние по умолчанию
  let state: GameState = {
    player: { name: '' },
    resources: { energy: 0, money: 10 },
    generator: { count: 0, level: 0 }
  };

  let lastUpdate = nowMs();
  let autosaveTimer: any = null;
  let tickTimer: any = null;

  function catchUp() {
    const now = nowMs();
    const delta = now - lastUpdate;
    if (delta > 0) {
      advanceBy(state, model, delta);
      lastUpdate = now;
    }
  }

  function saveNow() {
    persist.save(state, lastUpdate);
  }

  function loadOrInit() {
    const data = persist.load();
    if (data) {
      state = data.state;
      lastUpdate = data.lastUpdate;
      // оффлайн-догон одним шагом
      catchUp();
    } else {
      lastUpdate = nowMs();
    }
  }

  function onNameChange(newName: string) {
    setPlayerName(state, newName);
    saveNow();
  }

  function onBuild() {
    if (canBuild(state, model)) {
      buildGenerator(state, model);
      saveNow();
    }
  }

  function onUpgrade() {
    if (canUpgrade(state, model)) {
      upgradeGenerator(state, model);
      saveNow();
    }
  }

  function onReset() {
    resetGame(state);
    persist.clear();
    lastUpdate = nowMs();
  }

  function onFocus() {
    catchUp();
  }

  function onVisibilityChange() {
    if (document.visibilityState === 'visible') {
      catchUp();
    }
  }

  onMount(() => {
    loadOrInit();

    // Тикер: ленивая симуляция с шагом ~1с (используем разницу времени, чтобы не терять дельту)
    tickTimer = setInterval(() => {
      catchUp();
    }, 1000);

    // Автосохранение раз в N секунд
    autosaveTimer = setInterval(() => {
      saveNow();
    }, model.autosaveIntervalMs);

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('beforeunload', saveNow);

    return () => {
      if (tickTimer) clearInterval(tickTimer);
      if (autosaveTimer) clearInterval(autosaveTimer);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('beforeunload', saveNow);
    };
  });
</script>

<!-- Простой layout -->
<div class="min-h-screen flex flex-col">
  <header class="border-b border-slate-800 bg-slate-900/70 backdrop-blur sticky top-0 z-10">
    <div class="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4 justify-between">
      <div class="flex items-center gap-4">
        <h1 class="text-lg font-semibold">2D Эко-сим MVP</h1>
        <span class="text-xs text-slate-400">Svelte + TS + Vite + Tailwind</span>
      </div>
      <div class="flex items-center gap-6">
        <div class="text-sm">
          <span class="text-slate-400">Money:</span>
          <span class="font-semibold">{state.resources.money.toFixed(2)}</span>
        </div>
        <button class="text-xs text-red-300 hover:text-red-200" on:click={onReset} title="Сбросить прогресс">
          Сбросить
        </button>
      </div>
    </div>
  </header>

  <main class="flex-1">
    <div class="max-w-4xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-6">
      <section class="p-4 rounded-lg bg-slate-900 border border-slate-800">
        <PlayerProfile name={state.player.name} money={state.resources.money} onNameChange={onNameChange} />
      </section>

      <section class="p-4 rounded-lg bg-slate-900 border border-slate-800">
        <Dashboard {state} {model} onBuild={onBuild} onUpgrade={onUpgrade} />
      </section>
    </div>
  </main>

  <footer class="border-t border-slate-800 bg-slate-900/70">
    <div class="max-w-4xl mx-auto px-4 py-3 text-xs text-slate-400 flex items-center justify-between">
      <span>Оффлайн-сохранение: {new Date(lastUpdate).toLocaleTimeString()}</span>
      <span>© {new Date().getFullYear()}</span>
    </div>
  </footer>
</div>
