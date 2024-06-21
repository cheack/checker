import { defineConfig } from 'vite';
import { pluginExposeRenderer } from './vite.base.config';
import VuePlugin from "@vitejs/plugin-vue";

export default defineConfig((env) => {
  const forgeEnv = env;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? '';

  return {
    root,
    mode,
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`,
    },
    plugins: [pluginExposeRenderer(name), VuePlugin()],
    resolve: {
      preserveSymlinks: true,
    },
    clearScreen: false,
  };
});
