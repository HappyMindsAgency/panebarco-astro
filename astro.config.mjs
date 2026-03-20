import node from "@astrojs/node";
import { defineConfig } from "astro/config";
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: "server",
  /* adapter: node({
    mode: "standalone",
  }), */
  adapter: vercel({}),
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
