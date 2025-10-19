# Svelte + TypeScript MVP для 2D эконом-симулятора (ленивая оффлайн-симуляция)

Локальный MVP браузерной 2D эконом-игры в духе Power (Rumsod) без бэкенда и деплоя. Игра работает целиком в браузере, прогресс хранится в `localStorage`, при повторном открытии вкладки происходит «догон» состояния за время, пока вы были офлайн.

Техстек: Svelte + TypeScript + Vite + TailwindCSS. Линт/формат — ESLint + Prettier.

## Быстрый старт

1) Установите Node.js LTS (18.x или 20.x)

2) Установите зависимости:

```
npm i
```

3) Запустите локальный dev-сервер Vite:

```
npm run dev
```

Откройте http://localhost:5173 (порт может отличаться, смотрите вывод команды).

4) Сборка production:

```
npm run build
```

Предпросмотр собранной версии:

```
npm run preview
```

5) Линт/формат:

```
npm run lint
npm run format
```

## Структура проекта

- `index.html` — корневой HTML-файл Vite
- `src/main.ts` — инициализация приложения
- `src/App.svelte` — корневой компонент UI
- `src/components/`
  - `Dashboard.svelte` — ресурсы/действия (build/upgrade)
  - `PlayerProfile.svelte` — профиль игрока (ник, деньги)
- `src/core/`
  - `types.ts` — типы состояния (Player, Resources, Generator, GameState, GameModel)
  - `game_model.ts` — параметры баланса (производство, стоимости, авто‑продажа)
  - `sim.ts` — `advanceBy(ms)`: детерминированное обновление состояния по прошедшему времени
  - `actions.ts` — игровые действия: построить/улучшить, продать энергию
- `src/persistence.ts` — save/load в `localStorage`, схема хранилища, `lastUpdate`
- `src/utils/time.ts` — утилиты времени
- Tailwind/PostCSS/Vite конфиги: `tailwind.config.cjs`, `postcss.config.cjs`, `vite.config.ts`, `svelte.config.js`

CSS Tailwind подключён через `src/app.css`.

## Геймплей MVP

- Ресурсы: энергия (`energy`), деньги (`money`).
- Генератор энергии производит `energy/sec`; апгрейд усиливает производство (мультипликатор).
- Конвертация: включена простая автопродажа `energy -> money` по фиксированному курсу, поэтому пассивный доход идёт автоматически.
- Профиль игрока: имя (ввод в UI, сохраняется), деньги отображаются в шапке.
- Действия:
  - «Построить генератор» (увеличивает `count`, стоит `money`)
  - «Улучшить генератор» (повышает производство, растёт стоимость)

Опциональная ручная «Продажа энергии» не обязательна, т.к. автопродажа уже включена.

## Баланс и параметры (core/game_model.ts)

Файл `src/core/game_model.ts` содержит параметры баланса:

- `baseProductionPerGenerator` — базовая производительность одного генератора (energy/sec)
- `upgradeProdMultiplier` — мультипликатор к производству за каждый уровень апгрейда
- `buildBaseCost` и `buildCostGrowth` — базовая стоимость и рост цены построек
- `upgradeBaseCost` и `upgradeCostGrowth` — базовая стоимость и рост цены апгрейдов
- `energySellPrice` — фиксированный курс energy → money
- `autoSellEnergy` — флаг автопродажи (пассивный доход)
- `autosaveIntervalMs` — период автосохранения
- `maxOfflineMs` — ограничение на оффлайн-догон (защита от слишком больших скачков времени)

В этом же файле есть функции:

- `getProductionPerSecond(count, level, model)` — производство в energy/sec
- `getBuildCost(nextCount, model)` — стоимость постройки следующего генератора
- `getUpgradeCost(nextLevel, model)` — стоимость следующего апгрейда

## Оффлайн-симуляция и сохранения (persistence.ts)

- Прогресс хранится в `localStorage` под ключом `aleshavibesim_save_v1`.
- Сохраняется структура `{ version, lastUpdate, state }`, где `lastUpdate` — timestamp (ms).
- При загрузке приложения и при получении фокуса вкладкой вычисляется `delta = now - lastUpdate` и вызывается `sim.advanceBy(delta)` — одним шагом догоняем состояние.
- Затем `lastUpdate` обновляется на `now`. Дополнительно раз в N секунд (`autosaveIntervalMs`) выполняется автосохранение.

Код, отвечающий за это поведение, можно посмотреть в `src/App.svelte` (обработчики `focus/visibilitychange`, периодический тик и автосохранение) и `src/persistence.ts`.

## Сброс прогресса

- В шапке есть кнопка «Сбросить», которая обнуляет состояние и очищает запись в `localStorage`.
- Либо вручную очистите localStorage из DevTools: `localStorage.removeItem('aleshavibesim_save_v1')`.

## Примечания

- В этой версии нет деплоя/CI/CD — только локальный запуск через Vite dev server.
- Комментарии в коде на русском (технические термины могут быть на англ.).
- Проект простой и расширяемый: можно добавить больше типов зданий/ресурсов, отключаемую автопродажу, графики, и т.п.
