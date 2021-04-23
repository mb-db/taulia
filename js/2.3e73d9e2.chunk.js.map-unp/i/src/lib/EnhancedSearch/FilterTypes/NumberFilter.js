import PropTypes from 'prop-types';
import React from 'react';
import { Localization } from '../../Localization';
import SelectInput from './SelectInput';
import { Radio } from '../../Radio';
import { Text } from '../../Text';
import { cx } from '../../utils';

import TRANSLATIONS from '../translations/translations';

const UNARY_OPERATORS = ['IS_NULL', 'NOT_NULL'];
const TERNARY_OPERATORS = ['BETWEEN', 'NOT_BETWEEN'];

export default class NumberFilter extends React.Component {
  static propTypes = {
    field: PropTypes.shape().isRequired,
    filter: PropTypes.shape().isRequired,
    onFilterChange: PropTypes.func,
    tooltipText: PropTypes.string,
  };

  static defaultProps = {
    onFilterChange: null,
    tooltipText: '',
  };

  constructor(props) {
    super(props);
    const { field, filter } = props;
    this.state = {
      startValue: (filter.values && filter.values[0]) || '',
      endValue: (filter.values && filter.values[1]) || '',
      operator: filter.operator || this.findDefaultOperator(field),
    };
  }

  onOperatorChange = event => {
    const operator = event.target.value;
    this.setState({ operator }, this.fireFilterChange);
  };

  onStartValueChange = event => {
    const startValue = event.target.value;
    this.setState({ startValue }, this.fireFilterChange);
  };

  onEndValueChange = event => {
    const endValue = event.target.value;
    this.setState({ endValue }, this.fireFilterChange);
  };

  findDefaultOperator = field => {
    const operators = field.supportedOperators;
    const defaultOperators = ['LESS_THAN', 'MORE_THAN', 'EQUAL'];
    return defaultOperators.find(it => operators.includes(it));
  };

  fireFilterChange = () => {
    const { startValue, endValue } = this.state;
    let { operator } = this.state;
    const { filter, onFilterChange } = this.props;

    if (startValue && !endValue && operator === 'BETWEEN') {
      operator = 'GREATER_THAN';
    }

    let values;
    if (UNARY_OPERATORS.includes(operator)) {
      values = [];
    } else if (TERNARY_OPERATORS.includes(operator)) {
      values = [Number(startValue), Number(endValue)];
    } else {
      values = [Number(startValue)];
    }

    const updatedFilter = { ...filter, operator, values };

    if (onFilterChange) {
      onFilterChange(updatedFilter);
    }
  };

  isEndValueEnabled = () => {
    const { operator } = this.state;
    return !!(operator === 'BETWEEN' || operator === 'NOT_BETWEEN');
  };

  isEndValueAvailable = () => {
    const { field } = this.props;
    return !!(
      field.supportedOperators.includes('BETWEEN') ||
      field.supportedOperators.includes('NOT_BETWEEN')
    );
  };

  isStartValueEnabled = () => {
    const { operator } = this.state;
    return operator !== 'IS_NULL' && operator !== 'NOT_NULL';
  };

  UNSAFE_componentWillMount() {
    Localization.setTranslations(TRANSLATIONS);
  }

  renderContent = () => {
    const { startValue, endValue } = this.state;
    const na = Localization.translate('filters.na');

    return (
      <div className="filter-content">
        <div className="numberInput">
          <Text
            data-testid="start-value"
            disabled={!this.isStartValueEnabled()}
            onChange={this.onStartValueChange}
            type="number"
            value={this.isStartValueEnabled() ? startValue : na}
          />
          {this.isEndValueAvailable() && (
            <>
              <span className={cx(!this.isEndValueEnabled() && 'disabled')}>
                {Localization.translate('filters.and')}
              </span>
              <Text
                data-testid="end-value"
                disabled={!this.isEndValueEnabled()}
                onChange={this.onEndValueChange}
                type="number"
                value={this.isEndValueEnabled() ? endValue : na}
              />
            </>
          )}
        </div>
        <div className="advancedSearchOperators">{this.renderOperators()}</div>
      </div>
    );
  };

  renderSelectedContent = () => {
    const { startValue, endValue, operator } = this.state;
    let returnStr = '';
    if (startValue || !this.isStartValueEnabled()) {
      returnStr += Localization.translate(`operators.${operator}`);
    }
    if (this.isStartValueEnabled()) {
      returnStr += ` ${startValue}`;
    }
    if (this.isEndValueEnabled()) {
      returnStr += ` ${Localization.translate('filters.and')} ${endValue}`;
    }
    return returnStr.trim() ? [returnStr] : [];
  };

  renderOperators = () => {
    const { field } = this.props;
    const { operator } = this.state;

    return field.supportedOperators.map(supportedOperator => {
      return (
        <Radio
          data-testid={supportedOperator}
          key={supportedOperator}
          value={supportedOperator}
          checked={supportedOperator === operator}
          onChange={this.onOperatorChange}
        >
          {Localization.translate(`operators.${supportedOperator}`)}
        </Radio>
      );
    });
  };

  render() {
    const { tooltipText, field } = this.props;
    return (
      <div className="filterSelect numberFilter">
        <SelectInput
          className="numberFilter"
          content={this.renderContent()}
          label={field.label}
          selectedContent={this.renderSelectedContent()}
          tooltipText={tooltipText}
        />
      </div>
    );
  }
}
