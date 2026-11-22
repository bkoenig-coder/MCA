import i18n from '../i18n';

type Bundle = Record<string, Record<string, unknown>>;

/**
 * Adds a page's translations to the app. Call it at the top of a lazily loaded page, so that page's text
 * is downloaded together with the page instead of with the whole site.
 */
export function registerTranslations(bundle: Bundle) {
  for (const lng of Object.keys(bundle)) {
    i18n.addResourceBundle(lng, 'translation', bundle[lng], true, true);
  }
}
