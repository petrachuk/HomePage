import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import { localePaths, absoluteUrl } from './src/i18n/routes.ts';

export default defineConfig({
  output: 'static',
  site: 'https://petrachuk.com',
  integrations: [
    icon(),
    /*
     * The default output was checked first: it listed `/` alongside `/en/`
     * and `/ru/` and carried no hreflang alternates at all. Hence the two
     * hooks below — the minimum needed to reach the required XML, no sitemap
     * abstraction of our own.
     *
     * `filter` drops the root language stub: it is a redirect, not content.
     * `serialize` attaches the same three reciprocal alternates to both
     * entries, matching what Seo.astro emits in the page head. Both read
     * src/i18n/routes.ts, so the sitemap cannot drift from the pages.
     */
    sitemap({
      filter: (page) => page !== absoluteUrl('/'),
      serialize: (item) => ({
        ...item,
        links: [
          { lang: 'en', url: absoluteUrl(localePaths.en) },
          { lang: 'ru', url: absoluteUrl(localePaths.ru) },
          { lang: 'x-default', url: absoluteUrl(localePaths.en) },
        ],
      }),
    }),
  ],
  // Settled, not provisional: `/en/` and `/ru/` are the two indexable content
  // routes, and `/` is a noindex language-selection stub
  // (src/pages/index.astro) rather than a second copy of the English page.
  // Canonical, hreflang, and the sitemap all resolve through
  // src/i18n/routes.ts.
  //
  // `redirectToDefaultLocale` is deliberately not set: it runs only in the SSR
  // request pipeline, so in a static build it would be inert and misleading.
  //
  // This block governs routing only — the content model lives in
  // src/content.config.ts.
  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
