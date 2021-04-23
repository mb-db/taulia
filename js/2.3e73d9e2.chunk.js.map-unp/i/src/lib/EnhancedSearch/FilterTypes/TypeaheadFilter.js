import PropTypes from 'prop-types';
import React from 'react';
import SelectInput from './SelectInput';
import { Checkbox } from '../../Checkbox';
import { Localization } from '../../Localization';
import { Button } from '../../Button';
import { Text } from '../../Text';

import TRANSLATIONS from '../translations/translations';

export default class TypeaheadFilter extends React.Component {
  static propTypes = {
    field: PropTypes.shape({ label: PropTypes.string }).isRequired,
    filter: PropTypes.shape({
      values: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    maxOptions: PropTypes.number,
    onFilterChange: PropTypes.func,
    optionsGetter: PropTypes.func.isRequired,
    tooltipText: PropTypes.string,
  };

  static defaultProps = {
    onFilterChange: () => {},
    maxOptions: 100,
    tooltipText: '',
  };

  state = {
    search: '',
    selectedOptions: [],
    options: [],
    hasMore: false,
  };

  componentDidMount() {
    // Load the labels for the initially selected options.
    this.loadInitialOptions();
  }

  componentDidUpdate(prevProps) {
    const { filter } = this.props;
    if (prevProps.filter.values !== filter.values) {
      this.loadInitialOptions();
    }
  }

  onCheckboxChange = event => {
    const { value, checked } = event.target;
    const { filter, onFilterChange } = this.props;
    const { selectedOptions, options } = this.state;

    let selectedOptionsCopy = [...selectedOptions];
    if (checked) {
      selectedOptionsCopy.push(options.find(option => option.value === value));
    } else {
      selectedOptionsCopy = selectedOptionsCopy.filter(
        option => option.value !== value
      );
    }
    selectedOptionsCopy.sort(this.compareOptions);

    this.setState({ selectedOptions: selectedOptionsCopy });

    const selectedValues = selectedOptionsCopy.map(it => it.value);
    const updatedFilter = {
      ...filter,
      operator: 'EQUAL',
      values: selectedValues,
    };

    onFilterChange(updatedFilter);
  };

  onTextSearchChange = event => {
    const search = event.target.value;

    // The search text changed, so load the new options.
    this.setState({ search }, this.loadSearchOptions);
  };

  onClose = () => {
    this.setState({ search: '' });
  };

  onShow = () => {
    this.loadSearchOptions();
  };

  loadInitialOptions = () => {
    const { filter, optionsGetter } = this.props;
    const selectedValues = filter.values || [];

    // Load options that have the given values (if there are any).
    const loader = selectedValues.length
      ? optionsGetter({ values: selectedValues })
      : Promise.resolve([]);

    loader.then(selectedOptions => {
      // Now that we have the selected options, load the search options.
      this.setState({ selectedOptions }, this.loadSearchOptions);
    });
  };

  loadSearchOptions = () => {
    const { optionsGetter, maxOptions } = this.props;
    const { search, selectedOptions } = this.state;
    const selectedValues = selectedOptions.map(it => it.value);

    // Load options that have the given search text.
    optionsGetter({ search, maxOptions }).then(searchOptions => {
      // Determine if there are potentially more options than we could show.
      const hasMore = searchOptions.length >= maxOptions;

      // Remove the options that are already selected (those will go at the top).
      const filteredSearchOptions = searchOptions.filter(
        option => !selectedValues.includes(option.value)
      );

      // Include both the selected options and the search options.
      const options = [...selectedOptions, ...filteredSearchOptions];

      this.setState({ options, hasMore });
    });
  };

  compareOptions = (a, b) => {
    // If there is an `order` specified for the options, use it.
    if (a.order || b.order) {
      return (a.order || 0) - (b.order || 0);
    }

    // Otherwise, just sort by the label.
    return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
  };

  clearOptions = () => {
    const { filter, onFilterChange } = this.props;
    const updatedFilter = {
      ...filter,
      operator: 'EQUAL',
      values: [],
    };
    onFilterChange(updatedFilter);
  };

  UNSAFE_componentWillMount() {
    Localization.setTranslations(TRANSLATIONS);
  }

  renderContent() {
    const { search, selectedOptions, options, hasMore } = this.state;
    const selectedValues = selectedOptions.map(it => it.value);

    const renderedOptions = options.map(option => {
      return (
        <div key={option.value}>
          <Checkbox
            checked={selectedValues.includes(option.value)}
            className="option"
            data-testid={option.value}
            onChange={this.onCheckboxChange}
            value={option.value}
          >
            {option.label}
          </Checkbox>
        </div>
      );
    });
    return (
      <div className="filter-content">
        <div className="search">
          <Text
            onChange={this.onTextSearchChange}
            placeholder={Localization.translate('filters.search')}
            type="text"
            value={search}
          />
        </div>
        <Button
          onClick={this.clearOptions}
          style={{ margin: '10px 0 0' }}
          theme="text"
        >
          {Localization.translate('filters.clear')}
        </Button>
        <div className="typeaheadOptions">
          {renderedOptions}
          {hasMore && (
            <div className="more">
              &#40;
              {Localization.translate('filters.searchForMore')}
              &#41;
            </div>
          )}
        </div>
      </div>
    );
  }

  render() {
    const { field, tooltipText } = this.props;
    const { selectedOptions } = this.state;
    const selectedLabels = selectedOptions.map(option => option.label);

    return (
      <div className="filterSelect">
        <SelectInput
          className="typeaheadFilter"
          content={this.renderContent()}
          label={field.label}
          onClose={this.onClose}
          onShow={this.onShow}
          selectedContent={selectedLabels}
          tooltipText={tooltipText}
          width={350}
        />
      </div>
    );
  }
}
