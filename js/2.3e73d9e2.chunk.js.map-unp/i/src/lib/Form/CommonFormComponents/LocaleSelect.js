import PropTypes from 'prop-types';
import React from 'react';
import { Field, FieldLabel } from '..';
import { Translate, Select } from '../..';
import { Localization } from '../../Localization';
import TRANSLATIONS from '../translations/translations';

Localization.setTranslations(TRANSLATIONS);

const localeOptions = [
  { label: 'Český', value: 'cs-CZ' },
  { label: 'Deutsch', value: 'de' },
  { label: 'English (UK)', value: 'en-GB' },
  { label: 'English (US)', value: 'en-US' },
  { label: 'Στα Αγγλικά', value: 'el-GR' },
  { label: 'Español', value: 'es' },
  { label: 'Français (Canadien)', value: 'fr-CA' },
  { label: 'Français', value: 'fr' },
  { label: 'Italiano', value: 'it' },
  { label: '日本語', value: 'ja-JP' },
  { label: '한국어', value: 'ko-KO' },
  { label: 'Nederlands', value: 'nl' },
  { label: 'Norsk', value: 'no-NO' },
  { label: 'Polski', value: 'pl-PL' },
  { label: 'Português', value: 'pt' },
  { label: 'Slovenski', value: 'sl-SI' },
  { label: 'Svenska', value: 'sv-SE' },
  { label: '中文 (中国)', value: 'zh-CN' },
];

function LocaleSelect({ locale, maxHeight, updateLocale }) {
  return (
    <Field>
      <FieldLabel htmlFor="locale">
        <Translate code="locale.label" />
      </FieldLabel>
      <Select
        enableSearch={false}
        id="locale"
        maxHeight={maxHeight}
        multiple={false}
        name="locale"
        onChange={value => updateLocale(value)}
        options={localeOptions}
        placeholder={Localization.translate('locale.options.default')}
        value={locale.value}
      />
    </Field>
  );
}

LocaleSelect.propTypes = {
  locale: PropTypes.shape(),
  maxHeight: PropTypes.number,
  updateLocale: PropTypes.func,
};

LocaleSelect.defaultProps = {
  locale: {
    value: 'en-US',
    error: null,
  },
  maxHeight: null,
  updateLocale: () => null,
};

export default LocaleSelect;
