import { en } from "./en";
import { hr } from "./hr";

export const dictionaries = {
  en,
  hr,
} as const;

export type AppLanguage = keyof typeof dictionaries;

export const getDictionary = (lang: AppLanguage) => dictionaries[lang] ?? dictionaries.en;
