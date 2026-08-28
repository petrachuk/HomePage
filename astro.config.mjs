import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  // Provisional: matches the confirmed target URL structure (`/` = EN,
  // `/ru/` = RU), but the real localization/content model — how collection
  // entries link EN/RU versions, canonical URLs, hreflang — is designed in
  // a later milestone, not here. Treat this block as a placeholder, not a
  // locked decision.
  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
