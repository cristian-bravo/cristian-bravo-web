import * as es from './es';
import * as en from './en';

export type Lang = 'es' | 'en';
export type AppData = typeof es;

export const getData = (lang: Lang = 'es'): AppData => {
  switch (lang) {
    case 'en':
      return en as AppData;
    case 'es':
    default:
      return es;
  }
};

export * from './es/blog';
export * from './es/contact';
export * from './es/development-request';
export * from './es/home';
export * from './es/profile';
export * from './es/projects';
export * from './es/services';
