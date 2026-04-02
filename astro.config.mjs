import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://prozhaluzi.ru',
  integrations: [sitemap()],
  image: {
    domains: ['images.unsplash.com', 'api.telegram.org']
  }
});
