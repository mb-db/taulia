const SUPPORTED_LOCALES = [
  'cs-CZ',
  'de',
  'el-GR',
  'en-US',
  'en-GB',
  'es',
  'fr',
  'fr-CA',
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

export default () => {
  const nav = window.navigator;
  if (nav.languages) {
    for (let i = 0; i < nav.languages.length; i += 1) {
      const language = nav.languages[i];
      if (SUPPORTED_LOCALES.indexOf(language) > -1) {
        return language;
      }
    }
  }
  const browserLanguageKeys = [
    'language',
    'browserLanguage',
    'systemLanguage',
    'userLanguage',
  ];
  // Support for other well known properties in browsers
  for (let i = 0; i < browserLanguageKeys.length; i += 1) {
    const language = nav[browserLanguageKeys[i]];
    if (SUPPORTED_LOCALES.indexOf(language) > -1) {
      return language;
    }
  }
  // If still no language, check for main language by looking for language before hyphen
  if (nav.languages) {
    for (let i = 0; i < nav.languages.length; i += 1) {
      const partialLocale = nav.languages[i].split('-')[0];
      const language = SUPPORTED_LOCALES.find(
        item => item.indexOf(partialLocale) === 0
      );
      if (language) return language;
    }
  }
  return 'en-US';
};
