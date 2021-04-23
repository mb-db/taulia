import PropTypes from 'prop-types';
import React from 'react';
import SelectInput from './SelectInput';
import { Radio } from '../../Radio';
import { Button } from '../../Button';
import { Localization } from '../../Localization';
import { Text } from '../../Text';

import TRANSLATIONS from '../translations/translations';

const UNARY_OPERATORS = ['IS_NULL', 'NOT_NULL'];

export default class StringFilter extends React.Component {
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
      advancedSearch: false,
      defaultOperator: this.findDefaultOperator(field),
      operator: filter.operator || this.findDefaultOperator(field),
      textValue: (filter.values && filter.values[0]) || '',
    };
  }

  onTextChange = event => {
    const textValue = event.target.value;
    this.setState({ textValue }, this.fireFilterChange);
  };

  onOperatorChange = event => {
    const operator = event.target.value;
    this.setState({ operator }, this.fireFilterChange);
  };

  fireFilterChange = () => {
    const { textValue, operator } = this.state;
    const { filter, onFilterChange } = this.props;

    const values = !UNARY_OPERATORS.includes(operator) ? [textValue] : [];

    const updatedFilter = { ...filter, operator, values };

    if (onFilterChange) {
      onFilterChange(updatedFilter);
    }
  };

  findDefaultOperator = field => {
    const operators = field.supportedOperators;

    // Use these operators as the default, in this order of precedence.
    const defaultOperators = ['CONTAINS', 'STARTS_WITH', 'EQUAL'];

    return defaultOperators.find(it => operators.includes(it));
  };

  toggleAdvancedSearch = () => {
    const { advancedSearch } = this.state;
    this.setState({ advancedSearch: !advancedSearch });
  };

  retrieveSelectedContent() {
    const { textValue, operator, defaultOperator } = this.state;
    if (textValue || operator !== defaultOperator) {
      return [
        `${Localization.translate(`operators.${operator}`).toLowerCase()} ${
          textValue && !UNARY_OPERATORS.includes(operator) ? textValue : ''
        }`,
      ];
    }
    return [];
  }

  UNSAFE_componentWillMount() {
    Localization.setTranslations(TRANSLATIONS);
  }

  renderOperators() {
    const { field } = this.props;
    const { operator } = this.state;

    return field.supportedOperators.map(supportedOperator => {
      return (
        <Radio
          checked={supportedOperator === operator}
          data-testid={supportedOperator}
          key={supportedOperator}
          onChange={this.onOperatorChange}
          value={supportedOperator}
        >
          {Localization.translate(`operators.${supportedOperator}`)}
        </Radio>
      );
    });
  }

  renderContent() {
    const { field } = this.props;
    const { textValue, operator, advancedSearch } = this.state;

    const disabled = UNARY_OPERATORS.includes(operator);

    return (
      <div className="filter-content">
        <Text
          data-testid="string-filter-input"
          disabled={disabled}
          onChange={this.onTextChange}
          placeholder={`${Localization.translate('filters.placeholderLabel', {
            field: field.label,
          })} `}
          value={textValue}
        />
        <div className="advancedSearchToggle">
          <Button theme="text" onClick={this.toggleAdvancedSearch}>
            {Localization.translate('filters.advancedSearch')}
          </Button>
        </div>
        {advancedSearch && (
          <div className="advancedSearchOperators">
            {this.renderOperators()}
          </div>
        )}
      </div>
    );
  }

  render() {
    const { field, tooltipText } = this.props;

    return (
      <div className="filterSelect">
        <SelectInput
          className="stringFilter"
          label={field.label}
          content={this.renderContent()}
          selectedContent={this.retrieveSelectedContent()}
          tooltipText={tooltipText}
        />
      </div>
    );
  }
}
