import preprocess from 'svelte-preprocess';

// Конфиг Svelte: включаем препроцессинг PostCSS, чтобы Tailwind работал в компонентах
/** @type {import('svelte').Config} */
const config = {
  preprocess: preprocess({
    postcss: true
  })
};

export default config;
