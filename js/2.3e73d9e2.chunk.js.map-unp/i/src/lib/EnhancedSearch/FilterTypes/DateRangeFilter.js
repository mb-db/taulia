import React from 'react';
import PropTypes from 'prop-types';
import { Localization } from '../../Localization';
import { DateRangePicker } from '../../DateRangePicker';
import { Button } from '../../Button';
import SelectInput from './SelectInput';

import TRANSLATIONS from '../translations/translations';

export default class DateRangeFilter extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    field: PropTypes.shape({ label: PropTypes.string }).isRequired,
    filter: PropTypes.shape({
      values: PropTypes.arrayOf(PropTypes.string),
      operator: PropTypes.string,
    }).isRequired,
    onFilterChange: PropTypes.func,
  };

  static defaultProps = {
    disabled: false,
    onFilterChange: () => {},
  };

  state = {
    isDatePickerOpen: false,
    selectInputLabel: [],
  };

  componentDidMount() {
    // Add correct label to input on load
    const { filter } = this.props;
    if (!filter.values?.length) {
      this.setState({
        selectInputLabel: [Localization.translate('date.allTime')],
      });
    } else {
      const dates = [...filter.values];
      if (dates.length === 1) {
        if (filter.operator === 'GREATER_THAN_EQUAL') {
          dates.push(null);
        } else {
          dates.unshift(null);
        }
      }
      const { inputLabel } = this.createSelectInputLabelOperator(dates);
      this.setState({ selectInputLabel: [inputLabel] });
    }
  }

  fireFilterChange = (dates, operator = 'BETWEEN') => {
    const { onFilterChange, filter } = this.props;
    const values = dates.filter(date => date).map(date => date.toISOString());
    const updatedFilter = { ...filter, operator, values };
    onFilterChange(updatedFilter);
  };

  createSelectInputLabelOperator = dates => {
    const [start, end] = dates;
    const locale = Localization.getLocale();
    const formattedStart = new Date(start).toLocaleDateString(locale);
    const formattedEnd = new Date(end).toLocaleDateString(locale);
    if (!start) {
      return {
        operator: 'LESS_THAN_EQUAL',
        inputLabel: `${Localization.translate('date.before')} ${formattedEnd}`,
      };
    }
    if (!end) {
      return {
        operator: 'GREATER_THAN_EQUAL',
        inputLabel: `${Localization.translate('date.after')} ${formattedStart}`,
      };
    }
    return {
      operator: 'BETWEEN',
      inputLabel: `${formattedStart} - ${formattedEnd}`,
    };
  };

  handleCustomDatesClick = dates => {
    const { operator, inputLabel } = this.createSelectInputLabelOperator(dates);
    this.fireFilterChange(dates, operator);
    this.setState({ selectInputLabel: [inputLabel] });
  };

  renderContent = () => {
    const { disabled, filter } = this.props;
    const { isDatePickerOpen } = this.state;
    const now = new Date(Date.now());
    let start;
    let end;
    if (filter?.values) {
      const dates = [...filter.values];
      if (dates.length === 1) {
        if (filter.operator === 'GREATER_THAN_EQUAL') {
          dates.push(null);
        } else {
          dates.unshift(null);
        }
      }
      [start, end] = dates;
    }

    const dateList = [
      {
        label: Localization.translate('date.allTime'),
        dates: [],
      },
      {
        label: Localization.translate('date.currentDay'),
        dates: [new Date(new Date(now).setDate(now.getDate() - 1)), now],
      },
      {
        label: Localization.translate('date.previousDay'),
        dates: [
          new Date(new Date(now).setDate(now.getDate() - 2)),
          new Date(new Date(now).setDate(now.getDate() - 1)),
        ],
      },
      {
        label: Localization.translate('date.last7Days'),
        dates: [new Date(new Date(now).setDate(now.getDate() - 7)), now],
      },
      {
        label: Localization.translate('date.last30Days'),
        dates: [new Date(new Date(now).setDate(now.getDate() - 30)), now],
      },
      {
        label: Localization.translate('date.last1Year'),
        dates: [new Date(new Date(now).setDate(now.getDate() - 365)), now],
      },
    ];

    return (
      <div>
        {isDatePickerOpen ? (
          <div className="filter-content">
            <section className="top-section">
              <Button
                theme="none"
                onClick={() => this.setState({ isDatePickerOpen: false })}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                  <path
                    fill="#666666"
                    d="M69.17 41.273l-18.9 18.9-18.897-18.9c-.78-.78-2.047-.78-2.83 0s-.78 2.047 0 2.828l20.313 20.313c.39.392.903.587 1.415.587.513 0 1.025-.195 1.416-.586l20.312-20.312c.78-.78.78-2.047 0-2.828-.782-.782-2.048-.782-2.83 0z"
                  />
                </svg>
                <span>{Localization.translate('date.selectRange')}</span>
              </Button>
            </section>
            <DateRangePicker
              disabled={disabled}
              endDate={end}
              endLabel={Localization.translate('date.endDate')}
              startDate={start}
              startLabel={Localization.translate('date.startDate')}
              onChangeDate={this.handleCustomDatesClick}
            />
          </div>
        ) : (
          <ul className="button-list">
            {dateList.map(item => {
              return (
                <li key={item.label}>
                  <Button
                    theme="none"
                    onClick={() => {
                      this.setState({ selectInputLabel: [item.label] });
                      this.fireFilterChange(item.dates);
                    }}
                  >
                    {item.label}
                  </Button>
                </li>
              );
            })}
            <li>
              <Button
                theme="none"
                onClick={() => this.setState({ isDatePickerOpen: true })}
              >
                {Localization.translate('date.selectRange')}
              </Button>
            </li>
          </ul>
        )}
      </div>
    );
  };

  UNSAFE_componentWillMount() {
    Localization.setTranslations(TRANSLATIONS);
  }

  render() {
    const { field } = this.props;
    const { selectInputLabel } = this.state;
    return (
      <div className="filterSelect">
        <SelectInput
          className="dateRangeFilter"
          content={this.renderContent()}
          label={field.label}
          selectedContent={selectInputLabel}
          width={250}
        />
      </div>
    );
  }
}
