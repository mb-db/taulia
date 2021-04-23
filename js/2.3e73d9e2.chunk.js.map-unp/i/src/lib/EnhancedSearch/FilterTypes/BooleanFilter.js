import PropTypes from 'prop-types';
import React from 'react';
import SelectInput from './SelectInput';
import { Checkbox } from '../../Checkbox';
import { Localization } from '../../Localization';

import TRANSLATIONS from '../translations/translations';

export default class BooleanFilter extends React.Component {
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

    const { filter } = this.props;

    this.state = {
      trueOptionChecked: filter.values ? filter.values.includes(true) : false,
      falseOptionChecked: filter.values ? filter.values.includes(false) : false,
    };
  }

  onCheckboxChange = event => {
    const { value, checked } = event.target;
    const { trueOptionChecked, falseOptionChecked } = this.state;

    this.setState(
      {
        trueOptionChecked: value === 'true' ? checked : trueOptionChecked,
        falseOptionChecked: value === 'false' ? checked : falseOptionChecked,
      },
      this.fireFilterChange
    );
  };

  getBooleanOptions() {
    const { field } = this.props;
    const { trueLabel, falseLabel } = field;
    const { falseOptionChecked, trueOptionChecked } = this.state;

    return [
      { value: true, label: trueLabel, checked: trueOptionChecked },
      { value: false, label: falseLabel, checked: falseOptionChecked },
    ];
  }

  getSelectedContent() {
    const { field } = this.props;
    const { trueLabel, falseLabel } = field;
    const { trueOptionChecked, falseOptionChecked } = this.state;

    const selectedContent = [];
    if (trueOptionChecked) selectedContent.push(trueLabel);
    if (falseOptionChecked) selectedContent.push(falseLabel);
    return selectedContent;
  }

  fireFilterChange() {
    const { onFilterChange, filter } = this.props;
    const { trueOptionChecked, falseOptionChecked } = this.state;

    const values = [];
    if (trueOptionChecked) {
      values.push(true);
    }
    if (falseOptionChecked) {
      values.push(false);
    }
    const updatedFilter = { ...filter, operator: 'EQUAL', values };

    onFilterChange(updatedFilter);
  }

  UNSAFE_componentWillMount() {
    Localization.setTranslations(TRANSLATIONS);
  }

  renderOptions() {
    const options = this.getBooleanOptions();
    return options.map(option => {
      return (
        <Checkbox
          checked={option.checked}
          className="option"
          data-testid={option.value}
          key={option.value}
          onChange={this.onCheckboxChange}
          value={option.value}
        >
          {Localization.translate(option.label)}
        </Checkbox>
      );
    });
  }

  renderContent() {
    return <div className="filter-content">{this.renderOptions()}</div>;
  }

  render() {
    const { field, tooltipText } = this.props;

    return (
      <div className="filterSelect">
        <SelectInput
          className="booleanFilter"
          label={field.label}
          content={this.renderContent()}
          selectedContent={this.getSelectedContent()}
          tooltipText={tooltipText}
        />
      </div>
    );
  }
}
