import en, { type Translations } from './lang/en';
import zh from './lang/zh';

const locales: Record<string, Translations> = {
  en,
  zh,
  'zh-cn': zh,
  'zh-tw': zh,
};

function getLocale(): string {
  // window.moment is always available in Obsidian
  return (window as any).moment?.locale?.()?.toLowerCase() ?? 'en';
}

/**
 * Translate a key, optionally interpolating `{placeholder}` tokens.
 *
 * Example:
 *   t('NOTICE_WORD_ADDED', { word: 'foo', count: 3 })
 *   // en → 'Added: foo (3 total)'
 *   // zh → '已加入：foo（共 3 个）'
 */
export function t(key: keyof Translations, params?: Record<string, string | number>): string {
  const locale = getLocale();
  const dict = locales[locale] ?? en;
  let str = dict[key] ?? en[key];
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(`{${k}}`, String(v));
    }
  }
  return str;
}
