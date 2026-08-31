/*
 * SEO facts that are not page copy: image descriptors and profile dates.
 *
 * Route/URL facts deliberately are NOT redefined here — they come from
 * src/i18n/routes.ts, which is the single source of truth for locale paths.
 */
import { absoluteUrl } from '@/i18n/routes';

/*
 * One static OG image for the whole site, locale-independent — never derived
 * from the current locale path.
 *
 * Accepted trade-off: 667x375 is above the Open Graph minimum of 600x315 but
 * below the ideal 1200x630, so link previews upscale it slightly. Shipped as
 * is by owner decision; do not replace or regenerate the image.
 */
export const ogImage = {
  path: '/images/alex16x9.jpg',
  width: 667,
  height: 375,
  type: 'image/jpeg',
} as const;

/*
 * JSON-LD Person.image — the same three crops the legacy site published, so
 * URLs already indexed keep resolving.
 */
export const profileImages = [
  '/images/alex1x1.jpg',
  '/images/alex4x3.jpg',
  '/images/alex16x9.jpg',
].map(absoluteUrl);

export const profileDates = {
  /*
   * Preserved verbatim from the legacy site's JSON-LD (en/index.html). This
   * is the value the site has been publishing — it is NOT an independently
   * verified fact, and it was not re-derived or checked against anything.
   * (The legacy EN and RU pages differed by three minutes; the EN value
   * stands.) Leave it alone unless there is real evidence it is wrong.
   */
  created: '2025-06-20T10:01:00+03:00',

  /*
   * Still the legacy value, deliberately. The owner decided during the M5 QA
   * pass that this constant is updated once, by hand, in M6 — set to the date
   * the redesigned site actually goes live. It was not touched in M5, and it
   * is not a leftover to be "cleaned up" by anyone reading this earlier.
   *
   * It stays a manually maintained constant afterwards. Never `new Date()`, a
   * build timestamp, or a filesystem mtime: a rebuild with no content change
   * must not move it, and shipping a milestone is not by itself a reason to
   * bump it. After the M6 deploy, update it only when the profile/page content
   * materially changes.
   */
  modified: '2025-06-20T10:01:00+03:00',
} as const;
