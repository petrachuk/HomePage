/*
 * Single source of truth for locale URL paths.
 *
 * `/en/` and `/ru/` are the only indexable content routes. `/` is a noindex
 * language-selection stub and is deliberately absent from this map — it is
 * not a content representation and must never become a canonical or hreflang
 * target.
 *
 * Anything that needs a locale URL — canonical, hreflang, og:url, JSON-LD
 * `url`, the sitemap, the language switcher — resolves through here. Do not
 * write `/en/` or `/ru/` as a locale route anywhere else.
 */
import type { Locale } from '@/i18n/ui';

export const localePaths: Record<Locale, string> = {
  en: '/en/',
  ru: '/ru/',
};

export const siteOrigin = 'https://petrachuk.com';

/*
 * Built with the URL constructor rather than string concatenation: it cannot
 * produce a double slash when joining, and it cannot silently drop the
 * trailing slash that the canonical/hreflang/sitemap forms all depend on.
 */
export function absoluteUrl(path: string): string {
  return new URL(path, siteOrigin).href;
}
