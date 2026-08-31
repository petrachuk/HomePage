export const ui = {
  en: {
    // Written for English search intent, not translated from the RU copy.
    // Every claim traces to migrated content: "backend developer",
    // "high-load server applications" and "architecture, performance,
    // scalability" are from about/en.md; "banking systems" from the
    // Experience organizations. No job title — the EN About / EN Experience
    // titles disagree in the source and that is unresolved.
    meta: {
      title: 'Alexei Petrachuk — Backend Developer',
      description:
        'Backend developer building high-load server applications for banking systems: architecture, performance, scalability. Experience, projects, contacts.',
      ogImageAlt: 'Alexei Petrachuk',
    },
    sidebar: {
      name: 'Alexei Petrachuk',
      role: 'Backend Developer',
      pitch: 'Software engineer specializing in the development and design of server-side applications',
      langSwitchLabel: 'Switch to Russian',
    },
    // `label` names the <nav> landmark itself and is never rendered visually.
    // It must not be one of the item names below: a landmark called "About"
    // announces the whole menu as the About section.
    nav: {
      label: 'Section navigation',
      about: 'About',
      experience: 'Experience',
      projects: 'Projects',
    },
    experience: { present: 'Present', viewFullResume: 'View Full Résumé' },
    projects: { seeAll: 'See all projects', seeAllSuffix: 'petrachuk.dev' },
  },
  ru: {
    // Written for Russian search intent, not translated from the EN copy.
    meta: {
      title: 'Алексей Петрачук — backend-разработчик',
      description:
        'Backend-разработчик высоконагруженных серверных приложений для банковских систем. Архитектура, производительность, масштабируемость. Опыт и контакты.',
      ogImageAlt: 'Алексей Петрачук',
    },
    sidebar: {
      name: 'Алексей Петрачук',
      role: 'Backend Developer',
      pitch: 'Инженер-программист, специализирующийся на создании и проектировании серверных приложений',
      langSwitchLabel: 'Переключиться на английский',
    },
    nav: {
      label: 'Навигация по разделам',
      about: 'Обо мне',
      experience: 'Опыт',
      projects: 'Проекты',
    },
    experience: { present: 'по наст. время', viewFullResume: 'Посмотреть полное резюме' },
    projects: { seeAll: 'Все проекты', seeAllSuffix: 'petrachuk.dev' },
  },
} as const;

export type Locale = keyof typeof ui;

export function useTranslations(locale: Locale) {
  return ui[locale];
}
