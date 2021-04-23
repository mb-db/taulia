/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import PropTypes from 'prop-types';
import React from 'react';
import { isString, keys, reduce } from 'lodash';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import { cx } from '../utils';
import { Select } from '../Select';
import { Text } from '../Text';
import inputWrapper from '../inputWrapper';
import countryCodesMap from './countryNames';

const util = PhoneNumberUtil.getInstance();

function getDialCode(countryCode) {
  const dial = util.getCountryCodeForRegion(countryCode);
  if (dial === 0) {
    throw new Error(
      `Unknown country code [${countryCode}] passed to getDialCode()`
    );
  }
  return `+${dial}`;
}

function getCountryCode(dialCode, defaultCountryCode) {
  const list = util.getRegionCodesForCountryCode(dialCode);
  let countryCode = defaultCountryCode;
  if (list.length > 0) {
    if (list.indexOf(defaultCountryCode) === -1) {
      countryCode = list[0];
    }
  }
  return countryCode;
}

let countryData = null;
function getCountryData() {
  if (!countryData) {
    countryData = reduce(
      countryCodesMap,
      (memo, countryName, countryCode) => {
        memo.push({
          countryCode,
          countryName,
          dialCode: getDialCode(countryCode),
        });
        return memo;
      },
      []
    );
  }
  return countryData;
}

export const DEFAULT_COUNTRY_CODE = 'US';

function parseNumber(value = null) {
  if (!value) {
    value = '';
  }
  if (!isString(value)) {
    value = `${value}`;
  }
  const matches = value.match(/\d/g);
  if (matches) {
    return matches.join('');
  }
  return '';
}

function parse(number = null, defaultCountryCode = null) {
  let dialCode = getDialCode(defaultCountryCode, false);
  if (!isString(number) || number.indexOf('+') !== 0) {
    return {
      countryCode: defaultCountryCode,
      dialCode: getDialCode(defaultCountryCode),
      textValue: parseNumber(number),
    };
  }
  number = number.substring(1);
  if (number.indexOf('-') === -1) {
    dialCode = parseInt(number, 10);
    number = '';
  } else if (number.indexOf('-') > -1) {
    dialCode = parseInt(number.split('-')[0], 10);
    number = number.split('-')[1];
  }
  const countryCode = getCountryCode(dialCode, defaultCountryCode);
  return {
    countryCode,
    dialCode: getDialCode(countryCode),
    textValue: number,
  };
}

function isValid(value = null) {
  if (
    !isString(value) ||
    value.indexOf('+') !== 0 ||
    value.indexOf('-') === -1
  ) {
    return false;
  }
  try {
    const dialCode = parseInt(value.split('-')[0], 10);
    const phone = value.split('-')[1];
    const parsed = parse(phone, getCountryCode(dialCode));
    const phoneNumber = util.parse(parsed.textValue, parsed.countryCode);
    return util.isValidNumber(phoneNumber);
  } catch (e) {
    return false;
  }
}

class PhoneNumber extends React.Component {
  static propTypes = {
    defaultOption: PropTypes.string.isRequired,
    defaultCountryCode: PropTypes.oneOf(keys(countryCodesMap)),
    value: PropTypes.string,
  };

  static defaultProps = {
    defaultOption: null,
    defaultCountryCode: DEFAULT_COUNTRY_CODE,
    validationState: null,
    value: '',
  };

  constructor(props) {
    super(props);
    const parsed = parse(props.value, props.defaultCountryCode);

    this.state = {
      countryCodeValue: parsed.countryCode,
      countryWidth: '30%',
      textWidth: '70%',
      focus: false,
    };
  }

  onBlur = e => {
    e.persist();
    this.setState({ focus: false }, () => this.props.onBlur(e));
  };

  onFocus = e => {
    e.persist();
    this.setState({ focus: true }, () => this.props.onFocus(e));
  };

  setParentRef = el => {
    this.parentEl = el;
  };

  getCountryCodeOptions = () => {
    return getCountryData().map(country => {
      return {
        value: country.countryCode,
        label: `(${country.dialCode}) ${country.countryName}`,
      };
    });
  };

  updateCountryCodeValue = countryCodeValue => {
    this.setState({ countryCodeValue }, () => {
      if (this.props.onChange) {
        const parsed = parse(this.props.value, countryCodeValue);
        this.props.onChange(
          `${getDialCode(countryCodeValue)}-${parsed.textValue}`
        );
      }
    });
  };

  updateTextValue = event => {
    if (this.props.onChange) {
      const value = parseNumber(event.target.value);
      const { countryCodeValue } = this.state;
      const dialCode = getDialCode(countryCodeValue);
      try {
        const data = parse(`${dialCode}-${value}`, countryCodeValue);
        const phoneNumber = util.parseAndKeepRawInput(
          data.textValue,
          data.countryCode
        );
        if (!util.isValidNumber(phoneNumber)) {
          throw new Error('Send original number');
        }
        this.props.onChange(`${dialCode}-${phoneNumber.getNationalNumber()}`);
      } catch (e) {
        this.props.onChange(`${dialCode}-${value}`);
      }
    }
  };

  formatTextValue = (data = null) => {
    if (!data) {
      return '';
    }
    if (!this.state.focus) {
      try {
        const phoneNumber = util.parse(data.textValue, data.countryCode);
        return util.format(phoneNumber, PhoneNumberFormat.NATIONAL);
      } catch (e) {
        return data.textValue;
      }
    }
    return data.textValue;
  };

  resize = () => {
    if (this.parentEl) {
      const totalWidth = Math.max(this.parentEl.offsetWidth || 0, 300) - 1;
      const countryWidth = Math.max(
        Math.floor(totalWidth * (30 / 100) + 1),
        150
      );
      this.setState({
        countryWidth,
        textWidth: totalWidth - countryWidth,
      });
    }
  };

  render() {
    const {
      className,
      defaultOption,
      id,
      name,
      validationState,
      value,
    } = this.props;
    const { countryCodeValue, countryWidth, textWidth } = this.state;
    const parsed = parse(value, countryCodeValue);
    if (!countryData) {
      countryData = reduce(
        countryCodesMap,
        (memo, countryName, countryCode) => {
          memo.push({
            countryCode,
            countryName,
            dialCode: getDialCode(countryCode),
          });
          return memo;
        },
        []
      );
    }
    return (
      <div className={cx('tau-phone', className)} ref={this.setParentRef}>
        <div className="tau-phone-country" style={{ width: countryWidth }}>
          <Select
            multiple={false}
            noSearchResultsLabel="No results found"
            onChange={val => this.updateCountryCodeValue(val)}
            options={this.getCountryCodeOptions()}
            placeholder={defaultOption}
            searchPlaceholder="Search"
            value={parsed.countryCode}
          />
        </div>
        <div className="tau-phone-text" style={{ width: textWidth }}>
          <Text
            id={id}
            name={name}
            className="tau-phone-text"
            validationState={validationState}
            value={this.formatTextValue(parsed)}
            onChange={this.updateTextValue}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
          />
        </div>
      </div>
    );
  }
}

const PhoneNumberWrapper = inputWrapper(PhoneNumber);
PhoneNumberWrapper.isValid = isValid;
PhoneNumberWrapper.parse = parse;
export default PhoneNumberWrapper;
