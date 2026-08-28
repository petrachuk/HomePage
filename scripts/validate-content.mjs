// Cross-locale content validation for the `experience` and `projects`
// content collections. The Astro Content Layer build only validates each
// entry's own shape against its Zod schema — it does not notice a silently
// missing EN or RU counterpart, or a value that should be identical across
// locales (a shared date range, org URL, repo URL, tag list) drifting apart.
// This script closes that gap. Run via `npm run check`.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

const COLLECTIONS = [
  {
    name: 'experience',
    dir: join(rootDir, 'src/content/experience'),
    invariantFields: ['dateStart', 'dateEnd', 'organization.url', 'tags'],
  },
  {
    name: 'projects',
    dir: join(rootDir, 'src/content/projects'),
    invariantFields: ['repoUrl', 'tags'],
  },
];

const EXPECTED_LOCALE_FILES = ['en.md', 'ru.md'];

function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

function valuesEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function validateCollection({ name, dir, invariantFields }) {
  const errors = [];
  const entityFolders = readdirSync(dir).filter((entry) => statSync(join(dir, entry)).isDirectory());

  for (const entity of entityFolders) {
    const entityDir = join(dir, entity);
    const files = readdirSync(entityDir).filter((f) => statSync(join(entityDir, f)).isFile());
    const sortedFiles = [...files].sort();
    const sortedExpected = [...EXPECTED_LOCALE_FILES].sort();

    if (JSON.stringify(sortedFiles) !== JSON.stringify(sortedExpected)) {
      errors.push(
        `[${name}/${entity}] expected exactly ${JSON.stringify(EXPECTED_LOCALE_FILES)}, found ${JSON.stringify(sortedFiles)}`,
      );
      continue;
    }

    const parsed = {};
    for (const file of EXPECTED_LOCALE_FILES) {
      const expectedLocale = file.replace('.md', '');
      const raw = readFileSync(join(entityDir, file), 'utf-8');
      const { data } = matter(raw);
      parsed[expectedLocale] = data;

      if (data.locale !== expectedLocale) {
        errors.push(
          `[${name}/${entity}/${file}] frontmatter locale is "${data.locale}", expected "${expectedLocale}"`,
        );
      }
    }

    for (const field of invariantFields) {
      const enValue = getByPath(parsed.en, field);
      const ruValue = getByPath(parsed.ru, field);
      if (!valuesEqual(enValue, ruValue)) {
        errors.push(
          `[${name}/${entity}] invariant field "${field}" differs between locales: en=${JSON.stringify(enValue)} ru=${JSON.stringify(ruValue)}`,
        );
      }
    }
  }

  return { count: entityFolders.length, errors };
}

let hasErrors = false;
const summary = [];

for (const collection of COLLECTIONS) {
  const { count, errors } = validateCollection(collection);
  summary.push(`${count} ${collection.name} pairs validated`);
  if (errors.length > 0) {
    hasErrors = true;
    console.error(`\n${collection.name}: ${errors.length} problem(s) found`);
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
  }
}

if (hasErrors) {
  console.error('\nContent validation failed.');
  process.exit(1);
}

console.log(summary.join(', '));
