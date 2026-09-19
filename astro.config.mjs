// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://cystems.ec',
  output: 'server',
  security: {
    checkOrigin: true,
  },
  adapter: node({
    mode: 'standalone',
  }),
  vite: {
    plugins: [tailwindcss()],
    build: { assetsInlineLimit: 0 },
    ssr: {
      noExternal: ['nodemailer'],
    },
  },
});
