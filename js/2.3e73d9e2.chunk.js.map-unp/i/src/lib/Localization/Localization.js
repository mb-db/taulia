/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
import {
  difference,
  extend,
  isArray,
  isEmpty,
  isNumber,
  isString,
  keys,
  merge,
  reduce,
  template,
  trim,
} from 'lodash';
import warning from 'warning';
import invariant from 'invariant';
import { getCookie, isCookieEnabled } from 'tiny-cookie';
import { EventEmitter } from 'events';
import objectPath from 'object-path';
import { detectBrowserLanguage, setProfileCookie } from '../utils';

export const LOCALE_STORAGE_KEY = 'profile';
export const SUPPORTED_LOCALES = [
  'cs-CZ',
  'de',
  'el-GR',
  'en-GB',
  'en-US',
  'es',
  'fr-CA',
  'fr',
  'it',
  'ja-JP',
  'ko-KO',
  'nl',
  'no-NO',
  'pl-PL',
  'pt',
  'sl-SI',
  'sv-SE',
  'zh-CN',
];
export const DEFAULT_LOCALE = 'en-US';
export const DEFAULT_SILENT_VALUE =
  process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'testing';

const silentKey = Symbol('LOCALIZATION_SILENT_KEY');
const translationsKey = Symbol('LOCALIZATION_TRANSLATIONS_KEY');
const localeKey = Symbol('LOCALIZATION_LOCALE_KEY');

const defaultTranslations = reduce(
  SUPPORTED_LOCALES,
  (memo, locale) => {
    memo[locale] = {};
    return memo;
  },
  {}
);

class Localization extends EventEmitter {
  constructor() {
    super();
    this.reset();
  }

  reset() {
    this[localeKey] = DEFAULT_LOCALE;
    this[silentKey] = DEFAULT_SILENT_VALUE;
    this.setTranslations(defaultTranslations, false);
    return this;
  }

  setSilent(silent = true) {
    this[silentKey] = silent === true;
    return this;
  }

  setTranslations(translations, mergeExisting = true) {
    const parsedTranslations = this.parseTranslationsJson(translations);
    if (mergeExisting) {
      this[translationsKey] = merge(
        {},
        this[translationsKey],
        parsedTranslations
      );
    } else {
      this[translationsKey] = extend(
        {},
        defaultTranslations,
        parsedTranslations
      );
    }
    // update the monolith cookie for backwards compatibility
    if (isCookieEnabled) {
      let locale = null;
      try {
        const cookieVal = JSON.parse(getCookie(LOCALE_STORAGE_KEY)).language;
        if (cookieVal) {
          locale = cookieVal;
        }
      } catch (e) {
        locale = null;
      }
      if (!locale) {
        locale = detectBrowserLanguage();
      }
      if (!locale) {
        locale = DEFAULT_LOCALE;
      }
      this.setLocale(locale);
    }
    // emit 'updateTranslations' event
    this.emit('updateTranslations', translations);
    return this;
  }

  setTranslationsFromContext(requireContext) {
    const json = reduce(
      requireContext.keys(),
      (obj, file) => {
        const name = file
          .split(/(\\|\/)/g)
          .pop()
          .replace(/(\.[^.]*)$/, '');
        obj[name] = requireContext(file);
        return obj;
      },
      {}
    );
    return this.setTranslations(json);
  }

  setLocale(value) {
    const oldLocale = this.getLocale();
    let newLocale = value && isString(value) ? value.replace('_', '-') : null;
    if (newLocale && SUPPORTED_LOCALES.indexOf(newLocale) === -1) {
      warning(
        this[silentKey],
        `Supplied locale [${value}] cannot be set because it in unsupported`
      );
      newLocale = oldLocale;
    }
    if (newLocale !== oldLocale) {
      this[localeKey] = newLocale;
      // Emit 'updateLocale' event
      this.emit('updateLocale', newLocale, oldLocale);
    }
    setProfileCookie(newLocale);
    return this;
  }

  parseTranslationsJson(translations) {
    const missing = [];
    const parsed = reduce(
      SUPPORTED_LOCALES,
      (memo, locale) => {
        if (!translations[locale]) {
          missing.push(locale);
          return memo;
        }
        memo[locale] = translations[locale];
        return memo;
      },
      {}
    );
    warning(
      this[silentKey] || missing.length === 0,
      `Supplied translations do not contain data for all supported translations. Missing locales: [${missing.join(
        ', '
      )}]`
    );
    const additional = difference(keys(translations), SUPPORTED_LOCALES);
    warning(
      this[silentKey] || additional.length === 0,
      `Supplied translations contain additional locales that are unsupported. Additional locales: [${additional.join(
        ', '
      )}]`
    );
    return parsed;
  }

  getLocale() {
    return this[localeKey];
  }

  getPreferredLocale(locale = null) {
    let preferredLocale = null;
    if (
      locale &&
      SUPPORTED_LOCALES.indexOf(locale) > -1 &&
      this[translationsKey][locale]
    ) {
      preferredLocale = locale;
    } else {
      warning(
        this[silentKey] || locale === null,
        `Unable to fetch translations for locale [${locale}] (it is unsupported)`
      );
      preferredLocale = this.getLocale();
    }
    return preferredLocale;
  }

  getSupportedLocales = () => {
    return SUPPORTED_LOCALES.slice(0);
  };

  getAllTranslations() {
    return this[translationsKey];
  }

  getTranslationsForLocale(locale = null) {
    return this[translationsKey][this.getPreferredLocale(locale)];
  }

  hasTranslation(locale = null, key) {
    const translationForLocale = this.getTranslationsForLocale(locale);
    return objectPath.has(translationForLocale, key);
  }

  translate(code, props = {}) {
    const { locale = null, fallback = null, count = null, ...opts } = props;
    const options = extend({}, { silent: this[silentKey] }, opts);
    const { silent, ...args } = options;
    const translations = this.getTranslationsForLocale(locale);
    let rawString = objectPath.get(translations, code);
    if (!rawString) {
      // If no translation provided, default to English
      const defaultTranslationSet = this.getTranslationsForLocale(
        DEFAULT_LOCALE
      );
      rawString = objectPath.get(defaultTranslationSet, code);
    }
    if (isArray(rawString)) {
      invariant(
        silent || isNumber(count),
        `Code [${code}] is a pluralization type translation - please use argument 'count' with it.`
      );
      invariant(
        silent || rawString.length === 3,
        `Code [${code}] is a pluralization type translation, and it needs three possible array values. First for 'count = 0', second for 'count = 1' and third for 'count > 1'`
      );
      if (count === 0) {
        rawString = rawString[0];
      }
      if (count === 1) {
        rawString = rawString[1];
      }
      if (count > 1) {
        rawString = rawString[2];
      }
    }
    let parsed = null;
    try {
      parsed = template(rawString, {
        escape: /<%-([\s\S]+?)%>/g,
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /{{([\s\S]+?)}}/g,
        variable: '',
      })(args);
    } catch (e) {
      warning(
        silent,
        `Parsing error while translating code [${code}]: ${e.message}`
      );
      parsed = '';
    }
    if (isEmpty(trim(parsed))) {
      if (fallback != null) {
        return fallback;
      }
      return code;
    }
    return parsed;
  }
}

const instance = new Localization();

if (process.env.NODE_ENV !== 'production') {
  window.Localization = instance;
}

export default instance;
