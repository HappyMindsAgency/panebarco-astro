import { defineConfig } from "astro/config";

export default defineConfig({
  server: {
    host: true,
    port: 4321,
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: ["import"],
        },
      },
    },
  },
});
