// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static HTML + functions/ for Cloudflare Pages.
// No @astrojs/cloudflare adapter — same reason as macrosandmamas-marketing:
// the adapter targets Workers/SSR and has emitted a reserved ASSETS binding.
export default defineConfig({
  site: 'https://nourishwithcalista.com',
  output: 'static',
  integrations: [sitemap()],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
