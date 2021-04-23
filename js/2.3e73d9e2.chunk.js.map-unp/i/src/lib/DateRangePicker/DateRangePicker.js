import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import * as locales from 'date-fns/locale/';
import { Localization } from '../Localization';
import { cx } from '../utils';

const localeMap = {
  'el-GR': 'el',
  'en-GB': 'enGB',
  'en-US': 'enUS',
  'fr-CA': 'fr',
  'ja-JP': 'ja',
  'ko-KO': 'ko',
  'no-NO': 'nb',
  'pl-PL': 'pl',
  'sl-SI': 'sl',
  'sv-SE': 'sv',
  'zh-CN': 'zhCN',
};

const DateRangePicker = ({
  disabled,
  endDate,
  endError,
  endLabel,
  localeOverride,
  onChangeDate,
  startDate,
  startError,
  startLabel,
}) => {
  const [start, setStart] = useState();
  const [end, setEnd] = useState();

  const locale = localeOverride || Localization.getLocale();
  const dateFormat = locale === 'en-US' ? 'M/d/yyyy' : 'yyyy/MM/dd';

  useEffect(() => {
    // Localize names of days/months
    const translationString = localeMap[locale] || locale;
    registerLocale('translations', locales[translationString]);
    setDefaultLocale('translations');
  });

  useEffect(() => {
    if (startDate) setStart(new Date(startDate));
    if (endDate) setEnd(new Date(endDate));
  }, [startDate, endDate]);

  const handleStartChange = newStartDate => {
    setStart(newStartDate);

    if (end && newStartDate > end) {
      setEnd(newStartDate);
      onChangeDate([newStartDate, newStartDate]);
    } else {
      onChangeDate([newStartDate, end]);
    }
  };

  const handleEndChange = newEndDate => {
    setEnd(newEndDate);

    if (start && newEndDate < start) {
      setStart(newEndDate);
      onChangeDate([newEndDate, newEndDate]);
    } else {
      onChangeDate([start, newEndDate]);
    }
  };

  return (
    <div data-testid="date-range-picker" className="date-range">
      <label
        className={cx(startError ? 'has-error' : null)}
        htmlFor="datePickerStart"
      >
        <strong>{startLabel}</strong>
        <DatePicker
          autoComplete="off"
          dateFormat={dateFormat}
          disabled={disabled}
          endDate={end}
          id="datePickerStart"
          onChange={handleStartChange}
          selected={start}
          selectsStart
          startDate={start}
        />
      </label>
      <label
        className={cx(endError ? 'has-error' : null)}
        htmlFor="datePickerEnd"
      >
        <strong>{endLabel}</strong>
        <DatePicker
          autoComplete="off"
          dateFormat={dateFormat}
          disabled={disabled}
          endDate={end}
          id="datePickerEnd"
          onChange={handleEndChange}
          selected={end}
          selectsEnd
          startDate={start}
        />
      </label>
    </div>
  );
};

DateRangePicker.propTypes = {
  disabled: PropTypes.bool,
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  endError: PropTypes.bool,
  endLabel: PropTypes.string,
  localeOverride: PropTypes.string,
  onChangeDate: PropTypes.func,
  startDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  startError: PropTypes.bool,
  startLabel: PropTypes.string,
};

DateRangePicker.defaultProps = {
  disabled: false,
  endDate: null,
  endError: false,
  endLabel: 'End Date',
  localeOverride: '',
  onChangeDate: () => null,
  startDate: null,
  startError: false,
  startLabel: 'Start Date',
};

export default DateRangePicker;
