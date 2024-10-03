import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom', // Define o ambiente de teste para simular o DOM
    globals: true,        // Para utilizar funções globais do Vitest, como describe e it
  },
});