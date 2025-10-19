<script lang="ts">
  // Компонент профиля игрока: редактирование имени + показ денег
  export let name: string;
  export let money: number;
  export let onNameChange: (newName: string) => void;

  let localName = name;

  // Синхронизируем локальное поле при изменении пропа (например, при сбросе)
  $: if (name !== localName) localName = name;

  function handleSubmit(e: Event) {
    e.preventDefault();
    onNameChange?.(localName ?? '');
  }
</script>

<div class="space-y-4">
  <h2 class="text-base font-semibold">Профиль игрока</h2>

  <form class="flex items-center gap-2" on:submit|preventDefault={handleSubmit}>
    <input
      class="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
      placeholder="Введите ник"
      bind:value={localName}
      on:change={handleSubmit}
    />
    <button
      class="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700"
      type="submit"
    >
      Сохранить
    </button>
  </form>

  <div class="text-sm text-slate-300">
    <div><span class="text-slate-400">Ник:</span> <span class="font-medium">{name || '—'}</span></div>
    <div><span class="text-slate-400">Деньги:</span> <span class="font-medium">{money.toFixed(2)}</span></div>
  </div>
</div>
