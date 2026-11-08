import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://caresse.app',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: false,
  markdown: { smartypants: false },
  build: { format: 'directory' },
});
