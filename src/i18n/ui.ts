export const ui = {
  en: {
    meta: { title: 'Alexei Petrachuk' },
    sidebar: {
      name: 'Alexei Petrachuk',
      role: 'Backend Developer',
      pitch: 'Software engineer specializing in the development and design of server-side applications',
      langSwitchLabel: 'Switch to Russian',
    },
    nav: { about: 'About', experience: 'Experience', projects: 'Projects' },
    experience: { present: 'Present', viewFullResume: 'View Full Résumé' },
    projects: { seeAll: 'See all projects', seeAllSuffix: 'petrachuk.dev' },
  },
  ru: {
    meta: { title: 'Алексей Петрачук' },
    sidebar: {
      name: 'Алексей Петрачук',
      role: 'Backend Developer',
      pitch: 'Инженер-программист, специализирующийся на создании и проектировании серверных приложений',
      langSwitchLabel: 'Переключиться на английский',
    },
    nav: { about: 'Обо мне', experience: 'Опыт', projects: 'Проекты' },
    experience: { present: 'по наст. время', viewFullResume: 'Посмотреть полное резюме' },
    projects: { seeAll: 'Все проекты', seeAllSuffix: 'petrachuk.dev' },
  },
} as const;

export type Locale = keyof typeof ui;

export function useTranslations(locale: Locale) {
  return ui[locale];
}
