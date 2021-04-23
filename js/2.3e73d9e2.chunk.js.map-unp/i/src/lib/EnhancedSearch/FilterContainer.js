import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import StringFilter from './FilterTypes/StringFilter';
import BooleanFilter from './FilterTypes/BooleanFilter';
import EnumFilter from './FilterTypes/EnumFilter';
import ObjectFilter from './FilterTypes/ObjectFilter';
import NumberFilter from './FilterTypes/NumberFilter';
import SelectInput from './FilterTypes/SelectInput';
import DateRangeFilter from './FilterTypes/DateRangeFilter';
import { Checkbox } from '../Checkbox';
import { Button } from '../Button';
import { Text } from '../Text';
import { Localization } from '../Localization';
import { i18next } from '../utils';

import TRANSLATIONS from './translations/translations';

class FilterContainer extends React.Component {
  static propTypes = {
    fields: PropTypes.arrayOf(PropTypes.shape()),
    filters: PropTypes.arrayOf(PropTypes.shape()),
    onFiltersChange: PropTypes.func,
    request: PropTypes.func,
    tooltips: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    fields: [],
    filters: [],
    onFiltersChange: () => {},
    request: () => {},
    tooltips: [],
  };

  state = {
    search: '',
    searchFields: [],
  };

  componentDidMount() {
    this.sortSearchFields();
  }

  onSelectedFieldsChange = event => {
    const fieldName = event.target.value;
    const { filters, onFiltersChange } = this.props;

    const newFilters = event.target.checked
      ? filters.concat(this.createEmptyFilter(fieldName))
      : filters.filter(filter => filter.field !== fieldName);

    onFiltersChange(newFilters);
  };

  onFilterChange = changedFilter => {
    const { filters, onFiltersChange } = this.props;
    const newFilters = filters.map(filter =>
      filter.field === changedFilter.field ? changedFilter : filter
    );
    onFiltersChange(newFilters);
  };

  onSearchChange = event => {
    this.setState({ search: event.target.value });
  };

  getTooltipText = name => {
    const { tooltips } = this.props;
    if (tooltips && tooltips.includes(name)) {
      return i18next.t(`tooltips.${name}`);
    }
    return '';
  };

  createEmptyFilter = fieldName => {
    return {
      field: fieldName,
      values: [],
    };
  };

  debounceIfExpensive = type => {
    const expensiveFilterTypes = ['TEXT', 'NUMBER', 'MONEY'];
    if (expensiveFilterTypes.includes(type)) {
      return debounce(this.onFilterChange, 300);
    }
    return this.onFilterChange;
  };

  getTarget = () => {
    return (
      <Button style={{ float: 'right' }} theme="text">
        {Localization.translate('filterContainer.manageSearchFields')}
      </Button>
    );
  };

  sortSearchFields = () => {
    const { filters, fields } = this.props;

    const searchFields = fields.slice();
    const checkedFields = filters.map(filter => filter.field);
    searchFields.sort((a, b) => {
      if (checkedFields.includes(a.name) && !checkedFields.includes(b.name))
        return -1;
      if (!checkedFields.includes(a.name) && checkedFields.includes(b.name))
        return 1;
      if (a.label < b.label) return -1;
      if (a.label > b.label) return 1;
      return 0;
    });

    this.setState({ searchFields });
  };

  UNSAFE_componentWillMount() {
    Localization.setTranslations(TRANSLATIONS);
  }

  renderSelectedFilters = () => {
    const { filters, fields, request } = this.props;

    return filters.map(filter => {
      const field = fields.find(it => it.name === filter.field);
      const { name, type } = field;

      const tooltipText = this.getTooltipText(name);

      const props = {
        field,
        filter,
        key: name,
        onFilterChange: this.debounceIfExpensive(type),
        request,
        tooltipText,
      };

      switch (field.type) {
        case 'TEXT':
          return <StringFilter {...props} />;
        case 'BOOLEAN':
          return <BooleanFilter {...props} />;
        case 'ENUM':
          return <EnumFilter {...props} />;
        case 'NUMBER':
        case 'MONEY':
          return <NumberFilter {...props} />;
        case 'REFERENCE':
        case 'COLLECTION':
          return <ObjectFilter {...props} />;
        case 'DATE_TIME':
          return <DateRangeFilter {...props} />;
        default:
          return field.name;
      }
    });
  };

  renderManageFieldsContent = () => {
    const { search } = this.state;
    return (
      <div className="tooltipSelectDropDown">
        <Text
          placeholder={Localization.translate(
            'filterContainer.searchForAField'
          )}
          value={search}
          onChange={this.onSearchChange}
        />
        <div className="tooltipDropdownOptions">{this.renderOptions()}</div>
      </div>
    );
  };

  renderOptions = () => {
    const { search, searchFields } = this.state;
    const { filters } = this.props;
    const filteredSearchFields = searchFields.filter(field =>
      field.label.toLowerCase().includes(search.toLowerCase())
    );
    const checkedFields = filters.map(filter => filter.field);
    return filteredSearchFields.map(field => (
      <Checkbox
        key={field.name}
        value={field.name}
        checked={checkedFields.includes(field.name)}
        onChange={this.onSelectedFieldsChange}
      >
        {field.label}
      </Checkbox>
    ));
  };

  render() {
    return (
      <div className="filterContainer">
        <div className="manageSearchFields">
          <SelectInput
            arrowStyle="arrowRight"
            content={this.renderManageFieldsContent()}
            contentClassName="content-manageSearchFields"
            onClose={() => {
              this.setState({ search: '' });
              this.sortSearchFields();
            }}
            target={this.getTarget()}
          />
        </div>
        <div className="selectedFilters">{this.renderSelectedFilters()}</div>
      </div>
    );
  }
}

export default FilterContainer;
