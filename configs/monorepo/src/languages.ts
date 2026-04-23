export const languages = ['en', 'fr'] as const;

export type Language = (typeof languages)[number];

export const languageLabels: Record<Language, string> = {
  en: 'English',
  fr: 'Francais',
};

export function isLanguage(value: string): value is Language {
  return languages.includes(value as Language);
}
